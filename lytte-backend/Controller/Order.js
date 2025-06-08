import { db } from "../Model/db.js";

export const addorder = (req, res) => {
  const { req_id, s_id, quantity } = req.body;
  console.log("hello")
  // Begin transaction
  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to start transaction" });
    }

    // Fetch requirement data
    db.query(
      "SELECT * FROM requirement WHERE req_id = ?",
      [req_id],
      (err, requirementRows) => {
        if (err) {
          db.rollback(() =>
            res.status(500).json({ error: "Database query failed" })
          );
          return;
        }

        if (requirementRows.length === 0) {
          db.rollback(() =>
            res.status(404).json({ error: "Requirement not found" })
          );
          return;
        }

        const requirement = requirementRows[0];

        // Fetch supply data
        db.query(
          "SELECT * FROM supply WHERE s_id = ?",
          [s_id],
          (err, supplyRows) => {
            if (err) {
              db.rollback(() =>
                res.status(500).json({ error: "Database query failed" })
              );
              return;
            }

            if (supplyRows.length === 0) {
              db.rollback(() =>
                res.status(404).json({ error: "Supply not found" })
              );
              return;
            }

            const supply = supplyRows[0];

            // Check if category IDs are the same
            if (requirement.list_cat_id !== supply.list_cat_id) {
              db.rollback(() =>
                res.status(400).json({ error: "Category mismatch" })
              );
              return;
            }

            // Check if quantity is sufficient
            if (quantity > supply.s_qty) {
              db.rollback(() =>
                res.status(400).json({ error: "Insufficient supply quantity" })
              );
              return;
            }

            // Check if total quantity exceeds requirement quantity
            db.query(
              "SELECT SUM(order_qty) as total_order_qty FROM order_management WHERE req_id = ?",
              [req_id],
              (err, orderRows) => {
                if (err) {
                  db.rollback(() =>
                    res.status(500).json({ error: "Database query failed" })
                  );
                  return;
                }

                const totalOrderQty = orderRows[0].total_order_qty || 0;

                if (
                  Number(totalOrderQty) + Number(quantity) >
                  Number(requirement.req_quantity)
                ) {
                  db.rollback(() =>
                    res
                      .status(400)
                      .json({ error: "Quantity exceeds requirement" })
                  );
                  return;
                }

                // Update supply quantity and is_taken if needed
                const newSupplyQty = supply.s_qty - quantity;
                const newStatus =
                  newSupplyQty === 0 ? "Approved" : supply.s_status;
                const isTaken = newSupplyQty === 0 ? 1 : supply.is_taken;

                db.query(
                  "UPDATE supply SET s_qty = ?, is_taken = ?, s_status = ? WHERE s_id = ?",
                  [newSupplyQty, isTaken, newStatus, s_id],
                  (err) => {
                    if (err) {
                      db.rollback(() =>
                        res
                          .status(500)
                          .json({ error: "Failed to update supply quantity" })
                      );
                      return;
                    }

                    // Update notification status if supply quantity reaches 0
                    if (newSupplyQty === 0) {
                      db.query(
                        "UPDATE notification SET status = 'Approved' WHERE s_id = ?",
                        [s_id],
                        (err) => {
                          if (err) {
                            db.rollback(() =>
                              res.status(500).json({
                                error: "Failed to update notification status",
                              })
                            );
                            return;
                          }
                        }
                      );
                    }

                    // Generate a 4-digit OTP
                    const orderOtp = Math.floor(
                      100000 + Math.random() * 900000
                    ).toString();

                    // Insert new order
                    console.log(orderOtp);
                    db.query(
                      `INSERT INTO order_management (

                order_qty, order_status, order_otp, req_id, s_id, cat_name, list_cat_id, 
                  cat_image, b_name, b_id, b_drop_address, b_mobile,v_id,v_name,v_mobile,v_address,order_price
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)`,
                      [
                        quantity,
                        "Approved",
                        orderOtp,
                        req_id,
                        s_id,
                        supply.cat_name,
                        supply.list_cat_id,
                        supply.cat_image,
                        requirement.b_name,
                        requirement.b_id,
                        requirement.b_drop_add,
                        requirement.b_moile,
                        supply.v_id,
                        supply.v_name,
                        supply.v_mobile,
                        supply.v_add,
                        requirement.req_price,
                      ],
                      (err, result) => {
                        if (err) {
                          db.rollback(() =>
                            res
                              .status(500)
                              .json({ error: "Failed to insert order" })
                          );
                          return;
                        }

                        // Commit transaction
                        db.commit((err) => {
                          if (err) {
                            db.rollback(() =>
                              res
                                .status(500)
                                .json({ error: "Failed to commit transaction" })
                            );
                            return;
                          }

                          res.status(200).json({
                            message: "Order created successfully",
                            orderId: result.insertId,
                          });
                        });
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  });
};

export const allorder = (req, res) => {
  const sql = "SELECT * FROM order_management";

  db.query(sql, (err, results) => {
    if (err) {
      console.log(`Error in fetching orders`, err);
      res.status(500).json({ message: `Error in fetching orders`, error: err });
    } else {
      res.status(200).json({ message: "Success", data: results });
    }
  });
};

export const noncompleteorder = (req, res) => {
  const sql =
    "SELECT * FROM order_management where order_status!='completed' AND order_status!='rejected' ";

  db.query(sql, (err, results) => {
    if (err) {
      console.log(`Error in fetching orders`, err);
      res.status(500).json({ message: `Error in fetching orders`, error: err });
    } else {
      res.status(200).json({ message: "Success", data: results });
    }
  });
};

export const completedorder = (req, res) => {
  const sql =
    "SELECT * FROM order_management WHERE order_status = 'completed' OR order_status='rejected'";

  db.query(sql, (err, results) => {
    if (err) {
      console.log(`Error in fetching completed orders`, err);
      res
        .status(500)
        .json({ message: `Error in fetching completed orders`, error: err });
    } else {
      res.status(200).json({ message: "Success", data: results });
    }
  });
};

export const getallorderhistory = (req, res) => {
  // const id = req.params.id;
  const sql = "SELECT * FROM order_management";
  db.query(sql, (err, results) => {
    if (err) {
      console.log(`error in order history`, err);
      res.status(500).json({ message: `error in order history`, Error: err });
    } else {
      return res.status(200).json({ message: "success", data: results });
    }
  });
};
export const requirementOrder = (req, res) => {
  const id = req.params.id;
  const sql =
    "SELECT * FROM order_management where order_status = ? and req_id = ?";
  db.query(sql, ["approved", id], (err, results) => {
    if (err) {
      console.log(`error in order detain of requirement Id ${id}`, err);
      res.status(500).json({
        message: `error in order detain of requirement Id ${id}`,
        Error: err,
      });
    } else {
      return res.status(200).json({ message: "success", data: results });
    }
  });
};

export const requiretOrder = (req, res) => {
  const id = req.params.id;
  const sql =
    "SELECT * FROM order_management WHERE order_status NOT IN (?, ?) AND req_id = ?";
  db.query(sql, ["rejected", "pending", id], (err, results) => {
    if (err) {
      console.log(`Error in order details of requirement ID ${id}`, err);
      res.status(500).json({
        message: `Error in order details of requirement ID ${id}`,
        error: err,
      });
    } else {
      return res.status(200).json({ message: "success", data: results });
    }
  });
};
export const requireOrder = (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM order_management WHERE req_id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.log(`Error in order details of requirement ID ${id}`, err);
      res.status(500).json({
        message: `Error in order details of requirement ID ${id}`,
        error: err,
      });
    } else {
      return res.status(200).json({ message: "success", data: results });
    }
  });
};

export const deleteOrder = (req, res) => {
  const id = req.params.id;
  const sql = "Delete FROM order_management where order_id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.log(`error in order Deleting order of  Id ${id}`, err);
      res.status(500).json({
        message: `error in order Deleting order of  Id ${id}`,
        Error: err,
      });
    } else {
      return res.status(200).json({ message: "success", data: results });
    }
  });
};

export const DeliveryAgentAssign = (req, res) => {
  const id = req.params.id;
  const { d_id, d_name, d_phone, pick_up } = req.body;
  const sql =
    "update order_management set d_id = ? ,d_name = ?,d_phone=?,pick_up = ? where order_id = ?";
  const data = [d_id, d_name, d_phone, pick_up, id];
  db.query(sql, data, (err, results) => {
    if (err) {
      console.log(`error in adding delevery agent in order of  Id ${id}`, err);
      res.status(500).json({
        message: `error in adding delevery agent in order of  Id ${id}`,
        Error: err,
      });
    } else {
      return res.status(200).json({ message: "success", data: results });
    }
  });
};

export const RemoveAgent = (req, res) => {
  const id = req.params.id;
  const sql =
    "UPDATE order_management SET d_id = NULL, d_name = NULL, d_phone = NULL, pick_up = NULL WHERE order_id = ?";
  const data = [id];
  db.query(sql, data, (err, results) => {
    if (err) {
      console.log(
        `Error in removing delivery agent from order of Id ${id}`,
        err
      );
      res.status(500).json({
        message: `Error in removing delivery agent from order of Id ${id}`,
        Error: err,
      });
    } else {
      return res.status(200).json({ message: "Success", data: results });
    }
  });
};

export const ChangeStatus = (req, res) => {
  const id = req.params.id; // Order ID
  const { status, supplyid } = req.body; // New status and supply ID

  const fetchSupplyQtySQL = "SELECT s_qty FROM supply WHERE s_id = ?";
  const updateOrderStatusSQL = "UPDATE order_management SET order_status = ? WHERE order_id = ?";
  const fetchOrdersForSupplySQL = "SELECT order_status FROM order_management WHERE s_id = ?";
  const updateSupplyStatusSQL = "UPDATE supply SET s_status = ? WHERE s_id = ?";
   
  // Step 1: Always update the order status first
  db.query(updateOrderStatusSQL, [status, id], (err, orderResults) => {
    if (err) {
      console.log(`Error updating order status for Order ID ${id}`, err);
      return res.status(500).json({ message: `Error updating order status`, Error: err });
    }

    // Step 2: Fetch the supply quantity to determine if further action is needed
    db.query(fetchSupplyQtySQL, [supplyid], (err, supplyResults) => {
      if (err) {
        console.log(`Error fetching supply quantity for Supply ID ${supplyid}`, err);
        return res.status(500).json({ message: `Error fetching supply quantity`, Error: err });
      }

      const s_qty = supplyResults[0]?.supply_quantity || 0;
      console.log(s_qty);
      if (s_qty > 0) {
        // If supply quantity is not zero, just respond with the order status update result
        return res.status(200).json({ message: "Order status updated successfully", data: orderResults });
      } else {
        // Step 3: If s_qty is zero, fetch all orders for the given supply to analyze their statuses
        db.query(fetchOrdersForSupplySQL, [supplyid], (err, orderStatuses) => {
          if (err) {
            console.log(`Error fetching orders for Supply ID ${supplyid}`, err);
            return res.status(500).json({ message: `Error fetching orders`, Error: err });
          }

          const statusCounts = orderStatuses.reduce(
            (acc, order) => {
              if (order.order_status === 'Completed') acc.completed++;
              if (order.order_status === 'Rejected') acc.rejected++;
              return acc;
            },
            { completed: 0, rejected: 0 }
          );

          let newSupplyStatus;
          if (statusCounts.completed > 0 && statusCounts.rejected > 0) {
            newSupplyStatus = 'partial completed'; // Few completed, rest rejected
          } else if (statusCounts.completed === orderStatuses.length) {
            newSupplyStatus = 'completed'; // All orders completed
          } else if (statusCounts.rejected === orderStatuses.length) {
            newSupplyStatus = 'rejected'; // All orders rejected
          } else {
            newSupplyStatus = 'Approved'; // Fallback if needed
          }

          // Step 4: Update the supply status based on the analyzed statuses
          db.query(updateSupplyStatusSQL, [newSupplyStatus, supplyid], (err, supplyUpdateResults) => {
            if (err) {
              console.log(`Error updating supply status for Supply ID ${supplyid}`, err);
              return res.status(500).json({ message: `Error updating supply status`, Error: err });
            }

            console.log("here");

            return res.status(200).json({
              message: `Order status updated and Supply status set to ${newSupplyStatus} ${supplyid}`,
              orderData: orderResults,
              supplyData: supplyUpdateResults,
            });
          });
        });
      }
    });
  });
};


export const ChangePaymentStatus = (req, res) => {
  const orderId = req.params.id;
  const { status, req_id } = req.body;

  // Step 1: Update the payment status of the specific order
  const updatePaymentSql =
    "UPDATE order_management SET payment = ? WHERE order_id = ?";
  const updatePaymentData = [status, orderId];

  db.query(updatePaymentSql, updatePaymentData, (err, updateResults) => {
    if (err) {
      console.log(`Error updating payment status of Id ${orderId}`, err);
      return res.status(500).json({
        message: `Error updating payment status of Id ${orderId}`,
        Error: err,
      });
    }

    // Step 2: Retrieve the req_id associated with the order

    const reqId = req_id;

    // Step 3: Check the payment status of all orders under the same req_id
    const checkPaymentStatusSql =
      "SELECT payment FROM order_management WHERE req_id = ?";

    db.query(checkPaymentStatusSql, [reqId], (err, paymentStatusResults) => {
      if (err) {
        console.log(`Error checking payment statuses for req_id ${reqId}`, err);
        return res.status(500).json({
          message: `Error checking payment statuses for req_id ${reqId}`,
          Error: err,
        });
      }
      console.log(paymentStatusResults);

      // Determine the overall status
      let allPaid = true;
      let anyPaid = false;

      paymentStatusResults.forEach((row) => {
        if (row.payment === "Paid") {
          anyPaid = true;
        } else {
          allPaid = false;
        }
      });

      let newReqStatus = allPaid
        ? "completed"
        : anyPaid
        ? "partially completed"
        : "pending";

      // Step 4: Update the req_status based on the payment statuses
      const updateReqStatusSql =
        "UPDATE requirement SET req_status = ? WHERE req_id = ?";
      db.query(
        updateReqStatusSql,
        [newReqStatus, reqId],
        (err, updateReqStatusResults) => {
          if (err) {
            console.log(`Error updating req_status for req_id ${reqId}`, err);
            return res.status(500).json({
              message: `Error updating req_status for req_id ${reqId}`,
              Error: err,
            });
          }

          return res
            .status(200)
            .json({ message: "success", data: updateResults });
        }
      );
    });
  });
};

export const requrementPaymentStatus = (req, res) => {
  const id = req.params.requirement_id;
  const sql = "SELECT * FROM order_management where payment = ? and req_id = ?";
  db.query(sql, ["unpaid", id], (err, results) => {
    if (err) {
      console.log(`error in order detail of requirement Id ${id}`, err);
      res.status(500).json({
        message: `error in order detail of requirement Id ${id}`,
        Error: err,
      });
    } else {
      if (results.length === 0) {
        return res.status(200).json({ message: "success", data: "paid" });
      }
      return res.status(200).json({ message: "success", data: "unpaid" });
    }
  });
};

export const orderDetailById = (req, res) => {
  const id = req.params.orderedId;
  db.query(
    "select * from order_management where order_id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.log(`error in order detail of order id ${id}`, err);
        res.status(500).json({
          message: `error in order detail of id ${id}`,
          Error: err,
        });
      } else {
        return res.status(200).json({ message: "success", data: results });
      }
    }
  );
};

export const DeliveryDetailofVendor = (req, res) => {
  const id = req.params.v_id;
  console.log("fsddfdfsfds", id);
  const sql =
    "SELECT * FROM order_management where v_id = ? and (order_status = ? or order_status = ? or order_status = ?)";
  db.query(sql, [id, "Approved", "Picked-up", "Delivered"], (err, results) => {
    if (err) {
      console.log(`error in delevery  detail of vendor Id ${id}`, err);
      res.status(500).json({
        message: `error in delevery  detail of vendor Id ${id}`,
        Error: err,
      });
    } else {
      return res.status(200).json({ message: "success", data: results });
    }
  });
};

export const vendorOrderHistory = (req, res) => {
  const id = req.params.v_id;
  const sql =
    "SELECT * FROM order_management where v_id = ? and order_status = ? or order_status = ?";
  db.query(sql, [id, "Completed", "Rejected"], (err, results) => {
    if (err) {
      console.log(
        `error in vendor Order History  detail of vendor Id ${id}`,
        err
      );
      res.status(500).json({
        message: `error in vendor Order History    detail of vendor Id ${id}`,
        Error: err,
      });
    } else {
      return res.status(200).json({ message: "success", data: results });
    }
  });
};

export const AddTransition = (req, res) => {
  const id = req.params.order_id; // Order ID
  const { transitionId, supplyid } = req.body; // Transition ID and Supply ID

  const updateOrderSQL = `
    UPDATE order_management 
    SET transition_id = ?, order_status = 'Completed', payment = 'Paid' 
    WHERE order_id = ?;
  `;
  const fetchOrdersForSupplySQL = `
    SELECT order_status FROM order_management WHERE s_id = ?;
  `;
  const updateSupplyStatusSQL = `
    UPDATE supply SET s_status = ? WHERE s_id = ?;
  `;

  // Step 1: Update the order with the transition ID, set status to 'Completed' and payment to 'Paid'
  db.query(updateOrderSQL, [transitionId, id], (err, results) => {
    if (err) {
      console.error("Error in adding transition ID", err);
      return res
        .status(500)
        .json({ message: "Error in adding transition ID", Error: err });
    }

    // Step 2: Fetch all orders for the given supply to analyze their statuses
    db.query(fetchOrdersForSupplySQL, [supplyid], (err, orderStatuses) => {
      if (err) {
        console.error(`Error fetching orders for Supply ID ${supplyid}`, err);
        return res.status(500).json({ message: "Error fetching orders", Error: err });
      }

      const statusCounts = orderStatuses.reduce(
        (acc, order) => {
          if (order.order_status === 'Completed') acc.completed++;
          if (order.order_status === 'Rejected') acc.rejected++;
          return acc;
        },
        { completed: 0, rejected: 0 }
      );

      let newSupplyStatus;
      if (statusCounts.completed > 0 && statusCounts.rejected > 0) {
        newSupplyStatus = 'partial completed'; // Few completed, rest rejected
      } else if (statusCounts.completed === orderStatuses.length) {
        newSupplyStatus = 'completed'; // All orders completed
      } else if (statusCounts.rejected === orderStatuses.length) {
        newSupplyStatus = 'rejected'; // All orders rejected
      } else {
        newSupplyStatus = 'pending'; // Fallback for mixed states
      }

      // Step 3: Update the supply status based on the analyzed statuses
      db.query(updateSupplyStatusSQL, [newSupplyStatus, supplyid], (err, supplyUpdateResults) => {
        if (err) {
          console.error(`Error updating supply status for Supply ID ${supplyid}`, err);
          return res
            .status(500)
            .json({ message: "Error updating supply status", Error: err });
        }

        return res.status(200).json({
          message: `Transition ID saved and Supply status set to ${newSupplyStatus}`,
          orderData: results,
          supplyData: supplyUpdateResults,
        });
      });
    });
  });
};

