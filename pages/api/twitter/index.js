/**
 * Grab latest player price prices from our DB & send back to client as JSON
 * Accesible via `/api/changes/` - returns list of 7 items from stored changes DB collection
*/
import { tweetPriceChanges } from '../../../util/postPriceChangeTweet'

export default async (req, res) => {
    await tweetPriceChanges()
    try {
        res.status(200).send('Tweet Attempted')
    } catch (error) {
        res.status(404).json({found: 'Nothing at all!'})
    }
};