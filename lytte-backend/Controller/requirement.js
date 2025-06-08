import { db } from "./../Model/db.js";
import WebSocket from "ws";
import wss from "../index.js";
export const addRequirement = (req, res) => {
  const {
    req_quantity,
    req_price,
    req_status,
    req_note,
    b_id,
    b_name,
    b_add,
    b_drop_add,
    b_moile,
    list_cat_id,
    cat_name,
    cat_image,
  } = req.body;

  // Validation
  if (!req_quantity || isNaN(req_quantity) || parseFloat(req_quantity) <= 0) {
    return res.status(400).json({ message: "Invalid quantity" });
  }
  if (!req_price || isNaN(req_price) || parseFloat(req_price) <= 0) {
    return res.status(400).json({ message: "Invalid price" });
  }
  if (!req_status) {
    return res.status(400).json({ message: "Status is required" });
  }
  if (!b_id || !b_name || !b_add || !b_drop_add || !b_moile) {
    return res.status(400).json({ message: "All buyer details are required" });
  }
  if (!list_cat_id || !cat_name) {
    return res
      .status(400)
      .json({ message: "All category details are required" });
  }
  // console.log(wss);
  const sql =
    "INSERT INTO requirement (req_quantity, req_price, req_status, req_note, b_id, b_name, b_add, b_drop_add, b_moile, list_cat_id, cat_name, cat_image) VALUES (?,?,?,?,?,?,?,?,?,?,?,?);";
  const data = [
    req_quantity,
    req_price,
    req_status,
    req_note,
    b_id,
    b_name,
    b_add,
    b_drop_add,
    b_moile,
    list_cat_id,
    cat_name,
    cat_image,
  ];

  db.query(sql, data, (err, results) => {
    if (err) {
      console.log("Error in saving the requirement data", err);
      return res
        .status(500)
        .json({ message: "Error in saving the requirement data", Error: err });
    } else {
      // Fetch updated list of requirements and broadcast
      const fetchSql =
        "SELECT cat_image, cat_name, SUM(req_quantity) AS req_quantity, list_cat_id FROM requirement GROUP BY cat_name, list_cat_id, cat_image";
      db.query(fetchSql, (fetchErr, fetchResults) => {
        if (fetchErr) {
          console.log("Error in fetching updated data", fetchErr);
        } else {
          // Broadcast the updated results to all connected clients
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({ message: "newData", results: fetchResults })
              );
            }
          });
        }
      });

      return res
        .status(200)
        .json({ message: "Requirement data saved", results });
    }
  });
};

export const allRequirement = (req, res) => {
  const sql = "SELECT * FROM requirement";
  db.query(sql, (err, results) => {
    if (err) {
      console.log("error in getting data");
      res.status(500).json({ message: "error in getting data", Error: err });
    } else {
      return res.status(200).json({ message: "success", results });
    }
  });
};
export const CompleteRequirement = (req, res) => {
  const sql = "SELECT * FROM requirement where req_status!='pending'";
  db.query(sql, (err, results) => {
    if (err) {
      console.log("error in getting data");
      res.status(500).json({ message: "error in getting data", Error: err });
    } else {
      return res.status(200).json({ message: "success", results });
    }
  });
};
export const PendingRequirement = (req, res) => {
  const sql = "SELECT * FROM requirement where req_status='pending'";
  db.query(sql, (err, results) => {
    if (err) {
      console.log("error in getting data");
      res.status(500).json({ message: "error in getting data", Error: err });
    } else {
      return res.status(200).json({ message: "success", results });
    }
  });
};

export const vendorRequirement = (req, res) => {
  const sql =
    "SELECT cat_image, cat_name, SUM(req_quantity) AS req_quantity, list_cat_id FROM requirement GROUP BY cat_name, list_cat_id, cat_image";
  db.query(sql, (err, results) => {
    if (err) {
      console.log("error in getting data");
      res.status(500).json({ message: "error in getting data", Error: err });
    } else {
      return res.status(200).json({ message: "success", results });
    }
  });
};

export const requirementDetail = (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM requirement where req_id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.log(`error in getting detail of ${id}`);
      res
        .status(500)
        .json({ message: `error in getting detail of ${id}`, Error: err });
    } else {
      return res.status(200).json({ message: "success", results });
    }
  });
};

export const deleteRequirement = (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM requirement where req_id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.log(`error in deleting detail of ${id}`);
      res
        .status(500)
        .json({ message: `error in deleting detail of ${id}`, Error: err });
    } else {
      return res
        .status(200)
        .json({ message: `Requirement Detail of ${id} Deleted`, results });
    }
  });
};

export const editRequirement = (req, res) => {
  const id = req.params.id;
  const {
    req_quantity,
    req_price,
    req_status,
    req_note,
    b_id,
    b_name,
    b_add,
    b_drop_add,
    b_moile,
    list_cat_id,
    cat_name,
    cat_image,
  } = req.body;
  // Validation
  // console.log(req.body)
  if (!req_quantity || isNaN(req_quantity) || parseFloat(req_quantity) <= 0) {
    return res.status(400).json({ message: "Invalid quantity" });
  }
  if (!req_price || isNaN(req_price) || parseFloat(req_price) <= 0) {
    return res.status(400).json({ message: "Invalid price" });
  }
  if (!req_status) {
    return res.status(400).json({ message: "Status is required" });
  }
  if (!b_id || !b_name || !b_add || !b_drop_add || !b_moile) {
    return res.status(400).json({ message: "All buyer details are required" });
  }
  if (!list_cat_id || !cat_name) {
    return res
      .status(400)
      .json({ message: "All category details are required" });
  }

  const sql =
    "UPDATE requirement SET req_quantity=?, req_price=?, req_status=?, req_note=?, b_id=?, b_name=?, b_add=?, b_drop_add=?, b_moile=?, list_cat_id=?, cat_name=?, cat_image=? WHERE req_id =?;";
  const data = [
    req_quantity,
    req_price,
    req_status,
    req_note,
    b_id,
    b_name,
    b_add,
    b_drop_add,
    b_moile,
    list_cat_id,
    cat_name,
    cat_image,
    id,
  ];
  db.query(sql, data, (err, results) => {
    if (err) {
      console.log("error in saving the requirement data");
      return res
        .status(500)
        .json({ message: "error in saving the requirement data", Error: err });
    } else {
      return res
        .status(200)
        .json({ message: "requirement data data Saved", Error: results });
    }
  });
};

export const getRecentOrder = (req, res) => {
  const id = req.params.v_id;
  db.query(
    "select * from recentOrder where v_id = ? order by id DESC limit 6",
    [id],
    (err, results) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ message: "error in getting data", Error: err });
      }
      return res.status(200).json({ message: "success", data: results });
    }
  );
};

export const AddRecentOrder = (req, res) => {
  const { quantity, v_id, cat_id, priceRange, cat_name, cat_image } = req.body;

  db.query(
    "SELECT COUNT(*) AS count FROM recentOrder WHERE v_id = ? AND cat_id = ?",
    [v_id, cat_id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Internal server error" });
      }

      const orderCount = results[0].count;
      if (orderCount > 0) {
        return res.status(200).json({ message: "Data saved successfully" });
      }

      // If no record found, proceed with the transaction
      db.beginTransaction((err) => {
        if (err) {
          console.log("Error in starting transaction:", err);
          return res
            .status(500)
            .json({ message: "Internal server error", error: err });
        }

        db.query(
          "SELECT COUNT(*) AS count FROM recentOrder WHERE v_id = ?",
          [v_id],
          (err, results) => {
            if (err) {
              console.log("Error in getting count of v_id:", err);
              return db.rollback(() => {
                res.status(500).json({
                  message: "Error in getting count of v_id",
                  error: err,
                });
              });
            }

            const orderCount = results[0].count;
            if (orderCount >= 10) {
              db.query(
                "DELETE FROM recentOrder WHERE id = (SELECT MIN(id) FROM recentOrder WHERE v_id = ?)",
                [v_id],
                (err) => {
                  if (err) {
                    console.log("Error deleting oldest record:", err);
                    return db.rollback(() => {
                      res.status(500).json({
                        message: "Error deleting oldest record",
                        error: err,
                      });
                    });
                  }

                  // Continue to insert the new record
                  insertRecord();
                }
              );
            } else {
              // Continue to insert the new record
              insertRecord();
            }

            function insertRecord() {
              db.query(
                "INSERT INTO recentOrder (quantity, v_id, cat_id, priceRange, cat_name, cat_image) VALUES (?, ?, ?, ?, ?, ?)",
                [quantity, v_id, cat_id, priceRange, cat_name, cat_image],
                (err) => {
                  if (err) {
                    console.log("Error inserting new record:", err);
                    return db.rollback(() => {
                      res.status(500).json({
                        message: "Error inserting new record",
                        error: err,
                      });
                    });
                  }

                  db.commit((err) => {
                    if (err) {
                      console.log("Error committing transaction:", err);
                      return db.rollback(() => {
                        res.status(500).json({
                          message: "Error committing transaction",
                          error: err,
                        });
                      });
                    }

                    return res
                      .status(200)
                      .json({ message: "Data saved successfully" });
                  });
                }
              );
            }
          }
        );
      });
    }
  );
};
export const requirementStatus = (req, res) => {
  const id = req.params.req_id;

  // SQL query to fetch the required quantity from the requirement table
  const reqQuantitySql = `
    SELECT req_quantity FROM requirement WHERE req_id = ?;
  `;

  db.query(reqQuantitySql, [id], (err, reqResult) => {
    if (err) {
      return res.status(500).json({ message: "Internal Server Error", err });
    }

    if (reqResult.length === 0) {
      return res.status(404).json({ message: "Requirement not found" });
    }

    const reqQuantity = reqResult[0].req_quantity;

    // Combined SQL query to fetch all necessary data from order_management table
    const orderManagementSql = `
      SELECT 
        SUM(order_qty) as total_order_qty,
        COUNT(*) as total_orders,
        COUNT(CASE WHEN order_status = 'Completed' THEN 1 END) as completed_orders,
        COUNT(CASE WHEN order_status = 'Rejected' THEN 1 END) as rejected_orders,
        COUNT(CASE WHEN payment = 'Paid' THEN 1 END) as paid_orders,
        COUNT(CASE WHEN payment = 'unpaid' THEN 1 END) as unpaid_orders
      FROM order_management
      WHERE req_id = ?;
    `;

    db.query(orderManagementSql, [id], (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Internal Server Error", err });
      }

      const {
        total_order_qty = 0,
        total_orders = 0,
        completed_orders = 0,
        rejected_orders = 0,
        paid_orders = 0,
        unpaid_orders = 0,
      } = results[0];
      
      // Determine the status based on the fetched data
      var FinalStatus ;
      if (Number(total_order_qty) !== Number(reqQuantity) || (Number(completed_orders)>0 && Number(rejected_orders)>0 && Number(completed_orders) + Number(rejected_orders) !==Number(total_order_qty) ) ) {
        FinalStatus = "Pending";
       
      } else if (Number(total_orders) === Number(rejected_orders)) {
        FinalStatus = "Rejected";
        
      } else if (Number(total_orders) === Number(completed_orders)) {
        FinalStatus = "Completed";
        
      } else {
        FinalStatus = "Partially Completed";
        
      }
      db.query("update requirement set req_status = ? where req_id = ?;",[FinalStatus,id],(err,results)=>{
        if(err)
        {
          return res.status(500).json({ Error:  err });
        }
        else{
          // console.log(results)
          return res.status(200).json({data:results,FinalStatus});
        }
      })
      
    });
  });
};
// requirementStatus();