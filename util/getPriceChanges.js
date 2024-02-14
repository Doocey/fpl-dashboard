import { connectToDatabase } from "./mongodb";
import { getLivePlayerPrices } from "./getLivePlayerPrices";

const { MONGODB_PRICE_COLLECTION, MONGODB_PRICE_CHANGES_COLLECTION } =
  process.env;

export async function getPriceChanges() {
  try {
    const live_prices = await getLivePlayerPrices();
    const { db } = await connectToDatabase();

    // Players from API with recent price changes
    const players_with_changes = live_prices.filter(
      (player) =>
        player.cost_change_event > 0 || player.cost_change_event_fall > 0
    );

    // Crossmatch players_with_changes with players from our own DB
    const db_players = await db
      .collection(MONGODB_PRICE_COLLECTION)
      .find({
        _id: { $in: players_with_changes.map((player) => player.id) }
      })
      .toArray();

    // Players with changes that arent in sync with our DB
    const db_players_pending_change = players_with_changes.filter(
      ({ now_cost, id }) =>
        now_cost !== db_players.find(({ _id }) => _id === id)?.price
    );

    if (db_players_pending_change.length) {
      const risers = [];
      const fallers = [];

      db_players_pending_change.forEach((player) => {
        const single_player = db_players.find(({ _id }) => _id === player.id);

        if (
          player.now_cost > single_player.price ||
          player.now_cost < single_player.price
        ) {
          (player.now_cost > single_player.price ? risers : fallers).push({
            id: player.id,
            first_name: player.first_name,
            second_name: player.second_name,
            short_name: player.web_name,
            old_price: single_player.price,
            new_price: player.now_cost,
            percentage_ownership: player.selected_by_percent
          });
        }
      });

      // Update DB prices to reflect players new price, use bulkWrite for better perf
      await db
        .collection(MONGODB_PRICE_COLLECTION)
        .bulkWrite(
          db_players_pending_change.map(({ now_cost, id }) => {
            return {
              updateOne: {
                filter: { _id: id },
                update: { $set: { price: now_cost } }
              }
            };
          })
        )
        .catch((err) => err);

      // Add record in our daily changes table with any changes
      await db.collection(MONGODB_PRICE_CHANGES_COLLECTION).insertOne({
        _id: new Date(),
        date: new Date().toDateString(),
        fallers: fallers,
        risers: risers
      });
    }

    // Render the last 7 days of price changes
    const daily_changes = await db
      .collection(MONGODB_PRICE_CHANGES_COLLECTION)
      .find({})
      .limit(7)
      .sort({ _id: -1 })
      .toArray();

    return daily_changes;
  } catch (error) {
    return error;
  }
}
