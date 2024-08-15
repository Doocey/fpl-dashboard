/**
 * Grab latest player price changes from our DB & send back to client as JSON
 * Accesible via `/api/changes/` - returns list of 7 items from stored changes DB collection
 */

import { getPriceChanges } from "../../../util/getPriceChanges";

export default async (req, res) => {
  try {
    const price_changes = await getPriceChanges();
    res.status(200).json(price_changes);
  } catch (error) {
    res.status(404).json({ found: "Nothing at all!" });
  }
};
