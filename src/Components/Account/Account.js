import { getEllipsisTxt } from "../../helpers/formatters";
import Blockie from "../UI/Blockie";
import { useState } from "react";
import Address from "../Address/Address";
import { SelectOutlined } from "@ant-design/icons";
import { connectors } from "./config";
import wallet from "../../assets/images/wallet.svg";
import {
    useEagerConnect,
    useInactiveListener,
    useNetworkScanURL,
} from "../../hooks";
import { useWeb3React } from "@web3-react/core";
import { injected, walletconnect } from "../../connector";

const wallets = {
    injected: injected,
    walletconnect: walletconnect,
};

const styles = {
    account: {
        height: "42px",
        padding: "0 15px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "fit-content",
        borderRadius: "12px",
        backgroundColor: "rgb(244, 244, 244)",
        cursor: "pointer",
    },
    text: {
        color: "#206edd",
    },
    connector: {
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        height: "auto",
        justifyContent: "center",
        marginLeft: "auto",
        marginRight: "auto",
        padding: "20px 5px",
        cursor: "pointer",
    },
    icon: {
        alignSelf: "center",
        fill: "rgb(40, 13, 95)",
        flexShrink: "0",
        marginBottom: "8px",
        height: "30px",
    },
};

function Account() {
    const NETWORK_SCAN_URL = useNetworkScanURL();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);

    const { active, account, activate, deactivate } = useWeb3React();

    const triedEager = useEagerConnect();
    useInactiveListener(!triedEager);
    async function disconnectAccount() {
        try {
            deactivate();
        } catch (ex) {
            console.log(ex);
        }
    }

    const connectAccount = async (connectorId) => {
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

    const onClickHandler = () => {
        if (active) setIsModalVisible(true);
        else setIsAuthModalVisible(true);
    };

    return (
        <div className="flex">
            <div
                className="bg-white dark:bg-walletIndigo flex items-center rounded-lg hover:shadow-lg cursor-pointer lg:w-40 justify-between p-2 lg:pl-5"
                onClick={onClickHandler}
            >
                <div className="hidden lg:block text-center text-itemIndigo dark:text-white">
                    {active ? getEllipsisTxt(account, 4) : "Connect"}
                </div>
                {active && <Blockie size={6} address={account} />}
                <img
                    src={wallet}
                    alt="Wallet"
                    className={`w-7 ${active && "hidden"}`}
                ></img>
            </div>

            <div className={`${isModalVisible ? "flex" : "hidden"} ace-modal`}>
                <div
                    className="ace-modal-overlay"
                    onClick={() => setIsModalVisible(false)}
                />
                <div className="ace-modal-main w-80 2xl:w-96">
                    <div className="ace-modal-header">
                        <span>Account</span>
                        <button
                            type="button"
                            className="ace-modal-close-button"
                            onClick={() => setIsModalVisible(false)}
                        >
                            <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </button>
                    </div>
                    <div className="ace-modal-body pb-6 flex flex-col">
                        <div className="p-4 my-8 mx-6 border-2 rounded-2xl border-itemIndigo dark:border-itemPurple">
                            <div className="flex flex-col">
                                <Address
                                    account={account}
                                    avatar="left"
                                    size={6}
                                    copyable
                                />
                                <div className="mt-5 size-base font-medium flex items-center justify-center gap-3">
                                    <a
                                        href={`${NETWORK_SCAN_URL}${account}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-linkBlue flex gap-2 items-center"
                                    >
                                        <SelectOutlined />
                                        View on Explorer
                                    </a>
                                </div>
                            </div>
                        </div>
                        <button
                            className="bg-itemIndigo dark:be-itemPurple text-white mx-auto px-11"
                            onClick={async () => {
                                disconnectAccount();
                                setIsModalVisible(false);
                            }}
                        >
                            Disconnect Wallet
                        </button>
                    </div>
                </div>
            </div>

            <div
                className={`${
                    isAuthModalVisible ? "flex" : "hidden"
                } ace-modal`}
            >
                <div
                    className="ace-modal-overlay"
                    onClick={() => setIsAuthModalVisible(false)}
                />
                <div className="ace-modal-main w-96">
                    <div className="ace-modal-header">
                        <span>Connect Wallet</span>
                        <button
                            type="button"
                            className="ace-modal-close-button"
                            onClick={() => setIsAuthModalVisible(false)}
                        >
                            <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </button>
                    </div>
                    <div className="ace-modal-body">
                        <div className="grid grid-cols-2">
                            {connectors.map(
                                ({ title, icon, connectorId }, key) => (
                                    <div
                                        className="flex flex-col justify-center items-center py-5 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-500 duration-150"
                                        key={key}
                                        onClick={async () => {
                                            try {
                                                await connectAccount(
                                                    connectorId
                                                );
                                                setIsAuthModalVisible(false);
                                            } catch (e) {
                                                console.error(e);
                                            }
                                        }}
                                    >
                                        <img
                                            src={icon}
                                            alt={title}
                                            style={styles.icon}
                                        />
                                        <span className="size-base font-medium text-itemPurple">
                                            {title}
                                        </span>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Account;
