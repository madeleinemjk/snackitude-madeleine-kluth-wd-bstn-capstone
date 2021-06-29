# Snackitude

Capstone project for the BrainStation Full Stack Web Development April-June 2021 course.  
Linking professionals working remotely or dealing with the transition back to office life with users nearby who are already going to the shop, for when that low blood sugar hits and concentration drops.  

## Problem

Sometimes there is simply no chance to break from meetings to pop to the shop for a packet of crisps, so being able to request a snack from someone nearby who is already going, avoiding a minimum charge and outrageous delivery fee will save the day. Other people might live in a village where the nearest shop is a 10 minute drive away, and it is simply not economical to go all that way for a chocolate bar.  

## User Profile

Targeting the WfH demographic to save time, transport emissions, and wastage from impulse buying. Furthermore it could aid the sick, elderly or people otherwise limited in their capacity to travel, promoting community.  

### Tech Stack and APIs

HTML, SCSS, JS, Node, React, Express, Passport, Git  
MySQL  
Google Maps APIs: Places, Distance Matrix and Maps Embed  

### Further Development

Payment functionality - Stripe, PayPal - as MVP will use cash payments, but using a payment platform will allow easier implementation of the “transnacktion” fee.   
User profiles and personalisation e.g. avatar, snack suggestions, saved location radius.  
Report complaints.  
Live chat and option to add delivery directions.  
Better authorisation - so details are anonymous until a request is accepted.  
Public transport options.  
Private Route component for paths once logged in.  
Set radius by time option as well as distance.  
Option to change from filtering by radius to by along a specific route.  
Specific supermarket option for rogue snack options e.g. oat crunchies from sains and waitrose.  
Add store stock checker.  

## How to set this up yourself!  

1. Fork the repository https://docs.github.com/en/desktop/contributing-and-collaborating-using-github-desktop/adding-and-cloning-repositories/cloning-and-forking-repositories-from-github-desktop#forking-a-repository and choose "For my own purposes".  
2. npm install  
3. set up MySQL workbench with your password and new schema.  
4. create your Google Maps API key to use.  
5. set RELOAD_DB = true in your server .env to start your create your database tables, run node server.js in the Server terminal, then set it to false to keep your data.  
6. run npm start in the Client terminal.  
7. happy hacking!
