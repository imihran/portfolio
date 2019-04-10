#reddit AITA Script

#importing the required libraries
#----------------------
import praw #To connect to reddit and read the comments
from praw.models import MoreComments #To get only top level comments from reddit
import matplotlib.pyplot as plt #To make a bar chart at the end showing each posts votes
import pandas as pd #To convert data in to dataframe which can be exported to google sheets
import pygsheets #To export the data in to google sheets in order to do visualization, Visualization is done on Google Sheets.
#-----------------------

#connecting the connection to reddit and google
#--------------------------
#connecting to google sheets
gc = pygsheets.authorize(service_file='Your_Info')

#connecting to reddit
reddit = praw.Reddit(client_id='Your_Info',
                     client_secret='Your_Info',
                     user_agent='Your_Info,
                     username ="Your_Info",
                     password ='Your_Info'
                     )
#connecting to AITA subreddit
subreddit = reddit.subreddit('AmItheAsshole')
#--------------------------

comment_list =[]
tempdf=[]
# getting the top 20 hot posts
hot_python = subreddit.hot(limit=20)

#for every hot post
for s in hot_python:
    #if the post is no word Meta and is not sticky
    if not s.stickied and "META" not in s.title.split()[0:10]:
       # print(s.title)
       # Initialize the counter to start couting all the top level comment votes
        counter = {"Title":'',"URL":'',"SELFTEXT":'',"YTA":0,"NTA":0,"ESH":0,"INFO":0, "NAH":0}
        #for each comment in each post
        for c in s.comments:
            #this thing somehow only gets the top level comments and makes sure the errors go away. So yeh. I have it here
            if isinstance(c, MoreComments):
                continue
            # a will get the body convert everything to upper case and look for respective Wores.
            a= c.body.upper().split()
            if ("NTA" in a or "NTA." in a or "NTA-" in a or "NTA," in a):
                counter['NTA'] =counter["NTA"] + 1
            if ("YTA" in a or "YTA." in a or "YTA-" in a or "YTA," in a):
                counter['YTA'] =counter["YTA"] + 1
            if ("ESH" in a or "ESH." in a or "ESH-" in a or "ESH," in a):
                counter['ESH'] =counter["ESH"] + 1
            if ("INFO" in a or "INFO." in a or "INFO-" in a or "INFO," in a):
                counter['INFO'] =counter["INFO"] + 1
            if ("NAH" in a or "NAH." in a or "NAH-" in a or "NAH," in a):
                counter['NAH'] =counter["NAH"] + 1
        
        #after counting is complete assign the posts title URL and Body
        print(counter)
        counter['Title']= s.title
        counter['URL']=s.url
        counter["SELFTEXT"]=s.selftext
        #append the date 
        tempdf.append(counter)

#confet the dictionarry to dataframe
df = pd.DataFrame(tempdf)

#count the total votes
df['Total_Votes'] = df['YTA']+df['NTA']+df['NAH']+df['ESH']+df['INFO']

#calculate the asshole ratio
df['Arshole_Ratio_%'] = ((df['YTA']+df['ESH']) / df['Total_Votes']) *100
df['Arshole_Ratio_%'] = round(df['Arshole_Ratio_%'],2)

#rearrainge the dataframe 
df=df[['Title','YTA', 'NTA','NAH','ESH','Total_Votes','Arshole_Ratio_%','INFO','SELFTEXT', 'URL']]

#sort it by total votes
#df = df.sort_values(by=['Total_Votes'],ascending=False)

#push this dataframe to Google Sheets.
sh = gc.open('aitareddit1')
sh[0].set_dataframe(df,(1,1))

#end
