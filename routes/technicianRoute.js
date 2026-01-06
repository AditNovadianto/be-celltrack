import express from "express";
import {
  getAllTechnicians,
  signInTechnician,
  signUpTechnician,
} from "../controllers/technicianController.js";

const router = express.Router();

router.post("/signUpTechnicians", signUpTechnician);
router.post("/signInTechnicians", signInTechnician);
router.get("/getAllTechnicians", getAllTechnicians);

export default router;
