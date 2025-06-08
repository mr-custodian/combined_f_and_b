import express from 'express';
import { 
    updateTnc, getTnc, 
    updatePrivacy, getPrivacy, getContactInfo,updateContactInfo,
    deactivateAccount,
    getDeactivateAccountReason
     
} from '../Controller/Other.js';
import { verifyToken } from '../middleware/authorizationMiddleware.js';

const router = express.Router();

// TnC
router.post('/tnc',  updateTnc);
verifyToken(['dashboardUser']),
router.get('/tnc', getTnc);

// Privacy
router.post('/privacy', updatePrivacy);
// verifyToken(['dashboardUser']),
router.get('/privacy', getPrivacy);

router.get('/contact', getContactInfo);
router.post('/contact',updateContactInfo);
// , verifyToken(['dashboardUser'])

// Deactivate Account
router.post('/account-deactivate',deactivateAccount);
router.get('/deactivated-account-info',getDeactivateAccountReason);


export default router;
