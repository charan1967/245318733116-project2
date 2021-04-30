const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db;
var s;

MongoClient.connect('mongodb://localhost:27017/vege_inventory', (err, database) => {
    if (err)
        return console.log(err)
    db = database.db('vege_inventory')
    app.listen(1967, () => {
        console.log('port is on 1967')
    })
})

app.set('view engine', 'ejs')
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
app.use(express.static('public'))


var collectionOne = [];
var collectionTwo = [];
var collectionThree = [];
var collectionFour = [];
var collectionFive = [];
app.get('/', function (req, res) {
    db.collection("leafy_vegetables", function (err, collection) {
        collection.find().sort({ order_num: 1 }).toArray(function (err, result) {
            if (err) {
                throw err;
            } else {
                for (i = 0; i < result.length; i++) {
                    collectionOne[i] = result[i];
                }
            }
        });
        db.collection("cruciferous", function (err, collection) {
            collection.find().sort({ order_num: 1 }).toArray(function (err, result) {
                if (err) {
                    throw err;
                } else {
                    for (i = 0; i < result.length; i++) {
                        collectionTwo[i] = result[i];
                    }
                }
            });
        });
        db.collection("allium", function (err, collection) {
            collection.find().sort({ order_num: 1 }).toArray(function (err, result) {
                if (err) {
                    throw err;
                } else {
                    for (i = 0; i < result.length; i++) {
                        collectionThree[i] = result[i];
                    }
                }
            });
        });
        db.collection("Marrow", function (err, collection) {
            collection.find().sort({ order_num: 1 }).toArray(function (err, result) {
                if (err) {
                    throw err;
                } else {
                    for (i = 0; i < result.length; i++) {
                        collectionFour[i] = result[i];
                    }
                }
            });
        });
        db.collection("root", function (err, collection) {
            collection.find().sort({ order_num: 1 }).toArray(function (err, result) {
                if (err) {
                    throw err;
                } else {
                    for (i = 0; i < result.length; i++) {
                        collectionFive[i] = result[i];
                    }
                }
            });
        });
        // Thank you aesede!
        res.render('homepage.ejs', {
            collectionOne: collectionOne,
            collectionTwo: collectionTwo,
            collectionThree: collectionThree,
            collectionFour: collectionFour,
            collectionFive: collectionFive,
        });
    });
});

app.get('/create', (req,res)=>{
    res.render('add.ejs')
})
app.get('/updateitems', (req,res)=>{
    res.render('update.ejs')
})

app.get('/deleteitems', (req,res)=>{
    res.render('delete.ejs')
})

app.post('/adddata',(req,res)=>{
    db.collection(req.body.collection).insertOne(req.body,(err,result)=>{
        if(err) return console.log(err)
    res.redirect('/')
    })
})
app.post('/update',(req,res)=>{
    db.collection(req.body.collection).find().toArray((err,result)=>{
        if(err)
          return console.log(err)
        for(var i=0;i<result.length;i++)
        {
            if(result[i].v_id==req.body.v_id)
            {
                s=result[i].quantity
                break
            }
        }
        db.collection(req.body.collection).updateOne({v_id: req.body.v_id},{
         $set:{quantity:parseInt(s)+parseInt(req.body.quantity)}}, {sort:{v_id:-1}},
         (err,result)=>{
             if(err)
                 return res.send(err)
             console.log(req.body.v_id +' stock is updated')
             res.redirect('/')
         })
        //)
    })
 })
 
 app.post('/delete',(req,res)=>{
     db.collection(req.body.collection).deleteOne({v_id :req.body.v_id}, (err,result)=>{
         if(err) 
           return console.log(err)
         res.redirect('/')
     })
 })

