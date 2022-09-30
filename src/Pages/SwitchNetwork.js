import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TimeCounter from "../Components/TimeCounter/TimeCounter";

const SwitchNetwork = () => {
    const { chainId } = useWeb3React();
    const navigate = useNavigate();
    useEffect(() => {
        //testnet
        if (chainId === 97) navigate("/dashboard/launchpad-dashboard");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chainId]);
    const switchToTestnet = () => {
        window.ethereum
            .request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0x61" }],
            })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
                if (err.code === 4902) {
                    window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [
                            {
                                chainId: "0x61",
                                chainName: "BSC Testnet",
                                rpcUrls: [
                                    "https://data-seed-prebsc-1-s1.binance.org:8545/",
                                ],
                            },
                        ],
                    });
                }
            });
    };
    return (
        <div className="flex flex-col main-container component-container items-center text-center animation-fade-in py-8">
            <span className="size-2">
                Mainnet version goes live soon!
                <br />
                Try our test net version in the meantime
            </span>
            <button
                className="hover:shadow-itemCyan text-itemIndigo dark:text-itemCyan border-itemIndigo dark:border-itemCyan border-2 mt-6"
                onClick={switchToTestnet}
            >
                Switch to Testnet
            </button>
            <span className="text-itemIndigo dark:text-itemCyan size-2 py-3 font-bold">
                <TimeCounter time={270.82} />
            </span>
        </div>
    );
};

export default SwitchNetwork;
