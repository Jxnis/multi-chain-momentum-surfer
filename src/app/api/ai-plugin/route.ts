import { ACCOUNT_ID, PLUGIN_URL } from "@/app/config";
import { NextResponse } from "next/server";
import {
  chainIdParam,
  addressParam,
  SignRequestResponse200,
  AddressSchema,
  MetaTransactionSchema,
  SignRequestSchema,
} from "@bitte-ai/agent-sdk";

export async function GET() {
  const pluginData = {
    openapi: "3.0.0",
    info: {
      title: "Multi-Chain Momentum Surfer",
      description:
        "API for the Multi-Chain Momentum Surfer agent that detects momentum across chains and executes cross-chain trading strategies",
      version: "1.0.0",
    },
    servers: [
      {
        url: PLUGIN_URL,
      },
    ],
    "x-mb": {
      "account-id": ACCOUNT_ID,
      assistant: {
        name: "Multi-Chain Momentum Surfer",
        description:
          "An AI agent that detects price momentum across multiple blockchains and executes cross-chain trading strategies. I can detect 5%+ price movements, analyze momentum patterns, create cross-chain trading strategies, and execute momentum trades across Ethereum, BSC, Polygon, Solana, and other chains. I also provide blockchain information, account details, Twitter integration, and transaction creation for NEAR and EVM chains.",
        instructions:
          "You are a Multi-Chain Momentum Surfer that specializes in detecting and trading cross-chain momentum. Your primary functions: 1) Detect momentum using /api/tools/detect-momentum for 5%+ price movements, 2) Get cross-chain prices via /api/tools/get-cross-chain-prices, 3) Analyze momentum strength with /api/tools/analyze-momentum, 4) Create trading strategies using /api/tools/create-momentum-strategy, 5) Execute trades via /api/tools/execute-momentum-trade. For blockchain transactions, first generate payloads using /api/tools/create-near-transaction or /api/tools/create-evm-transaction, then use 'generate-transaction' or 'generate-evm-tx' tools to execute. Focus on cross-chain opportunities and momentum-based strategies.",
        tools: [{ type: "generate-transaction" }, { type: "generate-evm-tx" }],
      },
    },
    paths: {
      "/api/tools/detect-momentum": {
        get: {
          summary: "Detect price momentum across tokens",
          description:
            "Detects tokens with significant price momentum (5%+ moves) across multiple chains",
          operationId: "detect-momentum",
          parameters: [
            {
              name: "threshold",
              in: "query",
              required: false,
              schema: {
                type: "string",
                default: "5",
              },
              description:
                "Minimum percentage change threshold for momentum detection",
            },
            {
              name: "timeframe",
              in: "query",
              required: false,
              schema: {
                type: "string",
                default: "24h",
              },
              description: "Time period for momentum analysis (1h, 4h, 24h)",
            },
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      threshold: {
                        type: "string",
                        description: "Momentum threshold used",
                      },
                      timeframe: {
                        type: "string",
                        description: "Time period analyzed",
                      },
                      momentumDetected: {
                        type: "boolean",
                        description: "Whether momentum was detected",
                      },
                      tokens: {
                        type: "array",
                        description: "List of tokens with momentum",
                      },
                      summary: {
                        type: "string",
                        description: "Summary of momentum detection results",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/tools/get-cross-chain-prices": {
        get: {
          summary: "Get token prices across multiple chains",
          description:
            "Fetches real-time prices for tokens across different blockchains and identifies arbitrage opportunities",
          operationId: "get-cross-chain-prices",
          parameters: [
            {
              name: "token",
              in: "query",
              required: false,
              schema: {
                type: "string",
                default: "BTC",
              },
              description: "Token symbol to get prices for (BTC, ETH, SOL)",
            },
            {
              name: "chains",
              in: "query",
              required: false,
              schema: {
                type: "string",
                default: "ethereum,bsc,polygon,solana",
              },
              description: "Comma-separated list of chains to check prices on",
            },
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      token: {
                        type: "string",
                        description: "Token symbol",
                      },
                      chains: {
                        type: "object",
                        description: "Price data for each chain",
                      },
                      arbitrage: {
                        type: "object",
                        description: "Arbitrage opportunities between chains",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/tools/analyze-momentum": {
        get: {
          summary: "Analyze momentum strength and trend",
          description:
            "Analyzes momentum patterns across timeframes to determine if momentum is building or fading",
          operationId: "analyze-momentum",
          parameters: [
            {
              name: "token",
              in: "query",
              required: false,
              schema: {
                type: "string",
                default: "BTC",
              },
              description: "Token to analyze momentum for",
            },
            {
              name: "timeframes",
              in: "query",
              required: false,
              schema: {
                type: "string",
                default: "1h,4h,24h",
              },
              description: "Comma-separated timeframes to analyze",
            },
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      token: {
                        type: "string",
                        description: "Token analyzed",
                      },
                      momentumScore: {
                        type: "number",
                        description: "Overall momentum score",
                      },
                      status: {
                        type: "string",
                        description:
                          "Momentum status (building, strong, fading, etc.)",
                      },
                      recommendation: {
                        type: "string",
                        description: "Trading recommendation based on momentum",
                      },
                      riskLevel: {
                        type: "string",
                        description: "Risk level assessment",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/tools/create-momentum-strategy": {
        get: {
          summary: "Create cross-chain momentum trading strategy",
          description:
            "Generates a comprehensive cross-chain trading strategy based on momentum analysis",
          operationId: "create-momentum-strategy",
          parameters: [
            {
              name: "token",
              in: "query",
              required: false,
              schema: {
                type: "string",
                default: "BTC",
              },
              description: "Token to create strategy for",
            },
            {
              name: "budget",
              in: "query",
              required: false,
              schema: {
                type: "string",
                default: "2000",
              },
              description: "Trading budget in USD",
            },
            {
              name: "riskLevel",
              in: "query",
              required: false,
              schema: {
                type: "string",
                default: "medium",
              },
              description: "Risk tolerance (low, medium, high)",
            },
            {
              name: "chains",
              in: "query",
              required: false,
              schema: {
                type: "string",
                default: "ethereum,bsc,polygon,solana",
              },
              description: "Target chains for the strategy",
            },
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      token: {
                        type: "string",
                        description: "Token for the strategy",
                      },
                      strategy: {
                        type: "object",
                        description:
                          "Detailed trading strategy with allocations and exit plans",
                      },
                      estimatedReturns: {
                        type: "object",
                        description: "Expected return ranges",
                      },
                      risks: {
                        type: "array",
                        description: "Risk factors to consider",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/tools/execute-momentum-trade": {
        get: {
          summary: "Execute cross-chain momentum trade",
          description:
            "Executes momentum trading strategy across multiple chains with transaction payloads",
          operationId: "execute-momentum-trade",
          parameters: [
            {
              name: "strategy",
              in: "query",
              required: true,
              schema: {
                type: "string",
              },
              description: "Strategy ID or configuration to execute",
            },
            {
              name: "token",
              in: "query",
              required: false,
              schema: {
                type: "string",
                default: "BTC",
              },
              description: "Token to trade",
            },
            {
              name: "chains",
              in: "query",
              required: false,
              schema: {
                type: "string",
                default: "ethereum,bsc",
              },
              description: "Chains to execute trades on",
            },
            {
              name: "amounts",
              in: "query",
              required: false,
              schema: {
                type: "string",
                default: "1000,500",
              },
              description: "Comma-separated amounts to trade on each chain",
            },
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      executionPlan: {
                        type: "object",
                        description:
                          "Detailed execution plan with trades and timing",
                      },
                      transactionPayloads: {
                        type: "array",
                        description: "Transaction payloads for each chain",
                      },
                      instructions: {
                        type: "array",
                        description: "Step-by-step execution instructions",
                      },
                      warningsAndRisks: {
                        type: "array",
                        description: "Important warnings and risk factors",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/tools/get-blockchains": {
        get: {
          summary: "get blockchain information",
          description: "Respond with a list of blockchains",
          operationId: "get-blockchains",
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        description: "The list of blockchains",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/tools/get-user": {
        get: {
          summary: "get user information",
          description: "Respond with user account ID",
          operationId: "get-user",
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      accountId: {
                        type: "string",
                        description: "The user's account ID",
                      },
                      evmAddress: {
                        type: "string",
                        description: "The user's MPC EVM address",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/tools/twitter": {
        get: {
          operationId: "getTwitterShareIntent",
          summary: "Generate a Twitter share intent URL",
          description:
            "Creates a Twitter share intent URL based on provided parameters",
          parameters: [
            {
              name: "text",
              in: "query",
              required: true,
              schema: {
                type: "string",
              },
              description: "The text content of the tweet",
            },
            {
              name: "url",
              in: "query",
              required: false,
              schema: {
                type: "string",
              },
              description: "The URL to be shared in the tweet",
            },
            {
              name: "hashtags",
              in: "query",
              required: false,
              schema: {
                type: "string",
              },
              description: "Comma-separated hashtags for the tweet",
            },
            {
              name: "via",
              in: "query",
              required: false,
              schema: {
                type: "string",
              },
              description: "The Twitter username to attribute the tweet to",
            },
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      twitterIntentUrl: {
                        type: "string",
                        description: "The generated Twitter share intent URL",
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Bad request",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        description: "Error message",
                      },
                    },
                  },
                },
              },
            },
            "500": {
              description: "Error response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        description: "Error message",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/tools/create-near-transaction": {
        get: {
          operationId: "createNearTransaction",
          summary: "Create a NEAR transaction payload",
          description:
            "Generates a NEAR transaction payload for transferring tokens to be used directly in the generate-tx tool",
          parameters: [
            {
              name: "receiverId",
              in: "query",
              required: true,
              schema: {
                type: "string",
              },
              description: "The NEAR account ID of the receiver",
            },
            {
              name: "amount",
              in: "query",
              required: true,
              schema: {
                type: "string",
              },
              description: "The amount of NEAR tokens to transfer",
            },
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      transactionPayload: {
                        type: "object",
                        properties: {
                          receiverId: {
                            type: "string",
                            description: "The receiver's NEAR account ID",
                          },
                          actions: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                type: {
                                  type: "string",
                                  description:
                                    "The type of action (e.g., 'Transfer')",
                                },
                                params: {
                                  type: "object",
                                  properties: {
                                    deposit: {
                                      type: "string",
                                      description:
                                        "The amount to transfer in yoctoNEAR",
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Bad request",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        description: "Error message",
                      },
                    },
                  },
                },
              },
            },
            "500": {
              description: "Error response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        description: "Error message",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/tools/create-evm-transaction": {
        get: {
          operationId: "createEvmTransaction",
          summary: "Create EVM transaction",
          description:
            "Generate an EVM transaction payload with specified recipient and amount to be used directly in the generate-evm-tx tool",
          parameters: [
            {
              name: "to",
              in: "query",
              required: true,
              schema: {
                type: "string",
              },
              description: "The EVM address of the recipient",
            },
            {
              name: "amount",
              in: "query",
              required: true,
              schema: {
                type: "string",
              },
              description: "The amount of ETH to transfer",
            },
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      evmSignRequest: {
                        type: "object",
                        properties: {
                          to: {
                            type: "string",
                            description: "Receiver address",
                          },
                          value: {
                            type: "string",
                            description: "Transaction value",
                          },
                          data: {
                            type: "string",
                            description: "Transaction data",
                          },
                          from: {
                            type: "string",
                            description: "Sender address",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Bad request",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        description: "Error message",
                      },
                    },
                  },
                },
              },
            },
            "500": {
              description: "Server error",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        description: "Error message",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/tools/coinflip": {
        get: {
          summary: "Coin flip",
          description: "Flip a coin and return the result (heads or tails)",
          operationId: "coinFlip",
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      result: {
                        type: "string",
                        description:
                          "The result of the coin flip (heads or tails)",
                        enum: ["heads", "tails"],
                      },
                    },
                  },
                },
              },
            },
            "500": {
              description: "Error response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        description: "Error message",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  return NextResponse.json(pluginData);
}
