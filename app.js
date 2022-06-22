const express = require('express');
const app = express();
const router = require('./routes/routes');
const connectDB = require('./db/connect')
require('dotenv').config();
// const { auth } = require('express-openid-connect');
// const { notFound }  = require('./middleware/not-found')
// const { errorHandlerMiddleware }  = require('./middleware/error-handler')


const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL
};

app.use(express.json());
app.use(express.static('./public'))


const port = process.env.PORT || 3000;
const start = async ()=>{
    try{
        await connectDB(process.env.MONGO_URL)
        app.listen(port, ()=>{
            console.log(`Server is listening on port ${port}`);
        })
    }catch(error){
        console.log(error);
    }
}

start();