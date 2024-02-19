/**
 * Endpoint to hit to tweet out price changes, if there are any.
 * Hit by cron job to automate it
 */
import { tweetPriceChanges } from "../../../util/postPriceChangeTweet";

export default async (req, res) => {
  try {
    const tweets = await tweetPriceChanges();
    res.status(200).send(tweets);
  } catch (error) {
    res.status(404).json({ found: "Nothing at all!" });
  }
};
