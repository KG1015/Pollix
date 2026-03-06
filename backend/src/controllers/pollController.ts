import type { Request, Response } from "express";
import * as PollService from "../services/PollService.js";

export async function getState(_req: Request, res: Response) {
  try {
    const poll = PollService.getActivePollState();
    const remaining = PollService.getRemainingSecondsForActive();
    res.json({ poll, remainingSeconds: remaining });
  } catch (e) {
    res.status(500).json({ error: "Failed to get state" });
  }
}

export async function getHistory(_req: Request, res: Response) {
  try {
    const history = await PollService.getPollHistory();
    res.json(history);
  } catch (e) {
    res.status(500).json({ error: "Failed to get history" });
  }
}
