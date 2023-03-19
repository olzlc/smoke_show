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

app = Flask(__name__)
# postgresql://user:pw@host:port/database_name
# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:123456@192.168.6.129/exp3'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:123456@localhost:5432/fire-smoke'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # 动态追踪修改设置，未设置会提示警告，不建议开启
app.config['SQLALCHEMY_ECHO'] = True  # 查询会显示原始SQL语句
# app.config["SECRET_KEY"] = 'TPmi4aLWRbyVq8zu9v82dWYW1'  # 设置密码
# con = psycopg2.connect(database="exp3", user="postgres", password="123456", host="192.168.6.129", port="5432")
con = psycopg2.connect(database="fire-smoke", user="postgres", password="123456", host="localhost", port="5432")
cur = con.cursor()
db = SQLAlchemy(app)
from pathlib import Path


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
    __tablename__ = 'fire-smoke'
    # 参数一：表示属性列的类型，参数二：表示约束类型
    id = db.Column(db.Integer, primary_key=True)
    lat = db.Column(db.Numeric(precision=10, scale=7), nullable=False)
    lng = db.Column(db.Numeric(precision=10, scale=7), nullable=False)
    coorSysType = db.Column(db.String, nullable=False)
    start_time = db.Column(db.Date, nullable=False)
    end_time = db.Column(db.Date, nullable=False)
    fireType = db.Column(db.String, nullable=False)
    fireIntensity = db.Column(db.String, nullable=False)
    victim = db.Column(db.String, nullable=False)
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
    picName = db.Column(db.String, nullable=False)


# 定义路由和视图函数
@app.route('/addDatabase', methods=['POST'])
def post_image():
    try:
        db.drop_all()
        db.create_all()
        # 从请求中获取文件和 JSON 数据
        # post_data = request.get_json()
        # 从请求中获取Form数据
        post_data = request.form.get('picForm')  # 获取picForm信息
        file = request.files.get('file')  # 获取上传的文件
        if post_data == '' and not file:
            return jsonify({'message': '数据库成功被后端接受，但是表单或者图片出错，并未加入数据库'})
        post_data = ast.literal_eval(post_data)
        print(post_data)
        print(file)

        # 将图片保存在服务器
        keep_path = './save_pic'
        if not os.path.isdir(keep_path):
            os.makedirs(keep_path)
        path = os.path.join(keep_path, file.filename)
        if os.path.exists(path):
            path = increment_path(path, '_')
        file.save(path)
        filepath, filename = os.path.split(path)
        # 将数据存储到数据库
        fire_smoke = FireSmoke(lat=post_data['lat'], lng=post_data['lng'], coorSysType=post_data['coorSysType'],
                               start_time=post_data['period'][0],
                               end_time=post_data['period'][1], fireType=post_data['fireType'],
                               fireIntensity=post_data['fireIntensity'],
                               victim=post_data['victim'], province=post_data['province'][0],
                               city=post_data['province'][1], area=post_data['province'][2],
                               beaufort=post_data['beaufort'], windDirection=post_data['windDirection'],
                               rainfall=post_data['rainfall'],
                               temperature=post_data['temperature'], humidity=post_data['humidity'],
                               fireBrigade=post_data['fireBrigade'],
                               money=post_data['money'], picName=filename)
        db.session.add(fire_smoke)
        db.session.commit()

        # 返回 JSON 数据
        return jsonify({'message': '成功加入数据'})
        # return jsonify(post_data)
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({'message': '出现错误'})


@app.route("/add_all_data_origin", methods=['GET', 'POST'])
def add_all_data_origin():
    db.drop_all()
    db.create_all()
    fire_smoke = FireSmoke()
    db.session.add_all(fire_smoke)
    db.session.commit()



# 运行应用程序
if __name__ == '__main__':
    app.run(port=5000)
