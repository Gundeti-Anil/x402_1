import { createThirdwebClient } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { facilitator, settlePayment } from "thirdweb/x402";

const client = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY!,
});

const thirdwebFacilitator = facilitator({
  client,
  serverWalletAddress: process.env.THIRDWEB_SERVER_WALLET!,
});

export async function GET(request: Request) {
  const paymentData =
    request.headers.get("PAYMENT-SIGNATURE") ||
    request.headers.get("X-PAYMENT") ||
    request.headers.get("x-payment");

  const resourceUrl = new URL(request.url).origin + "/api";

  try {
    const result = await settlePayment({
      resourceUrl,
      method: "GET",
      paymentData,
      payTo: process.env.THIRDWEB_SERVER_WALLET!,
      network: baseSepolia,
      // USD price uses facilitator-supported USDC on this chain
      price: "$0.01",
      facilitator: thirdwebFacilitator,
      routeConfig: {
        description: "Access to premium API content",
        mimeType: "application/json",
      },
    });

    if (result.status === 200) {
      return Response.json(
        { message: "Payment successful: premium data" },
        {
          status: 200,
          headers: result.responseHeaders,
        },
      );
    }

    // 402 Payment Required — client uses this to sign & retry
    return Response.json(result.responseBody, {
      status: result.status,
      headers: result.responseHeaders,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ error: message }, { status: 500 });
  }
}
