const { FPL_API_URI } = process.env;

export async function getLivePlayerPrices() {
  try {
    const response = await fetch(FPL_API_URI, {
      method: "GET",
      headers: {
        "User-Agent": "FPL-Dev-Test-Please"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.elements;
  } catch (error) {
    console.error("Failed to fetch live player prices:", error);
    return null;
  }
}
