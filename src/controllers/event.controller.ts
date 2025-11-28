import { Request, Response } from "express";
import dayjs from "../config/time.js";
import { Event } from "../models/event.model.js";
import { EventUpdateLog } from "../models/eventUpdateLog.model.js";

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { userId, createdBy, timezone, startUtc, endUtc } = req.body;
    console.log('Received request body:', req.body);

    if(!userId || !Array.isArray(userId) || userId.length === 0) {
      return res.status(400).json({ message: "userId is required and must be a non-empty array" });
    }
    
    if(!createdBy) {
      return res.status(400).json({ message: "createdBy is required" });
    }
    
    if(!timezone || !startUtc || !endUtc) {
      return res.status(400).json({ message: "timezone, startUtc, and endUtc are required" });
    }

    const startUtcDate = dayjs.tz(startUtc, timezone).utc().toDate();
    const endUtcDate = dayjs.tz(endUtc, timezone).utc().toDate();

    if (endUtcDate <= startUtcDate) {
      return res
        .status(400)
        .json({ message: "End time must be after start time" });
    }

    const event = await Event.create({
      userId,
      createdBy,
      timezone,
      startTime: startUtcDate,
      endTime: endUtcDate,
    });

    res.status(201).json({
      id: event._id,
      userId: event.userId,
      timezone: event.timezone,
      startUtc: event.startTime,
      endUtc: event.endTime,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.find({}).lean();
    
    // Transform to include both UTC and original timezone times
    const transformedEvents = events.map(event => ({
      id: event._id,
      userId: event.userId,
      timezone: event.timezone,
      startUtc: event.startTime,
      endUtc: event.endTime,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    }));
    
    res.status(200).json(transformedEvents);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { userId, startUtc, endUtc, timezone, changedBy } = req.body;
    
    console.log('Update event request:', req.body);

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const oldEvent = event.toObject() as Record<string, any>;
    let tzForParsing = event.timezone;
    if (timezone) {
      event.timezone = timezone;
      tzForParsing = timezone;
    }

    if (startUtc && endUtc) {
      const startUtcDate = dayjs.tz(startUtc, tzForParsing).utc().toDate();
      const endUtcDate = dayjs.tz(endUtc, tzForParsing).utc().toDate();

      if (endUtcDate <= startUtcDate) {
        return res
          .status(400)
          .json({ message: "End time must be after start time" });
      }
      event.startTime = startUtcDate;
      event.endTime = endUtcDate;
    }

    if (userId) {
      event.userId = userId;
    }

    event.updatedAt = new Date();
    await event.save();

    const changes: Array<{ field: string; oldValue: any; newValue: any }> = [];
    let fieldsToCheck = ["userId", "startTime", "endTime", "timezone"] as const;

    fieldsToCheck.forEach((field) => {
      const oldValue = oldEvent[field];
      const newValue = (event as any)[field];
      // Convert to string for comparison if they're objects or dates
      const oldStr = JSON.stringify(oldValue);
      const newStr = JSON.stringify(newValue);
      
      if (oldStr !== newStr) {
        changes.push({ field, oldValue, newValue });
      }
    });

    if (changes.length > 0) {
      await EventUpdateLog.create({
        eventId: event._id,
        changedBy,
        changedAt: new Date(),
        changes,
      });
    }

    res.status(200).json({
      id: event._id,
      userId: event.userId,
      timezone: event.timezone,
      startUtc: event.startTime,
      endUtc: event.endTime,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getEventLogs = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;

    const logs = await EventUpdateLog.find({ eventId }).populate('changedBy', 'name').lean();
    
    // Transform logs to match frontend expectations
    const transformedLogs = logs.map(log => ({
      _id: log._id,
      eventId: log.eventId,
      changedBy: log.changedBy,
      changedAt: log.changedAt,
      changedAtUtc: log.changedAt,
      changes: log.changes,
    }));
    
    res.status(200).json(transformedLogs);
  } catch (error) {
    console.error("Error fetching event logs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
