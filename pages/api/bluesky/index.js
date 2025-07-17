/**
 * Endpoint to hit to post price changes to Bluesky, if there are any.
 * Hit by cron job to automate it
 */

export default async (req, res) => {
  // Peform some basic auth before executing
  const secret = req.headers["x-webhook-secret"];

  if (!secret || secret !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    res.status(200).send("Hello, Bluesky");
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
