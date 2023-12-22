import express from "express";
import { MongoClient } from 'mongodb'

const app= express();
const port= 4000;
// localhost:4000
const url= 'mongodb://127.0.0.1:27017';
//'mongodb://localhost:27017';
let db;

//==> HTTP Methods
app.get("/",(req,res)=>{
    res.send("Welcome to Restaurants App API 🙌")
});

// locations
app.get("/locations",(req,res)=>{
    db.collection("locations").find().toArray() // in here is db is not defined, we have to define it here.
    res.send(location)
});


//Mongo connection 

MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
    if (err) {
        console.log("Error while connecting to MongoDB:", err);
    } else {
        console.log("MongoDB is connected");
        db = client.db("Resturent-api");
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }
});
