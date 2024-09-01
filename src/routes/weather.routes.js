import 'dotenv/config'
import {Router} from 'express'
import { verifyJwt } from '../middlewares/auth.middleware.js';
import { TopLargeCities, autocomplete, currentConditions,geoPosition,graphDataHourly,sevenDayforecast } from '../controllers/weather.controller.js';
import apicache from 'apicache'
const router=Router();
const cache = apicache.middleware
router.use(verifyJwt);


router.get('/autocomplete',cache('1 day'),autocomplete);
router.get('/currentconditions/:cityCode',cache('10 minutes'),currentConditions);
router.get('/sevendayforecast/:cityCode',cache('10 minutes'),sevenDayforecast);
router.get('/largecities/',cache('10 minutes'),TopLargeCities);
router.get('/graphdata/:cityCode',cache('10 minutes'),graphDataHourly);
router.get('/geoposition',geoPosition);



export default router;
