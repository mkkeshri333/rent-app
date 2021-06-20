if(process.env.NODE_ENV!=="production"){
    require('dotenv').config();
}


const express=require('express');
const path= require('path');
const mongoose= require('mongoose');
const ejsMate =require('ejs-mate');
const session=require('express-session');
const flash=require('connect-flash');
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

const dbUrl=process.env.DB_URL || 'mongodb://localhost:27017/Rent-home-pay';
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

const secret=process.env.SECRET || 'thisshouldbebettersecret!';

const sessionConfig={
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

app.use('/',userRoutes);
app.use('/rent',rentRoutes);
app.use('/rent/:id/reviews',reviewsRoutes);

app.get('/',(req,res)=>{
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


const port=process.env.PORT || 3000;

app.listen(port,()=>{
    console.log('listening port');
})







