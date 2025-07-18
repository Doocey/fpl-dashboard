// Sort players by price & indicate movement
export const sortPlayers = (players) =>
  players
    .sort((a, b) => b.new_price - a.new_price)
    .map(
      ({ short_name, new_price, old_price }) =>
        `\n${short_name} - £${(new_price / 10).toFixed(1)}m ${
          new_price > old_price ? "⬆️" : "🔻"
        }`
    );

export const generateSocialPosts = (priceMovers, postCharacterLimit) => {
  const combinePosts = (priceMovers, currentString = "") => {
    if (priceMovers.length === 0) return [currentString];

    const currentWord = priceMovers[0];
    const remainingWords = priceMovers.slice(1);

    // If many price movers, we need separate posts to show them all and allow for threading
    if (currentString.length + currentWord.length <= postCharacterLimit) {
      const tweetString = currentString + currentWord;
      const remainingCombinations = combinePosts(remainingWords, tweetString);
      return remainingCombinations;
    } else {
      return [currentString, ...combinePosts(remainingWords, currentWord)];
    }
  };

  return combinePosts(priceMovers);
};

// Denote threaded social posts with alternate prefix, if applicable
export const formatSocialPosts = (items, type) => {
  return items.map((item, index) =>
    index === 0
      ? `#FPL Price ${type}: \n${item}\n\n#FPLPriceChanges #FPLCommunity #FPL`
      : `#FPL Price ${type} (continued): \n${item}\n\n#FPLPriceChanges`
  );
};
