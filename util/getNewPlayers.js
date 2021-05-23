import { connectToDatabase } from './mongodb'
import { getDatabasePrices } from './getDatabasePrices'
import { getLivePlayerPrices } from './getLivePlayerPrices'
const { MONGODB_PRICE_COLLECTION } = process.env

export async function getNewPlayers() {
    // Grab live prices & stored prices to compare against
    const { db } = await connectToDatabase();
    const live_players = await getLivePlayerPrices()
    const db_players = await getDatabasePrices()
    let status;

    try {
        // Compare both arrays of players, and see if there's differences.
        // May or may not have been taking directly from Stackoverflow :P 
        const new_player = live_players.filter(({ id: id1 }) => !db_players.some(({ _id: id2 }) => id2 === id1));

        if(!new_player.length === 0) {
            for await (const player of new_player) {
                await db.collection(MONGODB_PRICE_COLLECTION).insertOne({
                    _id: player.id,
                    first_name: player.first_name,
                    second_name: player.second_name, 
                    web_name: player.web_name,
                    price: player.now_cost
                })     
            }
            status = `${new_player.length} new player added`;
        } else {
            status = 'No new players to be added'
        }
        return status        
    } catch (error) {
        console.log('Something went wrong')
        return error
    }
};
