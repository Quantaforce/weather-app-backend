import 'dotenv/config'
//require('dotenv').config()
import express from 'express'
import connectDB from './db/index.js';
import { User } from './models/user.models.js';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import {verifyJwt} from './middlewares/auth.middleware.js';
import userRouter from './routes/user.routes.js'
import weatherApi from './routes/weather.routes.js'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { corsOptions } from './config/corsOptions.js';
connectDB();

const app=express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.get('/',(req,res)=>{
	res.send('server is ready');

})
app.use('/api/user',userRouter);
app.use('/api/weather',weatherApi);
app.post('/refresh-token',async(req,res)=>{
	try{

		const {refreshToken}=req.body;
		const decodedToken=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
		const user=await User.findById(decodedToken._id);
		if(refreshToken !==user?.refreshToken){
			return res.status(401).send("expired refreshToken")
		}
		const accessToken=user.generateAccessToken();	
		return res.status(200).json({accessToken});
	}
	catch(err){
		console.log(err);
		res.status(401).send("xasd")
	}
})
app.get('/api/info',verifyJwt,(req,res)=>{
	//const check=jwt.verify(req.body.token,process.env.ACCESS_TOKEN_SECRET);
	res.send([{
		id:1,
		name:"madhav"
	},{
		id:2,
		name:"negi"
	}])
})
const port=process.env.PORT||3000;
app.listen(port,()=>{
	console.log(`server at ${port}`);
})
