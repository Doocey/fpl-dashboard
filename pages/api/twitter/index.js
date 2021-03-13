/**
 * Endpoint to hit to tweet out price changes, if there are any.
 * Hit by cron job to automate it
*/

import { tweetPriceChanges } from '../../../util/postPriceChangeTweet'

export default async (req, res) => {
    await tweetPriceChanges()
    try {
        res.status(200).send('Tweet Attempted')
    } catch (error) {
        res.status(404).json({ found: 'Nothing at all!' })
    }
};