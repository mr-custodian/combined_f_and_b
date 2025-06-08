import { db } from "./../Model/db.js";
import isWeekend from "../isWeekend.js";

import WebSocket from "ws";
import wss from "../index.js"; // Import the WebSocket server instance

export const Add = (req, res) => {
    const checkNotificationSql = `
        SELECT * FROM notification 
        WHERE s_id = ? AND v_id = ? AND cat_id = ?;
    `;
    const insertNotificationSql = `
        INSERT INTO notification (
            s_id, v_id, asked_price, asked_quantity, prev_price, 
            prev_quantity, cat_id, cat_name, status, lowerPrice, upperPrice
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const updateNotificationSql = `
        UPDATE notification 
        SET asked_price = ?, asked_quantity = ?, prev_price = ?, prev_quantity = ?, 
            cat_name = ?, status = ?, lowerPrice = ?, upperPrice = ? 
        WHERE s_id = ? AND v_id = ? AND cat_id = ?;
    `;
    const updateSupplyStatusSql = 'UPDATE supply SET s_status = ? WHERE s_id = ?;';
    
    const { 
        s_id, 
        v_id, 
        asked_price, 
        asked_quantity, 
        prev_price, 
        prev_quantity, 
        cat_id, 
        cat_name, 
        lower_price, 
        upper_price 
    } = req.body;

    const notificationData = [
        asked_price, 
        asked_quantity, 
        prev_price, 
        prev_quantity, 
        cat_name, 
        "Pending", 
        lower_price, 
        upper_price, 
        s_id, 
        v_id, 
        cat_id
    ];

    // Check if a notification already exists
    db.query(checkNotificationSql, [s_id, v_id, cat_id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Error checking notification", Error: err });
        }

        if (result.length > 0) {
            // If notification exists, update it
            db.query(updateNotificationSql, notificationData, (err, updateResult) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ message: "Error updating notification", Error: err });
                } else {
                    updateSupplyStatus(res, s_id, updateResult,v_id);
                }
            });
        } else {
            // If no notification exists, insert a new one
            const newNotificationData = [
                s_id, 
                v_id, 
                asked_price, 
                asked_quantity, 
                prev_price, 
                prev_quantity, 
                cat_id, 
                cat_name, 
                "Pending", 
                lower_price, 
                upper_price
            ];

            db.query(insertNotificationSql, newNotificationData, (err, insertResult) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ message: "Error adding notification", Error: err });
                } else {
                    updateSupplyStatus(res, s_id, insertResult,v_id);
                }
            });
        }
    });
};

// Function to update supply status and send notification
function updateSupplyStatus(res, s_id, notificationResult,v_id) {
    const updateSupplyStatusSql = 'UPDATE supply SET s_status = ? WHERE s_id = ?;';
    db.query(updateSupplyStatusSql, ["Pending", s_id], (err, updateResults) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Notification added but error updating supply status", Error: err });
        } else {
            // WebSocket notification logic remains the same
            const newNotification = {
                type: 'new_notification',
                data: notificationResult
            };

            // Notify vendor via WebSocket
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN && client.vendorId === v_id.toString()) {
                    client.send(JSON.stringify(newNotification));
                }
            });

            return res.status(200).json({ 
                message: "Notification added/updated and supply status updated", 
                NotificationData: notificationResult, 
                SupplyUpdateData: updateResults 
            });
        }
    });
}



export const Update = (req,res)=>{
    const id = req.params.id;
    const sql = 'update notification set s_id = ?,v_id = ?,asked_price = ?,asked_quantity = ?,prev_price = ?,prev_quantity = ?,cat_id = ?,cat_name = ?  where n_id = ?;'
    const {s_id,v_id,asked_price,asked_quantity,prev_price,prev_quantity,cat_id,cat_name} = req.body;
    const data = [s_id,v_id,asked_price,asked_quantity,prev_price,prev_quantity,cat_id,cat_name,id]
    db.query(sql,data,(err,results)=>{
        if(err)
        {
            console.log(err);
            return res.status(500).json({message: "Error in Adding Notification",Error:err});
        }else{
            return res.status(200).json({message: "Notification Added",Data:results});
        }
    })
};
export const GetPending = (req,res)=>{
    const id = req.params.vendor_id;
    const sql = 'select * from notification where v_id = ? and status = ?;'
    const data = [id,'pending']
    db.query(sql,data,(err,results)=>{
        if(err)
        {
            console.log(err);
            return res.status(500).json({message: "Error in getting Notification",Error:err});
        }else{
            const canEdit = !isWeekend();
            const canDelete= !isWeekend();
            const modifiedResults = results.map(notification => ({
                ...notification,
                canEdit: canEdit,
                canDelete:canDelete
                
            }));
            return res.status(200).json({message: "Requist Succeful",Data:modifiedResults});
        }
    })
};

export const GetPending2 = (req, res) => {
    const id = req.params.vendor_id;
    const sql1 = 'SELECT * FROM notification WHERE v_id = ? AND status = ?;';
    const data1 = [id, 'Pending'];

    db.query(sql1, data1, (err, notifications) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Error in getting Notification", Error: err });
        }

        if (notifications.length > 0) {
            const canEdit = !isWeekend();
            const canDelete = !isWeekend();

            // Collect all cat_ids from the notifications
            const catIds = notifications.map(notification => notification.cat_id);
           
            // Use a single query to get all requirement details for the collected cat_ids
            const sql2 = `
                SELECT cat_image, cat_name, SUM(req_quantity) AS req_quantity, list_cat_id 
                FROM requirement 
                WHERE list_cat_id IN (?) 
                GROUP BY cat_name, list_cat_id, cat_image;
            `;

            db.query(sql2, [catIds], (err2, requirementResults) => {
                if (err2) {
                    console.log(err2);
                    return res.status(500).json({ message: "Error in getting requirement details", Error: err2 });
                }

                console.log(requirementResults);

                // Map over notifications and merge requirement details
                const modifiedResults = notifications.map(notification => {
                    const matchingRequirement = requirementResults.find(req => req.list_cat_id === notification.cat_id) || {};
                    return {
                        ...notification,
                        canEdit: canEdit,
                        canDelete: canDelete,
                        requirementDetails: matchingRequirement
                    };
                });

                return res.status(200).json({ message: "Request Successful", Data: modifiedResults });
            });
        } else {
            return res.status(200).json({ message: "No pending notifications found", Data: [] });
        }
    });
};



export const NumberOfNotification = (req,res)=>{
    const id = req.params.vendor_id;
    const sql = 'select count(*) from notification where seen = ? and v_id=?;'
    const data = [0,id]
    db.query(sql,data,(err,results)=>{
        if(err)
        {
            console.log(err);
            return res.status(500).json({message: "Error in getting number of  Notification",Error:err});
        }else{
            return res.status(200).json({message: "Requist Succeful",Data:results});
        }
    })
};


export const editSeen = (req,res)=>{
    const id = req.params.vendor_id;
    const sql = 'update notification set seen = ? where v_id=?;'
    const data = [1,id]
    db.query(sql,data,(err,results)=>{
        if(err)
        {
            console.log(err);
            return res.status(500).json({message: "Error in getting seeting seen  Notification",Error:err});
        }else{
            return res.status(200).json({message: "Requist Succeful",Data:results});
        }
    })
};


export const changeStatus = (req, res) => {
    const n_id = req.body.n_id;  // notification ID
    const s_id = req.body.s_id;  // supply ID
    const  status  = req.body.status;
console.log(req.body);
    let notificationStatus;
    let supplyStatus;

    if (status === 'approve') {
        notificationStatus = 'approved';
        supplyStatus = 'approved';
    } else if (status === 'reject') {
        notificationStatus = 'rejected';
        supplyStatus = 'approved';
    } else {
        return res.status(400).json({ message: "Invalid status provided" });
    }

    const updateNotificationSql = 'UPDATE notification SET status = ? WHERE n_id = ?;';
    const updateSupplySql = 'UPDATE supply SET s_status = ? WHERE s_id = ?;';

    db.query(updateNotificationSql, [notificationStatus, n_id], (err, notificationResults) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Error in updating notification status", Error: err });
        } else {
            db.query(updateSupplySql, [supplyStatus, s_id], (err, supplyResults) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ message: "Notification status updated but error in updating supply status", Error: err });
                } else {
                    return res.status(200).json({ message: "Status updated successfully", NotificationData: notificationResults, SupplyData: supplyResults });
                }
            });
        }
    });
};

export const UpdateSupplyNotification = (req, res) => {
    const { n_id, s_id, prev_price, prev_quantity } = req.body;

    if (!n_id || !s_id || prev_price === undefined || prev_quantity === undefined) {
        return res.status(400).json({ message: 'n_id, s_id, prev_price, and prev_quantity are required.' });
    }

    // Update notification table
    const updateNotificationSql = `
        UPDATE notification
        SET prev_price = ?, prev_quantity = ?
        WHERE n_id = ?
    `;
    
    db.query(updateNotificationSql, [prev_price, prev_quantity, n_id], (err, results) => {
        if (err) {
            console.error('Error updating notification:', err);
            return res.status(500).json({ message: 'Error updating notification', error: err });
        }

        // Update supply table
        const updateSupplySql = `
            UPDATE supply
            SET s_price = ?, s_qty = ?
            WHERE s_id = ?
        `;
        
        db.query(updateSupplySql, [prev_price, prev_quantity, s_id], (err, results) => {
            if (err) {
                console.error('Error updating supply:', err);
                return res.status(500).json({ message: 'Error updating supply', error: err });
            }

            return res.status(200).json({ message: 'Notification and supply updated successfully' });
        });
    });
};



export const UnseenNotification = (req,res)=>{
    const id = req.params.vendor_id;
    const sql = 'select * from notification where seen = ? and v_id=? order by n_id desc limit 5;'
    const data = [0,id]
    db.query(sql,data,(err,results)=>{
        if(err)
        {
            console.log(err);
            return res.status(500).json({message: "Error in getting number of  Notification",Error:err});
        }else{
            return res.status(200).json({message: "Requist Succeful",data:results});
        }
    })
};
