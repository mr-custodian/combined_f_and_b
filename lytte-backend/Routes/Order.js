import express from "express";

import {
  addorder,
  allorder,
  requirementOrder,
  deleteOrder,
  DeliveryAgentAssign,
  ChangeStatus,
  ChangePaymentStatus,
  requrementPaymentStatus,
  vendorOrderHistory,
  getallorderhistory,
  orderDetailById,
  DeliveryDetailofVendor,
  RemoveAgent,
  requiretOrder,
  AddTransition,
  completedorder,
  noncompleteorder,
  requireOrder,
} from "../Controller/Order.js";

const router = express.Router();
import { verifyToken } from "../middleware/authorizationMiddleware.js";

router.post("/add-order", addorder);
router.get("/delivery-detail/:v_id", DeliveryDetailofVendor);
// ,verifyToken(['dashboardUser','vendor'])
router.get(
  "/vendor-order-history/:v_id",
  verifyToken(["dashboardUser", "vendor"]),
  vendorOrderHistory
);
// verifyToken(['dashboardUser','vendor']),
router.get("/get-approve-order", allorder);
router.get("/get-order-history", completedorder);
router.get("/get-current-order", noncompleteorder);
router.get("/get-requirement-order/:id", requirementOrder);
router.get("/get-require-order/:id", requiretOrder);
router.get("/get-required-order/:id", requireOrder);
router.get("/get-order-detail/:orderedId", orderDetailById);
router.delete("/delete/:id", deleteOrder);
router.patch("/assign-deleveryagent/:id", DeliveryAgentAssign);
router.post("/remove-agent/:id", RemoveAgent);
router.patch("/changestatus/:id", ChangeStatus);
router.put("/payment/:id", ChangePaymentStatus);
router.get(
  "/requrement-payment-status/:requirement_id",
  requrementPaymentStatus
);
router.get("/get-order-history", getallorderhistory);
router.patch("/add-transitionId/:order_id", AddTransition);
// ,verifyToken(['dashboardUser','vendor'])
export default router;
