"use client";

import { useState } from "react";
import { createThirdwebClient } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { ConnectButton, useActiveWallet } from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { wrapFetchWithPayment } from "thirdweb/x402";
import { Button } from "@/components/ui/button";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

const wallets = [
  inAppWallet(),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("walletConnect"),
];

export default function Home() {
  const wallet = useActiveWallet();
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function accessPremiumContent() {
    if (!wallet) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const fetchWithPayment = wrapFetchWithPayment(fetch, client, wallet, {
        // Allow up to $1 USDC (6 decimals) so $0.01 API price is covered
        maxValue: BigInt(1_000_000),
      });

      const response = await fetchWithPayment("/api");
      const data = await response.json();

      if (!response.ok) {
        setError(JSON.stringify(data, null, 2));
        return;
      }

      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-start gap-4 bg-white p-6 text-black">
      <h1 className="text-xl font-medium">x402 Premium Content</h1>
      <ConnectButton client={client} wallets={wallets} chain={baseSepolia} />

      {wallet ? (
        <Button onClick={accessPremiumContent} disabled={loading}>
          {loading ? "Paying…" : "Pay to Access Premium Content"}
        </Button>
      ) : (
        <p className="text-sm text-neutral-600">
          Connect a wallet to pay for premium content.
        </p>
      )}

      {result ? (
        <pre className="max-w-xl overflow-auto rounded border border-neutral-200 bg-neutral-50 p-3 text-sm text-black">
          {result}
        </pre>
      ) : null}

      {error ? (
        <pre className="max-w-xl overflow-auto rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </pre>
      ) : null}
    </div>
  );
}
