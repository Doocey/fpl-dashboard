import { connectToDatabase } from "./mongodb";
import { getDatabasePrices } from "./getDatabasePrices";
import { getLivePlayerPrices } from "./getLivePlayerPrices";
const { MONGODB_PRICE_COLLECTION } = process.env;
const { db } = await connectToDatabase();

export async function getNewPlayers() {
  try {
    // Grab live prices & stored prices to compare against
    const live_players = await getLivePlayerPrices();
    const db_players = await getDatabasePrices();

    const idsOfLivePlayers = live_players.map(
      ({ id, first_name, second_name, now_cost, web_name }) => ({
        _id: id,
        first_name,
        second_name,
        web_name,
        price: now_cost
      })
    );

    const idsOfDbPlayers = db_players.map(({ _id }) => _id);

    const newlyAddedPlayers = idsOfLivePlayers.filter(
      (player) => !idsOfDbPlayers.includes(player._id)
    );

    if (newlyAddedPlayers.length) {
      await db.collection(MONGODB_PRICE_COLLECTION).insertMany(newlyAddedPlayers);

      return `${newlyAddedPlayers.length} newly added`;
    } else {
      return "No new players to be added";
    }
  } catch (error) {
    return "Something went wrong";
  }
}
