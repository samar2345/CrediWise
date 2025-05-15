import { Router } from "express";
import {
  createCreditReport,
  getUserCreditReports,
  getCreditReportById,
  deleteCreditReport
} from "../controllers/creditReport.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Protected routes – user must be logged in
router.route("/")
  .post(verifyJWT, createCreditReport)
  .get(verifyJWT, getUserCreditReports);

router.route("/:id")
  .get(verifyJWT, getCreditReportById)
  .delete(verifyJWT, deleteCreditReport);

export default router;
