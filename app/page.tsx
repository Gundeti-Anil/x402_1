import { Button } from "@/components/ui/button"
import { exportTraceState } from "next/dist/trace";
import { createThirdwebClient } from "thirdweb";
import {connectButton, useActivateWallet } from "thirdweb/react";
import { Wallet } from "thirdweb/wallets";
import {wrapFetchWithPayment} from "thirdweb/x402";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
  // secretKey: process.env.THIRDWEB_SECRET_KEY!,
  // chain: telos,
});

async function accessPremiumContent(wallet: Wallet) {

  const fetchWithPayment = wrapFetchWithPayment(
    fetch
    client,
    wallet,
    BigInt(1*10**6/100)
  );

  const response = await fetchWithPayment("http://localhost:3000/api");
  const data = await response.json();
  console.log(data);
}

export default function Home() {
  const wallet = useActiveWallet();

  if(!wallet) {
    return <ConnectButton  client = {client}/>;
  }

  return (
    <div>
      <Button onClick={() => {
        accessPremiumContent(wallet);
      }}>
        pay to Access Premium Content
      </Button>
    </div>
  )
}

// export default function Page() {
//   return (
//     <div className="flex min-h-svh p-6">
//       <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose text-black">
//         <div>
//           <h1 className="font-medium">Project ready!</h1>
//           <p>You may now add components and start building.</p>
//           <p>We&apos;ve already added the button component for you.</p>
//           <Button className="mt-2">Button</Button>
//         </div>
//       </div>
//     </div>
//   )
// }
