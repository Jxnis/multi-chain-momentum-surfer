# Bitte AI Agent NextJS Boilerplate

A comprehensive template for creating AI agents using the Bitte Protocol with Next.js. This boilerplate demonstrates best practices for building blockchain-enabled AI agents with pre-configured tools and endpoints.

## 🌟 Features

- 🤖 **Complete AI Agent Setup** - Pre-configured agent manifest with OpenAPI specification
- 🔗 **Blockchain Integration** - Built-in support for NEAR and EVM transactions
- 🛠️ **Ready-to-Use Tools**:
  - Blockchain information retrieval
  - NEAR & EVM transaction generation with wallet integration
  - Ethereum message signing (eth_sign, personal_sign, typed data)
  - User account & EVM address retrieval
  - Twitter share intent generation
  - Coin flip functionality
- ⚡ **Next.js 15** with App Router and TypeScript
- 🎨 **Modern Development Stack** - Tailwind CSS, ESLint, TypeScript
- 🚀 **One-Command Development** - Integrated with `make-agent` for seamless development
- 📋 **Production Ready** - Built-in deployment scripts and Vercel integration

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- A Bitte wallet account
- Git

### 1. Clone and Setup

```bash
git clone https://github.com/BitteProtocol/agent-next-boilerplate.git
cd agent-next-boilerplate
pnpm install
```

### 2. Environment Configuration

Create a `.env.local` file:

```bash
# Required: Get your API key from https://key.bitte.ai
BITTE_API_KEY='your-api-key'

# Required: Your NEAR account ID (e.g., yourname.near)
ACCOUNT_ID='your-account.near'

# Optional: For local development
NEXT_PUBLIC_HOST='localhost'
PORT=3000
```

### 3. Start Development

```bash
pnpm run dev
```

This command will:
- Start your Next.js application on `http://localhost:3000`
- Launch `make-agent` development mode
- Prompt you to sign a message in your Bitte wallet to authenticate
- Open your agent in the Bitte playground for testing
- Enable hot reload for seamless development

### 4. Build for Production

```bash
# Build without deployment
pnpm run build

# Build and deploy to production
pnpm run build:deploy
```

## 🔧 Available Tools

The boilerplate includes six fully functional tools that demonstrate different agent capabilities:

### 1. **Blockchain Information** (`/api/tools/get-blockchains`)
- **Purpose**: Returns a randomized list of 3 blockchain networks
- **Implementation**: Static list with random selection
- **Use Case**: Demonstrating simple data retrieval and randomization

### 2. **NEAR Transaction Generator** (`/api/tools/create-near-transaction`)
- **Purpose**: Creates NEAR transaction payloads for token transfers
- **Parameters**: `receiverId` (NEAR account), `amount` (NEAR tokens)
- **Implementation**: Converts amounts to yoctoNEAR (10^24) for precision
- **Integration**: Works with Bitte's `generate-transaction` tool for wallet execution

### 3. **EVM Transaction Generator** (`/api/tools/create-evm-transaction`)
- **Purpose**: Creates EVM transaction payloads for ETH transfers
- **Parameters**: `to` (recipient address), `amount` (ETH amount)
- **Implementation**: Uses viem for proper ETH amount parsing
- **Integration**: Works with Bitte's `generate-evm-tx` tool for wallet execution

### 4. **Ethereum Message Signing** (`/api/tools/eth-sign-request`)
- **Purpose**: Creates various Ethereum signature requests
- **Methods**: `eth_sign`, `personal_sign`, `eth_signTypedData`, `eth_signTypedData_v4`
- **Parameters**: `evmAddress`, `chainId`, `method`, `message`
- **Implementation**: Supports both simple messages and typed data structures

### 5. **User Information** (`/api/tools/get-user`)
- **Purpose**: Returns user's NEAR account ID and EVM address
- **Context-Aware**: Automatically populated by Bitte's context system
- **Use Case**: Accessing authenticated user information within agent flows

### 6. **Twitter Integration** (`/api/tools/twitter`)
- **Purpose**: Generates Twitter share intent URLs
- **Parameters**: `text` (required), `url`, `hashtags`, `via`
- **Implementation**: Proper URL encoding for all parameters
- **Use Case**: Social sharing and engagement features

### 7. **Coin Flip** (`/api/tools/coinflip`)
- **Purpose**: Simple randomization tool returning "heads" or "tails"
- **Implementation**: Cryptographically random using Math.random()
- **Use Case**: Demonstrating simple random functionality

## 🤖 Agent Configuration

The agent is configured through the AI plugin manifest at `/api/ai-plugin/route.ts`. This endpoint returns an OpenAPI specification that defines:

### Agent Metadata
```typescript
{
  name: "Blockchain Assistant",
  description: "An assistant that answers with blockchain information...",
  instructions: "You create near and evm transactions, give blockchain information...",
  tools: [
    { type: "generate-transaction" },  // NEAR transactions
    { type: "generate-evm-tx" },       // EVM transactions
    { type: "sign-message" }           // Message signing
  ],
  categories: ["DeFi", "DAO", "Social"],
  chainIds: [1, 8453]  // Ethereum Mainnet, Base
}
```

### Important Configuration Notes

1. **Tool Integration**: The agent uses Bitte's built-in tools (`generate-transaction`, `generate-evm-tx`, `sign-message`) to execute blockchain operations
2. **Two-Step Process**: Your endpoints generate transaction payloads, then Bitte's tools execute them in the user's wallet
3. **Chain Support**: Currently configured for Ethereum Mainnet (1) and Base (8453)
4. **Deployment URL**: Automatically detected from Vercel or environment variables

## 📝 Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `BITTE_API_KEY` | ✅ | Your Bitte API key from [key.bitte.ai](https://key.bitte.ai) | `bitte_key_...` |
| `ACCOUNT_ID` | ✅ | Your blockchain account ID | `walletaddresss` |
| `NEXT_PUBLIC_HOST` | ❌ | Development host | `localhost` |
| `PORT` | ❌ | Development port | `3000` |
| `NEXT_PUBLIC_BASE_URL` | ❌ | Base URL for assets | `https://yourdomain.com` |

## 🛠️ Development Scripts

```bash
# Development with hot reload and make-agent
pnpm run dev

# Next.js development only (without make-agent)
pnpm run dev:agent

# Production build (local)
pnpm run build

# Build and deploy to production
pnpm run build:deploy

# Linting
pnpm run lint
```

## 🚀 Deployment

### Automatic Deployment (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `BITTE_API_KEY`
   - `ACCOUNT_ID`
4. Deploy! The build process automatically runs `make-agent deploy`

### Manual Deployment

```bash
# Build and deploy manually
pnpm run build:deploy
```

## 🔨 Creating Custom Tools

To add your own tools to the agent:

### 1. Create the Tool Endpoint

```typescript
// src/app/api/tools/my-tool/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const param = searchParams.get('param');

  // Your tool logic here

  return NextResponse.json({ result: 'success' });
}
```

### 2. Add to Agent Manifest

Update `/api/ai-plugin/route.ts`:

```typescript
paths: {
  // ... existing paths
  "/api/tools/my-tool": {
    get: {
      summary: "My custom tool",
      description: "Description of what your tool does",
      operationId: "my-tool",
      parameters: [
        {
          name: "param",
          in: "query",
          required: true,
          schema: { type: "string" }
        }
      ],
      responses: {
        "200": {
          description: "Successful response",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  result: { type: "string" }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

### 3. Update Agent Instructions

Modify the `instructions` field in the agent configuration to include guidance on when and how to use your new tool.

## 📖 Key Dependencies

- **[@bitte-ai/agent-sdk](https://www.npmjs.com/package/@bitte-ai/agent-sdk)** - Core SDK for Bitte integration
- **[make-agent](https://www.npmjs.com/package/make-agent)** - Development and deployment tooling
- **[viem](https://viem.sh)** - TypeScript Ethereum library for transaction handling
- **[Next.js 15](https://nextjs.org)** - React framework with App Router
- **[vercel-url](https://www.npmjs.com/package/vercel-url)** - Automatic deployment URL detection

## 🌐 Community & Support

- 📚 [Bitte Protocol Documentation](https://docs.bitte.ai)
- 💬 [Join our Telegram](https://t.me/bitteai) - Get help and connect with other developers
- 🐛 [Report Issues](https://github.com/BitteProtocol/agent-next-boilerplate/issues)
- 🔗 [Next.js Documentation](https://nextjs.org/docs)
- 📋 [OpenAPI Specification](https://swagger.io/specification/)

## 📋 Project Structure

```
agent-next-boilerplate/
├── src/app/
│   ├── api/
│   │   ├── ai-plugin/route.ts      # Agent manifest endpoint
│   │   └── tools/                  # Tool endpoints
│   │       ├── get-blockchains/
│   │       ├── create-near-transaction/
│   │       ├── create-evm-transaction/
│   │       ├── eth-sign-request/
│   │       ├── get-user/
│   │       ├── twitter/
│   │       └── coinflip/
│   ├── config.ts                   # Environment configuration
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Home page
├── public/                         # Static assets
├── package.json                    # Dependencies and scripts
└── README.md                       # This file
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

Built with ❤️ using [Bitte Protocol](https://bitte.ai)
# multi-chain-momentum-surfer
# multi-chain-momentum-surfer
# multi-chain-momentum-surfer
