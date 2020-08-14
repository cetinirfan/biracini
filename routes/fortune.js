const express = require('express')
const router = express.Router();
const Application = require('../services/modals/Application');
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
          message: 'Fal hakkınız kalmadı.'});
      }else{    
        let date1= new Date();
        let date2= new Date();
        date1.setFullYear(date2.getFullYear());
        date1.setMonth(date2.getMonth());
        date1.setDate(date2.getDate());
        date1.setHours(date2.getHours()+3);
        date1.setMinutes(date2.getMinutes());
        let date3 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate(), date1.getHours(), date1.getMinutes(), 0, 0);
        const NewFortune = new Fortune({
          fortuneCreated:date3,
          fullName,
          gender,
          birthday,
          job,
          fortuneUser:data._id,
          userFullName:data.fullName,
          userTelephone:data.telephone,
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
                  message: 'Falınız elimize ulaştı en kısa sürede cevaplayacağız.'});
              }).catch((err)=>{
                res.json({
                  status: false,
                  message: 'Falınız gönderilirken bir sorun oluştu.'});
              })
          })
        }).catch((err)=>{
          res.json({
            status: false,
            message: 'Lütfen giriş yapınız.'});
        })
      }
    })
  }); 

router.get('/getFortune',verifyToken,(req,res)=>{
  Fortune.find({fortuneUser:req.user_id,fortuneType:1})
  .sort({'fortuneCreated':-1})
  .then(data=>res.json(data))
  .catch(err=>
    res.json({
      status: false,
      message: 'Fallarınız listelenirken bir sorun oluştu.'}));
});

router.get('/viewFortune/:_id',verifyToken, (req, res) => {
  Fortune.findOneAndUpdate({_id:req.params._id},{$set:{fortuneView:1}})
    .then(data =>{
      res.json({
        status: true,
        message: 'Fal başarıyla okundu.'
      });    
    })
    .catch(err=>{
      res.json(err);
    })
});

router.get('/getFortune/:_id',verifyToken,(req,res)=>{
  Fortune.find({_id:req.params._id})
  .then(data=>res.json(data))
  .catch(err=>res.json(err))
});

router.post('/commentFortune/:_id',verifyToken, (req, res) => {
  const { fortuneComment,fortuneRating } = req.body;
  Fortune.findOneAndUpdate({_id:req.params._id},{$set:{fortuneComment:fortuneComment,fortuneRating:fortuneRating}})
    .then(data =>{
      res.json({
        status: true,
        message: 'Yorum başarıyla gönderildi.'
      });    
    })
    .catch(err=>{
      res.json(err);
    })
});

router.get('/getApp/',verifyToken,(req,res)=>{
  const appId = "5eea5f10c2ab1908e98b8a41";
  Application.find({_id:appId})
  .then(data=>res.json(data))
  .catch(err=>res.json(err))
});
module.exports = router;
