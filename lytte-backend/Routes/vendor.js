import express from "express";
import {AddVendor,getVendors,getVenderDetail,deleteVendor,editVendor,VendorDetailChanged,GetPassword} from "../Controller/vendor.js";
import {verifyToken} from '../middleware/authorizationMiddleware.js'
const router = express.Router();


router.get('/get-vendors',getVendors)
// ,verifyToken(['dashboardUser'])
router.get('/vender-detail/:id',getVenderDetail)
// ,verifyToken(['dashboardUser','vendor'])
router.post('/save-vendor',AddVendor)
// ,verifyToken(['dashboardUser'])
router.delete('/delete-vendor/:id',deleteVendor)
// ,verifyToken(['dashboardUser'])
router.put("/edit/:id",editVendor)
// ,verifyToken(['dashboardUser'])
router.patch("/edit-vendor-detail/:id",VendorDetailChanged);
// ,verifyToken(['dashboardUser','vendor'])
router.get('/get-password',GetPassword)
// ,verifyToken(['dashboardUser'])

export default router;