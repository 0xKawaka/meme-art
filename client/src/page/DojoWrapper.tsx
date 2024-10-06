import { setup, SetupResult } from "../dojo/setup.ts";
import { DojoProvider } from "../dojo/DojoContext.tsx"; // Ensure useDojo is imported
import { dojoConfig } from "../dojoConfig.ts";
import { useEffect, useState } from "react";
import { useDojo } from "../dojo/useDojo.tsx";
import MemesDrawings from "./MemesDrawing.tsx";
import Loading from "../components/Loading.tsx";
import { Account } from "starknet";
import WalletWrapper from "../components/WalletWrapper.tsx";


export default function DojoWrapper() {
  // const [account, setAccount] = useState<Account | undefined>(undefined);
  const [setupResult, setSetupResult] = useState<SetupResult | undefined>(undefined);

  // Fetch the setup result once on mount
  useEffect(() => {
    setup(dojoConfig).then(setSetupResult);
  }, []);

  if (!setupResult) {
    console.log("Loading...");
    return <Loading />
  }

  function WrappedGamePage() {
    const { setup: {}, account } = useDojo();
    return <MemesDrawings account={account.account} />;
    // useDojo();
    // return <MemesDrawings account={account} />;
  }

  return (
    <DojoProvider value={setupResult}>
      {/* <WalletWrapper setAccount={setAccount} account={account} rpcUrl={dojoConfig.rpcUrl} /> */}
      <WrappedGamePage />
    </DojoProvider>
  );
}
