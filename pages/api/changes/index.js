import { getPriceChanges } from '../../../util/getPriceChanges'

export default async (req, res) => {
    // Grab latest player prices from official FPL API
    const price_changes = await getPriceChanges();
    res.status(200).json(price_changes)
};