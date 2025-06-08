import { db } from "./../Model/db.js";

// Update TnC
export const updateTnc = (req, res) => {
    const { tnc } = req.body;
    const sql = 'UPDATE other SET tnc = ?';
    db.query(sql, [tnc], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'TnC updated successfully' });
    });
};

// Get TnC
export const getTnc = (req, res) => {
    const sql = 'SELECT tnc FROM other LIMIT 1';
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(result[0]);
    });
};

// Update Privacy
export const updatePrivacy = (req, res) => {
    const { privacy } = req.body;
    const sql = 'UPDATE other SET privacy = ?';
    db.query(sql, [privacy], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Privacy updated successfully' });
    });
};

// Get Privacy
export const getPrivacy = (req, res) => {
    const sql = 'SELECT privacy FROM other LIMIT 1';
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(result[0]);
    });
};

export const getContactInfo = (req, res) => {
    const sql = `
        SELECT 
            payment_related_mobile, 
            delivery_related_mobile, 
            application_related_mobile, 
            payment_related_email, 
            delivery_related_email, 
            application_related_email 
        FROM other 
        LIMIT 1
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(result[0]);
    });
};

export const updateContactInfo = (req, res) => {
    const { 
        payment_related_mobile, 
        delivery_related_mobile, 
        application_related_mobile, 
        payment_related_email, 
        delivery_related_email, 
        application_related_email 
    } = req.body;

    const sql = `
        UPDATE other 
        SET 
            payment_related_mobile = ?, 
            delivery_related_mobile = ?, 
            application_related_mobile = ?, 
            payment_related_email = ?, 
            delivery_related_email = ?, 
            application_related_email = ?
    `;

    db.query(sql, [
        payment_related_mobile, 
        delivery_related_mobile, 
        application_related_mobile, 
        payment_related_email, 
        delivery_related_email, 
        application_related_email
    ], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Contact information updated successfully' });
    });
};


export const deactivateAccount = (req,res)=>{
    const {v_id,name,reason} = req.body;
    db.beginTransaction((err)=>{
        if(err){
            return res.status(500).json({message:"error transition",Error:err});
        }
        db.query("select * from vendor where v_id = ?",[v_id],(err,result)=>{
            if(err)
            {
                db.rollback(()=>{
                    return res.status(500).json({message:"error transition",Error:err});
                })
            }
            else{
                const vendorInfo =  result[0];
                db.query("insert into Deactivate_account (v_id,v_name,Reason,v_mobile,v_email,v_companyname,v_address,v_image,v_document) values (?,?,?,?,?,?,?,?,?);",[v_id,name,reason,vendorInfo.v_mobile,vendorInfo.v_email,vendorInfo.v_companyname,vendorInfo.v_address,vendorInfo.v_image,vendorInfo.v_document],(err,result)=>{
                    if(err)
                    {
                        db.rollback(()=>{
                            return res.status(500).json({message:"error in adding reason",Error:err});
                        })
                        
                    }
                    else{
                        db.query("delete from vendor where v_id = ?",[v_id],(err,result)=>{
                            if(err)
                            {
                                db.rollback(()=>{
                                    return res.status(500).json({message:"error in deleting vendor ",Error:err});
                                });
                            }
                            else{
                                db.commit((err)=>{
                                    if(err){
                                        db.rollback(()=>{
                                            return res.status(500).json({message:"error in commit",Error:err});
                                        });
                                    }
                                    else{
                                        return res.status(200).json({message:"account Deactivate",data:result});
                                    }
                                })
                            }
                        })
                    }
                });
            }
        })
    })
    
};

export const getDeactivateAccountReason = (req,res)=>{
    db.query("select * from Deactivate_account;",(err,result)=>{
        if(err)
        {
            return res.status(500).json({message:"error in adding reason",Error:err});
        }
        return res.status(200).json({message:"error in adding reason",data:result});
    });
}