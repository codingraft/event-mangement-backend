import { User } from "../models/user.model.js";
import { Request, Response } from "express";

export const createProfile = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const user = await User.findOne({ name });
        if (user) {
            return res.status(409).json({ message: "Profile already exists" });
        }
 
        const newUser = await User.create({ name });
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error creating profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getProfiles = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching profiles:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getProfile = async (req: Request, res: Response) => {
    try {
        const { name } = req.params;
        const user = await User.findOne({ name });
        if (!user) {
            return res.status(404).json({ message: "Profile not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
} 