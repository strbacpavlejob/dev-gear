# dev-gear
Dev Gear is a online store that has a Stripe payment built in
# Welcome to Dev-Gear!

Dev Gear is an online store that sells computer equipment (Laptops, Smartphones, and Tablets). Users can interact with the web application and find more about available products by filtering or searching. Logged users can add items to their cart and make a purchase. If the user has admin permissions, they can create, edit or delete products on the website. 
The project has been built with Nest.JS on the back-end and React.JS on the front-end, and with the support of MongoDB and Stripe API for online purchases.

# Installation
For this project you will need several things installed before you start with project setup:

 1. [Git](https://git-scm.com/) - for cloning the project
 2. [Node](https://nodejs.org/en/) - for running the app and installing needed packages
 3. [MongoDB](https://www.mongodb.com/docs/manual/installation/) - for the database
 4. [Stripe Account](https://stripe.com/)  - for Stripe API keys for the online payment
 
 Useful developer tools:
 1.  [VSCode](https://code.visualstudio.com/) - for viewing the code
 2. [MongoDBCompass](https://www.mongodb.com/products/compass) - for manipulation with database

# Project Setup
There are two folders **server** and **client**. Both have **.env** files for the variables used for Stripe API keys, JWT and MongoDB configuration.

 1. Open project in terminal 
 2. Go to client folder  `cd client/`
 3. Install needed packages`npm install`
 4. Rename the **.example.env** to **.env**
 5. Fill variables using your Stripe API key
 6. Go to server folder  `cd server/`
 7. Install needed packages`npm install`
 8. Rename the **.example.env** to **.env**
 9. Fill variables using your Stripe API key and JWT 

# Running the Project
 1. Open project in terminal 
 2. From the project root folder go to client folder  `cd client/`
 3. Start the client app `npm start`
 4. Open another instance of terminal 
 5. From the project root folder go to server folder  `cd server/`
 6. Start the client app `npm start`

First user that will be created will have admin rights, you can always change this manually by using **MongoDBCompass**