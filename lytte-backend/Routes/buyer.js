import express from 'express';
import {allbuyer,getbuyer,deletbuyer,AddBuyer,editBuyer} from '../Controller/buyer.js'
import { verifyToken } from './../middleware/authorizationMiddleware.js';
const router = express.Router();

router.get('/allbuyer',allbuyer)
// verifyToken(['dashboardUser']),
router.get('/getbuyer/:id',getbuyer)
// ,verifyToken(['dashboardUser'])
router.post('/addbuyer',AddBuyer)
// ,verifyToken(['dashboardUser'])
router.delete('/deletbuyer/:id',deletbuyer)
// ,verifyToken(['dashboardUser'])
router.put('/edit/:id',editBuyer)
// ,verifyToken(['dashboardUser'])

export default router;
