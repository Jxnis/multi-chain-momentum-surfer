import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const threshold = parseFloat(searchParams.get("threshold") || "5");
    const timeframe = searchParams.get("timeframe") || "24h";

    // Fetch real data from CoinGecko API
    const coingeckoUrl =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d";

    let response;
    try {
      response = await fetch(coingeckoUrl, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }
    } catch (fetchError) {
      console.error("Error fetching from CoinGecko:", fetchError);
      return NextResponse.json(
        {
          error: "Failed to fetch live market data. Please try again later.",
          fallback: "Using backup data source...",
        },
        { status: 503 }
      );
    }

    const marketData = await response.json();

    // Process the data to detect momentum
    const timeframeMappings: { [key: string]: string } = {
      "1h": "price_change_percentage_1h_in_currency",
      "24h": "price_change_percentage_24h_in_currency",
      "7d": "price_change_percentage_7d_in_currency",
    };

    const changeField =
      timeframeMappings[timeframe] || "price_change_percentage_24h_in_currency";

    const tokensWithMomentum = marketData
      .filter((coin: any) => {
        const change = coin[changeField];
        return change !== null && Math.abs(change) >= threshold;
      })
      .map((coin: any) => ({
        token: coin.symbol.toUpperCase(),
        name: coin.name,
        change24h: coin.price_change_percentage_24h || 0,
        change1h: coin.price_change_percentage_1h_in_currency || 0,
        change7d: coin.price_change_percentage_7d_in_currency || 0,
        price: coin.current_price,
        volume24h: coin.total_volume,
        marketCap: coin.market_cap,
        chains: getAvailableChains(coin.symbol.toUpperCase()),
        momentumScore: calculateMomentumScore(coin),
        trend: determineTrend(coin[changeField]),
      }))
      .sort((a: any, b: any) => b.momentumScore - a.momentumScore);

    return NextResponse.json({
      threshold: `${threshold}%`,
      timeframe,
      momentumDetected: tokensWithMomentum.length > 0,
      tokens: tokensWithMomentum.slice(0, 10), // Top 10 momentum tokens
      summary: `Found ${tokensWithMomentum.length} tokens with ${threshold}%+ momentum in ${timeframe}`,
      dataSource: "CoinGecko API (Live)",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error detecting momentum:", error);
    return NextResponse.json(
      {
        error: "Failed to detect momentum with live data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

function getAvailableChains(symbol: string): string[] {
  const chainMappings: { [key: string]: string[] } = {
    BTC: ["Bitcoin", "Ethereum (wBTC)", "BSC (BTCB)", "Solana (Portal BTC)"],
    ETH: [
      "Ethereum",
      "BSC (ETH)",
      "Polygon (ETH)",
      "Arbitrum (ETH)",
      "Optimism (ETH)",
    ],
    SOL: ["Solana", "Ethereum (Wrapped SOL)", "BSC (SOL)"],
    MATIC: ["Polygon", "Ethereum (MATIC)", "BSC (MATIC)"],
    AVAX: ["Avalanche", "Ethereum (AVAX)", "BSC (AVAX)"],
    BNB: ["BSC", "Ethereum (BNB)"],
    ADA: ["Cardano", "Ethereum (ADA)", "BSC (ADA)"],
    DOT: ["Polkadot", "Ethereum (DOT)", "BSC (DOT)"],
  };

  return chainMappings[symbol] || ["Ethereum", "BSC"];
}

function calculateMomentumScore(coin: any): number {
  const change24h = coin.price_change_percentage_24h || 0;
  const change1h = coin.price_change_percentage_1h_in_currency || 0;
  const volume = coin.total_volume || 0;
  const marketCap = coin.market_cap || 0;

  // Score based on price change, volume, and market cap
  let score = 0;
  score += Math.abs(change24h) * 2; // 24h change weight
  score += Math.abs(change1h) * 3; // 1h change weight (more recent = higher weight)
  score += Math.min((volume / 1000000000) * 10, 20); // Volume contribution (capped at 20)
  score += Math.min((marketCap / 1000000000) * 2, 10); // Market cap stability (capped at 10)

  return Math.round(score * 10) / 10;
}

function determineTrend(changePercent: number): string {
  if (changePercent === null || changePercent === undefined) return "neutral";

  if (changePercent > 15) return "very_bullish";
  if (changePercent > 8) return "strong_bullish";
  if (changePercent > 3) return "bullish";
  if (changePercent > -3) return "neutral";
  if (changePercent > -8) return "bearish";
  if (changePercent > -15) return "strong_bearish";
  return "very_bearish";
}
