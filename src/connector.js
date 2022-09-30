import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { NetworkConnector } from "@web3-react/network-connector";

export const RPC_URLS = {
    56: "https://bsc-dataseed.binance.org/",
    97: "https://data-seed-prebsc-1-s1.binance.org:8545/",
};
export const network = new NetworkConnector({
    urls: { 56: RPC_URLS[56], 97: RPC_URLS[97] },
    defaultChainId: 56,
});

export const injected = new InjectedConnector({
    supportedChainIds: [56, 97],
});

export const walletconnect = new WalletConnectConnector({
    rpc: RPC_URLS,
    network: "binance",
    qrcode: true,
    pollingInterval: 12000,
    chainId: 56,
    bridge: "https://bridge.walletconnect.org",
});
