/**
 * 1. Grabs recent price changers from MongoDB Collection
 * 2. Form tweets, recursively, to allow for threaded tweets,
 * TODO: Clean up further
 */

import { TwitterApi } from "twitter-api-v2";
import { connectToDatabase } from "./mongodb";

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_CONSUMER_KEY,
  appSecret: process.env.TWITTER_CONSUMER_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

export async function tweetPriceChanges() {
  try {
    const { db } = await connectToDatabase();

    // Look up Price Changes Collection by current date, if it returns empty, exit
    const daily_changes = await db
      .collection(process.env.MONGODB_PRICE_CHANGES_COLLECTION)
      .find({
        date: new Date().toDateString()
      })
      .limit(1)
      .sort({ _id: -1 })
      .toArray();

    if (daily_changes.length === 0) return "No price changes today";

    const { fallers, risers } = daily_changes[0];

    const sort_players = (players) =>
      players
        .sort((a, b) => b.new_price - a.new_price)
        .map(
          ({ short_name, new_price, old_price }) =>
            `\n${short_name} - £${(new_price / 10).toFixed(1)}m ${
              new_price > old_price ? "⬆️" : "🔻"
            }`
        );

    const fallers_to_tweet = sort_players(fallers);
    const risers_to_tweet = sort_players(risers);

    const prefix_length = 58;
    const tweet_char_limit = 280 - prefix_length;

    const tweeted = [];

    // Function to split into multiple tweets / twitter thread if needed
    const generate_tweets = (price_movers) => {
      const combine = (price_movers, current_string = "") => {
        if (price_movers.length === 0) return [current_string];

        const current_word = price_movers[0];
        const remaining_words = price_movers.slice(1);

        // If many price movers, we need separate tweets to show them all
        if (current_string.length + current_word.length <= tweet_char_limit) {
          const tweet_string = current_string + current_word;
          const remaining_combinations = combine(remaining_words, tweet_string);
          return remaining_combinations;
        } else {
          return [current_string, ...combine(remaining_words, current_word)];
        }
      };

      return combine(price_movers);
    };

    // Send off Price Risers & Fallers, if there's any of them!
    if (fallers_to_tweet.length) {
      const tweets = generate_tweets(fallers_to_tweet)?.map((item, index) => {
        return index === 0
          ? `#FPL Price Fallers: \n${item}\n\n#FPLPriceChanges #FPLCommunity #FPL`
          : `#FPL Price Fallers (continued): \n${item}\n\n#FPLPriceChanges`;
      });

      const tweeted_fallers = await twitterClient.v2.tweetThread(tweets);

      tweeted.push(tweeted_fallers);
    }

    if (risers_to_tweet.length) {
      const tweets = generate_tweets(risers_to_tweet)?.map((item, index) => {
        return index === 0
          ? `#FPL Price Risers: \n${item}\n\n#FPLPriceChanges #FPLCommunity #FPL`
          : `#FPL Price Risers (continued): \n${item}\n\n#FPLPriceChanges`;
      });

      const tweeted_risers = await twitterClient.v2.tweetThread(tweets);

      tweeted.push(tweeted_risers);
    }

    return tweeted;
  } catch (error) {
    return error;
  }
}
