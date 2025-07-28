# Multi-Chain Momentum Surfer 🏄‍♂️

An AI agent that detects momentum on one blockchain and immediately surfs it across multiple chains to capture maximum profit opportunities.

## 🌊 The Concept

When BTC pumps 5% on Bitcoin, this agent instantly:

- Buys wBTC on Ethereum
- Grabs BTCB on BSC
- Acquires Portal BTC on Solana
- Rides the momentum wave across ALL chains simultaneously

**Goal**: Turn $2K into $20K by riding cross-chain momentum waves

## 🎯 How It Works

### 1. **Momentum Detection**

- Scans major tokens (BTC, ETH, SOL, MATIC, etc.) for 3-5%+ price movements
- Uses real-time data from CoinGecko and Binance APIs
- Calculates momentum scores based on price change, volume, and market cap

### 2. **Cross-Chain Price Analysis**

- Fetches live prices across Ethereum, BSC, Polygon, Solana, Arbitrum, Optimism
- Identifies arbitrage opportunities between chains
- Maps token equivalents (BTC → wBTC, BTCB, Portal BTC, etc.)

### 3. **Strategy Creation**

- Generates multi-chain allocation strategies with risk management
- Supports low/medium/high risk levels with position sizing
- Sets profit targets (+15%) and stop losses (-8%)

### 4. **Execution Planning**

- Creates detailed trade execution plans across multiple DEXs
- Optimizes for timing, slippage, and gas fees
- Integrates with wallet for seamless transaction execution

## 🛠️ Available Tools

### Momentum Detection

```
/api/tools/detect-momentum
```

Scans the market for tokens with significant price movements above a specified threshold.

### Cross-Chain Prices

```
/api/tools/get-cross-chain-prices
```

Fetches real-time prices for tokens across multiple blockchains and identifies arbitrage opportunities.

### Momentum Analysis

```
/api/tools/analyze-momentum
```

Provides deep technical analysis including RSI, volume profiles, and momentum scoring.

### Strategy Creation

```
/api/tools/create-momentum-strategy
```

Generates multi-chain trading strategies with risk management and allocation plans.

### Trade Execution

```
/api/tools/execute-momentum-trade
```

Creates detailed execution plans with optimal timing and DEX selection.

### Blockchain Transactions

```
/api/tools/create-near-transaction
/api/tools/create-evm-transaction
```

Generates transaction payloads for NEAR and EVM chains with wallet integration.

## 🚀 Quick Start Examples

### Detect Market Momentum

```
"Detect any momentum in the market right now with 3% threshold"
```

### Check Cross-Chain Prices

```
"What's the current price of BTC across Ethereum, BSC, and Solana?"
```

### Analyze Specific Token

```
"Analyze SOL momentum - is it building or fading?"
```

### Create Trading Strategy

```
"Create a momentum strategy for ETH with $5000 budget and medium risk"
```

### Execute Trades

```
"Execute momentum trade for BTC across Ethereum and BSC with $2000"
```

## 🎯 Trading Strategy

### Simple Starting Strategy:

1. **Detect**: 5%+ moves on major tokens (BTC, ETH, SOL, MATIC)
2. **Replicate**: Instantly replicate position across 3-4 chains
3. **Manage**: Set 15% profit targets and 8% stop losses
4. **Exit**: Close positions when momentum fades

### Supported Chains:

- **Ethereum** (ETH, wBTC, MATIC, etc.)
- **BSC** (BNB, BTCB, ETH, etc.)
- **Polygon** (MATIC, wBTC, ETH, etc.)
- **Solana** (SOL, Portal BTC, Wrapped ETH, etc.)
- **Arbitrum** (ETH, wBTC, etc.)
- **Optimism** (ETH, wBTC, etc.)
- **Avalanche** (AVAX, BTC.b, WETH.e, etc.)

## 📊 Risk Management

### Position Sizing by Risk Level:

- **Low Risk**: 30% of budget per strategy
- **Medium Risk**: 60% of budget per strategy
- **High Risk**: 90% of budget per strategy

### Built-in Safety Features:

- Automatic stop losses at -8%
- Profit taking at +15%
- Position limits based on budget
- Real-time monitoring and alerts

## 🌐 Live Data Sources

- **CoinGecko API**: Real-time prices, volume, market cap
- **Binance API**: Additional liquidity and volume data
- **DEX Aggregators**: Cross-chain price comparisons
- **On-chain Data**: Transaction costs and slippage estimates

## 💡 Unique Value Proposition

Unlike traditional trading bots that focus on single chains, the Multi-Chain Momentum Surfer:

✅ **Captures momentum across ALL major chains simultaneously**  
✅ **Identifies cross-chain arbitrage opportunities**  
✅ **Manages risk with automated stop losses and profit targets**  
✅ **Executes complex multi-chain strategies with simple commands**  
✅ **Provides real-time market intelligence and analysis**

## 🏄‍♂️ Ready to Surf?

Start by asking the agent to detect current market momentum, then let it guide you through creating and executing profitable cross-chain trading strategies.

The future of DeFi trading is multi-chain. Ride the waves with the Momentum Surfer! 🌊

---

_Built with Bitte Protocol AI Agent SDK_
