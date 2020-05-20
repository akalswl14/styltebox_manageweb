# -*- coding: utf-8 -*- 

import json
import csv
import os
import pandas as pd
import numpy as np
from GetBrandList import GetBrandList_json

def ForBrandExcel():
    ExcelData = pd.read_excel('/public/excel/brand.xlsx')
    ExcelData = ExcelData.fillna("")
    ExcelDataList = ExcelData.values.tolist()
    Json_Data = GetBrandList_json()
    for EachRow in ExcelDataList:
        if EachRow[3]=='' or EachRow[1]=='':
            continue
        BrandID = EachRow[0]
        BrandName = EachRow[1]
        FollowerNum = EachRow[2]
        instaID = EachRow[3][26:]
        instaID = instaID.split('/')[0]
        BrandText = EachRow[4]
        BrandSite = EachRow[5]
        AddressList = []
        AddressList.append(EachRow[6])
        AddressList.append(EachRow[7])
        AddressList.append(EachRow[8])
        AddressList.append(EachRow[9])
        AddressList.append(EachRow[10])
        AddressList.append(EachRow[11])
        AddressList.append(EachRow[12])
        AddressList.append(EachRow[13])
        AddressList.append(EachRow[14])
        AddressList.append(EachRow[15])
        Json_Data[BrandName]['BrandID'] = BrandID
        Json_Data[BrandName]['FollowerNum'] = FollowerNum
        Json_Data[BrandName]['instaID'] = instaID
        Json_Data[BrandName]['Text'] = BrandText
        Json_Data[BrandName]['Site'] = BrandSite
        Json_Data[BrandName]['Address'] = AddressList
        Json_Data[BrandName]['FeedNum'] = 0
        Json_Data[BrandName]['NewFeedNum'] = 0
        Json_Data[BrandName]['TodayDownloadNum'] = 0
        Json_Data[BrandName]['ReviewStatus'] = "N"
        Json_Data[BrandName]['Comment'] = ""
        
    