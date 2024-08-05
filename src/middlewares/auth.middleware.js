import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import 'dotenv/config'
export const verifyJwt =async (req,res,next)=>{
	try{
		const token=req.header("Authorization").split(" ")[1];
		if(!token)
			return res.status(401).send("unauthorised request");
		const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
		const user=await User.findById(decodedToken._id).select("-password ");
		if(!user)
			return res.status(400).send("user not found");
		req.user=user;
		next();
	}
	catch(err){
		res.status(401).send("something went wrong")
	}
}
