if(process.env.NODE_ENV!=="production"){
    require('dotenv').config();
}


const express=require('express');
const path= require('path');
const mongoose= require('mongoose');
const ejsMate =require('ejs-mate');
const session=require('express-session');
const flash=require('connect-flash');
const Joi = require('joi');
const ExpressError = require('./utils/ExpressError');

const methodOverride=require('method-override');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user');
const helmet=require('helmet');

const mongoSanitize=require('express-mongo-sanitize');



const userRoutes=require('./routes/user');
const rentRoutes=require('./routes/rent');
const reviewsRoutes = require('./routes/reviews');

const secret=process.env.SECRET || 'thisshouldbebettersecret!';

const MongoStore = require("connect-mongo");


const dbUrl=process.env.DB_URL || 'mongodb://localhost:27017/Rent-home';



mongoose.connect(dbUrl,{
useNewUrlParser:true,
useCreateIndex:true,
useUnifiedTopology:true,
useFindAndModify:false

});

const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected");
})




const app=express();


app.engine('ejs', ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));
app.use(mongoSanitize());

const store= MongoStore.create ({
        mongoUrl:dbUrl,
        secret,
        touchAfter:20*60*60
});

store.on("error",function(e){
    console.log("SESSION STORE Error",e);
});

const sessionConfig={
    store,
    name:'home',
    secret,
    resave:false,
    saveUninitialized:true,
    cookie: {
        httpOnly:true,
        //secure:true,
       _expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      originalMaxAge : 1000 * 60 * 60 * 24 * 7
    }
}


app.use(session(sessionConfig));
app.use(flash());
app.use(helmet({contentSecurityPolicy: false}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser= req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})

app.get('/fakeUser',async(req,res)=>{
    const user=new User({email:'coltttt@gmail.com',username:'colttt'});
    const newUser=await User.register(user,'chicken');
    res.send(newUser);
})

app.use('/',userRoutes);
app.use('/rent',rentRoutes);
app.use('/rent/:id/reviews',reviewsRoutes);

app.get('/',(req,res)=>{
    //console.log( 1000 * 60 * 60 * 24 * 7);
    //console.log(session.cookies);

    res.render('home');
})


app.all('*',(req,res,next)=>{

    next(new ExpressError('page not found',404));

})

app.use((err,req,res,next)=>{
     const {statusCode=500}=err;
     if(!err.message) err.message="oh No Something went Wrong !";
     res.status(statusCode).render('error',{err});
})

app.listen(3000,()=>{
    console.log('listening port');
})







