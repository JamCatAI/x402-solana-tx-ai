import { paymentMiddleware } from "x402-next";
import { x402Facilitator, x402Network, x402PayTo, x402Paywall } from "@/lib/x402";

const payTo = x402PayTo();

export const middleware = paymentMiddleware(
  payTo,
  {
    "/tx/*": {
      price: "$0.01",
      network: x402Network(),
      config: { description: "Solana transaction explanation page" }
    }
  },
  x402Facilitator(),
  x402Paywall()
);

export const config = {
  matcher: ["/tx/:path*"],
  runtime: "nodejs"
};
