import 'dotenv/config'
import {Router} from 'express';
import { handleSignup,handleLogin,handleLogout, handleRefresh } from '../controllers/user.controller.js';
const router = Router();


router.post('/signup',handleSignup);
router.post('/login',handleLogin);
router.post('/logout',handleLogout);
router.post('/refreshauth',handleRefresh);
export default router;
