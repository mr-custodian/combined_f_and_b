import express from 'express';
import {addsupply,allsupply,supplyDetail,deletesupply,editsupply,vendorsupply, pendingsupply, completesupply} from '../Controller/supply.js';
const router = express.Router();


router.post('/add',addsupply);
router.get('/all-supply',allsupply);
router.get('/pending-supply',pendingsupply);
router.get('/complete-supply',completesupply);
router.get('/supply-detail/:id',supplyDetail);
router.delete('/del/:id',deletesupply);
router.put('/edit/:id',editsupply);
router.get('/supply-vendor-detail/:id',vendorsupply)
export default router;