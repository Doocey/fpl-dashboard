import { connectToDatabase } from "./mongodb";
import { getDatabasePrices } from "./getDatabasePrices";
import { getLivePlayerPrices } from "./getLivePlayerPrices";

const { MONGODB_PRICE_COLLECTION } = process.env;

export async function getNewPlayers() {
  try {
    const { db } = await connectToDatabase();
    // Grab live prices & stored prices to compare against
    const live_players = await getLivePlayerPrices();
    const db_players = await getDatabasePrices();

    const ids_of_live_players = live_players.map(
      ({ id, first_name, second_name, now_cost, web_name }) => ({
        _id: id,
        first_name,
        second_name,
        web_name,
        price: now_cost
      })
    );

    const ids_of_db_players = db_players.map(({ _id }) => _id);

    const newly_added_players = ids_of_live_players.filter(
      (player) => !ids_of_db_players.includes(player._id)
    );

    if (newly_added_players.length) {
      await db
        .collection(TEST_MONGODB_PRICE_COLLECTION)
        .insertMany(newly_added_players);

      return `${newly_added_players.length} newly added`;
    } else {
      return "No new players to be added";
    }
  } catch (error) {
    return "Something went wrong";
  }
}
