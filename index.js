//Packages are the building blocks of nodejs

//1.Inbuild Packages
//2.Custom Packages
//3.Third Party Packages

const os=require("os");
const OS=os.platform();
console.log(OS);

const platform= process.platform;
const core=os.cpus();
const uptime =os.uptime();
const path=require("path")
const dirname= path.dirname(__dirname);
console.log(dirname)
//absolute path  => C://project_name/floder_name/file_name
// Relative path => ../../folder/file.js
const fs=require ("fs")
fs.writeFile("message.txt","Hello wprld",function(err){
    console.log("File created successfully");
});
fs.readFile("./message.txt",{encoding:"utf-8"},function(err,data){
if(err)throw err;
console.log(data)
})

fs.readdir("./",function(err,list){
    console.log(list)
})

fs.watchFile("./message.txt",function(curr,prev){
    console.log(curr)
    console.log(prev)
})



const express=require("express")
const mongodb=require("mongodb")
const app= express()
app.use(express.json())
const mongoclient= mongodb.MongoClient;
const URL="mongodb+srv://user:hztHmDTfkSGd1p4D@cluster0.mc3htnf.mongodb.net"
const users=[];
const cors= require("cors")
app.use(cors({
    origin :"http://localhost:3000"
}))
const bcrypt = require ("bcryptjs")
app.get("/users",async (req,res)=> {
    try{
        //connect mongoDB
        const connection = await mongoclient.connect(URL);
        //Select DataBase
        const db = connection.db("userslist")
        //Select Collection
        const collection= db.collection("users")
        //Do operation
        const users=  await collection.find({
            $or:[
                { isDeleted:{$exists : false} },
                {isDeleted: false}
            ],
        }).toArray();
        //close connection
        await connection.close()
        res.json(users)
        }catch(error){
            console.log(error);
            res.status(500).json({message:"Something went wrong"})
        }
    });
    
// post method in nodejs
  app.post("/user", async(req,res)=> 
  { 
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
    const db = connection.db("userslist")
    //Select Collection
    const collection= db.collection("users")
    //Do operation
    const operation=  await collection.insertOne({...req.body,isDeleted : false})
    //close connection
    await connection.close()
    res.json({message:"user inserted"})
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Something went wrong"})
    }
});

app.put("/user/:id",async (req,res) =>{
    // put method in nodejs

    //const index=users.findIndex(o => o.id == req.params.id)
   // console.log(index);
   //console.log(Object.keys(req.body));
   //Object.keys(req.body).forEach((field) => {
    //users[index][field] = req.body[field];
   //});
    //users[index].age=req.body.age;
    //res.json({message:" Edited Success"})
    console.log(req.params);
    try{
        //connect mongoDB
        const connection = await mongoclient.connect(URL);
        //Select DataBase
        const db = connection.db("userslist")
        //Select Collection
        const collection= db.collection("users")
        //Do operation
        await collection.findOneAndUpdate({
            _id:req.params.id},
            
            {$set:req.body}
        ).then((responce) =>{console.log(responce)});
        //close connection
        await connection.close()
        res.json({message:"user Updated"})
        }catch(error){
            console.log("error",error);
            res.status(500).json({message:"Something went wrong"})
        }

})

app.delete("/user/:id", async (req,res) => {
    //nodejs method
    //const index=users.findIndex(o => o.id == req.params.id)
    //users.splice(index,1)
    //res.json({message:"success Delete"})

    try{
        //connect mongoDB
        const connection = await mongoclient.connect(URL);
        //Select DataBase
        const db = connection.db("userslist")
        //Select Collection
        const collection= db.collection("users")
        //Do operation
        const operation=  await collection.findOneAndUpdate({
            _id:mongodb.ObjectId(req.params.id)},
            {$set:{isDeleted: true},
        })
        //close connection 
        await connection.close()
        res.json({message:"user deleted"})
        }catch(error){
            console.log(error);
            res.status(500).json({message:"Something went wrong"})
        }

});

// find single user
app.get("/users/:id",async (req,res)=> {
try{
        //connect mongoDB
        const connection = await mongoclient.connect(URL);
        //Select DataBase
        const db = connection.db("userslist")
        //Select Collection
        const collection= db.collection("users")
        //Do operation
        const users=  await collection.findOne({
            $and :[
                {
                    _id: mongodb.ObjectId(req.params.id),
                },
                {
                    $or:[
                        { isDeleted:{$exists : false} },
                        {isDeleted: false},
                    ],
                },
            ], 
        });
        //close connection
        await connection.close()
        res.json(users)
        }catch(error){
            console.log(error);
            res.status(500).json({message:"Something went wrong"})
        }
    });

app.post("/register",async(req,res) =>{
    try{
        //connect mongoDB
        const connection = await mongoclient.connect(URL);
        //Select DataBase
        const db = connection.db("userslist")
        //Select Collection
        const collection= db.collection("app_users")
        //Do operation
        const salt= await bcrypt.genSalt(10)
        const hash= await bcrypt.hash(req.body.password,salt)
        //console.log(hash)
        req.body.password=hash;
        const operation=  await collection.insertOne(req.body)
        //close connection
        await connection.close()
        res.json({message:"user inserted"})
        }catch(error){
            console.log(error);
            res.status(500).json({message:"Something went wrong"})
        }
});

app.post("/login",async(req,res) =>{
    try{
        //connect mongoDB
        const connection = await mongoclient.connect(URL);
        //Select DataBase
        const db = connection.db("userslist")
        //Select Collection
        const collection= db.collection("app_users")
        //Do operation
        const user= await collection.findOne({email : req.body.email})
        if(user){
            //check password
            const compare= await bcrypt.compare(req.body.password,user.password)
            if(compare){
                res.json({message:"Correct"})
            }else{
                res.json({message:"Email/Password is Wrong"})
            }
        }else{
            res.status(401).json({message:"Email/Password is Wrong"})
        }
        //close connection
        await connection.close()
        res.json({message:"user inserted"})
        }catch(error){
            console.log(error);
            res.status(500).json({message:"Something went wrong"})
        }
});   

app.listen(5000)
