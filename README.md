# Commercify

<p>It's a Full Stack e-Commerce Web App build in MERN Stack including Stripe payment integartion</p>

Docker Image : [kamit6337/commercify-server](https://hub.docker.com/repository/docker/kamit6337/commercify-server/general)

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Tech](#tech)
- [Screenshots](#screenshots)
- [Running](#running)

## Description

This is an e-Commerce website like Amazon, Flipkart etc. where you can get various products of different categories.

## Features

- using Twilio for sending otp to mobile
- protect routes and data though express middleware
- Stripe payment integration to accept card
- global error handling at one place : globalErrorHandler.js
- cookie is created using jwt token to maintain user session

## Tech
<ul>
<li>Node JS</li>
<li>Express JS</li>
<li>JsonWebToken - <i>create token to maintain user logged in</i></li>
<li>MongoDB - <i>NoSQL database to store user data</i></li>
<li>Stripe - <i>online payment integration where user can pay using card</i></li>
<li>Twilio - <i>user logged in through mobile OTP</i></li>
</ul>

## Screenshots

Here are the screenshots of my project:

![product 1](https://commercify-vercel.s3.ap-south-1.amazonaws.com/images/commercify1.png)
![product 2](https://commercify-vercel.s3.ap-south-1.amazonaws.com/images/commercify2.png)


## Running

To run this server locally using Docker Image :

- install Docker Desktop from [Docker website](https://www.docker.com/products/docker-desktop) and start to run in background
- create a folder in desktop, open this folder in VS Code
- create a .env file
- copy .env.example file variables from above and paste in .env file
- start filling all environment variables
### All environment variables is necessary except EXPIRES_IN, SENTRY_DSN, REDIS_URL to run smoothly and see all functionality
- also create a compose.yaml file inside that folder
- copy below code and paste in compose.yaml

```
version: "3"
services:
  server:
    image : kamit6337/commercify-client
    ports:
      - 8000:8000
    env_file:
      - .env
    depends_on:
      - redis
    command: npm run dev # Command to run the server, no need for ./server prefix

  redis:
    image: redis/redis-stack:latest
    container_name: redis-stack
    ports:
      - 6379:6379
      - 8001:8001 # Optional: Web UI port for Redis Stack (if using Redis Stack)
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 5

```


- open VS Code terminal (Ctrl + `)

```
docker compose up
```

- both Redis and server started
- check by go to url: http://localhost:8000, you will get a response means server is working fine

