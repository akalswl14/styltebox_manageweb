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
from HandleJson import GetCrawlingFeedJson,UpdateCrawlingFeedJson,UpdateBrandJson,GetDownloadDataJson,UpdateDownloadDataJson
from GetBrandList import GetBrandList_json

warnings.filterwarnings(action='ignore')  # 경고 메세지 제거

#현재 프로젝트 폴더
ProjectFolder = os.getcwd()

# 인스타 그램 url 생성
# baseUrl = "https://www.instagram.com"
baseUrl = "https://www.instagram.com/p/"


# def EachFeed(driver, FeedUrlList):
def EachFeed(driver,JsonData):
    FeedUrlList = list(JsonData.keys())
    # FeedDataList = []
    CrawlingFeedJson = GetCrawlingFeedJson()
    BrandJson = GetBrandList_json()
    DownloadJson = GetDownloadDataJson()
    for EachUrl in FeedUrlList:
        ContNameList = JsonData[EachUrl]
        FeedData = GetEachContents(driver, EachUrl,ContNameList)
        # Update CrawlingFeed.json
        for i in ContNameList:
            tmp = "Contents_"+i
            CrawlingFeedJson[EachUrl]['Contents'][tmp] += 1
        CrawlingFeedJson[EachUrl]['DownloadNum'] += 1
        # Update brand.json
        BrandName = CrawlingFeedJson[EachUrl]['brand']
        BrandJson[BrandName]['TodayDownloadNum'] += 1
        FeedData['Brand'] = BrandName
        DownloadJson[EachUrl] = FeedData
    UpdateBrandJson(BrandJson)
    UpdateCrawlingFeedJson(CrawlingFeedJson)
    UpdateDownloadDataJson(DownloadJson)

def GetEachContents(driver, EachUrl,ContNameList):
    FeedData = dict()
    f_url = 'public/img/crawlingimg/'+EachUrl
    #저장할 폴더 생성
    if(not os.path.isdir(f_url)):
        os.mkdir(f_url)

    url = baseUrl+str(EachUrl)
    driver.get(url)
    sleep(3)
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    try:
        driver.find_element(
            By.XPATH, '//*[@id="react-root"]/section/nav/div/div/section/div/div[2]/div[4]/button').click()
        driver.find_element(
            By.XPATH, '//*[@id="react-root"]/section/nav/div/div/section/div[3]/button[2]').click()
    except:
        pass
    try:
        element = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".sXUSN"))
        )
    except:
        pass
    else:
        element = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, '//*[@id="react-root"]/section/main/div/div/article/div[2]/div[1]/div/div/span/span[2]/button'))
        )
        driver.find_element(By.XPATH, '//*[@id="react-root"]/section/main/div/div/article/div[2]/div[1]/div/div/span/span[2]/button').click()

    pageString = driver.page_source
    soup = BeautifulSoup(pageString, "lxml")
    TextSection = soup.select("._8Pl3R")[0].text
    try : 
        LikeNum = soup.select("div.Nm9Fw span")[0].text
    except :
        try : 
            LikeNum = soup.select(".zV_Nj")[0].text[4]
        except :
            driver.find_element(By.XPATH,'//*[@id="react-root"]/section/main/div/div/article/div[2]/section[2]/div/span').click()
            pageString = driver.page_source
            soup = BeautifulSoup(pageString, "lxml")
            LikeNum = soup.select('.vJRqr')[0].text[4]

    #Date
    Date = driver.find_element(By.CLASS_NAME,'_1o9PC.Nzb55').get_attribute('datetime')
    Date = Date[:10]
    FeedData['Date'] = Date

    #TagList
    FeedData['TagList'] = ''

    # #feedid
    # FeedData.append(EachUrl[3:])

    # #likenum
    # # FeedData.append(LikeNum)
    # FeedData['LikeNum'] = LikeNum

    #text
    # FeedData.append(TextSection)
    FeedData['Text'] = TextSection
    

    image = list()
    if(driver.find_elements_by_css_selector(".coreSpriteRightChevron") or driver.find_elements(By.CLASS_NAME,"vi798")):
        while(True):
            pageString = driver.page_source
            soup = BeautifulSoup(pageString, "lxml")
            LiTagList = soup.select(".FFVAD")
            LiTagList += soup.select(".tWeCl")
            if len(LiTagList) == 0 :
                driver.get(url)
                continue
            try:
                for LiTag in LiTagList:
                    img = LiTag.attrs['src']
                    if(img not in image):
                        image.append(img)
            except KeyError as keyerr:
                print(keyerr)
                print(LiTag)
                print("!!!!!!!KEYERROR!!!!!!!!!")
                driver.get(url)
                continue
            if(driver.find_elements_by_css_selector(".coreSpriteRightChevron")):
                driver.find_element_by_css_selector(".coreSpriteRightChevron").click()
                sleep(1)
                print("click")
            else:
                break
    else:
        while(True):
            pageString = driver.page_source
            soup = BeautifulSoup(pageString, "lxml")
            EachContent = soup.select(".FFVAD") + soup.select(".tWeCl")
            if len(EachContent) == 0:
                driver.get(url)
                continue
            else:
                img = EachContent[0].attrs['src']
                if(img not in image):   
                    image.append(img)
                break

    # image = list(set(image))
    # imgList = []
    # vidList = []
    ContList = []
    
    #Contents
    ContDict = dict()
    cnt = 1
    for img in image:
        # if ".mp4" in img :
        #     vidList.append(img)
        # else :
        #     imgList.append(img)
        if str(cnt) in ContNameList:
            KeyName = 'Contents_'+str(cnt)
            ContDict[KeyName] = img
            ContList.append(img)
            if(len(image) > 1):
                if ".mp4" in img:
                    urllib.request.urlretrieve(img, f_url+str(cnt)+".mp4")
                else:
                    urllib.request.urlretrieve(img, f_url+str(cnt)+".jpg")
            else:
                if ".mp4" in img:
                    urllib.request.urlretrieve(img, f_url+str(cnt) + ".mp4")
                else:
                    urllib.request.urlretrieve(img, f_url+str(cnt) + ".jpg")
        cnt += 1
    FeedData['Contents'] = ContDict
    
    # #imglist
    # FeedData.append(imgList)

    # #videolist
    # FeedData.append(vidList)
    print("------------------------------")
    return FeedData
