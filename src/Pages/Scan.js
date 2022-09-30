import Web3 from "web3";

import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { GiPouringPot } from "react-icons/gi";

const isHoneypot = async (address) => {
    let bnbIN = 1000000000000000000;
    let maxTXAmount = 0;
    let maxSell = 0;
    const hWeb3 = new Web3("https://bsc-dataseed1.defibit.io/");
    const getBNBIn = async (address) => {
        let amountIn = maxTXAmount;
        if (maxSell !== 0) {
            amountIn = maxSell;
        }
        let WETH = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";
        let path = [address, WETH];
        let sig = hWeb3.eth.abi.encodeFunctionCall(
            {
                name: "getAmountsOut",
                type: "function",
                inputs: [
                    { type: "uint256", name: "amountIn" },
                    { type: "address[]", name: "path" },
                ],
                outputs: [{ type: "uint256[]", name: "amounts" }],
            },
            [amountIn, path]
        );

        let d = {
            to: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
            from: "0x8894e0a0c962cb723c1976a4421c95949be2d4e3",
            value: 0,
            gas: 15000000,
            data: sig,
        };
        try {
            let val = await hWeb3.eth.call(d);
            let decoded = hWeb3.eth.abi.decodeParameter("uint256[]", val);
            bnbIN = hWeb3.utils.toBN(decoded[1]);
        } catch (e) {
            console.log(e);
        }
    };

    const getMaxes = async () => {
        let sig = hWeb3.eth.abi.encodeFunctionSignature({
            name: "_maxTxAmount",
            type: "function",
            inputs: [],
        });
        let d = {
            to: address,
            from: "0x8894e0a0c962cb723c1976a4421c95949be2d4e3",
            value: 0,
            gas: 15000000,
            data: sig,
        };
        try {
            let val = await hWeb3.eth.call(d);
            maxTXAmount = hWeb3.utils.toBN(val);
        } catch (e) {
            sig = hWeb3.eth.abi.encodeFunctionSignature({
                name: "maxSellTransactionAmount",
                type: "function",
                inputs: [],
            });
            let d = {
                to: address,
                from: "0x8894e0a0c962cb723c1976a4421c95949be2d4e3",
                value: 0,
                gas: 15000000,
                data: sig,
            };
            try {
                let val2 = await hWeb3.eth.call(d);
                maxSell = hWeb3.utils.toBN(val2);
            } catch (e) {
                console.log(e);
            }
        }
    };
    await getMaxes();
    if (maxTXAmount !== 0 || maxSell !== 0) {
        await getBNBIn(address);
    }

    let encodedAddress = hWeb3.eth.abi.encodeParameter("address", address);
    let contractFuncData = "0xd66383cb";
    let callData = contractFuncData + encodedAddress.substring(2);

    let blacklisted = {
        "0xa914f69aef900beb60ae57679c5d4bc316a2536a": "SPAMMING SCAM",
        "0x105e62565a31c269439b29371df4588bf169cef5": "SCAM",
        "0xbbd1d56b4ccab9302aecc3d9b18c0c1799fe7525":
            "Error: TRANSACTION_FROM_FAILED",
    };
    let unableToCheck = {
        "0x54810d2e8d3a551c8a87390c4c18bb739c5b2063":
            "Coin does not utilise PancakeSwap",
        "0xc0834ee3f6589934dc92c63a893b4c4c0081de06":
            "Due to anti-bot, Honeypot is not able to check at the moment.",
    };

    if (blacklisted[address.toLowerCase()] !== undefined) {
        return { is: "Yes", buy_tax: 0, sell_tax: 0 };
    }
    if (unableToCheck[address.toLowerCase()] !== undefined) {
        return { is: "Unknown", buy_tax: 0, sell_tax: 0 };
    }

    let value = 100000000000000000;
    if (bnbIN < value) {
        value = bnbIN - 1000;
    }

    const val = await hWeb3.eth.call({
        to: "0x2bf75fd2fab5fc635a4c6073864c708dfc8396fc",
        from: "0x8894e0a0c962cb723c1976a4421c95949be2d4e3",
        value: value,
        gas: 45000000,
        data: callData,
    });
    let decoded = hWeb3.eth.abi.decodeParameters(
        ["uint256", "uint256", "uint256", "uint256", "uint256", "uint256"],
        val
    );
    let buyExpectedOut = hWeb3.utils.toBN(decoded[0]);
    let buyActualOut = hWeb3.utils.toBN(decoded[1]);
    let sellExpectedOut = hWeb3.utils.toBN(decoded[2]);
    let sellActualOut = hWeb3.utils.toBN(decoded[3]);
    const buy_tax =
        Math.round(
            ((buyExpectedOut - buyActualOut) / buyExpectedOut) * 100 * 10
        ) / 10;
    const sell_tax =
        Math.round(
            ((sellExpectedOut - sellActualOut) / sellExpectedOut) * 100 * 10
        ) / 10;
    return { is: "No", buy_tax: buy_tax, sell_tax: sell_tax };
};

const Scan = () => {
    const [tokenAddress, setTokenAddress] = useState("N/A");
    const [tokenPrice, setTokenPrice] = useState(0);
    const [tokenName, setTokenName] = useState("N/A");
    const [tokenSymbol, setTokenSymbol] = useState("N/A");
    const [buyTax, setBuyTax] = useState(0);
    const [sellTax, setSellTax] = useState(0);
    const [honeyResult, setHoneyResult] = useState("ENTER TOKEN ADDRESS");
    const [honeyResult2, setHoneyResult2] = useState("ENTER TOKEN ADDRESS");
    const [honeyClass, setHoneyClass] = useState("idle-honey mx-auto");
    const [honeyClassBr, setHoneyClassBr] = useState(
        "idle-honey honey-breaking mx-auto"
    );

    const scanForHoneypot = async () => {
        setHoneyResult("⌛ SCANNING... ⌛");
        setHoneyResult2("⌛ SCANNING... ⌛");
        setHoneyClass("idle-honey mx-auto");
        setHoneyClassBr("idle-honey honey-breaking mx-auto");
        if (tokenAddress !== "N/A") {
            const hon = await isHoneypot(tokenAddress);
            if (hon.is === "No") {
                setHoneyResult("✔️ NOT HONEYPOT ✔️");
                setHoneyResult2("✔️ NOT HONEYPOT ✔️");
                setHoneyClass("not-honey  mx-auto w-100");
                setHoneyClassBr("not-honey  honey-breaking  mx-auto w-100");
            } else {
                setHoneyResult(
                    "❌ HONEY POT RUN THE FUCK AWAY AND DON’T LOOK BACK ❌"
                );
                setHoneyResult2(
                    "❌ HONEY POT RUN THE FUCK <br /> AWAY AND DON’T LOOK BACK ❌"
                );
                setHoneyClass("honey  mx-auto w-100");
                setHoneyClassBr("honey  honey-breaking  mx-auto w-100");
            }
            setBuyTax(hon.buy_tax);
            setSellTax(hon.sell_tax);
            const response = await fetch(
                `https://api.pancakeswap.info/api/v2/tokens/${tokenAddress}`
            );
            const raw = await response.json();
            const data = raw.data;
            const name = data.name;
            const price = data.price;
            const symb = data.symbol;
            setTokenName(name);
            setTokenPrice(price);
            setTokenSymbol(symb);
        }
    };

    const scanArray = [
        { name: "Address", number: tokenAddress },
        { name: "Token Name", number: tokenName },
        { name: "Symbol", number: tokenSymbol },
        { name: "Price", number: tokenPrice },
        { name: "Buy Tax", number: `${buyTax}%` },
        { name: "Sell Tax", number: `${sellTax}%` },
    ];

    return (
        <div className="main-container animation-fade-in component-container p-6 flex flex-col items-center">
            <GiPouringPot className="text-itemIndigo dark:text-itemPurple size-8" />
            <span className="text-itemIndigo dark:text-itemPurple size-3 font-semibold">
                Honeypot Scan
            </span>
            <span className="py-1">
                Honeypot scan provides checks for the code in the contract for
                "Honey Pots". If not a honey pot still always do your own
                research!
            </span>
            <div className="flex flex-col lg:flex-row gap-x-8 gap-y-2 items-center justify-between pt-12">
                <div className="flex flex-row relative w-64 lg:w-96">
                    <FiSearch
                        size={16}
                        className="absolute text-itemIndigo dark:text-itemPurple h-full left-4"
                    />
                    <input
                        type="text"
                        className="bg-inputBg placeholder-[#440AD399] border-none rounded-full pl-12 w-full"
                        onChange={(e) => {
                            setTokenAddress(e.target.value);
                        }}
                        placeholder="Enter token address to check honeypot"
                    />
                </div>

                <button
                    className="bg-[#FF6E38] text-white rounded-full px-8 size-base lg:size-1"
                    onClick={scanForHoneypot}
                >
                    Search
                </button>
            </div>
            <div className={honeyClass}>{honeyResult}</div>
            <div className={honeyClassBr}>{honeyResult2}</div>
            <div className="flex flex-col gap-6 w-full lg:w-3/4 2xl:w-1/2 mt-12">
                {scanArray.map((el, i) => (
                    <div key={i} className="flex flex-col">
                        <div
                            key={i}
                            className="flex flex-col lg:flex-row justify-between px-8"
                        >
                            <span>{el.name}</span>
                            <span className="text-right">{el.number}</span>
                        </div>
                        <div className="h-[1px] bg-black dark:bg-gray-600 bg-opacity-15" />
                    </div>
                ))}
            </div>
        </div>
    );
};
export default Scan;
