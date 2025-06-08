import express from 'express';
import {addRequirement,allRequirement,requirementDetail,deleteRequirement,editRequirement,vendorRequirement,getRecentOrder,AddRecentOrder,requirementStatus, CompleteRequirement, PendingRequirement} from '../Controller/requirement.js';
const router = express.Router();
import {verifyToken} from '../middleware/authorizationMiddleware.js';

router.post('/add-requirement',addRequirement);
// ,verifyToken(['dashboardUser'])
router.get('/vendor-requirement',vendorRequirement);
// ,verifyToken(['dashboardUser','vendor'])
router.get('/all-requirement',allRequirement);
// ,verifyToken(['dashboardUser','vendor'])
router.get('/complete-requirement',CompleteRequirement);
// ,verifyToken(['dashboardUser','vendor'])
router.get('/pending-requirement',PendingRequirement);
// ,verifyToken(['dashboardUser','vendor'])
router.get('/requirement-detail/:id',requirementDetail);
// ,verifyToken(['dashboardUser'])
router.delete('/delete/:id',deleteRequirement);
// ,verifyToken(['dashboardUser'])
router.put('/edit/:id',editRequirement);
// ,verifyToken(['dashboardUser'])
router.get('/recentOrder/:v_id',getRecentOrder);
// ,verifyToken(['dashboardUser','vendor'])
router.post('/add-recent-visit',AddRecentOrder);
// ,verifyToken(['dashboardUser','vendor'])
router.patch('/requirementstatus/:req_id',requirementStatus);
export default router;