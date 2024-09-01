import 'dotenv/config';
import { asyncHandler } from '../utils/asyncHandler.js';
import { hourlyData } from '../fakeapi.js';
const autocomplete= asyncHandler(async (req,res)=>{
	const {q}=req.query;
	const data=await fetch(`${process.env.SUGGESTION_URL}+${process.env.API_KEY}&q=${q}`);
	const jsonData=await data.json();
	return res.status(201).json(jsonData);

}
)
const currentConditions = asyncHandler(async (req,res)=>{
	const {cityCode}= req.params;
	const data=await fetch(`${process.env.CURRENT_WEATHER_URL}+${cityCode}?apikey=${process.env.API_KEY}&details=true`);
	const jsonData=await data.json();
	//const graphData=await fetch(`${process.env.HOURLY_DATA}+${cityCode}?apikey=${process.env.API_KEY}&metric=true`);
	const graphData= await graphDataHourly(cityCode);
	const finalData={jsonData,graphData}
	return res.status(201).json(finalData);
}) 
const sevenDayforecast= asyncHandler(async (req,res)=>{
	const {cityCode}= req.params;
	const data=await fetch(`${process.env.FIVE_DAY_FORECAST}+${cityCode}?apikey=${process.env.API_KEY}&details=true&metric=true`);
	const jsonData=await data.json();
	return res.status(201).json(jsonData);
})
const TopLargeCities=  asyncHandler(async(req,res)=>{
	const data=await fetch(`${process.env.TOP_CITIES}?apikey=${process.env.API_KEY}`);
	const jsonData=await data.json();
	const finalData=jsonData.slice(1,4);
	return res.status(201).json(finalData);
})
/*
const data2 =[
  { "id":"india",
    "color": "hsl(170, 70%, 50%)",
    "data":[
      {
        "x": "16:00",
        "y": 46
 
  */
const processData=(data)=>{
	const temp=Math.ceil(data.Temperature.Value);
	const time=new Date(data.EpochDateTime*1000);
	return {x:`${time.getHours()}`,y:temp};

}
//
const graphDataHourly=async(cityCode)=>{
	const graphData=await fetch(`${process.env.HOURLY_DATA}+${cityCode}?apikey=${process.env.API_KEY}&metric=true`);
	const jsonData=await graphData.json();
	let base=100;
	console.log(jsonData,'graphdata');
	const data=jsonData.map((value)=>{
		base=Math.min(base,value.Temperature.Value);
		return processData(value)});
	base=Math.floor(base);
	const finalData=[{"id":"india","color":"hsl(170, 70%, 50%)",base,data}];
	return finalData;
}
const geoPosition=asyncHandler(async (req,res)=>{
	const {lat,lon}=req.query;
	const data=await fetch(`${process.env.GEO_POSITION}?apikey=${process.env.API_KEY}&q=${lat},${lon}`)
	const fdata=await data.json();
	res.status(200).json(fdata);
})

export {autocomplete,
	currentConditions,
	sevenDayforecast,
	TopLargeCities,
	graphDataHourly,
	geoPosition,
}
