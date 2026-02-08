import { Connection } from "@solana/web3.js";

export const solanaConnection = new Connection(
  process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com",
  { commitment: "confirmed" }
);
