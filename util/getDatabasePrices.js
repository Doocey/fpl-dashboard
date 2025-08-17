import { connectToDatabase } from "@/util/mongodb";

const { MONGODB_PRICE_COLLECTION } = process.env;

export async function getDatabasePrices() {
  const { db } = await connectToDatabase();
  if (connectToDatabase) {
    try {
      const players = await db
        .collection(MONGODB_PRICE_COLLECTION)
        .find()
        .toArray();
      return players;
    } catch (error) {
      console.log("Something went wrong", error);
    }
  }
}
