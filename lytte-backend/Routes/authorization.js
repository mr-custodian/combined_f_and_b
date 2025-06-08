import express from 'express';
import {login,checkAuth,logout,changePassword,intrestedVendor, getIntrestedVendor, newVendorCount, ChangeNotifyStatus} from '../Controller/authorization.js';
import { verifyToken } from './../middleware/authorizationMiddleware.js';
const router = express.Router();


router.post('/login',login);
router.get('/checkAuth',checkAuth);
router.post('/logout',logout);
// router.patch('/changepassword/:id',verifyToken(['dashboardUser','vendor']),changePassword);
router.patch('/changepassword/:id',verifyToken(['dashboardUser','vendor']),changePassword);
router.post('/signUp',intrestedVendor) ;
router.get('/signUp-get',getIntrestedVendor) ;
router.get('/interested-vendor-count',newVendorCount) ;
router.post('/mark-all-unread',ChangeNotifyStatus) ;


export default router;