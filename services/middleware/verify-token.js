const jwt =require('jsonwebtoken');

module.exports = (req,res,next) => {
    const token = req.headers['x-access-token'] || req.body.token || req.query.token
    if(token){
        jwt.verify(token, req.app.get('api_key'),(err,decoded)=>{
            if(err){
                res.json({status: false, message:'Failed to authenticate token'})
            }
            else{
                var user_id = decoded.user_id;
                req.user_id = user_id;
                next();
            }
        })

    }else{
        res.json({status: false, message: 'No token provided.'})
    }

};