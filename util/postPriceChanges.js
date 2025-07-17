/**
 * 1. Grabs recent price changers from MongoDB Collection
 * 2. Generate social posts for the supplied social platform, recursively, to allow for threaded tweets,
 * TODO: Clean up further
 */

import { connectToDatabase } from "./mongodb";
import { blueskyPost } from "./bluesky";
import { sortPlayers, generateSocialPosts, formatSocialPosts } from "./helpers";
import dummyData from "../dummy-changes.json";

const socialPlatform = {
  BLUESKY: blueskyPost
};

export async function postPriceChanges(social) {
  try {
    // const { db } = await connectToDatabase();

    if (!socialPlatform[social]) return "Invalid social platform";

    // Look up Price Changes Collection by current date, if it returns empty, exit
    const daily_changes = dummyData[0];

    if (daily_changes.length === 0) return "No price changes today";

    const { fallers, risers } = dummyData[6];

    const fallersToPost = sortPlayers(fallers);
    const risersToPost = sortPlayers(risers);

    const prefixLength = 58;
    const postCharLimit = 280 - prefixLength;

    const posted = [];

    // Grab the social platform we are to post to
    const postToSocial = socialPlatform[social];

    // Send off Price Risers & Fallers, if there's any of them!
    if (fallersToPost.length) {
      const posts = formatSocialPosts(
        generateSocialPosts(fallersToPost, postCharLimit),
        "Fallers"
      );

      if (postToSocial) {
        console.log(`[FALLERS] Attempting to post to ${social}`, posts);
        const result = await postToSocial(posts);
        posted.push({ [social]: result });
      }
    }

    if (risersToPost.length) {
      const posts = formatSocialPosts(
        generateSocialPosts(risersToPost, postCharLimit),
        "Risers"
      );

      if (postToSocial) {
        console.log(`[RISERS] Attempting to post to ${social}`, posts);
        const result = await postToSocial(posts);
        posted.push({ [social]: result });
      }
    }

    return posted;
  } catch (error) {
    return error;
  }
}
