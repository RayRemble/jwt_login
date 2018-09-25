const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');
var   randomstring = require('randomstring');

const User = require('../models/User');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: "remble96@gmail.com",
        pass: "Raptor1!"
    },
  });
  
router.post('/register', function(req, res) {

    const { errors, isValid } = validateRegisterInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }
    User.findOne({
        email: req.body.email
    }).then(user => {
        // if(user) {
        //     return res.status(400).json({
        //         email: 'Email already exists'
        //     });
        // }
        // else {
            const avatar = gravatar.url(req.body.email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });
            const verifyToken =  randomstring.generate();
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                avatar,
                verifyToken: verifyToken
            });
            
            bcrypt.genSalt(10, (err, salt) => {
                if(err) console.error('There was an error', err);
                else {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) console.error('There was an error', err);
                        else {
                            newUser.password = hash;
                            newUser
                                .save()
                                .then(user => {
                                    res.json(user)
                                    
                                    const url = `http://localhost:3001/verify/`;
                                    

                                    transporter.sendMail({
                                        to: req.body.email,
                                        subject: 'Confirm Email',
                                        text: verifyToken,
                                        html: `Please click this email to confirm your email with below token value:<a href="${url}"> ${url} </a>
                                               <br />Token Value - <label style="color:blue" > ${verifyToken} </label>  `,
                                    }, function(error, response){
                                        if(error){
                                            console.log(error);
                                        }else{
                                            
                                            // User.findOneAndUpdate({ _id: user._id }, {$set: { isVerified: true } }, {new: true}, function(err, doc){
                                            //     if(err){
                                            //         console.log("Something wrong when updating data!");
                                            //     }
                                            //     console.log(doc);
                                            // });
                                            console.log("Message sent: " + response.message);
                                        }
                                    });
                                }); 
                        }
                    });
                }
            });
            
    });
});

router.post('/login', (req, res) => {

    
    const { errors, isValid } = validateLoginInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }
    console.log(req.body);
    const isSocialLogin =  req.body.isSocialLogin;
    const email = req.body.email;
    const password = req.body.password;
    
    User.findOne({email})
        .then(user => {
            if(!user) {
                errors.email = 'User not found'
                return res.status(404).json(errors);
            }
            if(!user.isVerified){
                if(isSocialLogin){
                    console.log('facebook');
                    const payload = {
                        id: user.id,
                        name: user.name,
                        avatar: user.avatar
                    }
                    jwt.sign(payload, 'secret', {
                        expiresIn: 3600
                    }, (err, token) => {
                        if(err) console.error('There is some error in token', err);
                        else {
                            res.json({
                                success: true,
                                isVerified: true,
                                token: `Bearer ${token}`
                            });
                        }
                    });
                } else {
                    console.log("verify");
                    return res.json({
                        isVerified: user.isVerified
                    });
                }
                
            } else {
                bcrypt.compare(password, user.password)
                    .then(isMatch => {
                       
                        if(isMatch) {
                            const payload = {
                                id: user.id,
                                name: user.name,
                                avatar: user.avatar
                            }
                            jwt.sign(payload, 'secret', {
                                expiresIn: 3600
                            }, (err, token) => {
                                if(err) console.error('There is some error in token', err);
                                else {
                                    res.json({
                                        success: true,
                                        isVerified: user.isVerified,
                                        token: `Bearer ${token}`
                                    });
                                }
                            });
                        }
                        else {
                            User.findOne({email: email}, function(err, document) {
                                console.log(document.entryNumber);
                                if(document.entryNumber > 2){
                                    errors.loginLimit = 'You can\'t login anymore until Admin allow your login.';  
                                    return res.status(400).json(errors); 
                                }
                                else {
                                    User.findOneAndUpdate({ email: email }, {$inc: { entryNumber: 1 } }, {new: true}, function(err, doc){
                                        if(err){
                                            console.log("Something wrong when updating data!");
                                        }
                                        //console.log(doc);
                                    });
                                    errors.password = 'Incorrect Password';    
                                    return res.status(400).json(errors);        
                                }
                            });
                        }
                    });    
                }
           
        });

    
});

router.post('/emailVerify', (req, res) => {

    const verifyToken = req.body.verifyToken;
    //const { errors } = validateLoginInput(req.body);
    console.log(req.body);
    User.findOne({verifyToken})
        .then(user => {
            if(!user) {
                
                return res.json({
                    isExist: false
                });
            }
            if(!user.isVerified){
             
                User.findOneAndUpdate({ verifyToken: verifyToken }, {$set: { isVerified: true } }, {new: true}, function(err, doc){
                    if(err){
                        console.log("Something wrong when updating data!");
                    }
                    //console.log(doc);
                    
                });
                return res.json({
                    isExist: true
                });
            } else {
                return res.json({
                    isExist: true
                });
            }
            
           
        });

    
});

router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
});

module.exports = router;