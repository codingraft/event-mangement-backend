import express from "express";
import { createEvent, getEventLogs, getEvents, updateEvent } from "../controllers/event.controller.js";
const router = express.Router();

router.post('/', createEvent);
router.get('/', getEvents);
router.put('/:eventId', updateEvent);
router.get('/:eventId/logs', getEventLogs); 


export default router;