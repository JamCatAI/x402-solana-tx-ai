# x402-solana-tx-ai

Production-ready Next.js app for deterministic Solana transaction facts + AI explanation/classification, monetized per request with HTTP 402 payment flow.

## Features
- Deterministic `facts` from Solana RPC before any AI call
- Paid endpoints and paid page routes via x402-style 402 flow
- Streaming endpoint emits facts first, then summary chunks, then final structured JSON
- 24h caching for facts and AI result payloads
- Free `facts` endpoint with rate limiting
- Tailwind UI pages for landing, input, paid result, and API docs

## Routes
- `GET /`
- `GET /tx`
- `GET /tx/[signature]` (paid)
- `GET /docs/api`
- `GET /api/health`
- `POST /api/x402/session-token`
- `POST /api/tx/facts` (free, rate-limited)
- `POST /api/tx/explain` (paid)
- `POST /api/tx/explain/stream` (paid, SSE)

## Environment
Copy `.env.example` to `.env.local` and set values:
- `NEXT_PUBLIC_WALLET_ADDRESS`
- `NEXT_PUBLIC_NETWORK=solana-devnet` or `solana-mainnet-beta`
- `NEXT_PUBLIC_CDP_CLIENT_KEY`
- `NEXT_PUBLIC_FACILITATOR_URL=https://www.x402.org/facilitator` (dev/test)
- `SOLANA_RPC_URL`
- `OPENAI_API_KEY`
- `REDIS_URL`, `REDIS_TOKEN` (optional)

## Facilitators and CAIP-2
- Dev/test facilitator: `https://www.x402.org/facilitator`
- Mainnet/CDP facilitator: `https://api.cdp.coinbase.com/platform/v2/x402`
- Devnet CAIP-2: `solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1`
- Mainnet CAIP-2: `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp`

## Run
```bash
pnpm install
pnpm dev
```

## Payment behavior
Paid routes return `402` with `PAYMENT-REQUIRED` when unpaid, accept `PAYMENT-SIGNATURE` (or legacy `X-PAYMENT`) and return `PAYMENT-RESPONSE` on success.

## Tests
```bash
pnpm test
```

## Mainnet switch notes
1. Set `NEXT_PUBLIC_NETWORK=solana-mainnet-beta`.
2. Set `NEXT_PUBLIC_FACILITATOR_URL=https://api.cdp.coinbase.com/platform/v2/x402`.
3. Use a production Solana RPC and wallet receiving address.
