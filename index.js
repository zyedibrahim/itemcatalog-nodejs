import express from "express"; // "type": "module"
const app = express();
import nodemailer from "nodemailer"
import  Jwt, { verify }  from "jsonwebtoken";
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import bcrypt from "bcrypt"
import cors from "cors"
import shortid from "shortid";
import { MongoClient, ObjectId } from "mongodb";
import {auth} from "./middleware/auth.js"
const MONGO_URL = process.env.MONGO_URL
const client = new MongoClient(MONGO_URL); // dial
// Top level await
await client.connect(); // call
console.log("Mongo is connected !!!  ");
app.use(express.json())
app.use(cors());

const PORT = process.env.PORT

// password encrypted 
async function generateHashedPassword(password){

  const No_of_rounds = 10;
  const salt = await bcrypt.genSalt(No_of_rounds);
  const hashedpassword = await bcrypt.hash(password,salt)
  console.log(salt);
  console.log(hashedpassword);
  return hashedpassword;
}





app.get("/", function (request, response) {
  response.send("🙋‍♂️, 🌏 🎊✨🤩");
});

// app.delete("/products/categories/all", async function (request, response) {
  

//   const datas = await client
//   .db("products")
//   .collection("allproducts")
//   .deleteMany({})

//   response.send(datas);
// });


app.post("/products/categories/all", async function (request, response) {
  const bodydata=request.body;
  const datas = await client
  .db("products")
  .collection("allproducts")
  .insertOne(bodydata)
  
console.log(bodydata);
  response.status(200).send({"status":"200 ok",datas})
});
app.delete("/products/categories/all/:id",auth,async function (request, response) {
  const {id}=request.params;
  try{
    const datas = await client
    .db("products")
    .collection("allproducts")
    .deleteOne({_id:new ObjectId(id)})
    response.status(200).send({"status":"200 ok"})
}
catch(err){
  response.status(400).send({"status":"something went wrong"})
}

});

// // categories Milk
// app.post("/products/categories/milk", async function (request, response) {
//   const data=request.body;
  
//   const alldata = await client
//   .db("products")
//   .collection("allproducts")
//   .insertMany(data)
  

//   const datas = await client
//   .db("products")
//   .collection("categories_milk")
//   .insertOne(data)



//   response.send(datas);
// });
// // categories fruit
// app.post("/products/categories/fruit", async function (request, response) {
//   const data=request.body;
  
//   const alldata = await client
//   .db("products")
//   .collection("allproducts")
//   .insertMany(data)

//   const datas = await client
//   .db("products")
//   .collection("categories_fruit")
//   .insertOne(data)
//   response.send(datas);
// });
// // categories vegetables
// app.post("/products/categories/vegetables", async function (request, response) {
//   const data=request.body;

//   const alldata = await client
//   .db("products")
//   .collection("allproducts")
//   .insertMany(data)

//   const datas = await client
//   .db("products")
//   .collection("categories_vegetables")
//   .insertOne(data)
  

//   response.send(datas);
// });
// // categories oil
// app.post("/products/categories/oil", async function (request, response) {
//   const data=request.body;

//   const alldata = await client
//   .db("products")
//   .collection("allproducts")
//   .insertMany(data)

//   const datas = await client
//   .db("products")
//   .collection("categories_oil")
//   .insertOne(data)

//   response.send(datas);
// });
// // categories soap&detergent
// app.post("/products/categories/soap&detergent", async function (request, response) {
//   const data=request.body;
  
//   const alldata = await client
//   .db("products")
//   .collection("allproducts")
//   .insertMany(data)


//   const datas = await client
//   .db("products")
//   .collection("categories_soap&detergent")
//   .insertOne(data)
  



//   response.send(datas);
// });

// // fruit
//  app.get("/products/categories/fruit", async function (request, response) {
//   const datas = await client
//   .db("products")
//   .collection("categories_fruit")
//   .find({})
//   .toArray()
  
//   response.send(datas);
// });

// // vegetables
//  app.get("/products/categories/vegetables", async function (request, response) {
//   const datas = await client
//   .db("products")
//   .collection("categories_vegetables")
//   .find({})
//   .toArray()
  
//   response.send(datas);
// });
// // milk
//  app.get("/products/categories/milk", async function (request, response) {
//   const datas = await client
//   .db("products")
//   .collection("categories_milk")
//   .find({})
//   .toArray()
  
//   response.send(datas);
// });
// // oil
//  app.get("/products/categories/oil", async function (request, response) {
//   const datas = await client
//   .db("products")
//   .collection("categories_oil")
//   .find({})
//   .toArray()
  
//   response.send(datas);
// });
// // soap
//  app.get("/products/categories/soap&detergent", async function (request, response) {
//   const datas = await client
//   .db("products")
//   .collection("categories_soap&detergent")
//   .find({})
//   .toArray()
  
//   response.send(datas);
// });


 //  all products get
 app.get("/products/categories/name/all", async function (request, response) {
  const datas = await client
  .db("products")
  .collection("allproducts")
  .find({})
  .toArray()
  
  response.send(datas);
});

app.post("/products/categories/name", async function (request, response) {
  
  const bodydata =request.body
  
  const datas = await client
  .db("products")
  .collection("catagories")
.insertOne(bodydata) 
  
  response.status(200).send({"status":"200 ok"});
});
app.get("/products/categories/name",auth,async function (request, response) {
  
 
  
  const datas = await client
  .db("products")
  .collection("catagories")
.find({})
.toArray() 
  
  response.send(datas);
});
app.get("/products/categories/name/:id",auth,async function (request, response) {
  
  const {id} =request.params
  
  const datas = await client
  .db("products")
  .collection("catagories")
.findOne({_id: new ObjectId(id)})
  
  response.send(datas);
});
app.get("/alluser/accounts",auth,async function  (request, response) {
    
  const datas = await client
  .db("userdetails")
  .collection("user-accounts")
  .find({})
   .toArray({})
 
   const newdata = datas
const array =[]

for(let i = 0 ; i < newdata.length;i++){
// console.log(newdata[i].username);

const temp = {
username:newdata[i].username,
email:newdata[i].email,
roll : newdata[i].roll
}
 
array.push(temp)



}

   response.status(200).send({"status": "200 ok", array})



});


app.delete("/products/categories/name/:id",auth,async function (request, response) {
  
  const {id} =request.params
  
  const datas = await client
  .db("products")
  .collection("catagories")
.deleteOne({_id: new ObjectId(id)})
  
  response.send(datas);
});
app.put("/products/categories/name/:id",auth,async function (request, response) {
  
  const {id} =request.params
  const {catagories} = request.body
  
  const datas = await client
  .db("products")
  .collection("catagories")
.updateOne({_id: new ObjectId(id)},{$set :{catagories:catagories}})
  
  response.status(200).send({"status": "200 ok "})
});



app.get("/products/:id", async function (request, response) {
  const {id}=request.params;
  
  const datas = await client
  .db("products")
  .collection("allproducts")
  .findOne({_id:new ObjectId(id)})

  response.status(200).send({"status":"Successfully geted",datas })
});

// login
app.post("/login", async function (request, response) {
  
  
  try{
    
    const {username,password}=request.body;
  
  const getdata = await client
  .db("userdetails")
  .collection("user-accounts")
  .findOne({username:username})
  const isppasswordcheck = await bcrypt.compare(password,getdata.password)
  


  if(!getdata){
    response.status(404).send({"status":"This username not found "})
  }
  else if(getdata.verified !== "true"){
    
    response.status(404).send({"status":"email not activated "})
  }

else if(isppasswordcheck !== true ){
response.status(404).send({"status":"Password is incorrect"})
}

else if(getdata.username === "adminuser"){
  const adtoken = Jwt.sign({id:getdata._id},process.env.secretkey)
 response.status(200).send({"status":"Login successful",adtoken:adtoken})
}

else{

  const getdata = await client
  .db("userdetails")
  .collection("user-accounts")
  .findOne({username:username})



  const token = Jwt.sign({id:getdata._id},process.env.secretkey)
  response.status(200).send({"status":"Login successful",token:token,username:getdata.username,_id:getdata._id})

}


}

catch(err){
  console.log(err);
}


});
app.get("/updateprofile/:id", async function (request, response) {
 
  const {id} = request.params;
  const getdataup = await client
  .db("userdetails")
  .collection("user-accounts")
  .findOne({_id:new ObjectId(id)})

response.send(getdataup)

});
app.post("/updateprofile/:id", async function (request, response) {
 
const data = request.body;

  const {id} = request.params;
  const getdataup = await client
  .db("userdetails")
  .collection("user-accounts")
  .findOneAndUpdate({_id:new ObjectId(id)}, {$set:data}  )

response.status(200).send({"status": "200 Ok",  })

});

app.post("/updateprofile/password/:id", async function (request, response) {
 
const data = request.body;
const {id} = request.params


const verifypassword = await client
.db("userdetails")
.collection("user-accounts")
.findOne({_id:new ObjectId(id)})
const hashedpassword =await generateHashedPassword(data.confirm_newpassword)
console.log(hashedpassword);

const isppasswordcheck = await bcrypt.compare(data.old_password,verifypassword.password)



console.log(verifypassword);
  if(isppasswordcheck !== true ){
    response.status(400).send({"status":"incorrect password"})
  }

else{
  if(data.new_password === data.confirm_newpassword){
    
  const getdataup = await client
  .db("userdetails")
  .collection("user-accounts")
  .findOneAndUpdate({_id:new ObjectId(id)}, {$set:{password:hashedpassword}}  )

response.status(200).send({"status": "200 Ok password Changed"})
}

else{
  response.status(400).send({"status":"password must be match "})
}



}




});



// create user
app.post("/signup", async function (request, response) {
  const {username,email,password}=request.body;
  const hashedpassword = await generateHashedPassword(password)


try{
  const getemail = await client
  .db("userdetails")
  .collection("user-accounts")
  .findOne({email:email})
  const getusername = await client
  .db("userdetails")
  .collection("user-accounts")
  .findOne({username:username})
  
  if(getemail){
    response.status(404).send({"status":"This Email exist "})
  }
  else if(getusername){
  response.status(400).send({"status":" This Username Is Taken "})
  
  }
  else if( password.length < 8 ){
    
    response.status(404).send({"status":"password must be at least be 8 characters"})
  }

else{

const data = {
  username:username,
  email:email,
  password:hashedpassword,
  verifyotp: shortid.generate(),
  roll : "user"
}



const insertdata = await client
.db("userdetails")
.collection("user-accounts")
.insertOne(data)

const getotp = await client
.db("userdetails")
.collection("user-accounts")
.findOne({username:username})

 


  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
  
    service:"gmail",
     auth: {
       user: "syed0333800@gmail.com", // generated ethereal user
       pass: process.env.GPASS, // generated ethereal password
     },
   });
 
 var mailoption ={
   from: 'Unknow Co LTD PVT', // sender address
   to: email, // list of receivers
   subject: "Activation otp✔", // Subject line
   text: getotp.verifyotp,
 }
 
 
   // send mail with defined transport object
   transporter.sendMail(mailoption,async function (err,info){
 if(err){
  response.status(400).send({"status":"This is not a valid email"})
 }
 else{
   
   console.log("email sent",info.response);

  }
  
})


if(insertdata.verifyotp  !== ""){
  response.status(200).send({"status":"OTP sended"})
}else{
  
  response.status(200).send({"status":"Otp failed to sent"})
}

}  

}

catch(err){
console.log(err)

}

});


// verify otp
app.post("/verifyotp", async function (request, response) {

  const {otp} = request.body

  const getotp = await client
  .db("userdetails")
  .collection("user-accounts")
  .findOne({verifyotp:otp})
  
if(getotp.verifyotp === otp ){
  const getotp = await client
  .db("userdetails")
  .collection("user-accounts")
  .updateOne({verifyotp:otp}, {$set : {verified: "true"}})

response.status(200).send({"status": "verification success"})

}
else{
  response.status(400),send({"status": "invalid otp"})
}



});


app.put("/add/address/:id", async function (request, response) {
 
  const data = request.body;
  const {id} = request.params;
  const addressdata = data

const newsdata = data
    const getdataup = await client
    .db("userdetails")
    .collection("user-accounts")
    .updateOne({_id:new ObjectId(id)}, {$push: {address:newsdata}} , { new: true } )

    console.log(newsdata)

  response.status(200).send( {"status":"200 ok"})
  
  });
app.get("/add/address/:id", async function (request, response) {
 
const {id}=request.params


    const getdataup = await client
    .db("userdetails")
    .collection("user-accounts")
    .findOne({_id:new ObjectId(id)})
    
const addressdata = getdataup.address

  response.status(200).send( {"status":"200 ok",addressdata})
  
  });











app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));