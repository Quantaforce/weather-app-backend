import 'dotenv/config'
import {Router} from 'express'
import { verifyJwt } from '../middlewares/auth.middleware.js';
import { TopLargeCities, autocomplete, currentConditions,graphDataHourly,sevenDayforecast } from '../controllers/weather.controller.js';

const router=Router();
router.use(verifyJwt);


router.get('/autocomplete',autocomplete);
router.get('/currentconditions/:cityCode',currentConditions);
router.get('/sevendayforecast/:cityCode',sevenDayforecast);
router.get('/largecities/',TopLargeCities);
router.get('/graphdata/:cityCode',graphDataHourly);



export default router;
