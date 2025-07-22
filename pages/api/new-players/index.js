/**
 * Get newly added players to the game
 **/
import { getNewPlayers } from "@/util/getNewPlayers";

export default async (req, res) => {
  // Peform some basic auth before executing
  const secret = req.headers["x-webhook-secret"];

  if (!secret || secret !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const newPlayers = await getNewPlayers();
    res.status(200).json({ status: newPlayers });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
