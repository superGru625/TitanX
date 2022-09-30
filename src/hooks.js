import { useState, useEffect, useRef } from "react";
import { useWeb3React } from "@web3-react/core";
import { injected } from "./connector";
import { RANDOM_ADDRESS } from "./utils/constants";
import { useSearchParams } from "react-router-dom";
import Web3 from "web3";

export function useEagerConnect() {
    const { activate, active } = useWeb3React();

    const [tried, setTried] = useState(false);

    useEffect(() => {
        injected.isAuthorized().then((isAuthorized) => {
            if (isAuthorized) {
                activate(injected, undefined, true).catch(() => {
                    setTried(true);
                });
            } else {
                setTried(true);
            }
        });
    }, [activate]); // intentionally only running on mount (make sure it's only mounted once :))

    // if the connection worked, wait until we get confirmation of that to flip the flag
    useEffect(() => {
        if (!tried && active) {
            setTried(true);
        }
    }, [tried, active]);

    return tried;
}

export function useInactiveListener(suppress = false) {
    const { active, error, activate } = useWeb3React();

    useEffect(() => {
        const { ethereum } = window;
        if (ethereum && ethereum.on && !active && !error && !suppress) {
            const handleChainChanged = (chainId) => {
                activate(injected);
            };

            const handleAccountsChanged = (accounts) => {
                if (accounts.length > 0) {
                    activate(injected);
                }
            };

            const handleNetworkChanged = (networkId) => {
                activate(injected);
            };

            ethereum.on("chainChanged", handleChainChanged);
            ethereum.on("accountsChanged", handleAccountsChanged);
            ethereum.on("networkChanged", handleNetworkChanged);

            return () => {
                if (ethereum.removeListener) {
                    ethereum.removeListener("chainChanged", handleChainChanged);
                    ethereum.removeListener(
                        "accountsChanged",
                        handleAccountsChanged
                    );
                    ethereum.removeListener(
                        "networkChanged",
                        handleNetworkChanged
                    );
                }
            };
        }

        return () => {};
    }, [active, error, suppress, activate]);
}

export const useIsMount = () => {
    const isMountRef = useRef(true);
    useEffect(() => {
        // console.log("isMount ");
        isMountRef.current = false;
        return () => {
            isMountRef.current = true;
        };
    }, []);
    return isMountRef.current;
};

export const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};

export const useValidAccount = () => {
    const { account } = useWeb3React();
    return { account: account ? account : RANDOM_ADDRESS };
};

export const useRpcURL = () => {
    const [searchParams] = useSearchParams();
    if (searchParams.get("chain") === "bsc-testnet")
        return "https://data-seed-prebsc-1-s1.binance.org:8545";
    // if (searchParams.get("chain") === "bsc")
    else return "https://bsc-dataseed1.ninicoin.io/";
};

export const useStorageContractAddress = () => {
    const [searchParams] = useSearchParams();
    if (searchParams.get("chain") === "bsc-testnet")
        return "0x6809C8c62da239dda04882D2741076fe6395B320";
    // if (searchParams.get("chain") === "bsc")
    else return "0xA4A3a935f70f7b0c50ADe3465eD0B45772F6E479";
};

export const useDeployerContractAddress = () => {
    const [searchParams] = useSearchParams();
    if (searchParams.get("chain") === "bsc-testnet")
        return "0x5e29044ac21440b7b2B8f9650B61a8fc853BC81c";
    // if (searchParams.get("chain") === "bsc")
    else return "0xEBfC7BDafbee61ddA2F55Af077154236a021E16c";
};

export const useWhitelistedCrowdFundingAddress = () => {
    const [searchParams] = useSearchParams();
    if (searchParams.get("chain") === "bsc-testnet")
        return "0xdee4F70c21e123F1BBb27569a7B20B72F6D7e28b";
    // if (searchParams.get("chain") === "bsc")
    else return "0x3946D6BB4500A35464849C82346ee07fB7261Dd7";
};

export const useCrowdFundingAddress = () => {
    const [searchParams] = useSearchParams();
    if (searchParams.get("chain") === "bsc-testnet")
        return "0x84e50267a74aa587623f3c2ad33e8d1f0fbef7df";
    // if (searchParams.get("chain") === "bsc")
    else return "0x84e50267a74aa587623f3c2ad33e8d1f0fbef7df";
};

export const useApeNftAddress = () => {
    const [searchParams] = useSearchParams();
    if (searchParams.get("chain") === "bsc-testnet")
        return "0xe663d69901bd99d5f980e64a708a7df975120058";
    // if (searchParams.get("chain") === "bsc")
    else return "0xE663d69901bd99D5F980e64A708A7dF975120058";
};

export const useLockerAddress = () => {
    const [searchParams] = useSearchParams();
    if (searchParams.get("chain") === "bsc-testnet")
        return "0xc21ac3bAD73Dd5769268216a2E0D52a805d73e97";
    // if (searchParams.get("chain") === "bsc")
    else return "0x9c4e442031dd5b4db753e71e6b1d30740bf7d75a";
};

export const useLPLockerAddress = () => {
    const [searchParams] = useSearchParams();
    if (searchParams.get("chain") === "bsc-testnet")
        return "0x6943a9A3bb248B9e561f9c17E8414a4247A3EA07";
    // if (searchParams.get("chain") === "bsc")
    else return "0xd673bDBd458982AC52632D83283B58E76FbFDB36";
};

export const usePCSRouterV2 = () => {
    const [searchParams] = useSearchParams();
    if (searchParams.get("chain") === "bsc-testnet")
        return "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3";
    // if (searchParams.get("chain") === "bsc")
    else return "0x10ed43c718714eb63d5aa57b78b54704e256024e";
};

export const usePCSFactoryV2 = () => {
    const [searchParams] = useSearchParams();
    if (searchParams.get("chain") === "bsc-testnet")
        return "0xca143ce32fe78f1f7019d7d551a6402fc5350c73";
    // if (searchParams.get("chain") === "bsc")
    else return "0xca143ce32fe78f1f7019d7d551a6402fc5350c73";
};

export const useNetworkScanURL = (suffix = "address") => {
    const [searchParams] = useSearchParams();
    if (searchParams.get("chain") === "bsc-testnet")
        return `https://testnet.bscscan.com/${suffix}/`;
    // if (searchParams.get("chain") === "bsc")
    else return `https://bscscan.com/${suffix}/`;
};

export const useIntenseAddress = () => {
    const [searchParams] = useSearchParams();
    if (searchParams.get("chain") === "bsc-testnet")
        return "0xC8082df0C7A966BbA9016D26342e679817671122";
    // if (searchParams.get("chain") === "bsc")
    else return "0xc791a03d9D3D61621d1156FCEF7A3bF36A625e0F";
};

export const useStealthStorageAddress = () => {
    const [searchParams] = useSearchParams();
    if (searchParams.get("chain") === "bsc-testnet")
        return "0xff8E14C27d29c254d887C6d6eD86233573A3F541";
    // if (searchParams.get("chain") === "bsc")
    else return "0xff8E14C27d29c254d887C6d6eD86233573A3F541";
};
export const useStealthDeployerAddress = () => {
    const [searchParams] = useSearchParams();
    if (searchParams.get("chain") === "bsc-testnet")
        return "0x150DE90Ba33De5b8ba3805Aec5Fd6ECEda2E9A0f";
    // if (searchParams.get("chain") === "bsc")
    else return "0x150DE90Ba33De5b8ba3805Aec5Fd6ECEda2E9A0f";
};
export const useBUSDAddress = () => {
    const [searchParams] = useSearchParams();
    if (searchParams.get("chain") === "bsc-testnet")
        return "0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7";
    else return "0xe9e7cea3dedca5984780bafc599bd69add087d56";
};
export const useWBNBAddress = () => {
    const [searchParams] = useSearchParams();
    if (searchParams.get("chain") === "bsc-testnet")
        return "0xae13d989dac2f0debff460ac112a837c89baa7cd";
    else return "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";
};

export const useStakingAddress = () => {
    const [searchParams] = useSearchParams();
    if (searchParams.get("chain") === "bsc-testnet")
        return "0x2E54f7Fe338c82A9FC087C3177fce412C6d371df";
    else return "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";
};

export const useStakingTokenAddress = () => {
    const [searchParams] = useSearchParams();
    if (searchParams.get("chain") === "bsc-testnet")
        return "0xEc206Cc05d856d5a7C87d0a410cce8f8556a8f63";
    else return "0xb314b8703e07eb1861f1c4b99bef65e379c52bbc";
};

export const useOldStakingContractAddress = () => {
    const [searchParams] = useSearchParams();
    if (searchParams.get("chain") === "bsc-testnet")
        return "0xEEbd1cC25CF3b4761a9C1451D1cb1B987B6D54a6";
    else return "0xA9605B16959F2Fcd0433382A3bD42264903C27eB";
};

export const useOldStakingTokenAddress = () => {
    const [searchParams] = useSearchParams();
    if (searchParams.get("chain") === "bsc-testnet")
        return "0x621BFaDd95E0F7E0E3009d553343615c379360A9";
    else return "0xb314b8703e07eb1861f1c4b99bef65e379c52bbc";
};

export const useMyWeb3 = () => {
    const { library } = useWeb3React();
    const HTTP_RPC_URL = useRpcURL();
    const provider = new Web3(new Web3.providers.HttpProvider(HTTP_RPC_URL));
    return new Web3(library ? library.provider : provider);
};
