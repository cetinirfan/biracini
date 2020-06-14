var express = require('express');
var router = express.Router();
const axios = require('axios');

function smsSend(message,telephone){

    const username = '8503462926';
    const password = 'ZX1V0F5D';
    const header = 'R.B.KARAOVA';
    const telefon = telephone;

    axios.get('https://api.netgsm.com.tr/sms/send/get/', {
        params: {
          usercode: username,
          password: password,
          gsmno: telefon,
          message: message,
          msgheader: header,
        }
      });

}

module.exports = smsSend;