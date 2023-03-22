import json
import random
import datetime
import math
import requests
import time

def transformlng(lng, lat):
    ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * math.sqrt(abs(lng))
    ret += ((20.0 * math.sin(6.0 * lng * math.pi) + 20.0 * math.sin(2.0 * lng * math.pi)) * 2.0) / 3.0
    ret += ((20.0 * math.sin(lng * math.pi) + 40.0 * math.sin((lng / 3.0) * math.pi)) * 2.0) / 3.0
    ret += ((150.0 * math.sin((lng / 12.0) * math.pi) + 300.0 * math.sin((lng / 30.0) * math.pi)) * 2.0) / 3.0
    return ret

def transformlat(lng, lat):
    ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * math.sqrt(abs(lng))
    ret += ((20.0 * math.sin(6.0 * lng * math.pi) + 20.0 * math.sin(2.0 * lng * math.pi)) * 2.0) / 3.0
    ret += ((20.0 * math.sin(lat * math.pi) + 40.0 * math.sin((lat / 3.0) * math.pi)) * 2.0) / 3.0
    ret += ((160.0 * math.sin((lat / 12.0) * math.pi) + 320 * math.sin((lat * math.pi) / 30.0)) * 2.0) / 3.0
    return ret

def convert_coordinates(lng, lat):
    a = 6378245.0
    ee = 0.00669342162296594323
    PI = math.pi
    dlat = transformlat(lng - 105.0, lat - 35.0)
    dlng = transformlng(lng - 105.0, lat - 35.0)
    radlat = (lat / 180.0) * PI
    magic = math.sin(radlat)
    magic = 1 - ee * magic * magic
    sqrtmagic = math.sqrt(magic)
    dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI)
    dlng = (dlng * 180.0) / ((a / sqrtmagic) * math.cos(radlat) * PI)
    mglat = lat + dlat
    mglng = lng + dlng
    return [mglng, mglat]

path = './olddata.txt'
save_path = './newdata.txt'

with open(path, "r", encoding="utf-8") as r:
    lines = r.read().split(',\n')

max_id = 1
for line in lines:
    parsed_obj = json.loads(line)
    # 生成随机日期
    start_date = datetime.date(2023, 1, 1)
    end_date = datetime.date(2023, 3, 22)
    random_date = start_date + datetime.timedelta(days=random.randint(0, (end_date - start_date).days))
    parsed_obj['start_time'] = start_date.strftime('%Y-%m-%d')
    parsed_obj['end_time'] = random_date.strftime('%Y-%m-%d')
    parsed_obj['picOriginalName'] = parsed_obj['name']

    # 随机选择火灾类型
    fireType = ['other', 'indoor', 'building', 'forest']
    parsed_obj['fireType'] = random.choice(fireType)

    # 随机选择火势强度
    fireIntensity = ['large', 'medium', 'small']
    parsed_obj['fireIntensity'] = random.choice(fireIntensity)

    parsed_obj['victim'] = random.randint(0, 20)
    parsed_obj['beaufort'] = random.randint(0, 12)
    parsed_obj['money'] = random.randint(0, 10000)
    parsed_obj['fireBrigade'] = random.randint(0, 5)
    parsed_obj['rainfall'] = random.randint(0, 12)
    parsed_obj['temperature'] = random.randint(0, 34)
    parsed_obj['humidity'] = random.randint(0, 90)
    # 随机选择火势强度
    windDirection = ['north', 'south', 'west', 'east', 'northeast', 'southeast', 'southwest', 'northwest']
    parsed_obj['windDirection'] = random.choice(windDirection)

    [lng, lat] = convert_coordinates(parsed_obj['lng'], parsed_obj['lat'])

    html = 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + str(lat) + ',' + str(
        lng) + '&get_poi=1&key=J6CBZ-TZLRK-FDXJI-AEFT3-3XS4Q-D5BXS'
    response = requests.get(html)
    time.sleep(0.5)
    html_data = json.loads(response.text)
    parsed_obj['province'] = html_data['result']['address_component']['province']
    parsed_obj['city'] = html_data['result']['address_component']['city']
    parsed_obj['area'] = html_data['result']['address_component']['district']
    parsed_obj['picDatasetName'] = str(max_id).rjust(6, '0') + '.jpg'
    max_id += 1
    with open(save_path, "a", encoding="utf-8") as w:
        w.write(json.dumps(parsed_obj, ensure_ascii=False) + ',\n')
    print(parsed_obj)


