import { connectToDatabase } from "./mongodb";
import { getDatabasePrices } from "./getDatabasePrices";
import { getLivePlayerPrices } from "./getLivePlayerPrices";

const { MONGODB_PRICE_COLLECTION } = process.env;

export async function getNewPlayers() {
  try {
    const { db } = await connectToDatabase();
    const livePlayers = await getLivePlayerPrices();
    const dbPlayers = await getDatabasePrices();

    // Use a Set for faster lookups
    const dbIds = new Set(dbPlayers.map(({ _id }) => _id));

    // Filter and map only new players
    // TODO: Potentially extend this call to also store updated players (EPL -> EPL transfer deals)
    const newPlayers = livePlayers
      .filter(({ id }) => !dbIds.has(id))
      .map(({ id, first_name, second_name, now_cost, web_name, team }) => ({
        _id: id,
        first_name,
        second_name,
        web_name,
        price: now_cost,
        team_id: team
      }));

    if (newPlayers.length === 0) return "No new players to be added";

    // Insert new players into the DB
    await db.collection(MONGODB_PRICE_COLLECTION).insertMany(newPlayers);

    const playerNames = newPlayers.map(({ web_name }) => web_name).join(", ");

    return `${newPlayers.length} newly added: [${playerNames}]`;
  } catch (error) {
    console.error("Error in getNewPlayers:", error);
    throw error;
  }
}
