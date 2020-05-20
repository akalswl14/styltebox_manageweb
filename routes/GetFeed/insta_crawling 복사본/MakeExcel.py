# -*- coding: utf-8 -*- 

import csv
import os
import pandas as pd
import numpy as np

ProjectFolder = os.getcwd()

def MakeExcel(DataList):
    # df = pd.DataFrame(DataList, columns=['FeedId','LikeNumber','Text','ImageList','VideoList'])
    # df.to_excel('InstaCrawling.xlsx')
    
    df = pd.DataFrame(DataList, columns=['FeedId','Date','Brand','ContentsNumber','ContentsUrl','HashTagList','Text'])
    df.to_excel('public/excel/DownloadCrawling.xlsx')
    print('크롤링 정보 저장 완료')

def MakeFollowerExcel(DataList):
    df = pd.DataFrame(DataList, columns=['followerid'])
    df.to_excel('FollowerList.xlsx')
    print('팔로워리스트 저장 완료')

def MakeExcel_Embed(DataList):
    df = pd.DataFrame(DataList, columns=['instaId','FeedId','EmbedCode'])
    df.to_excel('EmbedDataList.xlsx')
    print('임베드 코드 정보 엑셀 저장 완료')