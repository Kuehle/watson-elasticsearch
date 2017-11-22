# Purpose
This project is part of a thesis about connecting a Chatbot (namely Watson Conversation) to a Document Search engine

## TheMealDB
From [TheMealDB - API](http://www.themealdb.com/api.php):

You can use the test API key "1" during development of your app (see test links below)
However you must apply for a key a production API key via email before releasing your app to the public.
The test key may be revoked at any time if abused.

The Mail to apply for your API Key is -> Email: zag (at) kodi.tv

## Install 
Prequesites: docker, docker-compose, node

```docker-compose up``` starts the Elasticsearch instances (avaliable on localhost:9200).

```node data-import.js``` runs a series of queries against the popular open meal Database [TheMealDB](http://www.themealdb.com) and indexes all Data in your local elastic instances. 