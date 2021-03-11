/**
 * 1. Grabs recent price changers from MongoDB Collection
 * 2. Loops through and composes Tweet string to be sent only if there are either risers/fallers
 * 3. trycatch attempts tweeting out the string, otherwise catches error
 */

import { TwitterClient } from 'twitter-api-client'
import { connectToDatabase } from './mongodb'

const { TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET, MONGODB_PRICE_CHANGES_COLLECTION } = process.env

const twitterClient = new TwitterClient({
  apiKey: TWITTER_CONSUMER_KEY,
  apiSecret: TWITTER_CONSUMER_SECRET,
  accessToken: TWITTER_ACCESS_TOKEN,
  accessTokenSecret: TWITTER_ACCESS_TOKEN_SECRET
})

export async function tweetPriceChanges() {

    var tweet_string_fallers = ''
    var tweet_string_risers = ''

    const { db } = await connectToDatabase();
    const daily_changes = await db.collection(MONGODB_PRICE_CHANGES_COLLECTION)
        .find({})
        .limit(1)
        .sort({_id: -1})
        .toArray()
  
    daily_changes.forEach(dc => {
      dc.fallers 
        ? dc.fallers.forEach(fl => tweet_string_fallers += `\n${fl.short_name} - £${(fl.new_price / 10).toFixed(1)}m 🔻`)
        : ''
      dc.risers 
        ? dc.risers.forEach(fl => tweet_string_risers += `\n${fl.short_name} - £${(fl.new_price / 10).toFixed(1)}m 💚`)
        : ''
    })

    if(tweet_string_fallers.length > 0) {
      tweet_string_fallers = 'Price Fallers: \n' + tweet_string_fallers + '\n\n#FPLPriceChanges'
      console.log(tweet_string_fallers)
    }

    if(tweet_string_risers.length > 0) {
      tweet_string_risers = 'Price Risers: \n' + tweet_string_risers + '\n\n#FPLPriceChanges'
      console.log(tweet_string_risers)
    }
    
    try {
      // Send off Price Risers & Fallers, if there's any of them!
      const tweetedFallers = await twitterClient.tweets.statusesUpdate({ status: tweet_string_fallers });
      const tweetedRisers = await twitterClient.tweets.statusesUpdate({ status: tweet_string_risers });
      return [tweetedFallers, tweetedRisers]
    } catch (error) {
      console.log(error.data)
    }
}