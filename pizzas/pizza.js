const express=require("express")
const mongodb=require("mongodb")
const app= express()
app.use(express.json())
const mongoclient= mongodb.MongoClient;
const URL="mongodb+srv://user:hztHmDTfkSGd1p4D@cluster0.mc3htnf.mongodb.net"
const pizzas=[];
const cors= require("cors")
app.use(cors({
    //origin :"http://localhost:3000"
}))
const bcrypt = require ("bcryptjs")

app.get("/pizzas",async (req,res)=> {
    try{
        //connect mongoDB
        const connection = await mongoclient.connect(URL);
        //Select DataBase
        const db = connection.db("pizaaslist")
        //Select Collection
        const collection= db.collection("pizaas")
        //Do operation
        const pizzas=  await collection.find({
            $or:[
                { isDeleted:{$exists : false} },
                {isDeleted: false}
            ],
        }).toArray();
        //close connection
        await connection.close()
        res.json(pizzas)
        }catch(error){
            console.log(error);
            res.status(500).json({message:"Something went wrong"})
        }
    });
    
// post method in nodejs
  app.post("/pizza", async(req,res)=> 
  { 
    console.log("i am");
     /* const now=new Date();
    const year=now.getFullYear();
    const month=now.getMonth() + 1;
    const date=now.getDate();
    const hour=now.getHours();
    const minit=now.getMinutes();
    const sec=now.getSeconds();
req.user.id=`${year}+${month}+${date}+${hour}+${minit}+${sec}`
    users.push({
        id:req.body.id,
        name:req.body.name,
        age:req.body.age 
    })
    res.json({message:"Success"}) */
    try{
    //connect mongoDB
    const connection = await mongoclient.connect(URL);
    //Select DataBase
    const db = connection.db("pizzaslist")
    //Select Collection
    const collection= db.collection("pizzas")
    //Do operation
    const operation=  await collection.insertOne({...req.body,isDeleted : false})
    //close connection
    await connection.close()
    res.json({message:"pizza inserted"})
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Something went wrong"})
    }
});
app.listen(5000)