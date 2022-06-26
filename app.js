const express = require('express');
const app = express();
const router = require('./routes/routes');
const connectDB = require('./db/connect')
require('dotenv').config();
const { auth } = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');
const { notFound }  = require('./middleware/not-found')
const { errorHandlerMiddleware }  = require('./middleware/error-handler')
const path = require('path');

//auth config
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL
};
app.use(auth(config));

app.use(express.json());
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));

//view engine setup
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
//bootstrap
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));

//check if user is logged in
app.use('/', async (req, res, next)=>{
    if(req.oidc.user){
        res.locals = {isAuth: true, username:req.oidc.user.name, profilePic:req.oidc.user.picture};
    } else {
        res.locals = {isAuth: false};
    }
    next();
})

//home page
app.get('/', async (req, res, next)=>{
    res.render('index')
    next();
});

//routes
app.use('/reviewApp', requiresAuth());
app.use('/reviewApp',router);

//middleware for catching errors
// app.use(notFound)
// app.use(errorHandlerMiddleware)

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