import mongoose from "mongoose";

export interface IEventUpdateLog extends mongoose.Document {
    eventId: mongoose.Types.ObjectId;
    changedBy: mongoose.Types.ObjectId;
    changedAt: Date;
    changes: {
        field: string;
        oldValue: Object;
        newValue: Object;
    }[];
}

const changeSchema = new mongoose.Schema({
    field: String,
    oldValue: { type: mongoose.Schema.Types.Mixed, required: true },
    newValue: { type: mongoose.Schema.Types.Mixed, required: true },
}, { _id: false });

const eventUpdateLogSchema = new mongoose.Schema<IEventUpdateLog>({
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    changedAt: { type: Date, default: () => new Date() },
    changes: { type: [changeSchema], required: true },
});

export const EventUpdateLog = mongoose.model<IEventUpdateLog>("EventUpdateLog", eventUpdateLogSchema);