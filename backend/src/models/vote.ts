import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
  pollId: { type: mongoose.Schema.Types.ObjectId, ref: "Poll", required: true },
  studentId: { type: String, required: true },
  optionIndex: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

voteSchema.index({ pollId: 1, studentId: 1 }, { unique: true });

export const Vote = mongoose.model("Vote", voteSchema);
export type VoteDoc = mongoose.InferSchemaType<typeof voteSchema> & mongoose.Document;
