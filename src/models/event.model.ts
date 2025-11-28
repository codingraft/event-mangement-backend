import mongoose from "mongoose";

export interface IEvent extends mongoose.Document {
    userId: mongoose.Types.ObjectId[];
    createdBy: mongoose.Types.ObjectId;
    timezone: string;
    startTime: Date;
    endTime: Date;
    createdAt: Date;
    updatedAt: Date;
}

const eventSchema = new mongoose.Schema<IEvent>({
    userId: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    timezone: { type: String, default: "UTC" },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    createdAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, default: () => new Date() },
});

export const Event = mongoose.model<IEvent>("Event", eventSchema);