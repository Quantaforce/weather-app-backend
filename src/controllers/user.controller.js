import { User } from "../models/user.models.js";
import {verifyJwt} from '../middlewares/auth.middleware.js';
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt";
import { asyncHandler } from "../utils/asyncHandler.js";

const handleSignup=async (req,res)=>{
	try{
		console.log(req);
		const hashedPass=await bcrypt.hash(req.body.password,10);
		const user={name:req.body.name ,
			password:hashedPass,
			email:req.body.email};
		if(!user)
			return res.status(201).end();
		const c=await User.create(user);
		console.log('user created')
		if(c)
			return res.status(201).send("user created");
	}
	catch(err){
		console.log(err);
		return res.send("server error");
	}
}

const handleLogin=async (req,res)=>{
	console.log(req.body);
	const {email,password}=req.body;
	const user=await User.findOne({email});
	if(!user)
		return res.status(404).send("user not found");
	const credCheck=await bcrypt.compare(password,user.password);
	if(!credCheck)
		return res.send("incorrect password");
	const refreshToken=user.generateRefreshToken();
	res.cookie('jwt',refreshToken,{
		httpOnly:true,
		secure:true,
		sameSite:'None',

		});
	const accessToken=user.generateAccessToken();	
	await User.findOneAndUpdate(user._id,{
		$set:{
			refreshToken:refreshToken
		}
	});
	return res.status(200).json({
		accessToken,
	});
}

const handleLogout=async(req,res)=>{
	const refreshToken=req.cookies['jwt'];
	if(!refreshToken) return res.status(401).send("user not found");
	const user=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
	res.cookie('jwt',refreshToken,{httpOnly:true,
		secure:true,
		sameSite:'Lax',
		expires:new Date(0),
		});
	await User.findByIdAndUpdate(user._id,{
		$unset:{
		refreshToken:""
		}
	},{
		new:true
	});
	return res.status(200).send("user logged out")
}
const handleRefresh=asyncHandler(async(req,res)=>{
	const refreshToken=req.cookies.jwt;
	if(!refreshToken){
		return res.status(402).send('refresh Token does not exit');
	}
	const decodedToken=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
	const email=decodedToken.email;
	const user=await User.findOne({email});
	const newtoken=user.generateRefreshToken();
	await User.findByIdAndUpdate(decodedToken._id,{
		$set:{
		refreshToken:newtoken
		}
	});
	const newAccesstoken=user.generateAccessToken();
	res.cookie('jwt',refreshToken,{httpOnly:true,
		secure:true,
		sameSite:'Lax',
		});
	return res.status(200).json({
		accessToken:newAccesstoken
	})
	
	
});
export {handleLogin, 
	handleSignup,
	handleLogout,
	handleRefresh

}
