
import { getLivePlayerPrices } from '../../../util/getLivePlayerPrices'

export default async (req, res) => {
    // Grab latest player prices from official FPL API
    const live_pp = await getLivePlayerPrices()
    res.status(200).send(live_pp)
};


export const config = {
    api: {
        externalResolver: true,
    },
}
  