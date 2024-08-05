import mongoose from "mongoose"
import 'dotenv/config';
import jwt from "jsonwebtoken"
const userSchema=new mongoose.Schema({
	name:{
		type:String,
		required:true,
	},
	email:{
		type:String,
		required:true,
		unique:true,
		lowercase:true,
	},
	password:{
		type:String,
		required:true,
	},
	refreshToken:{
		type:String,
	}
},{timestamps:true})

userSchema.methods.generateRefreshToken=function(){
	return jwt.sign({
		_id:this._id,
		email:this.email
		},
		process.env.REFRESH_TOKEN_SECRET)
}
userSchema.methods.generateAccessToken=function(){
	return jwt.sign({
		_id:this._id,
		email:this.email
			
	},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'10s'});
}

export const User=mongoose.model('User',userSchema);
