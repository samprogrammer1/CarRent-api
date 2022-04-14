const jwt = require('jsonwebtoken');

module.exports.user = (req,res, next) =>{
    try {
        const token = req.headers.authorization.split(" ")[1];
        const verify = jwt.verify(token,'this is token sender');
        if(verify.isAdmin == false){
            next();
        }else{
            return res.status(401).json({
                msg: "Please Verify your account."
            })
        }
    } catch (error) {
        return res.status(401).json({
            msg : "invalid token"
        })
    }
}

module.exports.admin = (req, res , next) =>{
    try {
        const token = req.headers.authorization.split(" ")[1];
        const verify = jwt.verify(token,'this is token sender');
        if(verify.isAdmin == true){
            next();
        }else{
            return res.status(401).json({
                msg: "Please Verify your account."
            });
        }
    } catch (error) {
        return res.status(401).json({
            msg : "invalid token"
        })
    }
}
