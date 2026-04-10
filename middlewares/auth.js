const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");


exports.auth = async (req, res, next) => {
    try{

        const token = req.cookies.token || req.header("Authorization").replace("Bearer ", "");

        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token missing",
            })
        }

        try{

            const decode = await jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);

            req.user = decode;

        }catch(error){
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            })
        }
        next();
        

    }catch(error){
        return res.status(401).json({
            success: false,
            message: `Something went wrong`
        })
    }
}

exports.isStudent = async (req, res, next) => {
    try{
        const userDetails = await User.findOne({email: req.user.email});

        if(userDetails.accountType != student){
            return res.status(400).json({
                success: false,
                message: `its not protected route for student `,
            })
        }

        next();

    }catch(error){
        return res.status(400).json({
            success: false,
            message: "User role can't be verified",
        })
    }
}

exports.isInstructor = async (req, res, next) => {
    try{

        const userDetails = await User.findOne({email: req.user.email});

        if(userDetails.accountType !== "Instructor"){
            return res.status(400).json({
                success: false,
                message: `This is protected route for instructor`
            })
        }
        next();

    }catch(error){
        console.log(error);
        res.status(400).json({
            success: false,
            message: `user role can't be verified`,
        })
    }
}


exports.isAdmin = async (req, res, next)=>{
    try{

        const userDetails = await User.findOne({email: req.user.email});

        if(userDetails.accountType !== "Admin"){
            return res.status(400).json({
                success: false,
                message: `Cannot be verified`,
            })
        }

        next();

    }catch(error){
        console.log(error);
        return res.status(401).json({
            success: false,
            message: `connot be verified`,
        })
    }
}