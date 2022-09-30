import Metamask from "./WalletIcons/metamaskWallet.png";
import Coin98 from "./WalletIcons/Coin98.png";
import WalletConnect from "./WalletIcons/wallet-connect.svg";
import MathWallet from "./WalletIcons/MathWallet.svg";
import TokenPocket from "./WalletIcons/TokenPocket.svg";
import SafePal from "./WalletIcons/SafePal.svg";
import TrustWallet from "./WalletIcons/TrustWallet.png";

export const connectors = [
    {
        title: "Metamask",
        icon: Metamask,
        connectorId: "injected",
        priority: 1,
    },
    {
        title: "WalletConnect",
        icon: WalletConnect,
        connectorId: "walletconnect",
        priority: 2,
    },
    {
        title: "Trust Wallet",
        icon: TrustWallet,
        connectorId: "injected",
        priority: 3,
    },
    {
        title: "MathWallet",
        icon: MathWallet,
        connectorId: "injected",
        priority: 999,
    },
    {
        title: "TokenPocket",
        icon: TokenPocket,
        connectorId: "injected",
        priority: 999,
    },
    {
        title: "SafePal",
        icon: SafePal,
        connectorId: "injected",
        priority: 999,
    },
    {
        title: "Coin98",
        icon: Coin98,
        connectorId: "injected",
        priority: 999,
    },
];

export const networks = {
    eth_main: "https://mainnet.infura.io/v3/7d9d43def2584f2a9f01f2a4719327bc",
    eth_test: "https://ropsten.infura.io/v3/8ca77c4631f14dccb88318200cfca61d",
    bsc_main: "https://bsc-dataseed.binance.org/",
    bsc_test: "https://data-seed-prebsc-2-s3.binance.org:8545",
};
