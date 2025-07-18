import { TwitterApi } from "twitter-api-v2";

export async function twitterPost(posts) {
  try {
    const twitterClient = new TwitterApi({
      appKey: process.env.TWITTER_CONSUMER_KEY,
      appSecret: process.env.TWITTER_CONSUMER_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    });

    const tweets = await twitterClient.v2.tweetThread(posts);

    return tweets;
  } catch (error) {
    return error;
  }
}
