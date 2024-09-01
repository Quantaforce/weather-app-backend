const asyncHandler= (requestHandler)=>async(req,res,next)=>{
	try{
		await requestHandler(req,res,next);
	}
	catch(err){
		console.log(err.message);
		return res.status(err.code || 500).json({
			message:"error"
		})
	}
}

export {asyncHandler};
