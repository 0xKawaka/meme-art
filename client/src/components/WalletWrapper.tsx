import { connect, disconnect } from "starknetkit"
import { Account, RpcProvider } from "starknet";
import "./WalletWrapper.css";

type MemesDrawingsProps = {
  setAccount: React.Dispatch<React.SetStateAction<Account | undefined>>
  account: Account | undefined;
  rpcUrl: string;
};


export default function WalletWrapper({setAccount, account, rpcUrl}: MemesDrawingsProps) {

  const connectWallet = async () => {
    const { wallet, connectorData, connector } = await connect({modalMode: 'alwaysAsk'})
    if (wallet && connectorData && connector) {
      const provider = new RpcProvider({
        nodeUrl: rpcUrl,
      });
      setAccount(await connector.account(provider) as Account)
    }
  }

  return (
    <div className="wallet-wrapper-container">
      {!account && <div className="wallet-wrapper-connect" onClick={connectWallet}>Connect Wallet</div>}
      {account && <div className="wallet-wrapper-address">{account.address}</div>}
    </div>
  );
}
