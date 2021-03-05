
/**
 * Grab latest player prices from official FPL API & send back to client as JSON
 * Accesible via `/api/changes/` - returns list of 7 items from stored changes DB collection
*/
import { getLivePlayerPrices } from '../../../util/getLivePlayerPrices'

export default async (req, res) => {
    try {
        const live_pp = await getLivePlayerPrices()
        res.status(200).send(live_pp)
    } catch (error) {
        res.status(404).json({found: 'Nothing found my good friend.'})
    }
};