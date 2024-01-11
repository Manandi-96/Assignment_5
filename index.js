    import express from "express";
    import { MongoClient } from 'mongodb';

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
    app.get('/locations', (req, res) => {
        db.collection("locations").find().toArray((err, result) => {
            if (err) throw err;
            res.send(result)
        })
    })



    //get mealType

    app.get('/quickSearch', (req, res) => {
        db.collection("mealType").find().toArray((err, result) => {
            if (err) throw err;
            res.send(result)
        })

    })


    //get restaurant data (query search is used in here)
    app.get('/restaurants', (req, res) => {
        let query = {}
        let stateId = +req.query.state_id
        let mealId = +req.query.mealId
        if (stateId) {
            query = { state_id: stateId }//state_id is the field name, it should match with my given stateId
        }
        else if (mealId) {
            query = { "mealTypes.mealtype_id": mealId }
            // mealtype_id is under the mealType, thats why ( this method is used for mongo)
        }

        // get restaurant

        db.collection("restaurant").find(query).toArray((err, result) => {
            if (err) throw err;
            res.send(result)
        })
        
    })




    //filters


    app.get('/filter/:mealId', (req, res) => {
        let query = {}
        let mealId = +req.params.mealId
        let cuisineId = +req.query.cuisineId
        let lcost = +req.query.lcost
        let hcost = +req.query.hcost
        let sort = { cost: 1 }//asc

        if (req.query.sort) {
            sort = { cost: req.query.sort }
        }

        if (cuisineId) {
            query = {
                "mealTypes.mealtype_id": mealId,
                "cuisines.cuisine_id": cuisineId
            }
            // considering the cost range
        } else if (lcost && hcost) {
            query = {
                "mealTypes.mealtype_id": mealId,
                $and: [{ cost: { $gt: lcost, $lt: hcost } }]//setting up the range
                //using and operator in mongodb
            }
        } else if (cuisineId && lcost && hcost) {
            query = {
                "mealTypes.mealtype_id": mealId,
                "cuisines.cuisine_id": cuisineId,
                $and: [{ cost: { $gt: lcost, $lt: hcost } }]
            }
        }

        // -1 => desc
        // 1 => asc

        db.collection("restaurant").find(query).sort(sort).toArray((err, result) => {
            if (err) throw err;
            res.send(result)
            //sort is a method used in mongoDB to arrange data in asc or desc order
        })

    })

    //details

    app.get('/details/:id', (req, res) => {
        let id = +req.params.id

        db.collection("restaurant").find({ restaurant_id: id }).toArray((err, result) => {
            if (err) throw err;
            res.send(result)
        })

    })

    //menu of restaurant

    app.get('/menu/:id', (req, res) => {
        let id = +req.params.id

        db.collection("menu").find({ restaurant_id: id }).toArray((err, result) => {
            if (err) throw err;
            res.send(result)
        })

    })
// page 4== transfer data to database as in the order info and the price
    //Menu Details

        // express.json() => Inbuilt middleware, 
        app.post('/menuItem',express.json(),(req, res) => {
            if (Array.isArray(req.body)) {
                db.collection("menu").find({ menu_id: { $in: req.body } })
                // $in whether it is inside an array (mongoDB doc)
                    .toArray((err, result) => {
                        if (err) throw err;
                        res.send(result)
                    })
            } else {
                res.send("Invalid Input")
            }
        })

        //delete order

app.delete('/deleteOrder/:id', (req, res) => {
    let oid = +req.params.id
    db.collection("orders").deleteOne({ orderId: oid }, (err, result) => {
        if (err) throw err;
        res.send("Order deleted successfully")
    })
})

//update payment details


app.put('/updateOrder/:id', (req, res) => {
    let oid = +req.params.id
    db.collection("orders").updateOne({ orderId: oid },
        {
            $set: {
                status: req.body.status,
                bank_name: req.body.bank_name,
                date: req.body.date,
            }
        },
        (err, result) => {
            if (err) throw err;
            res.send("Order updated successfully")
        })
})



    //Mongo connection 

    MongoClient.connect(url, (err, client) => {
        if (err) {
            console.log("Error while connecting to MongoDB:", err);
        } else {
            console.log("MongoDB is connected");
            db = client.db("Resturent-api");//theres a spelling mistake , this is the same way i saved in the mongo shell as well
            app.listen(port, () => {
                console.log(`Server running on port ${port}`);
            });
        }
    });
