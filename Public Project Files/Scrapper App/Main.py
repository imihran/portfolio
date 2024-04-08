# This Section imports aree the libraries that will be used in the code

# selenium==4.16.0
import tkinter as tk
from tkinter import simpledialog
from selenium import webdriver # to open a web browser
from selenium.webdriver.common.keys import Keys # to be able to type in the browser
from selenium.webdriver.common.by import By # to be able to search things in the browser
from selenium.webdriver.firefox.service import Service as FirefoxService
from webdriver_manager.firefox import GeckoDriverManager
from selenium.common.exceptions import NoSuchElementException 
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import datetime
from helper_functions import *
import credentials
import pandas as pd
from bs4 import BeautifulSoup # to be able to search the HTML in browser 
import time # to be able to wait for x amount of time seconds. 
import os

# have this folder structure 
# Scapper App/
# │
# ├── credentials/
# │   └── credentials.py <- this is where you have your user_id and password for 
# │
# ├── main.py
# │
# └── .gitignore  <- in this file  incliude credentials/ this when when you git push it does not put your user id and passportd in github for every one to see. 
from credentials import credentials
print (credentials.user_id)

# GUI SECTION 
# Ask the user for INPUT  
root = tk.Tk()
root.withdraw() 

job_title = simpledialog.askstring("Job Title", "Enter the job title:")
root.destroy()  # Destroy the hidden root window after getting input


linkedin_email = credentials.user_id
linkedin_password = credentials.password

url = 'https://www.linkedin.com/jobs'


print ("importing credentials")

# This section contains the code to scrape the data. specifically the salary.

print ("Prepping functions to scrap data")
import re

def check_element (elem):
    if elem is None: 
        return ''
    if len (elem) > 0:
        return elem.text.strip()
    else:
        return ''


print ("lunching the browser and logging in")
#  THis section of the code is to start the browser and go the the respective URL. and located the box for user id and password
browser = webdriver.Firefox(service=FirefoxService(GeckoDriverManager().install()))# start the browser 
browser.get(url)  # in browser search the URL 
wait = WebDriverWait(browser, 10)

# email_input = browser.find_element("name", "session_key")
email_input = wait.until(EC.element_to_be_clickable(("name", "session_key")))
# password_input = browser.find_element("name", "session_password")
password_input = wait.until(EC.element_to_be_clickable(("name", "session_password")))
# login_button = browser.find_element("xpath", "//button[@type='submit']")
login_button = wait.until(EC.element_to_be_clickable(("xpath", "//button[@type='submit']")))


# This section of the code is to enter the user id and password
email_input.send_keys(linkedin_email)
password_input.send_keys(linkedin_password)

# Click the login button
login_button.click()
# time.sleep(10)


print ("Asking for job title search")
# Plug in Job title in the search box
job_title_search = job_title    # get the job_title_Search from GUI
# search_box = browser.find_element(By.CLASS_NAME, 'jobs-search-box__text-input')
search_box = wait.until(EC.element_to_be_clickable((By.CLASS_NAME, 'jobs-search-box__text-input')))

search_box.send_keys(job_title_search)
search_box.send_keys(Keys.RETURN)


print ("Filtering for the last week")
# locate and clik the date filter
# date_filter = browser.find_element("id", "searchFilter_timePostedRange")
date_filter = wait.until(EC.element_to_be_clickable((By.ID, "searchFilter_timePostedRange")))
date_filter.click()
# time.sleep(10)

# locate week filter on the date filter

class_name = "t-14 t-black--light t-normal"
span_text = "week"

past_week_x_path= f"//span[@class='{class_name}' and contains(.,'{span_text}')]"
# past_week = browser.find_element("xpath", past_week_x_path)
past_week = wait.until(EC.element_to_be_clickable((By.XPATH, past_week_x_path)))
past_week.click()
print ("selected past week")

# time.sleep(10)


# click the show results button the the date filter
class_name = "artdeco-button__text"
span_text = "result"
show_results_xpath = f"//span[@class='{class_name}' and (contains(.,'result') or contains(.,'results'))]"
# show_results = browser.find_element("xpath", show_results_xpath)
show_results = wait.until(EC.element_to_be_clickable((By.XPATH, show_results_xpath)))
show_results.click()

time.sleep(5)
print ("Starting the job Scan")
# Start SCANNING THE JOBS and OUTPUT FINAL RESULT AS CSV FILE

jobs_data = []
next_page_num = 1
while  True:
    # find the current page number
    current_page_xpath = "//button[@aria-current='true']"
    try:
        current_page = int(browser.find_element("xpath", current_page_xpath).text)
    except NoSuchElementException:
        print ('scanned all the pages')
        break
    # find all the job postings on the page 
    jobs_block = browser.find_element(By.CSS_SELECTOR, '.scaffold-layout__list-container')
    jobs_list= jobs_block.find_elements(By.CSS_SELECTOR, '.jobs-search-results__list-item')
   
    #scroll down
    x = 0
    while (x<=len(jobs_list)-1):
        try:
            browser.execute_script("arguments[0].scrollIntoView();", jobs_list[x])
            x= x+1
            time.sleep(0.1)
    
        except NoSuchElementException:
            print ("no more pages")
            break
   
    # parse the page   
    soup = BeautifulSoup(browser.page_source, "html.parser")
    target_class = 'jobs-search-results'
    target_li_elements = soup.find_all('li', class_=lambda x: x and 'jobs-search-results__list-item' in x)

    # get job data in to a dictionarry 
    for num in range (0,len (target_li_elements)-1):
        job_title = check_element (target_li_elements[num].find('a', class_=lambda x: x and 'title' in x))
        company = check_element ( target_li_elements[num].find('span', class_= 'job-card-container__primary-description') )
        location = check_element (target_li_elements[num].find('div', class_= 'artdeco-entity-lockup__caption ember-view') )
        salary = check_element (target_li_elements[num].find('div', class_= lambda x: x and 'mt1 t-sans t-12 t-black--light' in x) )
        link = target_li_elements[num].find('a').get('href')

        dic = {     'job_title': job_title ,
                    'company': company,
                    'location': location,
                    'salary_string': salary,
                    'lower_bound_extracted_salary':  (extract_hourly_or_salary_range(salary)[0]),
                    'upper_extracted_salary':  (extract_hourly_or_salary_range(salary)[1]),
                    'average_extracted_salary':  (extract_hourly_or_salary_range(salary)[2]),
                    'link': 'www.linkedin.com'+link
            
                }
        # append the data in to an array
        jobs_data.append(dic)


    # find the next page number
    next_page_num = current_page+1
    # find it on the webpage
    next_page_xpath = "//button[@aria-label='Page "+str(next_page_num)+"']"
    try:
        # try to find the next page
        # next_page = browser.find_element("xpath", next_page_xpath)
        next_page = wait.until(EC.element_to_be_clickable((By.XPATH, next_page_xpath)))
       
        print ("loading page - " + str(next_page.text) + ". Scanned " + str(len(jobs_data)) + " amount of jobs so far")
        # go to the next page
        next_page.click()
        # wait for the page to load
        # time.sleep(3)
    # if this error is thrown. that means end of page has reached.
    except TimeoutException:
        print ('scanned all the pages')
        break

# job_data list now should be able to be converted to dataframe. 
df = pd.DataFrame(jobs_data)

# File location export
file_name = job_title_search+'_'+str(datetime.datetime.now().date()) + '_export.csv'
export_path = os.path.join('Scrapper App/Exports/',file_name) # os.path.join('Scrapper App/Exports/',file_name)

# directory = 'Scrapper App/Exports/'
# if not os.path.exists(directory):
#     os.makedirs(directory)

df.to_csv(export_path, index=False)

# Close the browser
browser.close()
