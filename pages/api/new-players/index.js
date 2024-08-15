/**
 * Get newly added players to the game
 **/
import { getNewPlayers } from "../../../util/getNewPlayers";

export default async (req, res) => {
  const new_players = await getNewPlayers();
  try {
    res.status(200).json({ status: new_players });
  } catch (error) {
    res.status(404).send(error);
  }
};
