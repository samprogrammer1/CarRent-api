const route = require("express").Router();
const mongoose = require("mongoose");
const User = require("../../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../../../ecommerce/Models/user");

route.post('/login', (req, res, next) => {
    User.findOne({ email: req.body.email }).then((UserResult) => {
        bcrypt.compare(req.body.password, UserResult.password, (err, result) => {
            if (result) {
                const token = jwt.sign({
                    _id: UserResult._id,
                    name: UserResult.name,
                    email: UserResult.email,
                    number: UserResult.number,
                    image: UserResult.image,
                    isVerify: UserResult.isVerify,
                    isAdmin : UserResult.isAdmin
                },
                    'this is token sender',
                    {
                        expiresIn: "24h"
                    });
                res.status(200).json({
                    _id: UserResult._id,
                    name: UserResult.name,
                    email: UserResult.email,
                    number: UserResult.number,
                    image: UserResult.image,
                    isAdmin : UserResult.image,
                    token: token
                })
            } else {
                return res.status(401).json({
                    status_code : 401,
                    msg: 'password matching failed'
                })
            }
        })
    }).catch((err) => {
        res.status(500).json({
            status_code : 500,
            error: err
        })
    });
});

route.post('/register', (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                status_code : 500,
                error: err
            })
        } else {
            User.findOne({ email: req.body.email }).then((result) => {
                if (result.isVerify == false) {
                    User.findByIdAndUpdate(result._id, {
                        name: req.body.name,
                        image: req.body.image,
                        email: req.body.email,
                        password: hash,
                        number: req.body.number,
                        isAdmin : req.body.isAdmin
                    }, { upsert: true }).then((result) => {
                        return res.status(201).json({
                            status_code : 201,
                            response : {
                                update: result
                            }
                        })
                    }).catch((err) => {
                        return res.status(500).json({
                            status_code : 500,
                            error: err
                        })
                    })
                } else {
                    return res.status(201).json({
                        status_code : 202,
                        massage: result
                    });
                }
            }).catch((err) => {
                const userdata = new User({
                    _id: new mongoose.Types.ObjectId,
                    name: req.body.name,
                    image: req.body.image,
                    email: req.body.email,
                    password: hash,
                    number: req.body.number,
                    isVerify: req.body.isVerify,
                    isAdmin : req.body.isAdmin
                });
                userdata.save().then((result) => {
                    return res.status(201).json({
                        status_code : 201,
                        response : {
                            newAccount: result
                        }
                    });
                }).catch((err) => {
                    return res.status(401).json({
                        status_code : 401,
                        error: err
                    });
                });
            });
        }
    })
});


route.post('/forget-pass', (req, res, next) => {
    User.findOne({ $or: [{ email: req.body.email }, { number: req.body.number }] }).exec().then((result) => {
        if (result.isVerify == false) {
            return res.status(401).json({
                status_code : 401,
                massage: "Please verify Your account"
            });
        } else {
            if (result == null) {
                return res.status(200).json({
                    status_code : 200,
                    data: "you dont't have data"
                });
            } else {
                return res.status(201).json({
                    status_code : 201,
                    email: result.email
                })
            }
        }
    }).catch((err) => {
        return res.status(500).json({
            msg: err
        })
    });
});

route.post('/pass-confirm', (req, res, next) => {
    User.findOne({ email: req.body.email }).exec.then((result) => {
        if (result.isVerify == false) {
            return res.status(401).json({
                status_code : 401,
                massage: "Please verify your account"
            });
        } else {
            User.findByIdAndUpdate(result._id, {
                password: req.body.password
            }, { upsert: true }).then((doneResult) => {
                return res.status(201).json({
                    status_code : 201,
                    massage: "Your password has been changed"
                });
            }).catch((err) => {
                return res.status(401).json({
                    status_code : 401,
                    massage: "Your password have not been saved"
                });
            });
        }
    }).catch((err) => {
        return res.status(500).json({
            status_code : 500,
            error: err
        })
    });
});





route.put('/change-password', (req,res, next) =>{
        bcrypt.hash(req.body.password,10 ,(err,hash) =>{
            if (err) {
                return res.status(401).json({
                    status_code : 401,
                    error : err
                });
            }else{
                User.findByIdAndUpdate(req.body.id,{
                    password : hash
                },{upsert: true}).then((result) => {
                    return res.status(201).json({
                        status_code : 201,
                        response : {
                            data : result
                        }
                    })
                }).catch((err) => {
                    return res.status(500).json({
                        status_code : 500,
                        error : err
                    })
                });
            }
        })
})
module.exports = route