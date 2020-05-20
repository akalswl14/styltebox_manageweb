# -*- coding: utf-8 -*- 

import json
import csv
import os
import pandas as pd
import numpy as np
from MakeExcel import MakeExcel 

def ForDownloadJson(ReqJsonData):
    with open('routes/GetFeed/DownloadData.json','r') as f:
        json_data = json.load(f)
    KeyList = list(ReqJsonData.keys())
    ExcelDataList = []
    for EachKey in KeyList:
        ContNumList = list(json_data[EachKey]['Contents'].keys())
        tmpList = []
        for EachContKey in ContNumList:
            tmpList = [EachKey]
            tmpList.append(json_data[EachKey]['Date'])
            tmpList.append(json_data[EachKey]['Brand'])
            tmpList.append(EachContKey)
            tmpList.append(json_data[EachKey]['Contents'][EachContKey])
            tmpList.append(json_data[EachKey]['TagList'])
            tmpList.append(json_data[EachKey]['Text'])
            ExcelDataList.append(tmpList)
        # ContList = list(json_data[EachKey]['Contents'].values())
        # tmpList.append(ContList)
    MakeExcel(ExcelDataList)