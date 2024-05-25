const fs=require("fs");
const express=require("express");
const cors = require('cors');
const restaurants=require("./r1.json"); 
const Locations=require("./r2.json");  
const Mealtype=require("./r3.json");
const locationDehli=require("./r5.json");
const Menus=require("./r4.json");
const app=express();
const serverless = require("serverless-http");
const router = express.Router();

const port=8001;
app.use(cors());
app.use(express.json());
router.get('/', (req, res) => {
    res.send("<h1>App is running</h1>")
});
app.get("/getallrestaurants", (req, res) => {
    fs.readFile('./r1.json', (err, data) => {
        if (err) {
            throw err;
        } else {
            res.send(JSON.parse(data));
        }
    });
});
app.get("/getallLocations",(req,res)=>{
    fs.readFile('./r2.json',(err,data)=>{
        if(err){
            throw err;
        }else{
            res.send(JSON.parse(data));
        }
    });
});
app.get("/getallmealtype",(req,res)=>{
    fs.readFile('./r3.json',(err,data)=>{
        if(err){
            throw err;
        }else{
            res.send(JSON.parse(data));
        }
    });
});
app.get("/getallmenus",(req,res)=>{
    fs.readFile('./r4.json',(err,data)=>{
        if(err){
            throw err;
        }else{
            res.send(JSON.parse(data));
        }
    });
});
app.get("/getkfcrestaurants", (req, res) => {
    fs.readFile('./r1.json', (err, data) => {
        if (err) {
            throw err;
        } else {
            const restaurants = JSON.parse(data);
            const kfcRestaurants = restaurants.filter(restaurant => restaurant.name === "KFC");
            res.send(kfcRestaurants);
        }
    });
});
app.get("/getallrestaurants/:locationId", (req, res) => {
    const locationId = req.params.locationId;
    const filteredRestaurants = restaurants.filter(restaurant => restaurant.location_id === parseInt(locationId));
    res.json(filteredRestaurants);
});
app.get('/getrestaurantsbymealtype1', (req, res) => {
    const filteredRestaurants = restaurants.filter(restaurant => restaurant.mealtype_id === 1);
    res.json(filteredRestaurants);
  });
app.get('/getrestaurantsbymealtype2', (req, res) => {
    const filteredRestaurants = restaurants.filter(restaurant => restaurant.mealtype_id === 2);
    res.json(filteredRestaurants);
  });
app.get('/restaurants/by-cuisine', (req, res) => {
    const cuisineName = req.query.name;
    function filterCuisinesByName(name) {
        return restaurants.filter(restaurant =>
            restaurant.cuisine.some(cuisineItem =>
                cuisineItem.name.toLowerCase().includes(name.toLowerCase())
            )
        );
    }
const filteredCuisines = filterCuisinesByName(cuisineName);
    console.log(filteredCuisines);
    res.json(filteredCuisines);
});
app.get('/restaurants/by-cost', (req, res) => {
    const minPrice = parseInt(req.query.minPrice);
    const maxPrice = parseInt(req.query.maxPrice);
    const filteredRestaurants = restaurants.filter(restaurant =>
        restaurant.min_price >= minPrice && restaurant.min_price <= maxPrice
    );
    if (filteredRestaurants.length === 0) {
        res.status(404).json({ message: 'No restaurants found within the specified cost range.' });
    } else {
        res.json(filteredRestaurants);
    }
});
app.get('/mealtype_idlow',(req,res)=>{
    const FilterRestByMealtype=(mealtype_id,sortOrder)=>{
          const mealtype=restaurants.filter(restaurant=>restaurant.mealtype_id===mealtype_id).sort((a,b)=>{
              return sortOrder=a.min_price-b.min_price;
          })
          res.json(mealtype);
      };
      const filteredRestaurants=FilterRestByMealtype(1);
      console.log(filteredRestaurants);
  });
  app.get('/mealtype_idhigh',(req,res)=>{
    const FilterRestByMealtype=(mealtype_id,sortOrder1)=>{
          const mealtype=restaurants.filter(restaurant=>restaurant.mealtype_id===mealtype_id).sort((a,b)=>{
              return sortOrder1=b.min_price-a.min_price;
          })
          res.json(mealtype);
      };
      const filteredRestaurants=FilterRestByMealtype(1);
      console.log(filteredRestaurants);
  });
  app.use("/.netlify/functions/app", router);
  module.exports.handler = serverless(app);
app.listen(port,()=>{
    console.log("server is running on http://localhost:8001")
});





