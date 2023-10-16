/**
 * 1. Grabs recent price changers from MongoDB Collection
 * 2. Loops through and composes Tweet string to be sent only if there are either risers/fallers
 * 3. trycatch attempts tweeting out the string, otherwise catches error
 * TODO: Can I clean this up futher and optimize the execution?
 */

import { TwitterApi } from 'twitter-api-v2';
import { connectToDatabase } from './mongodb'

const {
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_TOKEN_SECRET,
  MONGODB_PRICE_CHANGES_COLLECTION
} = process.env

const twitterClient = new TwitterApi({
  appKey: TWITTER_CONSUMER_KEY,
  appSecret: TWITTER_CONSUMER_SECRET,
  accessToken: TWITTER_ACCESS_TOKEN,
  accessSecret: TWITTER_ACCESS_TOKEN_SECRET,
});

export async function tweetPriceChanges() {
  try {
    const { db } = await connectToDatabase();

    let tweet_string_fallers = ''
    let tweet_string_risers = ''

    // Look up Price Changes Collection by current date, if it returns empty, exit
    const daily_changes = await db.collection(MONGODB_PRICE_CHANGES_COLLECTION)
      .find({
        date: new Date().toDateString()
      })
      .limit(1)
      .sort({ _id: -1 })
      .toArray()

    if (daily_changes.length === 0) return 'No price changes today'

    daily_changes.forEach(dc => {
      dc.fallers
        ? dc.fallers
          .forEach(f => tweet_string_fallers += `\n${f.short_name} - £${(f.new_price / 10).toFixed(1)}m 🔻`)
        : ''
      dc.risers
        ? dc.risers
          .forEach(r => tweet_string_risers += `\n${r.short_name} - £${(r.new_price / 10).toFixed(1)}m 🔼`)
        : ''
    })

    // Send off Price Risers & Fallers, if there's any of them!
    if (tweet_string_fallers.length > 0) {
      tweet_string_fallers = '#FPL Price Fallers: \n' + tweet_string_fallers + '\n\n#FPLPriceChanges #FPLCommunity #FPL'

      var tweetedFallers = await twitterClient.v2.tweet({
        text: tweet_string_fallers,
      });
    }

    if (tweet_string_risers.length > 0) {
      tweet_string_risers = '#FPL Price Risers: \n' + tweet_string_risers + '\n\n#FPLPriceChanges #FPLCommunity #FPL'

      var tweetedRisers = await twitterClient.v2.tweet({
        text: tweet_string_risers,
      });
    }
    /** TODO: Can I optimize this code to be more efficient? */
    return [tweetedFallers, tweetedRisers]
  } catch (error) {
    return error
  }
}