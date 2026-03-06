import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  voteCount: { type: Number, default: 0 },
});

const pollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [optionSchema],
  durationSeconds: { type: Number, required: true },
  startedAt: { type: Date, default: null },
  status: { type: String, enum: ["draft", "live", "ended"], default: "draft" },
  createdAt: { type: Date, default: Date.now },
});

export const Poll = mongoose.model("Poll", pollSchema);
export type PollDoc = mongoose.InferSchemaType<typeof pollSchema> & mongoose.Document;
