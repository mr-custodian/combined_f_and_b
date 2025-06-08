import express from 'express';
import {allAgent,agentDetail,deleteAgent,addAgent,editAgent} from '../Controller/delivery.js'
import {verifyToken} from '../middleware/authorizationMiddleware.js';

const router = express.Router();

router.get('/get-all-agent',allAgent);
// ,verifyToken(['dashboardUser'])

router.get('/agent-detail/:id',agentDetail);
// ,verifyToken(['dashboardUser'])
router.delete('/delete/:id',deleteAgent);
// ,verifyToken(['dashboardUser'])
router.post('/add-agent',addAgent);
// ,verifyToken(['dashboardUser'])
router.put('/edit/:id',editAgent);
// ,verifyToken(['dashboardUser'])


export default router; 