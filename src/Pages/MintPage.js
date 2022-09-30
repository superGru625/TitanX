import Web3 from "web3";
import { useState, useEffect } from "react";
import { HiPlusSm, HiMinusSm } from "react-icons/hi";

import NFT_Group from "../assets/images/mint/nft-group.png";
import ROAD_MAP from "../assets/images/mint/roadmap.png";
import NFT_MINER from "../assets/images/mint/miner.png";

import toast from "react-hot-toast";

import ABI_MINT from "../abis/mint/ABI_Mint.json";
import {
    GOOGLE_NFT_SCRIPT_API_ENDPOINT,
    MINT_PRICE_BNB,
} from "../utils/constants";
import { useApeNftAddress } from "../hooks";
import { useWeb3React } from "@web3-react/core";

const MintPage = () => {
    const { active, account, library } = useWeb3React();
    const APE_NFT_ADDRESS = useApeNftAddress();
    const [balance, setbalance] = useState(0);
    const [mintQty, setMintQty] = useState(1);
    const [id_num, setID] = useState(0);
    var URIImage = new Image(300, 300);

    const increaseQty = () => {
        setMintQty(mintQty + 1);
    };
    const decreaseQty = () => {
        if (mintQty === 1) return;
        setMintQty(mintQty - 1);
    };

    useEffect(() => {
        if (active) {
            getData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active]);

    const getData = async () => {
        try {
            const web3 = new Web3(library.provider); //const web3 = window.web3;// await Moralis.Web3.enableWeb3()
            let contract = new web3.eth.Contract(ABI_MINT, APE_NFT_ADDRESS);
            let count_nft = await contract.methods.balanceOf(account).call();
            setbalance(count_nft);
        } catch (error) {}
    };

    const loadNFT = async () => {
        try {
            const web3 = new Web3(library.provider); //const web3 = window.web3;// await Moralis.Web3.enableWeb3()
            let contract = new web3.eth.Contract(ABI_MINT, APE_NFT_ADDRESS);
            let custom_abi = await contract.methods.tokenURI(id_num).call();
            //console.log(custom_abi)
            //image.src(URIImage.src);
            URIImage.src = JSON.parse(atob(custom_abi.substring(29))).image;
            document.getElementById("NFT_img").src = URIImage.src.toString();
            //console.log("URI is", URIImage);
        } catch (error) {
            // console.log("data", error);
        }
    };

    const getReward = async (e) => {
        e.target.classList.toggle("activate");
        if (mintQty === 1) {
            try {
                const array = await getNewCID();
                const data = array[0];
                // const cid = array[1];

                try {
                    const web3 = new Web3(library.provider); //const web3 = window.web3;// await Moralis.Web3.enableWeb3()
                    let contract = new web3.eth.Contract(
                        ABI_MINT,
                        APE_NFT_ADDRESS
                    );
                    const result = await contract.methods
                        .mintPublic(data)
                        .send({
                            from: account,
                            value: MINT_PRICE_BNB * 10 ** 18,
                        });
                    const status = result.status;
                    if (status === true) {
                        // console.log("status is true");
                        const id = result.events["Transfer"].returnValues["2"];
                        alert(
                            `SUCCESSFUL DELIVERY! APE #${id} IS BORN, TAKE CARE OF IT...`
                        );
                        // const update = await updateDatabase(cid, result);
                        // console.log(update);
                    } else {
                        // console.log("STATUS NOT TRUE!");
                    }
                } catch (error) {
                    // console.log("Error while sending the Transaction", error);
                }
                // console.log("This is the end");
            } catch (error) {
                // console.log("Error while getting the CID", error);
            }
        } else {
            let offChainArray = { dataArr: [], cidArr: [] };
            let i = 0,
                counter = 0;
            await new Promise((resolve, reject) => {
                for (i = 0; i < mintQty; i++) {
                    // eslint-disable-next-line no-loop-func
                    getNewCID().then((data) => {
                        const offChainItem = {
                            data: data[0],
                            cid: data[1],
                        };
                        offChainArray.dataArr.push(offChainItem.data);
                        offChainArray.cidArr.push(offChainItem.cid);
                        counter++;
                        if (counter === mintQty) resolve();
                    });
                }
            }).catch((error) => console.log(error));
            // console.log(offChainArray);
            try {
                const web3 = new Web3(library.provider); //const web3 = window.web3;// await Moralis.Web3.enableWeb3()
                let contract = new web3.eth.Contract(ABI_MINT, APE_NFT_ADDRESS);
                await contract.methods
                    .mintPublic(offChainArray.dataArr)
                    .send({ from: account, value: 5 * 10 ** 16 * mintQty });
                toast.success(
                    `${mintQty} APEs ARE BORN, TAKE CARE OF THEM...`,
                    {
                        style: {
                            borderRadius: "10px",
                            background: "#333",
                            color: "#fff",
                        },
                    }
                );
            } catch (error) {}
        }
    };

    const getNewCID = async () => {
        // GET request to our endpoint
        const response = await fetch(GOOGLE_NFT_SCRIPT_API_ENDPOINT);
        const raw = await response.json();
        const cid = raw.result;

        //build the json
        const json = `{"description": "This NFT is from titanx.org","name": "TitanX","external_link": "https://titanx.org","image": "https://ipfs.io/ipfs/${cid}"}`;
        // console.log(json);
        //convert json file to base64
        const b64 = Buffer.from(json).toString("base64");

        //build the data
        const data = `data:application/json;base64,${b64}`;

        //return the data and cid in an array
        return [data, cid];
    };

    // const updateDatabase = async (cid, result) => {
    //     const owner = result.events["Transfer"].returnValues["1"];
    //     const id = result.events["Transfer"].returnValues["2"];
    //     const tx = result.transactionHash;
    //     const formData = new FormData();
    //     formData.append("cid", cid);
    //     formData.append("id", id);
    //     formData.append("tx", tx);
    //     formData.append("owner", owner);
    //     const requestOptions = {
    //         method: "POST",
    //         body: formData,
    //     };
    //     const response = await fetch(ENDPOINT, requestOptions);
    //     const data = await response.json();
    //     return data.result;
    // };

    return (
        <div className="main-container animation-fade-in flex flex-col lg:flex-row bg-[#E2E5FA] dark:bg-[#31304F]">
            <div className="flex flex-col w-full rounded-2xl bg-white dark:bg-sideIndigo overflow-hidden items-center shadow-lg">
                <div className="w-[200%] lg:w-[107%] pt-16 pb-8">
                    <img src={NFT_Group} alt="NFT Group" />
                </div>
                <div className="text-center size-4 font-semibold leading-normal">
                    Buy an NFT
                    <br /> Mint Full
                    <span className="text-[#FF6E38]"> John Wick</span>
                    <br /> WIN $5000 💰
                </div>
                <span className="px-8 size-1 text-center py-8">
                    Deep within the Binance Smart Chain there lies an expensive
                    laboratory. Rich scientists built it to run tests on poor
                    apes. But the apes didn’t want to be poor anymore, and rose
                    up!
                </span>
                <span className="px-8 size-1 text-center pb-8">
                    They overthrew the scientists and ran them off. But the
                    scientists left in such a hurry, they forgot their credit
                    cards! Now armed with some credit and an online shopping
                    account, they accessorized. Everything they ever wanted to
                    buy. Including a large…pink… club? They aren’t sure what it
                    was but it wasn’t their money so who cares?
                </span>
            </div>
            <div className="flex flex-col w-full overflow-hidden items-center p-6 pb-0">
                <span
                    className="size-4 font-semibold text-itemIndigo dark:text-white pb-6"
                    style={{ textShadow: "2px 2px 0px #FF6E38" }}
                >
                    Minting Roadmap
                </span>

                <div className="flex flex-col-reverse lg:flex-row">
                    <div className="flex flex-col w-full roadmap gap-4 lg:w-3/5">
                        <div className="flex flex-col roadmap-item">
                            <span className="roadmap-handle size-2">
                                0 -1250{" "}
                            </span>
                            <span className="size-sm">
                                NFT Mint goes live with a rarity list and some
                                of the most epic NFT’s on the market.
                            </span>
                        </div>
                        <div className="flex flex-col roadmap-item">
                            <span className="roadmap-handle size-2">
                                1251 - 2500
                            </span>
                            <span className="size-sm">
                                Unannounced we will perform a buyback and burn
                                of Títan token with 33% of the funds raised from
                                the sale of these NFT’s
                            </span>
                        </div>
                        <div className="flex flex-col roadmap-item">
                            <span className="roadmap-handle size-2">
                                2551 - 3750
                            </span>
                            <span className="size-sm">
                                At 2500 sold we will announce 5 Gold NFT’s that
                                can be exchanged directly for $1000 USDT each.
                                They may or may not have already been minted…..
                            </span>
                        </div>
                        <div className="flex flex-col roadmap-item">
                            <span className="roadmap-handle size-2">
                                5000 SOLD
                            </span>
                            <span className="size-sm">
                                At or around 5000 Sold we will perform another
                                buy back and burn and showcase the Diamond Hand
                                NFT worth $5,000 USDT
                            </span>
                        </div>
                    </div>
                    <div className="h-full w-full lg:w-2/5 flex flex-col justify-center">
                        <img src={ROAD_MAP} alt="mint roadmap" />
                    </div>
                </div>

                <div className="flex flex-col-reverse lg:flex-row relative">
                    <div className="w-full lg:w-1/2 flex flex-col justify-end">
                        <img src={NFT_MINER} alt="mint miner" />
                    </div>
                    <div className="w-full lg:w-1/2 flex flex-col items-center">
                        <button className="flex flex-row items-center gap-8">
                            <HiMinusSm
                                onClick={decreaseQty}
                                className="rounded-full text-white bg-itemIndigo dark:bg-itemPurple h-8 w-8"
                            />
                            <span className="mint">{mintQty}</span>
                            <HiPlusSm
                                onClick={increaseQty}
                                className="rounded-full text-white bg-itemIndigo dark:bg-itemPurple h-8 w-8"
                            />
                        </button>
                        <button
                            className="bg-itemIndigo dark:bg-itemPurple text-white w-48 mt-4 hover:opacity-80"
                            onClick={getReward}
                        >
                            Mint
                        </button>
                        <span className="size-base mb-3">
                            {MINT_PRICE_BNB} BNB per Lab Ape
                        </span>
                        <input
                            type="text"
                            onChange={(e) => {
                                setID(e.target.value);
                            }}
                        />
                        <span className="mt-4 mb-1">
                            You own {balance} NFTs
                        </span>
                        <button
                            className="bg-itemIndigo dark:bg-itemPurple text-white w-48 hover:opacity-80"
                            onClick={loadNFT}
                        >
                            Load NFT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default MintPage;
