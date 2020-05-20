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

from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from HandleJson import GetCrawlingFeedJson,UpdateCrawlingFeedJson

warnings.filterwarnings(action='ignore')  # 경고 메세지 제거

# 인스타 그램 url 생성
baseUrl = "https://www.instagram.com"


def EachFeed_Embed(driver, FeedUrlList,instaId,brandname):
    CrawlingData = GetCrawlingFeedJson()
    # FeedDataList = []
    for EachUrl in FeedUrlList:
        FeedID = EachUrl[3:]
        FeedData = GetEachEmbed(driver, EachUrl,instaId)
        FeedData['brand'] = brandname
        FeedData['CrawlingDate'] = time.strftime('%Y%m%d', time.localtime(time.time()))
        FeedData['DownloadNum'] = 0
        CrawlingData[FeedID] = FeedData
        # FeedDataList.append(GetEachEmbed(driver, EachUrl,instaId))
    # return FeedDataList
    # print(CrawlingData)
    UpdateCrawlingFeedJson(CrawlingData)



def GetEachEmbed(driver, EachUrl,instaId):
    # FeedData = [instaId,EachUrl]
    FeedData = dict()

    #url 접속
    url = baseUrl+str(EachUrl)
    driver.get(url)
    sleep(3)
    try:
        driver.find_element(
            By.XPATH, '//*[@id="react-root"]/section/nav/div/div/section/div/div[2]/div[4]/button').click()
        driver.find_element(
            By.XPATH, '//*[@id="react-root"]/section/nav/div/div/section/div[3]/button[2]').click()
    except:
        pass

    #날짜 가져오기
    Date = driver.find_element(By.CLASS_NAME,'_1o9PC.Nzb55').get_attribute('datetime')
    Date = Date[:10]
    FeedData['Date'] = Date

    #콘텐츠 갯수 가져오기
    ContentsNum = len(driver.find_elements(By.CLASS_NAME,'Yi5aA'))
    if ContentsNum == 0:
        ContentsNum = 1
    FeedData['ContentsNum'] = ContentsNum

    # driver.find_element(By.XPATH,'//*[@id="react-root"]/section/main/div/div/article/div[3]/button').click()
    # element = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, '/html/body/div[5]/div/div/div/button[5]')))
    # driver.find_element(By.XPATH,'/html/body/div[5]/div/div/div/button[5]').click()
    # TextData = ''
    # #embed 코드 가져오기
    # while TextData == '' :
    #     TextData = driver.find_element(By.XPATH,'/html/body/div[5]/div/div/textarea').text
    # FeedData['EmbedCode'] = TextData

    #Contents 0으로 초기화
    ContDict = dict()
    for i in range(1,ContentsNum+1):
        KeyName = 'Contents_'+str(i)
        ContDict[KeyName] = 0
    FeedData['Contents'] = ContDict

    # FeedData.append(TextData)

    return FeedData