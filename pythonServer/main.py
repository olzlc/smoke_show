from flask import Flask, request, render_template, redirect, flash, url_for, jsonify
from flask_sqlalchemy import SQLAlchemy
import psycopg2
import ast
from sqlalchemy import Table
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey
from sqlalchemy import and_
import numpy as np
import os
import json
import sys
import base64
from utils.general import LOGGER

app = Flask(__name__)
# postgresql://user:pw@host:port/database_name
# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:123456@192.168.6.129/exp3'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:123456@localhost:5432/fire-smoke'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True  # 动态追踪修改设置，未设置会提示警告，不建议开启
app.config['SQLALCHEMY_ECHO'] = True  # 查询会显示原始SQL语句
# app.config["SECRET_KEY"] = 'TPmi4aLWRbyVq8zu9v82dWYW1'  # 设置密码
# con = psycopg2.connect(database="exp3", user="postgres", password="123456", host="192.168.6.129", port="5432")
con = psycopg2.connect(database="fire-smoke", user="postgres", password="123456", host="localhost", port="5432")
cur = con.cursor()
db = SQLAlchemy(app)
from pathlib import Path
from detect import detect_one_picture

# 获取当前模块的绝对路径，__file__是一个特殊变量，它表示当前模块的文件名
FILE = Path(__file__).resolve()  # 这个文件绝对路径
# 获取了当前模块所在的目录的父目录，即YOLOv5的根目录
ROOT = FILE.parents[0]
# 判断YOLOv5的根目录是否已经在Python模块搜索路径中
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))  # 将YOLOv5的根目录添加到Python模块搜索路径中
ROOT = Path(os.path.relpath(ROOT, Path.cwd()))  # 将YOLOv5的根目录转换为相对路径，相对于当前工作目录


def increment_path(path, sep='_'):
    # 该函数用于对给定的文件或目录路径进行递增，即在原有路径的基础上添加一个数字后缀
    # 如果给定路径已存在，则递增数字直到找到一个可用的路径。此外，该函数还可以选择性地创建目录（如果目录不存在）

    path = Path(path)  # 创建了一个新的Path对象，用于封装文件或目录的路径，这个对象能够在不同的操作系统上使用
    if path.exists():
        path, suffix = (path.with_suffix(''), path.suffix) if path.is_file() else (path, '')

        for n in range(2, 9999):
            p = f'{path}{sep}{n}{suffix}'
            if not os.path.exists(p):
                break
        path = Path(p)

    return path


# 定义数据模型
# 创建数据库模型类
class FireSmoke(db.Model):
    __tablename__ = 'fire_smoke'
    # 参数一：表示属性列的类型，参数二：表示约束类型
    id = db.Column(db.Integer, autoincrement=True, primary_key=True, nullable=False)
    lat = db.Column(db.Numeric(precision=10, scale=7), nullable=False)
    lng = db.Column(db.Numeric(precision=10, scale=7), nullable=False)
    start_time = db.Column(db.Date, nullable=False)
    end_time = db.Column(db.Date, nullable=False)
    fireType = db.Column(db.String, nullable=False)
    fireIntensity = db.Column(db.String, nullable=False)
    victim = db.Column(db.Integer, nullable=False)
    province = db.Column(db.String, nullable=False)
    city = db.Column(db.String, nullable=False)
    area = db.Column(db.String, nullable=False)
    beaufort = db.Column(db.Integer, nullable=False)
    windDirection = db.Column(db.String, nullable=False)
    rainfall = db.Column(db.Integer, nullable=False)
    temperature = db.Column(db.Integer, nullable=False)
    humidity = db.Column(db.Integer, nullable=False)
    fireBrigade = db.Column(db.Integer, nullable=False)
    money = db.Column(db.Integer, nullable=False)
    # picName = db.Column(db.String, nullable=False)
    picOriginalName = db.Column(db.String, nullable=False)
    picDatasetName = db.Column(db.String, nullable=False)
    address = db.Column(db.String)


def product_json(json_name):
    with open(ROOT / 'result_txt' / json_name, 'r') as f:
        data = f.read()

    # 将数据分割成行
    lines = data.split('\n')

    # 创建一个空列表来存储JSON对象
    json_list = []

    # 遍历每一行数据并将其转换为JSON对象
    for line in lines:
        if line:
            # 将行分割成单个值
            values = line.split(' ')
            # 创建一个字典来存储值
            obj = {
                'type': values[0],
                'x1': float(values[1]),
                'y1': float(values[2]),
                'x2': float(values[3]),
                'y2': float(values[4]),
                'confidence': float(values[5])
            }
            # 将字典添加到列表中
            json_list.append(obj)

    # 将列表转换为JSON字符串并打印输出
    json_str = json.dumps(json_list)
    return json_str


# 定义路由和视图函数
@app.route('/addDatabase', methods=['POST'])
def post_image():
    # 从请求中获取文件和 JSON 数据
    # post_data = request.get_json()
    # 从请求中获取Form数据
    post_data = request.form.get('picForm')  # 获取picForm信息
    file = request.files.get('file')  # 获取上传的文件
    if post_data == '' and not file:
        return jsonify({'message': '数据库成功被后端接受，但是表单或者图片出错，并未加入数据库'})
    post_data = ast.literal_eval(post_data)
    LOGGER.info(f"success load data")
    # db.drop_all()
    # db.create_all()
    try:
        db.drop_all()
        db.create_all()
        # 将图片保存在服务器
        keep_path = ROOT / 'original_pic'
        if not os.path.isdir(keep_path):
            os.makedirs(keep_path)
        # todo:如果表一开始为空，查询不到id会报错
        cur.execute('SELECT MAX(id) FROM fire_smoke')
        con.commit()
        info = cur.fetchall()
        if len(info) != 0 and len(info[0]) != 0 and info[0][0] is not None:
            max_id = info[0][0] + 1
        else:
            max_id = 1

        pic_name = str(max_id).rjust(6, '0') + '.jpg'
        path = os.path.join(keep_path, pic_name)
        file.save(path)

        # 预测
        detect_one_picture(pic_name)

        # 将数据存储到数据库
        fire_smoke = FireSmoke(lat=post_data['lat'], lng=post_data['lng'],
                               start_time=post_data['period'][0],
                               end_time=post_data['period'][1], fireType=post_data['fireType'],
                               fireIntensity=post_data['fireIntensity'],
                               victim=post_data['victim'], province=post_data['province'][0],
                               city=post_data['province'][1], area=post_data['province'][2],
                               beaufort=post_data['beaufort'], windDirection=post_data['windDirection'],
                               rainfall=post_data['rainfall'],
                               temperature=post_data['temperature'], humidity=post_data['humidity'],
                               fireBrigade=post_data['fireBrigade'],
                               money=post_data['money'], picOriginalName=file.filename, picDatasetName=pic_name,
                               address=post_data['address'])
        db.session.add(fire_smoke)
        db.session.commit()

        # txt生成Json
        json_name = str(max_id).rjust(6, '0') + '.txt'
        json_str = product_json(json_name)
        # 预测图片转码base64
        with open(ROOT / 'detect_pic' / pic_name, 'rb') as f:
            image_data = base64.b64encode(f.read()).decode()
        # 图片信息变为json
        image_info = {'lat': post_data['lat'], 'lng': post_data['lng'], 'address': file.filename}

        # 返回 JSON 数据
        return jsonify(
            {'message': '成功加入数据', 'detect_box': json_str, 'detect_image': image_data, 'image_info': image_info})
        # return jsonify(post_data)
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({'message': '出现错误'})


# @app.route("/add_all_data_origin", methods=['GET', 'POST'])
# 记得example.txt不要有空行，并且图片记得加入
def add_all_data_origin():
    app.app_context().push()
    with app.app_context():
        db.drop_all()
        db.create_all()
        with open('./example_data.txt', "r", encoding="utf-8") as r:
            lines = r.read().split(',\n')

        all_data = []
        for line in lines:
            # print(line)
            parsed_obj = json.loads(line)
            # print(parsed_obj)
            fire_smoke = FireSmoke(lat=parsed_obj['lat'], lng=parsed_obj['lng'],
                                   start_time=parsed_obj['start_time'],
                                   end_time=parsed_obj['end_time'], fireType=parsed_obj['fireType'],
                                   fireIntensity=parsed_obj['fireIntensity'],
                                   victim=parsed_obj['victim'], province=parsed_obj['province'],
                                   city=parsed_obj['city'], area=parsed_obj['area'],
                                   beaufort=parsed_obj['beaufort'], windDirection=parsed_obj['windDirection'],
                                   rainfall=parsed_obj['rainfall'],
                                   temperature=parsed_obj['temperature'], humidity=parsed_obj['humidity'],
                                   fireBrigade=parsed_obj['fireBrigade'],
                                   money=parsed_obj['money'], picOriginalName=parsed_obj['picOriginalName'],
                                   picDatasetName=parsed_obj['picDatasetName'],
                                   address=parsed_obj['address'])
            all_data.append(fire_smoke)
        db.session.add_all(all_data)
        db.session.commit()


# 运行应用程序
if __name__ == '__main__':
    # add_all_data_origin()
    # 一定注意端口是否被占用
    app.run(port=6000)
