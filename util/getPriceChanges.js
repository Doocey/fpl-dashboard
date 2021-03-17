import { connectToDatabase } from './mongodb'
import { getLivePlayerPrices } from './getLivePlayerPrices'
import { getDatabasePrices } from './getDatabasePrices'
const { MONGODB_PRICE_CHANGES_COLLECTION, MONGODB_PRICE_COLLECTION } = process.env;

export async function getPriceChanges() {
    // Grab latest player prices from official FPL API
    const live_pp = await getLivePlayerPrices()
    // Grab stored DB player prices
    // const database_pp = await getDatabasePrices()
    // db connection
    const { db } = await connectToDatabase();

    /**
     * comparePrices() will be sent the latest official API prices and our stored DB prices.
     * We filter the live prices to only of those who 
     * have had a gameweek price change (cost_change_event / cost_change_event_fall)
     * Then compare the filtered array's players to that of our DB
     * If their prices are different, we put them in either risers[] or fallers[]
     * Then update our main 'prices' database with all fresh player prices
     * Finally, push date-stamped daily_changes (risers + fallers) to 'daily_changes' collection
     * and send back 7 entries from that collection to the API endpoint
     * TODO: Can I clean this up to have it more streamlined? Introduce caching?
     */

    async function comparePrices(live_pp) {

        // console.log('Database Size: ' + database_pp.length)
        // console.log('Live Size: ' + live_pp.length)

        // Track Price Changes of Risers & Fallers
        let risers = []
        let fallers = []

        const players_with_changes = live_pp.filter((player) => {
            return player.cost_change_event > 0 || player.cost_change_event_fall > 0
        })

        // Loop over them & check against our DB
        for (const player of players_with_changes) {

            const db_prices = await db.collection(MONGODB_PRICE_COLLECTION).find({ _id: player.id })

            for await (const db_player of db_prices) {

                if (player.now_cost > db_player.price) {
                    // console.log("We have a riser!", player.web_name)
                    risers.push({
                        id: player.id,
                        first_name: player.first_name,
                        second_name: player.second_name,
                        short_name: player.web_name,
                        old_price: db_player.price,
                        new_price: player.now_cost,
                        percentage_ownership: player.selected_by_percent,
                        photo: player.photo
                    })

                    // Update our own player DB with new price
                    await db.collection(MONGODB_PRICE_COLLECTION).updateOne(
                        { _id: player.id },
                        { $set: { price: player.now_cost } }
                    )

                } else if (player.now_cost < db_player.price) {
                    // console.log("We have a faller!", player.web_name)
                    fallers.push({
                        id: player.id,
                        first_name: player.first_name,
                        second_name: player.second_name,
                        short_name: player.web_name,
                        old_price: db_player.price,
                        new_price: player.now_cost,
                        percentage_ownership: player.selected_by_percent,
                        photo: player.photo
                    })
                    // Update our own player DB with new price
                    await db.collection(MONGODB_PRICE_COLLECTION).updateOne(
                        { _id: player.id },
                        { $set: { price: player.now_cost } }
                    )
                }
            }

        }

        /**
         * Insert two arrays, of the price rises, and falls
         * into our daily_changes collection with the _id as the date for later parsing
         */
        if (risers.length > 0 || fallers.length > 0) {
            // Risers
            // console.table(risers)
            // Fallers
            // console.table(fallers)

            await db.collection(MONGODB_PRICE_CHANGES_COLLECTION).insertOne({
                _id: new Date(),
                fallers: fallers,
                risers: risers
            })
        } else {
            console.log('No new price rises....seemingly!')
        }
    }

    // Run the Async function to carry out the checking, updating, and sending back to API
    await comparePrices(live_pp)

    /**
     * Pull the recently updated list of daily changes from DB
     * Then send it back to our res object for display by API endpoint
     */

    const daily_changes = await db.collection(MONGODB_PRICE_CHANGES_COLLECTION)
        .find({})
        .limit(7)
        .sort({ _id: -1 })
        .toArray()
    // Send JSON response back (which will be database value of players with changed price)    
    return daily_changes
};
