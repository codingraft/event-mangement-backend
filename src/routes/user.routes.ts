import express from "express";
import { createProfile, getProfile, getProfiles } from "../controllers/profile.controller.js";
const router = express.Router();


router.post("/", createProfile); 
router.get("/:name", getProfile);
router.get("/", getProfiles);

export default router;