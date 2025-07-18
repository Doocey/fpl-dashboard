/**
 * 1. Grabs recent price changers from MongoDB Collection
 * 2. Generate social posts for the supplied social platform, recursively, to allow for threaded tweets,
 * TODO: Clean up further
 */

import { connectToDatabase } from "./mongodb";
import { blueskyPost } from "./bluesky";
import { twitterPost } from "./twitter";
import { sortPlayers, generateSocialPosts, formatSocialPosts } from "./helpers";

const socialPlatform = {
  BLUESKY: blueskyPost,
  TWITTER: twitterPost
};

export async function postPriceChanges(social) {
  try {
    // Grab the social platform we are to post to
    const postToSocial = socialPlatform[social];

    if (!postToSocial) return "Invalid social platform";

    const { db } = await connectToDatabase();

    // Look up Price Changes Collection by current date, if it returns empty, exit
    const dailyChange = await db
      .collection(process.env.MONGODB_PRICE_CHANGES_COLLECTION)
      .findOne({ date: new Date().toDateString() }, { sort: { _id: -1 } });

    if (!dailyChange) return "No price changes today";

    const { fallers, risers } = dailyChange;

    const fallersToPost = sortPlayers(fallers);
    const risersToPost = sortPlayers(risers);

    const prefixLength = 58;
    const postCharLimit = 280 - prefixLength;

    const posted = [];

    // Send off Price Risers & Fallers, if there's any of them!
    if (fallersToPost.length) {
      const posts = formatSocialPosts(
        generateSocialPosts(fallersToPost, postCharLimit),
        "Fallers"
      );

      const result = await postToSocial(posts);
      posted.push({ [social]: result });
    }

    if (risersToPost.length) {
      const posts = formatSocialPosts(
        generateSocialPosts(risersToPost, postCharLimit),
        "Risers"
      );

      const result = await postToSocial(posts);
      posted.push({ [social]: result });
    }

    return posted;
  } catch (error) {
    return error;
  }
}
