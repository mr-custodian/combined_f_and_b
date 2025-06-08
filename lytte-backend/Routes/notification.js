import express from 'express';
import {Add,Update,GetPending,NumberOfNotification,editSeen,changeStatus,UpdateSupplyNotification,UnseenNotification,GetPending2} from '../Controller/notification.js';
const router = express.Router();


router.post('/new-notification',Add);
router.get('/get-pending-notication/:vendor_id',GetPending);
router.get('/get-pending-notications/:vendor_id',GetPending2);
router.get('/num-notication/:vendor_id',NumberOfNotification);
router.get("/get-unseen-notification/:vendor_id",UnseenNotification)
router.put('/edit/:id',Update);
router.put('/editsupply_notification/:id',UpdateSupplyNotification);

router.patch('/edit-seen/:vendor_id',editSeen);
router.post('/edit-status',changeStatus)

export default router;