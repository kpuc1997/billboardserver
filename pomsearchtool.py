#!/usr/bin/env python3

import requests, json, datetime, time, smtplib, sys
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from bs4 import BeautifulSoup

doPrint = False
verbose = False

# Get song lyrics from genius page
def scrap_song_url(url):
    page = requests.get(url)
    html = BeautifulSoup(page.text, 'html.parser')
    try:
        lyrics = html.find('div', class_='lyrics').get_text()
        lyrics = str(lyrics)
    except:
        if doPrint and verbose:
            print('NoneType Error')
        return False
    if type(lyrics) != str:
        if doPrint and verbose:
            print(type(lyrics))
        return False
    return lyrics

# Genius API song info request
def request_song_info(song_title, artist_name):
    base_url = 'https://api.genius.com'
    headers = {'Authorization': 'Bearer ' + 'G4nIJWMfTWPblnqwC5LwXgSawbrYLAcaOtdiioV_rS97DC-ak1T0huBUa1T_H-6e'}
    search_url = base_url + '/search'
    data = {'q': song_title + ' ' + artist_name}
    response = requests.get(search_url, data=data, headers=headers)
    
    return response

# Search for matches in the request response
def getSongLyrics(song, artist):
    
    response = request_song_info(song, artist)
    json = response.json()
    remote_song_info = None

    for hit in json['response']['hits']:
        if artist.lower() in hit['result']['primary_artist']['name'].lower():
            remote_song_info = hit
            break

    # Extract lyrics from URL if the song was found. Return false if no song found.
    if remote_song_info:
        song_url = remote_song_info['result']['url']
    else:
        if doPrint and verbose:
            print('Song not found')
        return False
    return scrap_song_url(song_url)

# Find POMs in given lyrics
def findPOM(lyrics):
    with open('badwords.json') as json_file:
        badwords = json.load(json_file)['RECORDS']
    if not lyrics:
        return 'Song not found.'
    POMs = []
    for word in lyrics.split():
        for badword in badwords:
            if word.lower() == badword['word'].lower():
                POMs.append(word)
    if not POMs:
        return 'No POMs found.'
    return POMs


# Inputs should have underscores for spaces.
song = sys.argv[1].replace('_', ' ')
artist = sys.argv[2].replace('_', ' ')

print(findPOM(getSongLyrics(song, artist)))
sys.stdout.flush()