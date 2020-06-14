const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../services/modals/Users');
const verifyToken = require('../services/middleware/verify-token');
const smsSend = require('../services/modals/Sms');
const randomInt = require('random-int');
const gnp = require('generate-password');

router.post('/register',(req,res,next)=>{
	const {fullName,password,telephone,gender,job,birthday} = req.body;
	Users.findOne({telephone:telephone},(err,data)=>{
		if(data){
			res.json({
				status: false,
				message: 'Bu telefon numarasına ait zaten bir hesap bulunmakta.'});
		}else{
      var verification_code = randomInt(1000,9999);
			bcrypt.hash(password,10).then((hash)=>{
				const New = new Users({
          fullName,
          telephone,
          job,
          gender,
          birthday,
          userSmsCode:verification_code,
					password:hash
				});
				const promise = New.save();
				promise.then((data)=>{
          /* smsSend('Sn '+req.body.fullName+' BiraCini uygulamasına hoşgeldiniz!! Doğrulama kodunuz: '+verification_code,req.body.telephone); */
					res.json({
            status: false,
            message: 'Kullanıcı başarıyla oluşturuldu.'
          });
				}).catch((err)=>{
          res.json({
            status: false,
            message: 'Kullanıcı oluşturulamadı, tekrar deneyiniz.'
          });
				})
			});
		}
	})
});

router.post('/login', (req, res) => {
	const { telephone, password } = req.body;
	Users.findOne({telephone}, (err, Users) => {
    if(!Users){
      res.json({
        status: false,
        message: 'Telefon numarasına ait kullanıcı bulunamadı.'
      });
    }else{
      if(Users.userBanType===1){
        res.json({
          status: false,
          message: 'Hesabınız askıya alındı.'
        });
      }else{
        if(Users.userSmsCode==0){
          const user_id=Users._id;
          bcrypt.compare(password, Users.password).then((result) => {
            if (result){
              const token = jwt.sign({user_id:Users._id}, req.app.get('api_key'));
              res.json({status:true, token, user_id})
            }else{
              res.json({
                status: false,
                message: 'Doğrulama hatası, hatalı parola.'
              });
                    }
                })
        }else{
          res.json({
            status: false,
            message: 'Doğrulanmamış kullanıcı'
          });
        }
      } 
    }
    })
});

router.post('/code', (req, res) => {
  const { telephone, userSmsCode } = req.body;
  Users.findOne({telephone})
  .then(data =>{
    if(data.userSmsCode===userSmsCode){
        Users.updateOne({telephone},{$set:{userSmsCode:0}})
        .then(data =>{
          res.json({
            status: true,
            message: 'Doğrulama kodu başarılı.'
          });
        })
        .catch(err=>{
          res.json(err);
        })
    }else{
      res.json({
        status: false,
        message: 'Doğrulama kodu hatalı.'
      });
    }
  })
  .catch(err=>{
    res.json(err);
  })
});

router.post('/changeCode', (req, res) => {
  const { telephone } = req.body;
  const verification_code = randomInt(1000,9999);
  Users.findOneAndUpdate({telephone},{$set:{userSmsCode:verification_code}})
    .then(data =>{
      /* smsSend('Telefon numarası doğrulama kodunuz: '+verification_code,req.body.telephone); */
      res.json({
        status: true,
        message: 'Kod Başarıyla değiştirildi.'
      });
      
    })
    .catch(err=>{
      res.json(err);
    })
});

router.post('/forgetPassword/v1/', (req, res) => {
  const { telephone } = req.body;
    const verification_code = randomInt(1000,9999);
    Users.updateOne({telephone},{$set:{userSmsCode:verification_code}})
    .then(data=>{
      smsSend('Telefon numarası doğrulama kodunuz: '+verification_code,req.body.telephone);
      res.json({
				status: true,
				message: 'Doğrulama kodu Telefonunuza gönderildi'});
    })
    .catch((err)=>{
      res.json({
				status: false,
				message: 'Doğrulama kodu Telefonunuza gönderilemedi'});
  });
});

router.post('/forgetPassword/v2/', (req, res) => {
  const { telephone,userSmsCode } = req.body;
  const password = gnp.generate({
    length: 10,
    uppercase: true});
  Users.findOne({telephone:telephone},(error,Users)=>{
    if(Users.userSmsCode==userSmsCode){
      bcrypt.hash(password,10).then((hash)=>{
        Users.updateOne({ $set: {
            password:hash,
            userSmsCode:0
          } },{new: true})
          .then((data)=>{
            smsSend('Şifrenizi kimse ile lütfen paylaşmayınız. Yeni şifreniz: '+password,req.body.telephone);
            res.json({
              status: true,
              message: 'Şifreniz başarıyla değiştirildi.'});
          }).catch((err)=>{
          res.json({
            status: false,
            message: 'Şifrenizi değiştirirken bir hata oluştu.'});
        });
      });
    }else{
      res.json({
        status: false,
        message: 'Eşleşmeyen kod.'});
    }
  })
});

router.post('/removeTelephone', (req, res) => {
  const { telephone } = req.body;
  Users.findOneAndDelete({telephone:telephone})
    .then(data =>{
      res.json({
				status: true,
				message: 'Kullanıcı Silindi.'});
    })
    .catch(err=>{
      res.json(err);
    })
});

router.post('/removeCode', (req, res) => {
  const { telephone } = req.body;
  Users.findOne({telephone})
  .then(data =>{
    if(data){
        Users.deleteOne({telephone})
        .then(data =>{
          res.json('Kod Başarıyla silindi');
        })
        .catch(err=>{
          res.json(err);
        })
    }else{
      res.json('Kullanıcı Bulunamadı');
    }
    })
  .catch(err=>{
    res.json(err);
  })
});

router.post('/changePassword',verifyToken, (req, res) => {
  const { password , newpassword } = req.body;
  Users.findOne({_id:req.user_id},(error,Users)=>{
    if(Users){
      bcrypt.compare(password, Users.password).then((result) => {
        if(result===true){
          bcrypt.hash(newpassword,10).then((hash)=>{
            Users.updateOne({ $set: {
              password:hash
            } },{new: true})
                .then((data)=>{
                  res.json({
                    status: true,
                    message: 'Şifreniz başarıyla değiştirildi.'});
                }).catch((err3)=>{
                  res.json({
                    status: false,
                    message: 'Şifrenizi değiştirirken bir hata oluştu.'});
                });
          });
        }else{
          res.json({
            status: false,
            message: 'Şifrenizi doğru girdiğinizden emin olun.'});
        }
      })
    }
  })
});

router.post('/setProfile',verifyToken,(req,res)=>{
	const {fullName,telephone,job,gender,birthday,mail} =req.body;
	Users.findByIdAndUpdate({_id:req.user_id}, { $set: {
    fullName,
    telephone,
    job,
    gender,
    birthday,
    mail,
		} },{new: true})
		.exec()
		.then(data=>{
			res.json({
        status: true,
        message: 'Profil bilgileriniz başarıyla güncellendi.'});
		}).catch(err =>{
		res.json(err);
	})
});

router.get('/getProfile',verifyToken,(req,res)=>{
    const promise = Users.findOne({_id:req.user_id});
        promise.then((data)=>{
            res.json(data);
        }).catch((err)=>{
            res.json(err);
        })
});

module.exports = router;
