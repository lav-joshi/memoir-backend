const express = require("express");
const authUser = require("../middleware/authUser");
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const path = require('path');
const {cloudinary} = require("../utils/cloudinary");
const fetch = require("node-fetch");
const methodOverride = require('method-override');
const { allowedNodeEnvironmentFlags } = require("process");
const crypto = require('crypto');
const mongoose = require('mongoose');
const Blog= require("../models/Blog");
const User= require("../models/User");
const router = express.Router();
const keys = require("../config/keys");


// Mongo URI
const mongoURI = keys.mongoURI;

// Create mongo connection
const conn = mongoose.connection;
let gfs;

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
  });
  
  // Create storage engine
  const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const result = Math.random().toString(36).substring(2,7);
          const filename = result + path.extname(file.originalname);

          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });
const upload = multer({ storage });


router.get("/getfile/file/:filename",(req,res)=>{
    gfs.files.findOne({filename:req.params.filename},(err,file)=>{
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No files exist'
        });
      }
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    });

});



router.post("/addblog" , authUser , async (req,res)=>{
    
    const x = JSON.parse(req.body.data);
    const fileStr = x.data;
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
        upload_preset: 'ml_default',
    });
     
    const temp = {
        title : req.body.title,
        description : req.body.description,
        email:"",
        name:"",
        imageURL : uploadResponse.secure_url
    }

    User.findOne({_id:req._id},(err, user)=>{
        temp.email = user.email;
        temp.name = user.name;
        Blog.create(temp,async (err,blog)=>{
            if(err){
              console.log("Error");
               res.status(401).send({message: "Something went wrong"});
            }else{
                await blog.save();
                res.status(200).send({message: "Successfully added"});
            }
       });
    });

});

router.get("/getblogs",(req,res)=>{
    Blog.find({},(err,blogs)=>{
        if(err){
           res.status(401).send({message: "Something went wrong"});
        }else{
           res.status(200).send({blogs});
        }
   });
});




router.post("/bbbb",async (req,res)=>{
    try{
      const fileStr = req.body.data;
      const uploadResponse = await cloudinary.uploader.upload(fileStr, {
          upload_preset: 'ml_default',
      });
      res.status(200).send({imageURL: uploadResponse.secure_url});
    }catch(err){
      res.status(500).send({ err: 'Something went wrong' });
    }
});



module.exports = router;
