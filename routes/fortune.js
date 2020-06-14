const express = require('express')
const router = express.Router();
const Fortune = require('../services/modals/Fortune');
const Users = require('../services/modals/Users');
const verifyToken = require('../services/middleware/verify-token');
const multer =require('multer');
const fs =require('fs');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './uploads/fortune/');
    },
    filename: function(req, file, cb) {
      cb(null, file.originalname);
    }
  });
  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  const upload = multer({
    storage: storage,
    fileFilter: fileFilter
  });
router.post('/addFortune',verifyToken,upload.single('image'),(req,res,next)=>{
  const {fullName,gender,birthday,job} =req.body;
  Users.findOne({_id:req.user_id},(err,data)=>{
    if(data.fortuneCount==0){
      res.json({
        status: false,
        message: 'Fal hakkınız kalmadı'});
    }else{    
      const NewFortune = new Fortune({
        fullName,
        gender,
        birthday,
        job,
        fortuneUser:data._id,
        fortunePhoto:'/uploads/fortune/'+req.file.filename
      });
      const promise = NewFortune.save();
      promise.then((data)=>{
        Users.findOne({_id:req.user_id})
        .then(data=>{
            console.log(data)
            var newFortuneCount =data.fortuneCount-1;
            Users.findByIdAndUpdate({_id:req.user_id},{$set:{fortuneCount:newFortuneCount}})
            .then(data=>{
              res.json({
                status: true,
                message: 'Falınız başarıyla oluşturuldu.'});
            })
        })
      }).catch((err)=>{
        res.json({
          status: false,
          message: 'Falınız gönderilirken bir sorun oluştu.'});
      })
    }
  })
});

router.get('/getFortune',verifyToken,(req,res)=>{
  Fortune.find({fortuneUser:req.user_id})
  .then(data=>res.json(data))
  .catch(err=>
    res.json({
      status: false,
      message: 'Fallarınız listelenirken bir sorun oluştu.'}));
});

router.get('/getFortune/:_id',verifyToken,(req,res)=>{
  Fortune.find({_id:req.params._id})
  .then(data=>res.json(data))
  .catch(err=>res.json(err))
});

module.exports = router;
