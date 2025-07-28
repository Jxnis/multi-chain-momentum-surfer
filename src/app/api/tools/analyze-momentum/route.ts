import { NextResponse } from "next/server";

type TimeframeData = {
  change: number;
  volume: number;
  trend: string;
};

type TechnicalData = {
  rsi: number;
  volumeProfile: string;
  crossChainFlow: string;
  socialSentiment: number;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token") || "BTC";
    const timeframes = searchParams.get("timeframes")?.split(",") || [
      "1h",
      "4h",
      "24h",
    ];

    // Get CoinGecko ID for the token
    const tokenId = getTokenId(token.toUpperCase());
    if (!tokenId) {
      return NextResponse.json(
        { error: `Token ${token} not supported` },
        { status: 400 }
      );
    }

    // Fetch real data from CoinGecko API
    const coingeckoUrl = `https://api.coingecko.com/api/v3/coins/${tokenId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`;

    let coinData;
    try {
      const response = await fetch(coingeckoUrl, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      coinData = await response.json();
    } catch (fetchError) {
      console.error("Error fetching from CoinGecko:", fetchError);
      return NextResponse.json(
        {
          error: "Failed to fetch live market data. Please try again later.",
          fallback: "API temporarily unavailable",
        },
        { status: 503 }
      );
    }

    const marketData = coinData.market_data;
    if (!marketData) {
      return NextResponse.json(
        { error: `Market data for ${token} not available` },
        { status: 400 }
      );
    }

    // Build timeframe analysis from real data
    const timeframeAnalysis: { [key: string]: TimeframeData } = {};

    // Map available data to our timeframes
    if (
      timeframes.includes("1h") &&
      marketData.price_change_percentage_1h_in_currency?.usd !== null
    ) {
      timeframeAnalysis["1h"] = {
        change: marketData.price_change_percentage_1h_in_currency?.usd || 0,
        volume: marketData.total_volume?.usd || 0,
        trend: determineTrend(
          marketData.price_change_percentage_1h_in_currency?.usd || 0
        ),
      };
    }

    if (
      timeframes.includes("24h") &&
      marketData.price_change_percentage_24h_in_currency?.usd !== null
    ) {
      timeframeAnalysis["24h"] = {
        change: marketData.price_change_percentage_24h_in_currency?.usd || 0,
        volume: marketData.total_volume?.usd || 0,
        trend: determineTrend(
          marketData.price_change_percentage_24h_in_currency?.usd || 0
        ),
      };
    }

    if (
      timeframes.includes("7d") &&
      marketData.price_change_percentage_7d_in_currency?.usd !== null
    ) {
      timeframeAnalysis["7d"] = {
        change: marketData.price_change_percentage_7d_in_currency?.usd || 0,
        volume: marketData.total_volume?.usd || 0,
        trend: determineTrend(
          marketData.price_change_percentage_7d_in_currency?.usd || 0
        ),
      };
    }

    // Calculate technical indicators based on real data
    const technicals: TechnicalData = {
      rsi: calculateRSI(coinData.market_data.sparkline_7d?.price || []),
      volumeProfile: analyzeVolumeProfile(marketData),
      crossChainFlow: analyzeCrossChainFlow(marketData),
      socialSentiment: calculateSocialSentiment(coinData),
    };

    // Calculate momentum score from real data
    const scores = Object.values(timeframeAnalysis).map(
      (data: TimeframeData) => {
        let score = 0;
        score += Math.min(Math.abs(data.change) * 10, 50); // Price change contribution
        score += Math.min((data.volume / 1000000000) * 5, 25); // Volume contribution
        return score;
      }
    );

    const avgScore =
      scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

    // Determine momentum status
    let momentumStatus = "neutral";
    let recommendation = "hold";

    if (avgScore > 60) {
      momentumStatus = "very_strong";
      recommendation = "aggressive_buy";
    } else if (avgScore > 40) {
      momentumStatus = "strong";
      recommendation = "buy";
    } else if (avgScore > 20) {
      momentumStatus = "building";
      recommendation = "cautious_buy";
    } else if (avgScore < -20) {
      momentumStatus = "fading";
      recommendation = "sell";
    }

    return NextResponse.json({
      token: token.toUpperCase(),
      momentumScore: Math.round(avgScore * 10) / 10,
      status: momentumStatus,
      recommendation,
      timeframes: timeframeAnalysis,
      technicals: technicals,
      riskLevel: avgScore > 50 ? "high" : avgScore > 30 ? "medium" : "low",
      marketData: {
        currentPrice: marketData.current_price?.usd || 0,
        marketCap: marketData.market_cap?.usd || 0,
        volume24h: marketData.total_volume?.usd || 0,
        circulatingSupply: marketData.circulating_supply || 0,
      },
      dataSource: "CoinGecko API (Live)",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error analyzing momentum:", error);
    return NextResponse.json(
      {
        error: "Failed to analyze momentum with live data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

function getTokenId(symbol: string): string | null {
  const tokenMapping: { [key: string]: string } = {
    BTC: "bitcoin",
    ETH: "ethereum",
    SOL: "solana",
    MATIC: "matic-network",
    AVAX: "avalanche-2",
    BNB: "binancecoin",
    ADA: "cardano",
    DOT: "polkadot",
    LINK: "chainlink",
    UNI: "uniswap",
  };

  return tokenMapping[symbol] || null;
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

function calculateRSI(prices: number[]): number {
  if (!prices || prices.length < 14) return 50; // Default neutral RSI

  const gains: number[] = [];
  const losses: number[] = [];

  for (let i = 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }

  const avgGain = gains.slice(-14).reduce((a, b) => a + b, 0) / 14;
  const avgLoss = losses.slice(-14).reduce((a, b) => a + b, 0) / 14;

  if (avgLoss === 0) return 100;

  const rs = avgGain / avgLoss;
  const rsi = 100 - 100 / (1 + rs);

  return Math.round(rsi);
}

function analyzeVolumeProfile(marketData: any): string {
  const currentVolume = marketData.total_volume?.usd || 0;
  const marketCap = marketData.market_cap?.usd || 0;

  if (marketCap === 0) return "unknown";

  const volumeToMcapRatio = currentVolume / marketCap;

  if (volumeToMcapRatio > 0.5) return "exploding";
  if (volumeToMcapRatio > 0.2) return "increasing";
  if (volumeToMcapRatio > 0.05) return "normal";
  return "decreasing";
}

function analyzeCrossChainFlow(marketData: any): string {
  // Simplified analysis based on volume and price changes
  const change24h =
    marketData.price_change_percentage_24h_in_currency?.usd || 0;
  const volume = marketData.total_volume?.usd || 0;

  if (change24h > 5 && volume > 1000000000) return "very_positive";
  if (change24h > 2 && volume > 500000000) return "positive";
  if (change24h > -2 && volume > 100000000) return "neutral";
  if (change24h < -5) return "negative";
  return "neutral";
}

function calculateSocialSentiment(coinData: any): number {
  // Simplified sentiment based on available data
  const change24h =
    coinData.market_data?.price_change_percentage_24h_in_currency?.usd || 0;
  const volume = coinData.market_data?.total_volume?.usd || 0;
  const marketCap = coinData.market_data?.market_cap?.usd || 0;

  let sentiment = 0.5; // Neutral base

  // Adjust based on price performance
  sentiment += (change24h / 100) * 0.3;

  // Adjust based on volume (higher volume = more interest)
  if (marketCap > 0) {
    const volumeRatio = volume / marketCap;
    sentiment += Math.min(volumeRatio * 0.2, 0.2);
  }

  // Clamp between 0 and 1
  return Math.max(0, Math.min(1, sentiment));
}
