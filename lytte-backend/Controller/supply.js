import { db } from "./../Model/db.js";
import isWeekend from "../isWeekend.js";
export const addsupply = (req, res) => {
    if (isWeekend()) {
      return res.status(400).json({ message: "Cannot add supply data on weekends." });
    }
  
    const {
      s_qty,
      s_price,
      s_status,
      v_name,
      v_id,
      otp,
      v_mobile,
      v_add,
      cat_name,
      list_cat_id,
      cat_image,
    } = req.body;
  
    // Check if a record already exists for the same v_id and cat_name
    const checkSql = "SELECT * FROM supply WHERE v_id = ? AND cat_name = ? AND s_status='Pending'";
    db.query(checkSql, [v_id, cat_name], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database query error", Error: err });
      }
  
      if (result.length > 0) {
        return res.status(400).json({ message: "Requirement already exists for this category, please edit in the Live Cart" });
      }
  
      // If no record exists, proceed to insert the new data
      const sql =
        "INSERT INTO supply (s_qty, s_price, s_status, v_name, v_id, otp, v_mobile, v_add, cat_name, list_cat_id, cat_image, vendor_supply) VALUES (?,?,?,?,?,?,?,?,?,?,?,?);";
      const data = [
        s_qty,
        s_price,
        s_status,
        v_name,
        v_id,
        otp,
        v_mobile,
        v_add,
        cat_name,
        list_cat_id,
        cat_image,
        s_qty,
      ];
  
      db.query(sql, data, (err, results) => {
        if (err) {
          return res.status(500).json({ message: "Error saving the requirement data", Error: err });
        } else {
          return res.status(200).json({ message: "Requirement data saved", results });
        }
      });
    });
  };
  

export const allsupply = (req, res) => {
    const sql = "SELECT * FROM supply";
    db.query(sql,(err,results)=>{
        if(err)
        {
            console.log('error in getting data');
            res.status(500).json({message:'error in getting data',Error:err});
        }else{
            return res.status(200).json({message:'success',results});
        }
    })
};
export const completesupply = (req, res) => {
    const sql = "SELECT * FROM supply where (s_status='completed' or s_status='rejected' or s_status='partial completed')";
    db.query(sql,(err,results)=>{
        if(err)
        {
            console.log('error in getting data');
            res.status(500).json({message:'error in getting data',Error:err});
        }else{
            return res.status(200).json({message:'success',results});
        }
    })
};
export const pendingsupply = (req, res) => {
    const sql = "SELECT * FROM supply where (s_status='pending' or s_status='approved')";
    db.query(sql,(err,results)=>{
        if(err)
        {
            console.log('error in getting data');
            res.status(500).json({message:'error in getting data',Error:err});
        }else{
            return res.status(200).json({message:'success',results});
        }
    })
};

export const supplyDetail = (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM supply where s_id = ?";
    db.query(sql,[id],(err,results)=>{
        if(err)
        {
            console.log(`error in getting detail of ${id}`);
            res.status(500).json({message:`error in getting detail of ${id}`,Error:err});
        }else{
            return res.status(200).json({message:'success',results});
        }
    })

};

export const vendorsupply = (req, res) => {
    const id = req.params.id;
    const sql = `
        SELECT s.*, s.list_cat_id 
        FROM supply s
        LEFT JOIN notification n 
        ON s.s_id = n.s_id AND n.status = 'Pending' 
        WHERE s.v_id = ? AND n.s_id IS NULL AND s.s_status !='completed'
    `;

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.log(`error in getting detail of ${id}`);
            return res.status(500).json({ message: `Error in getting detail of ${id}`, error: err });
        } 
        
        if (Array.isArray(results) && results.length > 0) {
            const listCatIds = results.map(result => result.list_cat_id);
            
            // Second query to get the required quantity from the requirement table
            const sql2 = `
                SELECT cat_image, cat_name, SUM(req_quantity) AS req_quantity, list_cat_id 
                FROM requirement 
                WHERE list_cat_id IN (?) 
                GROUP BY cat_name, list_cat_id, cat_image;
            `;
            
            db.query(sql2, [listCatIds], (err2, reqResults) => {
                if (err2) {
                    console.log(`error in getting requirement details for list_cat_id(s): ${listCatIds}`);
                    return res.status(500).json({ message: `Error in getting requirement details`, error: err2 });
                }
                
                const modifiedResults = results.map(vendor => {
                    const matchingRequirement = reqResults.find(req => req.list_cat_id === vendor.list_cat_id) || {};
                    return {
                        ...vendor,
                        ...matchingRequirement,
                        canEdit: !isWeekend() && vendor.s_status === "Pending",
                        canDelete: !isWeekend() && vendor.s_status === 'Pending'
                    };
                });

                return res.status(200).json({ message: 'success', results: modifiedResults });
            });
        } else {
            return res.status(200).json({ message: 'No results found' ,results:[]});
        }
    });
};



export const deletesupply = (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM supply where s_id = ?";
    db.query(sql,[id],(err,results)=>{
        if(err)
        {
            console.log(`error in deleting detail of ${id}`);
            res.status(500).json({message:`error in deleting supply detail of ${id}`,Error:err});
        }else{
            return res.status(200).json({message:`supply Detail of ${id} Deleted`,results});
        }
    })
};

export const editsupply = (req, res) => {
    const s_id = req.params.id;
    const { s_price, s_qty } = req.body;
    console.log(req.params);
    // SQL query to update the price and quantity based on s_id
    const sql = "UPDATE supply SET s_price = ?, s_qty = ?,vendor_supply=? WHERE s_id = ?;";
    const data = [s_price, s_qty,s_qty, s_id];

    db.query(sql, data, (err, results) => {
        if (err) {
            console.log(`Error in updating supply with id ${s_id}`);
            return res.status(500).json({ message: `Error in updating supply with id ${s_id}`, Error: err });
        } else {
            return res.status(200).json({ message: `Supply with id ${s_id} updated successfully`, results });
        }
    });
};
