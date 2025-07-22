/**
 * Grab latest player price changes from our DB & send back to client as JSON
 * Accesible via `/api/changes/` - returns list of 7 items from stored changes DB collection
 */

import { getPriceChanges } from "@/util/getPriceChanges";

export default async (req, res) => {
  // Peform some basic auth before executing
  const secret = req.headers["x-webhook-secret"];

  if (!secret || secret !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const priceChanges = await getPriceChanges();
    res.status(200).json(priceChanges);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
