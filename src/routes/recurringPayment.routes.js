import { Router } from "express";
import {
  createRecurringPayment,
  getAllRecurringPayments,
  getRecurringPaymentById,
  updateRecurringPayment,
  deleteRecurringPayment
} from "../controllers/recurringPayment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// All routes are protected
router.use(verifyJWT);

router.route("/")
  .post(createRecurringPayment)
  .get(getAllRecurringPayments);

router.route("/:id")
  .get(getRecurringPaymentById)
  .patch(updateRecurringPayment)
  .delete(deleteRecurringPayment);

export default router;
