import { NextResponse } from "next/server";

type RiskMultipliers = {
  [key: string]: number;
};

type AllocationData = {
  percentage: number;
  amount: number;
  symbol: string;
  reasoning: string;
};

type Allocation = {
  [key: string]: AllocationData;
};

type ExitStrategy = {
  profitTarget: number;
  stopLoss: number;
  timeLimit: string;
  partialExit: {
    [key: string]: string;
  };
};

type Strategy = {
  primary: string;
  allocation: Allocation;
  exitStrategy: ExitStrategy;
};

type Strategies = {
  [key: string]: Strategy;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token") || "BTC";
    const budget = parseFloat(searchParams.get("budget") || "2000");
    const riskLevel = searchParams.get("riskLevel") || "medium";
    const chains = searchParams.get("chains")?.split(",") || [
      "ethereum",
      "bsc",
      "polygon",
      "solana",
    ];

    // Risk multipliers
    const riskMultipliers: RiskMultipliers = {
      low: 0.3,
      medium: 0.6,
      high: 0.9,
    };

    const riskMultiplier = riskMultipliers[riskLevel] || 0.6;
    const maxPosition = budget * riskMultiplier;

    // Mock strategy generation
    const strategies: Strategies = {
      BTC: {
        primary: "ethereum",
        allocation: {
          ethereum: {
            percentage: 40,
            amount: maxPosition * 0.4,
            symbol: "wBTC",
            reasoning: "Highest liquidity, lowest slippage",
          },
          bsc: {
            percentage: 25,
            amount: maxPosition * 0.25,
            symbol: "BTCB",
            reasoning: "Good liquidity, lower fees",
          },
          polygon: {
            percentage: 20,
            amount: maxPosition * 0.2,
            symbol: "wBTC",
            reasoning: "Low fees, decent liquidity",
          },
          solana: {
            percentage: 15,
            amount: maxPosition * 0.15,
            symbol: "Portal BTC",
            reasoning: "Fast execution, growing ecosystem",
          },
        },
        exitStrategy: {
          profitTarget: 15,
          stopLoss: 8,
          timeLimit: "24h",
          partialExit: {
            fifty_percent: "at 8% profit",
            thirty_percent: "at 12% profit",
            twenty_percent: "let it ride to target",
          },
        },
      },
      ETH: {
        primary: "ethereum",
        allocation: {
          ethereum: {
            percentage: 50,
            amount: maxPosition * 0.5,
            symbol: "ETH",
            reasoning: "Native chain, maximum liquidity",
          },
          arbitrum: {
            percentage: 25,
            amount: maxPosition * 0.25,
            symbol: "ETH",
            reasoning: "L2 efficiency, high liquidity",
          },
          bsc: {
            percentage: 15,
            amount: maxPosition * 0.15,
            symbol: "ETH",
            reasoning: "Cross-chain exposure",
          },
          polygon: {
            percentage: 10,
            amount: maxPosition * 0.1,
            symbol: "ETH",
            reasoning: "Low fee option",
          },
        },
        exitStrategy: {
          profitTarget: 12,
          stopLoss: 6,
          timeLimit: "18h",
          partialExit: {
            forty_percent_a: "at 6% profit",
            forty_percent_b: "at 10% profit",
            twenty_percent: "hold to target",
          },
        },
      },
      SOL: {
        primary: "solana",
        allocation: {
          solana: {
            percentage: 60,
            amount: maxPosition * 0.6,
            symbol: "SOL",
            reasoning: "Native chain, best price discovery",
          },
          ethereum: {
            percentage: 25,
            amount: maxPosition * 0.25,
            symbol: "SOL",
            reasoning: "Cross-chain arbitrage potential",
          },
          bsc: {
            percentage: 15,
            amount: maxPosition * 0.15,
            symbol: "SOL",
            reasoning: "Additional exposure, lower fees",
          },
        },
        exitStrategy: {
          profitTarget: 20,
          stopLoss: 10,
          timeLimit: "12h",
          partialExit: {
            thirty_percent: "at 10% profit",
            forty_percent: "at 15% profit",
            thirty_percent_hold: "hold to target",
          },
        },
      },
    };

    const strategy = strategies[token.toUpperCase()];
    if (!strategy) {
      return NextResponse.json(
        { error: `Strategy for ${token} not available` },
        { status: 400 }
      );
    }

    // Filter allocation by requested chains
    const filteredAllocation: Allocation = {};
    Object.entries(strategy.allocation).forEach(([chain, data]) => {
      if (chains.includes(chain)) {
        filteredAllocation[chain] = data;
      }
    });

    // Calculate execution order based on momentum and liquidity
    const executionOrder = Object.keys(filteredAllocation).sort((a, b) => {
      const aData = filteredAllocation[a];
      const bData = filteredAllocation[b];
      return bData.percentage - aData.percentage; // Higher percentage first
    });

    return NextResponse.json({
      token: token.toUpperCase(),
      budget,
      riskLevel,
      maxPosition,
      strategy: {
        primary: strategy.primary,
        allocation: filteredAllocation,
        executionOrder,
        exitStrategy: strategy.exitStrategy,
      },
      estimatedReturns: {
        conservative: "8-12%",
        moderate: "12-18%",
        aggressive: "18-25%",
      },
      timeline: "Entry: 15-30 minutes, Full cycle: 12-24 hours",
      risks: [
        "Cross-chain bridge delays",
        "Momentum reversal",
        "Liquidity gaps",
        "Gas fee spikes",
      ],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error creating momentum strategy:", error);
    return NextResponse.json(
      { error: "Failed to create momentum strategy" },
      { status: 500 }
    );
  }
}
