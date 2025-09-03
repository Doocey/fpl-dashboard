import { connectToDatabase } from "./mongodb";
import { getLivePlayerPrices } from "./getLivePlayerPrices";

const { MONGODB_PRICE_COLLECTION, MONGODB_PRICE_CHANGES_COLLECTION } =
  process.env;

export async function getPriceChanges({ showHistorical = false } = {}) {
  try {
    const [livePlayers, { db }] = await Promise.all([
      getLivePlayerPrices(),
      connectToDatabase()
    ]);

    // Filter players with recent price changes
    const playersWithChanges = livePlayers.filter(
      (player) =>
        player.cost_change_event > 0 || player.cost_change_event_fall > 0
    );

    if (playersWithChanges.length === 0) {
      // If showHistorical is true, return 7 day data (used in price-changes page); otherwise return []
      if (showHistorical) {
        return await db
          .collection(MONGODB_PRICE_CHANGES_COLLECTION)
          .find()
          .sort({ _id: -1 })
          .limit(7)
          .toArray();
      }
      return "No price changes today";
    }

    // Get database players
    const dbPlayers = await db
      .collection(MONGODB_PRICE_COLLECTION)
      .find({
        _id: { $in: playersWithChanges.map((player) => player.id) }
      })
      .toArray();

    // Create lookup map for performance gain
    const playerMap = new Map(dbPlayers.map((player) => [player._id, player]));

    // Find players needing updates
    const playersToUpdate = playersWithChanges.filter((player) => {
      const dbPlayer = playerMap.get(player.id);
      return dbPlayer && player.now_cost !== dbPlayer.price;
    });

    if (playersToUpdate.length > 0) {
      const risers = [];
      const fallers = [];

      // Categorize price changes
      for (const player of playersToUpdate) {
        const dbPlayer = playerMap.get(player.id);

        const priceChange = {
          id: player.id,
          first_name: player.first_name,
          second_name: player.second_name,
          short_name: player.web_name,
          old_price: dbPlayer.price,
          new_price: player.now_cost,
          percentage_ownership: player.selected_by_percent
        };

        player.now_cost > dbPlayer.price
          ? risers.push(priceChange)
          : fallers.push(priceChange);
      }

      // Update DB prices
      await db.collection(MONGODB_PRICE_COLLECTION).bulkWrite(
        playersToUpdate.map((player) => ({
          updateOne: {
            filter: { _id: player.id },
            update: { $set: { price: player.now_cost } }
          }
        }))
      );

      // Record price changes
      await db.collection(MONGODB_PRICE_CHANGES_COLLECTION).insertOne({
        date: new Date().toDateString(),
        risers,
        fallers
      });
    }

    // Return recent changes (7days of records if called via price-changes page, 1 if called via API)
    return await db
      .collection(MONGODB_PRICE_CHANGES_COLLECTION)
      .find()
      .sort({ _id: -1 })
      .limit(showHistorical ? 7 : 1)
      .toArray();
  } catch (error) {
    console.error("Error in getPriceChanges:", error);
    throw error;
  }
}
