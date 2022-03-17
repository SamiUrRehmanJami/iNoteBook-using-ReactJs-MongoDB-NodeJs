const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../Middleware/fetchuser');
const { json } = require('express');
const JWT_SECRET = 'Samiisgoodb$oy';

//ROUTE 1: create a user using :Post "/api/auth/createuser". No login require
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    let success = false;
    // if there are errors return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }
    // Check wheather the user with this email already exist
    try {

        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({success, error: "Sorry a user with this email already exist" })
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password,salt); 
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
        })
        //   .then(user => res.json(user))
        //   .catch(err=>{console.log(err)
        //     res.json({error: 'Please enter a unique value for email', message: err.message})});

        const data={
            user :
            {
                id : user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        

        // res.json(user)
        success = true;
        res.json({ success,authToken})

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured");
    }
})


// ROUTE 2: Authenticate user using :Post "/api/auth/login". No login require
router.post('/login', [
   
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
    
], async (req, res) => {
    let success = false;
     // if there are errors return Bad request and the errors
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
     }

     const {email,password} = req.body;
     try {
         let user = await User.findOne({email});
         if(!user){
            success= false;
             return  res.status(400).json({success, error:"Please try to login with correct credentials"});
         }

         const passwordCompare = await bcrypt.compare(password,user.password);
         if(!passwordCompare){
             success= false;
            return  res.status(400).json({success ,error:"Please try to login with correct credentials"});
         }

         const data={
            user :
            {
                id : user.id
            }
        }
        
        const authToken = jwt.sign(data, JWT_SECRET);
        success= true;
        res.json({success, authToken})
     
     } 
     catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 3: Get loggedin user details using :Post "/api/auth/getuser". login require
router.post('/getuser',fetchuser,async (req, res) => {


try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
    
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
}
})
module.exports = router