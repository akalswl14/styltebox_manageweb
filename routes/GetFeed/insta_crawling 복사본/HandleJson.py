# -*- coding: utf-8 -*- 

import json

def GetCrawlingFeedJson():
    with open('routes/GetFeed/CrawlingFeed.json','r') as f:
    # with open('../CrawlingFeed.json','r') as f:
        json_data = json.load(f)
    return json_data

def UpdateCrawlingFeedJson(json_data):
    with open('routes/GetFeed/CrawlingFeed.json','w',encoding='utf-8') as make_file:
    # with open('../CrawlingFeed.json','w',encoding='utf-8') as make_file:
        json.dump(json_data,make_file,indent="\t")

def UpdateBrandJson(json_data):
    with open('routes/GetFeed/brand.json','w',encoding='utf-8') as make_file:
    # with open('../brand.json','w',encoding='utf-8') as make_file:
        json.dump(json_data,make_file,indent="\t")

def GetUrlListJson():
    with open('routes/GetFeed/DownloadRequest.json','r') as f:
    # with open('../DownloadRequest.json','r') as f:
        json_data = json.load(f)
    return json_data

def GetDownloadDataJson():
    with open('routes/GetFeed/DownloadData.json','r') as f:
    # with open('../DownloadData.json','r') as f:
        json_data = json.load(f)
    return json_data

def UpdateDownloadDataJson(json_data):
    with open('routes/GetFeed/DownloadData.json','w',encoding='utf-8') as make_file:
    # with open('../DownloadData.json','r') as f:
        json.dump(json_data,make_file,indent="\t")