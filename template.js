const fs = require("fs");

const folderNames = [
  "config",
  "controllers",
  "loaders",
  "logs",
  "middlewares",
  "models",
  "routes",
  "scripts/events",
  "scripts/logger",
  "scripts/utils",
  "services",
  "validations",
];
folderNames.map((folderName) => {
  fs.mkdirSync(`./v1/src/${folderName}`, { recursive: true });
});

const appExample = `
const express = require("express");
const app=express();
const config = require("./config"); 
const loaders = require("./loaders"); 

config();
loaders();

const errorHandler = require("./middlewares/exampleError");


app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//routes
app.use("/example",require("./routes/ExampleRoute"));


app.use(errorHandler);

const PORT = process.env.PORT || 5100;
app.listen(PORT, () => {
    console.log("Server is running: "+PORT);
  });
`;
const envExample = `
PORT=5100
MONGO_URI=mongodb://.......

`;
const serverExample = `
const dotenv = require('dotenv');

module.exports=() => {dotenv.config();}
`;
const serverIndexExample = `
const server = require("./server");

module.exports=()=> {
    server();
}
`;

const dbExample = `
const mongoose = require("mongoose");

const db = mongoose.connection;

db.once("open",()=> {
    console.log("DB bağlantısı başarılı.");
})



const connectDB = async () => {

    await mongoose.connect(process.env.MONGO_URI)
}

module.exports = {connectDB};
`;
const dbIndexExample = `

const {connectDB }= require("./dbExample");

module.exports = () => { 
    connectDB();
}
`;

const exampleModel = `
const mongoose = require("mongoose");

const ExampleModelSchema=new mongoose.Schema({
name : {type:String},
phone:{type:Number},
date : {type:Date,default:Date.now}
   
},{versionKey:false,collection:"example_models"});

const ExampleModel = mongoose.model("ExampleModel",ExampleModelSchema);

module.exports=ExampleModel;
`
const exampleRoute = `
const express = require("express");
const router = express.Router();

const {exampleInsert,exampleGetById,exampleGetAll,exampleUpdate,exampleDeleteOne} = require("../controllers/exampleController");

router.route("/").post(exampleInsert);
router.route("/").get(exampleGetAll);
router.route("/:id").get(exampleGetById);
router.route("/:id").put(exampleUpdate);
router.route("/:id").delete(exampleDeleteOne);



module.exports=router;
`

const exampleService = `
const ExampleModel = require("../models/ExampleModel");

const create = async (insertData) => {

  const exampleCreate = await ExampleModel.create(insertData);

  return exampleCreate;
}

const index = async () => {
   
  const exampleAll = await ExampleModel.find();
  
  return exampleAll;

}

const indexById = async (id) => {

  const exampleOne = await ExampleModel.findById(id);
  
  return exampleOne;

}

const update = async (id,updateData) => {
  const example = await ExampleModel.findByIdAndUpdate(id,updateData);
 
  return example;
}

const deleteById = async (id) => {
  await ExampleModel.deleteOne(id);
  return true;
}

module.exports = {
  create,
  index,
  indexById,
  update,
  deleteById
}

`
const exampleController = `
const {create,index,indexById,update,deleteById} = require("../services/exampleService");


const exampleInsert = async (req,res,next) => {
  const {name,phone} = req.body;
  create({name,phone})
  .then((response) => {
    res.status(201).json(response);
  })
  .catch((err) => {
    res.status(500).json(err);
  })
}

const exampleGetAll = async (req,res,next) => {
  index()
  .then((response) => {
    res.status(200).json(response);
  })
  .catch((err)=> {
    res.status(500).json(err);
  })
}

const exampleGetById = async (req,res,next) => {
  const {id} = req.params;
  indexById(id)
  .then((response) => {
    res.status(200).json(response);
  })
  .catch((err) => {
    res.status(500).json(err);
  })
}

const exampleUpdate = async (req,res,next) => {
  const {name,phone} = req.body;
  update({name:name,phone:phone})
  .then((response) => {
    res.status(200).json({status:true,message:"Updated ok"})
  })
  .catch((err) => {
    res.status(500).json(err);
  })
}

const exampleDeleteOne = async (req,res,next) => {
  const {id} = req.params;
  deleteById(id)
  .then((response) => {
    res.status(200).json({status:true,message:"Deleted ok"});
  })
  .catch((err) => {
    res.status(500).json(err);
  })
}

module.exports= {
  exampleInsert,
  exampleGetById,
  exampleGetAll,
  exampleUpdate,
  exampleDeleteOne
}
`
const exampleErrorResponse = `
class ExampleErrorResponse extends Error {
  constructor(message,statusCode){
      super(message);
      this.statusCode = statusCode;
  }
}

module.exports=ExampleErrorResponse;
`
const exampleErrorHandlerMiddleware = `
const ErrorResponse = require("../scripts/utils/ExampleErrorResponse");


const errorHandler = (err, req, res, next) => {

  
  let error = { ...err };

  error.message = err.message;


  if (err.code === 11000) {
    const message = "Yinelenen değeri girdiniz. Tekrar deneyiniz.";

    error = new ErrorResponse(message, 400);
  } 

  if(err.name === "ValidationError"){
      const message = Object.values(err.errors).map((val)=> {val.message;});
      error = new ErrorResponse(message,400);
  }

  res.status(error.statusCode || 500).json({
      status: false,
      message : error.message || "Server Error"
  })

};

module.exports = errorHandler;
`
const packageJson = `
{
  "name": "nodejs-api-template",
  "version": "1.0.0",
  "description": "",
  "main": "app.js",
  "scripts": {
    "start": "nodemon ./v1/src/app.js"
  },
  "repository": {
    "type": "git",
    "url": ""
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": ""
  },
  "homepage": "",
  "dependencies": {
    "dotenv": "^16.0.0",
    "express": "^4.17.3",
    "mongoose": "^6.3.0" 
  },
  "devDependencies": {
    "nodemon": "^2.0.15"
  }
}

`
const fileNames = [
  ".env",
  "./v1/src/app.js",
  "./v1/src/config/server.js",
  "./v1/src/config/index.js",
  "./v1/src/loaders/dbExample.js",
  "./v1/src/loaders/index.js",
  "./v1/src/models/ExampleModel.js",
  "./v1/src/routes/exampleRoute.js",
  "./v1/src/services/exampleService.js",
  "./v1/src/controllers/exampleController.js",
  "./v1/src/scripts/utils/ExampleErrorResponse.js",
  "./v1/src/middlewares/exampleError.js",
  "package.json"
];

const fileNameExample = [
  envExample,
  appExample,
  serverExample,
  serverIndexExample,
  dbExample,
  dbIndexExample,
  exampleModel,
  exampleRoute,
  exampleService,
  exampleController,
  exampleErrorResponse,
  exampleErrorHandlerMiddleware,
  packageJson
];

fileNames.map((fileName, index) => {
  fs.writeFile(fileName, fileNameExample[index], function (err) {
    if (err) throw err;
    console.log("File is created: " + fileName);
  });
});
