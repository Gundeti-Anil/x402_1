import {settlePayment, facilitator } from "thirdweb/x402";
import { createThirdwebClient } from "thirdweb";
import { telos } from "thirdweb/chains";

const client = createThirdwebClient({
  // clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
  secretKey: process.env.THIRDWEB_SECRET_KEY!,
  // chain: telos,
});


const thirdwebFacilitator = await facilitator({
  client,
  serverWalletAddress: process.env.THIRDWEB_SERVER_WALLET!,
});

export async function GET(request: Request) {

  const paymentData = request.headers.get("x-payment");
  
  const result = await settlePayment({

    resourceUrl: "http://localhost:3000/api",
    method: "GET",
    paymentData,
    payTo: process.env.THIRDWEB_SERVER_WALLET!,
    network: telos,
    price: {
      amount: "10000",
      asset: {
        address: "0xba18d65382e4f55235c1cd74ebfbdfdb3dc141fa"
      },
    },
    facilitator: thirdwebFacilitator,
  });

  if(result.status === 200) {
    return  Response.json({ message: "Payment successful: premium data" }, { status: 200 });
  } else {
    return Response.json({ message: "Payment failed" }, { status: 400 });
  }
}


// export async function GET() {
//   const html = `<!DOCTYPE html>
// <html lang="en">
//   <head>
//     <meta charset="utf-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1" />
//     <title>API</title>
//     <style>
//       html, body {
//         margin: 0;
//         min-height: 100%;
//         background: #ffffff;
//         color: #000000;
//         font-family: system-ui, sans-serif;
//         font-size: 1.25rem;
//         display: grid;
//         place-items: center;
//       }
//     </style>
//   </head>
//   <body>
//     <p>Hello, world!</p>
//   </body>
// </html>`

//   return new Response(html, {
//     headers: {
//       "Content-Type": "text/html; charset=utf-8",
//     },
//   })
// }
