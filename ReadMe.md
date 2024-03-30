# Getting Started

Run the dev servers

```
bin/dev up
```
or
```
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

Running the "regular" servers

```
bin/start
```

Running the app with docker-hub images... what the prod server is using
```
bin/prod up
```

# Struggles
registration and login wasn't mentioned in the requirements, but I had the api ready from another project. I sort of slapped together the login and registration page. I put most of the focus on the home page ui. There is room for improvement where error messages are concerned. For example, login wrong password. Or registering where the username is already taken. It throws a 500 on the server since the DB username needs to be unique.

Search state is not really defined fully. Should the search state return to showing all the notes when we go from `SEARCH` to `NEW` or `EDIT` state. I just left it the way it was. So if you filtered the notes then add a new one. the new note shows on top of the filtered notes. Then there is no way to get all the notes in the view without searching with an empty string.

The 20-300 character limit was implemented on the server side with validation. It would throw a 400 bad request exception. But the ui form also validates the length as well. Kind of overkill on my part. But the micro-service should never trust the ui.


# Implementation Details

## nginx layer
The app is pretty simple. It has three docker containers to get it to run. 
First, is the nginx container. It acts as the gateway where the browser static html get request goes through there. also the /api is routed through. This solves the cors problem. It has become my defacto way of doing personal projects. I would also advocate that it is a documented approach to the problem that any developer should be able to pick up from. Where as at my current position, we have inherited a react app that uses a javascript proxy server using express to deal with the cors problem. Even though it is a TypeScript project. This mechanism is written in JavaScript. Being custom code it is hard to tell what is going on without reading everything.  It could have just been a simple nginx config. It was also breaking constantly as offshore developers worked on it. We solved that by adding it to the cdci, checking the code with esLint. 

# ui layer
the ui is just an NextJs app. It really didn't need to be SSR. But I started going with that for my personal projects since I need to be able to do SEO things and get meta tags working in chat programs and social media. For this its kind of over kill. I could have saved my self a container by making it static html on the ningx layer.

# api layer
The api is written with the NestJS framework. I like it because it is modular. I already had the auth module from some other project I was working on. Just had to make the notes module with the routes. 
The pitfall of NodeJS servers is that they make 1+GB images. Taking up space on the small linode server. I solved this by offloading images to docker hub. Then pulling the images after ssh-ing into the linde. See docker-compose.prod.yml
I went with REST for the api interface. But could have easily implemented graphql with nestJS. I like being able to make POST PATCH and DELETE http requests.

# database
The database is just SQL-Lite with TypeORM on top. No need for a container. It saves the database as a db file. Nothing is backed up.
user passwords are hashed and stored along with the salt in the database for security. Each user creates notes with there user_id as a foreign key. All user notes are on the same table. There could be more separation. But this is a simple project   