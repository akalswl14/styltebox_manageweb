# -*- coding: utf-8 -*- 

import json

def GetBrandList():
    f = open('brand.txt', 'r')
    BrandList = f.readline().split(',')
    f.close()
    return BrandList

def GetBrandList_json():
    with open('routes/GetFeed/brand.json','r') as f:
    # with open('../brand.json','r') as f:
        json_data = json.load(f)
    return json_data
    