import { useEffect, useRef, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import bsc from "../../assets/images/bsc.svg";

const menuItems = [
    {
        key: 56,
        value: "Mainnet",
        icon: bsc,
        networkHex: "0x38",
    },
    {
        key: 97,
        value: "Testnet",
        icon: bsc,
        networkHex: "0x61",
    },
];

function Chains() {
    const { chainId } = useWeb3React();
    const [selected, setSelected] = useState({});
    const [dropdown, setDropdown] = useState(false);

    const ref = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);

    useEffect(() => {
        const tempCid = chainId === undefined ? 56 : chainId;
        const newSelected = menuItems.find((item) => item.key === tempCid);
        setSelected(newSelected);
    }, [chainId]);

    const handleMenuClick = async (e) => {
        console.log("switch to: ", e);
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: e }],
        });
    };

    return (
        <div
            className="hidden lg:flex items-center relative w-32 lg:w-36 cursor-pointer"
            onClick={() => setDropdown((prev) => !prev)}
            ref={ref}
        >
            <div className="flex p-2 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-t-lg bg-opacity-20">
                <img src={selected.icon} className="h-8" alt={selected.value} />
                <span className="leading-8 text-black dark:text-white px-2">
                    {selected.value}
                </span>
            </div>
            {dropdown && (
                <div className="absolute flex flex-col top-12 animation-enter bg-gray-100 dark:bg-gray-700 rounded-b-lg z-[10]">
                    {menuItems.map((item) => (
                        <div
                            className="flex p-2 hover:bg-gray-200 dark:hover:bg-gray-500 bg-opacity-20"
                            key={item.key}
                            onClick={() => handleMenuClick(item.networkHex)}
                        >
                            <img
                                src={item.icon}
                                alt={item.value}
                                className="h-8"
                            />
                            <span className="leading-8 text-black dark:text-white px-2">
                                {item.value}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Chains;
