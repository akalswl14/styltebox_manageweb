# -*- coding: utf-8 -*- 

import os
import urllib.request
from urllib.request import urlopen  # 인터넷 url를 열어주는 패키지
from urllib.parse import quote_plus  # 한글을 유니코드 형식으로 변환해줌
from bs4 import BeautifulSoup
from selenium import webdriver  # webdriver 가져오기
import time  # 크롤링 중 시간 대기를 위한 패키지
from time import sleep
import warnings  # 경고메시지 제거 패키지
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.chrome.options import Options
from ScrollFeed import Scroll_SomeFeed, Login
from GetBrandList import GetBrandList_json
from GetEachEmbed import EachFeed_Embed
from MakeExcel import MakeExcel_Embed
from HandleJson import GetCrawlingFeedJson, UpdateBrandJson


warnings.filterwarnings(action='ignore')  # 경고 메세지 제거

StartTime = time.time()

#현재 프로젝트 폴더
ProjectFolder = os.getcwd()


options = webdriver.ChromeOptions()
mobile_emulation = {"deviceName": "Nexus 5"}
options.add_experimental_option("mobileEmulation", mobile_emulation)


driver = webdriver.Chrome(
    executable_path="/Users/carly/Development/styltebox_manageweb/routes/GetFeed/insta_crawling/chromedriver", chrome_options=options
)

# BrandList = GetBrandList()
BrandList = GetBrandList_json()
CrawlingData = GetCrawlingFeedJson()

# FeedDataList = []
# for instaId in BrandList :
#     FeedUrlList = Scroll_SomeFeed(driver,instaId)
#     FeedDataList.extend(EachFeed_Embed(driver,FeedUrlList,instaId))
# MakeExcel_Embed(FeedDataList)
driver.get('https://www.instagram.com/accounts/login/')
Login(driver)

# driver.get('https://www.instagram.com/stylebox2u/?__a=1')

for eachBrand in BrandList:
    # 0 또는 ""로 초기화
    BrandList[eachBrand]['TodayDownloadNum'] = 0
    BrandList[eachBrand]['ReviewStatus'] = "N"
    BrandList[eachBrand]['Comment'] = ""
    # 새 게시물, 팔로워 정보, 게시물 수 정보 업데이트, url 리스트 크롤링
    rtndata = Scroll_SomeFeed(driver,BrandList[eachBrand])
    BrandList[eachBrand] = rtndata[0]
    FeedUrlList = rtndata[1]
    EachFeed_Embed(driver,FeedUrlList,BrandList[eachBrand]['instaID'],eachBrand)
UpdateBrandJson(BrandList)
driver.close()
print("소요시간 : ", time.time()-StartTime)
