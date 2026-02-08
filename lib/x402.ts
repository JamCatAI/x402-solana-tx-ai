import type { RouteConfig } from "x402-next";
import type { FacilitatorConfig } from "x402/types";
import type { Address as SolanaAddress } from "@solana/kit";

export function x402PayTo() {
  return (process.env.NEXT_PUBLIC_WALLET_ADDRESS || "") as SolanaAddress;
}

export function x402Network(): RouteConfig["network"] {
  const network = (process.env.NEXT_PUBLIC_NETWORK || "solana-devnet").toLowerCase();
  if (network === "solana-mainnet-beta") return "solana";
  if (network === "solana") return "solana";
  return "solana-devnet";
}

export function x402Facilitator(): FacilitatorConfig {
  return {
    url: (process.env.NEXT_PUBLIC_FACILITATOR_URL || "https://www.x402.org/facilitator") as `${string}://${string}`
  };
}

export function x402Paywall() {
  return {
    cdpClientKey: process.env.NEXT_PUBLIC_CDP_CLIENT_KEY,
    sessionTokenEndpoint: "/api/x402/session-token",
    appName: "Solana Tx AI"
  };
}
