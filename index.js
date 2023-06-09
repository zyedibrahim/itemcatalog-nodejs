import express from "express"; // "type": "module"
const app = express();
import nodemailer from "nodemailer"
import Jwt, { verify } from "jsonwebtoken";
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import bcrypt from "bcrypt"
import cors from "cors"
import shortid from "shortid";
import { MongoClient, ObjectId } from "mongodb";
import { auth } from "./middleware/auth.js"
const MONGO_URL = process.env.MONGO_URL
const client = new MongoClient(MONGO_URL); // dial
// Top level await
await client.connect(); // call
console.log("Mongo is connected !!!  ");
app.use(express.json())
app.use(cors());

const PORT = process.env.PORT

// password encrypted 
async function generateHashedPassword(password) {

  const No_of_rounds = 10;
  const salt = await bcrypt.genSalt(No_of_rounds);
  const hashedpassword = await bcrypt.hash(password, salt)

  return hashedpassword;
}





app.get("/", function (request, response) {
  response.send("🙋‍♂️, 🌏 🎊✨🤩");
});


app.post("/products/categories/all", async function (request, response) {
  const bodydata = request.body;
  const datas = await client
    .db("products")
    .collection("allproducts")
    .insertOne(bodydata)

  console.log(bodydata);
  response.status(200).send({ "status": "200 ok", datas })
});
app.delete("/products/categories/all/:id", auth, async function (request, response) {
  const { id } = request.params;
  try {
    const datas = await client
      .db("products")
      .collection("allproducts")
      .deleteOne({ _id: new ObjectId(id) })
    response.status(200).send({ "status": "200 ok" })
  }
  catch (err) {
    response.status(400).send({ "status": "something went wrong" })
  }

});


// all useraccount
app.get("/alluser/accounts", async function (request, response) {

  const datas = await client
    .db("userdetails")
    .collection("user-accounts")
    .find({})
    .toArray({})

  const newdata = datas
  const array = []


  for (let i = 0; i < newdata.length; i++) {

    const temp = {
      _id: newdata[i]._id,
      username: newdata[i].username,
      email: newdata[i].email,
      roll: newdata[i].roll,
      phone: newdata[i].phone,
      address: newdata[i].address,
      orders: newdata[i].orders,

    }

    array.push(temp)



  }

  response.status(200).send({ "status": "200 ok", array })



});
app.get("/alluser/accounts/:id", async function (request, response) {

  const { id } = request.params
  const datas = await client
    .db("userdetails")
    .collection("user-accounts")
    .findOne({ _id: new ObjectId(id) })

  const newdata = datas.orders


  response.status(200).send({ "status": "200 ok", newdata })



});
app.put("/alluser/accounts/:id", async function (request, response) {

  const { id } = request.params
  const { address, payment, product, _id } = request.body


  try {
    const orderdatabase = {
      orderaddress: address,
      orderproduct: product,
      payment: payment,
      _id: _id,
      date: new Date()
    }


    let dataid = []
    const datastock = []

    const storestock = []

    const solddata = []



    const temp = orderdatabase.orderproduct

    for (let i = 0; i < temp.length; i++) {
      dataid.push(temp[i]._id)
      datastock.push(temp[i].quantity)
    }

    for (let i = 0; i < dataid.length; i++) {

      const stockget = await client
        .db("products")
        .collection("allproducts")
        .findOne({ _id: new ObjectId(dataid[i]) })

      storestock.push(stockget.stock)
      solddata.push(stockget.sold)
    }


    for (let i = 0; i < dataid.length; i++) {
      const stockchange = await client
        .db("products")
        .collection("allproducts")
        .updateOne({ _id: new ObjectId(dataid[i]) }, { $set: { stock: storestock[i] - datastock[i] } })

    }


    for (let i = 0; i < dataid.length; i++) {
      const stockchange = await client
        .db("products")
        .collection("allproducts")
        .updateOne({ _id: new ObjectId(dataid[i]) }, { $set: { sold: solddata[i] + datastock[i] } })

    }

    const setorders = await client
      .db("userdetails")
      .collection("user-accounts")
      .updateOne({ _id: new ObjectId(orderdatabase._id) }, { $push: { orders: orderdatabase } })


    response.status(200).send({ "status": "200 ok", setorders })



  }
  catch (err) {
    response.status(400).send(err)
  }






});



//  all products get
app.get("/products/all", async function (request, response) {
  const datas = await client
    .db("products")
    .collection("allproducts")
    .find({})
    .toArray()

  response.send(datas);
});

// all products get with id
app.get("/products/all/:id", async function (request, response) {

  const { id } = request.params

  const datas = await client
    .db("products")
    .collection("allproducts")
    .findOne({ _id: new ObjectId(id) })

  response.send(datas);
});
// all products add product
app.post("/products/all", async function (request, response) {

  const bodydata = request.body

  try {
    const datas = await client
      .db("products")
      .collection("allproducts")
      .insertOne(bodydata)
    response.status(200).send({ "status": "200 ok" })
  }
  catch (err) {
    response.status(400).send(err)

  }




});
// edit products by id
app.put("/products/all/:id", auth, async function (request, response) {
  const { id } = request.params
  const bodydata = request.body

  try {
    const datas = await client
      .db("products")
      .collection("allproducts")
      .updateOne({ _id: new ObjectId(id) }, { $set: bodydata })
    response.status(200).send({ "status": "200 ok" })
  }
  catch (err) {
    response.status(400).send(err)

  }




});
// delete products by id
app.delete("/products/all/:id", auth, async function (request, response) {
  const { id } = request.params

  try {
    const datas = await client
      .db("products")
      .collection("allproducts")
      .deleteOne({ _id: new ObjectId(id) })
    response.status(200).send({ "status": "200 ok" })
  }
  catch (err) {
    response.status(400).send(err)

  }




});


// catagories 
app.get("/products/categories/name/all", async function (request, response) {



  const datas = await client
    .db("products")
    .collection("catagories")
    .find({})
    .toArray()

  response.send(datas);
});
app.post("/products/categories/name/all", async function (request, response) {

  const bodydata = request.body

  const datas = await client
    .db("products")
    .collection("catagories")
    .insertOne(bodydata)

  response.status(200).send({ "status": "200 ok" });
});


app.get("/products/categories/name/all/:id", async function (request, response) {

  const { id } = request.params

  const datas = await client
    .db("products")
    .collection("catagories")
    .findOne({ _id: new ObjectId(id) })

  response.status(200).send({ "status": "200 ok", datas });
});

app.delete("/products/categories/name/all/:id", auth, async function (request, response) {

  const { id } = request.params

  const datas = await client
    .db("products")
    .collection("catagories")
    .deleteOne({ _id: new ObjectId(id) })

  response.send(datas);
});

app.put("/products/categories/name/all/:id", auth, async function (request, response) {

  const { id } = request.params
  const { catagories } = request.body

  const datas = await client
    .db("products")
    .collection("catagories")
    .updateOne({ _id: new ObjectId(id) }, { $set: { catagories: catagories } })

  response.status(200).send({ "status": "200 ok" })
});



// login
app.post("/login", async function (request, response) {

  const { username, password } = request.body;

  try {
    const getdata = await client
      .db("userdetails")
      .collection("user-accounts")
      .findOne({ username: username })


    if (!getdata) {
      response.send({ "status": "This username not found " })
    }
    else if (!getdata?.verified || getdata?.verified === "false") {
      response.send({ "status": "email not activated " })
    }

    else if (getdata.username === "adminuser") {
      const isppasswordcheck = await bcrypt.compare(password, getdata?.password)

      if (isppasswordcheck === true) {

        const adtoken = Jwt.sign({ id: getdata._id }, process.env.secretkey)
        response.status(200).send({ "status": "Login successful", adtoken: adtoken, _id: getdata._id })
      }
      else {
        response.send({ "status": "Incorrect Password" })

      }

    }

    else {
      const isppasswordcheck = await bcrypt.compare(password, getdata?.password)

      if (isppasswordcheck === true) {
        console.log("password matched");
        const token = Jwt.sign({ id: getdata._id }, process.env.secretkey)
        response.status(200).send({ "status": "Login successful", token: token, username: getdata.username, _id: getdata._id })
      }
      else {
        response.send({ "status": "Incorrect Password" })
        console.log("password not matched");

      }


    }

  }
  catch (err) {
    response.send(err)
  }



});
app.get("/updateprofile/:id", async function (request, response) {

  const { id } = request.params;
  const getdataup = await client
    .db("userdetails")
    .collection("user-accounts")
    .findOne({ _id: new ObjectId(id) })

  response.send(getdataup)

});
app.post("/updateprofile/:id", async function (request, response) {

  const data = request.body;

  const { id } = request.params;
  const getdataup = await client
    .db("userdetails")
    .collection("user-accounts")
    .updateOne({ _id: new ObjectId(id) }, { $set: data })

  response.status(200).send({ "status": "200 ok" })

});

app.post("/updateprofile/password/:id", async function (request, response) {

  const data = request.body;
  const { id } = request.params


  const verifypassword = await client
    .db("userdetails")
    .collection("user-accounts")
    .findOne({ _id: new ObjectId(id) })

  const isppasswordcheck = await bcrypt.compare(data.old_password, verifypassword.password)

  if (isppasswordcheck === true) {
    const hashedpassword = await generateHashedPassword(data.confirm_newpassword)
    if (data.new_password === data.confirm_newpassword) {

      const getdataup = await client
        .db("userdetails")
        .collection("user-accounts")
        .updateOne({ _id: new ObjectId(id) }, { $set: { password: hashedpassword } })

      response.status(200).send({ "status": "200 ok" })
    }
    else {
      response.status(400).send({ "status": "password must be match " })
    }

  }

  else {

    response.status(400).send({ "status": "incorrect password" })
  }




});



// create user
app.post("/signup", async function (request, response) {
  const { username, email, password } = request.body;
  const hashedpassword = await generateHashedPassword(password)

  try {
    const getemail = await client
      .db("userdetails")
      .collection("user-accounts")
      .findOne({ email: email })
    const getusername = await client
      .db("userdetails")
      .collection("user-accounts")
      .findOne({ username: username })

    if (getemail) {
      response.status(404).send({ "status": "This Email exist " })
    }
    else if (getusername) {
      response.status(400).send({ "status": " This Username Is Taken " })

    }
    else if (password.length < 8) {

      response.status(404).send({ "status": "password must be at least be 8 characters" })
    }

    else {

      const data = {
        username: username,
        email: email,
        password: hashedpassword,
        verifyotp: shortid.generate(),
        roll: "user"
      }



      const insertdata = await client
        .db("userdetails")
        .collection("user-accounts")
        .insertOne(data)

      const getotp = await client
        .db("userdetails")
        .collection("user-accounts")
        .findOne({ username: username })




      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({

        service: "gmail",
        auth: {
          user: "syed0333800@gmail.com", // generated ethereal user
          pass: process.env.GPASS, // generated ethereal password
        },
      });

      var mailoption = {
        from: 'Unknow Co LTD PVT', // sender address
        to: email, // list of receivers
        subject: "Activation otp✔", // Subject line
        text: getotp.verifyotp,
      }


      // send mail with defined transport object
      transporter.sendMail(mailoption, async function (err, info) {
        if (err) {
          response.status(400).send({ "status": "This is not a valid email" })
        }
        else {

          response.status(200).send({ "status": "200 ok" })
          console.log("email sent", info.response);

        }

      })


      if (insertdata.verifyotp !== "") {
        response.status(200).send({ "status": "200 ok" })
      } else {

        response.status(200).send({ "status": "Otp failed to sent" })
      }

    }

  }

  catch (err) {
    console.log(err)

  }

});

// forgotpassword send link 
app.post("/user/forgotpassword/send", async function (request, response) {
  const { email } = request.body;
  try {

    const getemail = await client
      .db("userdetails")
      .collection("user-accounts")
      .findOne({ email: email })

    if (!getemail) {
      response.status(404).send({ "status": "This Email Not Exists" })
    }
    else {


      const insertdata = await client
        .db("userdetails")
        .collection("user-accounts")
        .findOne({ email: email })

      if (insertdata.email === email) {


        const secret = process.env.secretkey + getemail.password

        const token = Jwt.sign({ email: getemail.email, id: getemail._id }, secret, {
          expiresIn: "5m"
        })

        const link = `https://grocery-item-catalog.netlify.app/users/resetpassword?id=${getemail._id}&token=${token}`
        // const link = `http://localhost:5173/users/resetpassword?id=${getemail._id}&token=${token}`


        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({

          service: "gmail",
          auth: {
            user: "syed0333800@gmail.com", // generated ethereal user
            pass: process.env.GPASS, // generated ethereal password
          },
        });

        var mailoption = {
          from: 'Unknow Co LTD PVT', // sender address
          to: email, // list of receivers
          subject: "Reset Password Link✔", // Subject line
          text: link,
        }


        // send mail with defined transport object
        transporter.sendMail(mailoption, async function (err, info) {
          if (err) {
            response.status(400).send({ "status": "This is not a valid email" })
          }
          else {

            console.log("email sent", info.response);

          }

        })

        response.status(200).send({ "status": "200 ok" })
      } else {

        response.status(200).send({ "status": "Otp failed to sent" })
      }




    }

  }

  catch (err) {
    console.log(err)

  }

});

// forgotpassword send passowrd to reset password
app.put("/users/resetpassword", async function (request, response) {
  const { id } = request.query
  const { password } = request.body;

  try {
    const encryptedpass = await generateHashedPassword(password)
    console.log(encryptedpass, "password");
    const getpass = await client
      .db("userdetails")
      .collection("user-accounts")
      .updateOne({ _id: new ObjectId(id) }, { $set: { password: encryptedpass } })

    response.status(200).send({ "status": "Password Updated Successfully", getpass })

  }

  catch (err) {
    response.status(404).send({ err })

  }

});


// verify otp
app.post("/verifyotp", async function (request, response) {

  const { otp } = request.body

  const getotp = await client
    .db("userdetails")
    .collection("user-accounts")
    .findOne({ verifyotp: otp })

  if (!getotp) {
    response.status(400).send({ "status": "invalid otp" })
  }
  else if (getotp.verifyotp !== otp) {
    response.status(400).send({ "status": "invalid otp" })

  }
  else {
    const getotp = await client
      .db("userdetails")
      .collection("user-accounts")
      .updateOne({ verifyotp: otp }, { $set: { verified: "true", verifyotp: "" } })

    response.status(200).send({ "status": "200 ok" })
  }



});


// update address
app.post("/update/address/:id", async function (request, response) {

  const data = request.body;
  const { id } = request.params;
  const getdataup = await client
    .db("userdetails")
    .collection("user-accounts")
    .updateOne({ _id: new ObjectId(id), "address.id": data.id }, { $set: { "address.$": data } })

  response.status(200).send({ "status": "200 ok" })

});


// add address
app.put("/add/address/:id", async function (request, response) {

  const data = request.body;
  const { id } = request.params;

  function generateRandomNumber() {
    return Math.floor(Math.random() * 9000) + 1000;
  }

  const randomNumber = generateRandomNumber();

  const addressdata = {
    id: randomNumber,
    country: data.country,
    firstname: data.firstname,
    lastname: data.lastname,
    address: data.address,
    state: data.state,
    district: data.district,
    pincode: data.pincode,
    phone: data.phone,

  }


  const newsdata = data
  const getdataup = await client
    .db("userdetails")
    .collection("user-accounts")
    .updateOne({ _id: new ObjectId(id) }, { $push: { address: addressdata } }, { new: true })



  response.status(200).send({ "status": "200 ok" })

});


app.get("/add/address/:id", async function (request, response) {

  const { id } = request.params


  const getdataup = await client
    .db("userdetails")
    .collection("user-accounts")
    .findOne({ _id: new ObjectId(id) })

  const addressdata = getdataup.address

  response.status(200).send({ "status": "200 ok", addressdata })

});



app.post("/add/address/del/:id", async function (request, response) {

  const data = request.body;
  const { id } = request.params;

  const getdataup = await client
    .db("userdetails")
    .collection("user-accounts")
    .updateOne({ _id: new ObjectId(id) }, {
      $pull: {
        address: {
          id: data.id
        }
      }
    })


  response.status(200).send({ "status": "200 ok" })

});

// feedback?
app.post("/feedback", async function (request, response) {

  const data = request.body;
  const getdataup = await client
    .db("userdetails")
    .collection("feedback")
    .insertOne(data)


  response.status(200).send({ "status": "200 ok" })

})

// 








app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));