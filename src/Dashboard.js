import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
// import { useRecoilState } from "recoil";

import Sidebar from "./Components/Sidebar/Sidebar";
import ColorThemeToggler from "./Components/UI/ColorThemeToggler";
import Navbar from "./Components/Navbar/Navbar";
import MintPage from "./Pages/MintPage";
import DefiExchange from "./Pages/DefiExchangePage";
// import Stake from "./Pages/Stake";
import StakeOld from "./Pages/StakeOld";

import CreateTokenLocker from "./Pages/Lockers/CreateTokenLocker";
import CreatePresale from "./Pages/Lockers/CreatePresale/CreatePresale";
import LaunchPadDashboard from "./Components/LaunchPad/LaunchPadDashboard/LaunchPadDashboard";
import TokenLocker from "./Pages/Lockers/TokenLocker/TokenLockers";
import TokenLockerInfo from "./Pages/TokenLockerInfo";
import PreSaleInfoPage from "./Pages/PreSaleInfoPage";
import SwitchNetwork from "./Pages/SwitchNetwork";
import StealthDashboard from "./Pages/StealthDashboard";

import Scan from "./Pages/Scan";

import ManagePresale from "./Pages/ManagePreSales";

import { injected, walletconnect } from "./connector";
import {
    useEagerConnect,
    useInactiveListener,
    useValidAccount,
    useRpcURL,
} from "./hooks";

import CreateLiquidityLocker from "./Pages/Lockers/Liquidity/CreateLiquidityLocker";
import LiquidityLocker from "./Pages/Lockers/Liquidity/LiquidityLocker";
import LiquidityInfo from "./Pages/Lockers/Liquidity/LiquidityInfo";
import WhitelistedPrivateSale from "./Pages/WhitelistedPrivateSale";
import SubmitDocuments from "./Pages/SubmitDocuments";
import TermsConditions from "./Pages/TermsConditions";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import CreateStealth from "./Pages/CreateStealth";
import StealthInfoPage from "./Pages/StealthInfoPage";
import StealthManagePage from "./Pages/StealthManagePage";

const wallets = {
    injected: injected,
    walletconnect: walletconnect,
};

function Dashboard() {
    const { active, library, activate, deactivate, chainId } = useWeb3React();
    const { account } = useValidAccount();
    const HTTP_RPC_URL = useRpcURL();

    const [collapsed, setCollapsed] = useState(false);
    const [connected, setConnected] = useState(active);

    const triedEager = useEagerConnect();
    useInactiveListener(!triedEager);

    const getUserInfo = async () => {
        const provider = new Web3(
            new Web3.providers.HttpProvider(HTTP_RPC_URL)
        );
        window.web3 = new Web3(library ? library.provider : provider);
        setConnected(true);
    };

    useEffect(() => {
        account && getUserInfo();
        if (active === false) {
            setConnected(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account, active]);

    useEffect(() => {
        // console.log(chainId);
        // if (chainId === 97) navigate("/dashboard/switch-network");
    }, [chainId]);

    async function disconnectAccount() {
        try {
            deactivate();
            setConnected(false);
        } catch (ex) {
            console.log(ex);
        }
    }

    const ConnectAccount = async (connectorId) => {
        try {
            await activate(wallets[connectorId], (error) => {
                if (error) {
                    alert(error);
                }
            });
        } catch (error) {
            alert(error);
        }
    };

    return (
        <div className="flex animation-fade-in">
            <ColorThemeToggler />
            <div className="flex w-full">
                <div className="fixed md:static sidebar-container h-full z-[10]">
                    <Sidebar
                        collapsed={collapsed}
                        setCollapsed={setCollapsed}
                    />
                </div>
                <div className="w-full left-container bg-mainWhite dark:bg-mainIndigo h-full overflow-y-scroll flex flex-col">
                    <Navbar
                        connected={connected}
                        account={account}
                        connectAccount={ConnectAccount}
                        disconnectAccount={disconnectAccount}
                        collapsed={collapsed}
                        setCollapsed={setCollapsed}
                    />

                    <Routes>
                        <Route
                            path="*"
                            element={<Navigate to="launchpad" replace />}
                        />
                        <Route
                            path="switch-network"
                            element={<SwitchNetwork />}
                        />
                        <Route
                            path="defi-exchange"
                            element={<DefiExchange />}
                        />
                        <Route
                            path="defi-exchange/:tokenAddress"
                            element={<DefiExchange />}
                        />
                        <Route
                            path="create-stealth"
                            element={<CreateStealth />}
                        />
                        <Route
                            path="stealth-dashboard"
                            element={<StealthDashboard />}
                        />
                        <Route
                            path="stealth-presale/:address"
                            element={<StealthInfoPage />}
                        />
                        <Route
                            path="manage-stealth"
                            element={<StealthManagePage />}
                        />
                        <Route
                            path="manage-stealth/:address"
                            element={<StealthManagePage />}
                        />

                        <Route
                            path="privateSale"
                            element={<WhitelistedPrivateSale />}
                        />
                        <Route
                            path="create-launchpad"
                            element={<CreatePresale />}
                        />
                        <Route
                            path="launchpad"
                            element={<LaunchPadDashboard />}
                        />
                        <Route
                            path="presale/:address"
                            element={<PreSaleInfoPage />}
                        />
                        <Route
                            path="manage-presale"
                            element={<ManagePresale />}
                        />

                        <Route
                            path="create-lock"
                            element={<CreateTokenLocker />}
                        />
                        <Route
                            path="token-info/:tokenAddress"
                            element={<TokenLockerInfo />}
                        />
                        <Route path="lock-token" element={<TokenLocker />} />
                        <Route
                            path="create-liquidity"
                            element={<CreateLiquidityLocker />}
                        />
                        <Route
                            path="lock-liquidity"
                            element={<LiquidityLocker />}
                        />

                        <Route
                            path="liquidity/:tokenAddress"
                            element={<LiquidityInfo />}
                        />
                        <Route
                            path="stake"
                            element={
                                <StakeOld
                                    connected={connected}
                                    account={account}
                                />
                            }
                        />
                        <Route path="scan" element={<Scan />} />
                        <Route
                            path="mint"
                            element={
                                <MintPage
                                    connected={connected}
                                    account={account}
                                />
                            }
                        />
                        <Route
                            path="submit-document"
                            element={<SubmitDocuments />}
                        />
                        <Route
                            path="terms-conditions"
                            element={<TermsConditions />}
                        />
                        <Route
                            path="privacy-policy"
                            element={<PrivacyPolicy />}
                        />
                    </Routes>
                </div>
                <div
                    className={!collapsed ? "sidebar-overlay" : "hidden"}
                    onClick={() => setCollapsed(true)}
                ></div>
            </div>
        </div>
    );
}

export default Dashboard;
