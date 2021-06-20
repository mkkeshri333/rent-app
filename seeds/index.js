const mongoose= require('mongoose');
const cities=require('./cities');
const Rent=require('../models/rent');
const {places,descriptors}=require('./seedHelper');

mongoose.connect('mongodb://localhost:27017/Rent-home',{

useNewUrlParser:true,
useCreateIndex:true,
useUnifiedTopology:true

});

const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected");
});

const sample=array=>array[Math.floor(Math.random()*array.length)];


const seedDB=async ()=>{
    await Rent.deleteMany({});
    for(let i=0; i<10;i++){
        const random700=Math.floor(Math.random()*700);
        const price=Math.floor(Math.random()*100);
        const rentHome=new Rent({
            author:'60cd036aa4b39002d8a51655',
            location:`${cities[random700].city}, ${cities[random700].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            contact:8435641523,
            description:'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ',
            price,
            images:[
                {
                  url: 'https://res.cloudinary.com/dqwnjt6rq/image/upload/v1622846879/YelpCamp/sdlevfkxi5msooqlncci.jpg',
                    filename:'sdlevfkxi5msooqlncci' 
                }]
        })
        await rentHome.save(); 
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
})
