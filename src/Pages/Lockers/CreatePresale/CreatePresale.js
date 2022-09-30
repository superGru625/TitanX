import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import InputItem from "./InputItem";

import PresaleMasterABI from "../../../abis/ABI_Master.json";
import ABI_StorageLaunchpad from "../../../abis/ABI_StorageLaunchpad.json";

import PresaleDetails from "../../../Components/PresaleInfo/PresaleDetails";

import { ReactComponent as PascalSvg } from "../../../assets/images/launchpad/pascale.svg";
import {
    useDeployerContractAddress,
    usePCSRouterV2,
    useStorageContractAddress,
} from "../../../hooks";

const CreatePresale = () => {
    const PRESALE_CONTRACT_ADDRESS = useDeployerContractAddress();
    const STORAGE_CONTRACT_ADDRESS = useStorageContractAddress();
    const PCS_ROUTER_V2 = usePCSRouterV2();
    const navigate = useNavigate();

    const { active, account, library } = useWeb3React();

    const [notice, setNotice] = useState("");
    const [presaleAddress, setPresaleAddress] = useState("");
    const [modalShow, setModalShow] = useState(false);

    useEffect(() => {
        if (active === true) {
            window.web3 = new Web3(library.provider);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active]);

    const tokenAddRef = useRef(null);
    const promoCodeRef = useRef(null);
    const hardCapRef = useRef(null);
    const liqudityRef = useRef(null);
    const selectRouterRef = useRef(null);
    const listingRateRef = useRef(null);
    const presaleRateRef = useRef(null);
    const minConRef = useRef(null);
    const maxConRef = useRef(null);
    const preSaleStartRef = useRef(null);
    const preSaleEndRef = useRef(null);
    const liqudityLockTimeRef = useRef(null);

    const checkAllDataForUpload = () => {
        console.log(liqudityRef.current.innerText);
        if (active) {
            const data = {
                tokenAddress: tokenAddRef.current.value,
                promoCodeRef: promoCodeRef.current.value,
                hardCapRef: hardCapRef.current.value,
                liqudityRef: liqudityRef.current.innerText.substring(
                    0,
                    liqudityRef.current.innerText.length - 1
                ),
                selectRouterRef: PCS_ROUTER_V2,
                listingRateRef: parseInt(listingRateRef.current.value),
                presaleRateRef: parseInt(presaleRateRef.current.value),
                minConRef: window.web3.utils.toWei(
                    minConRef.current.value.toString(),
                    "ether"
                ),
                maxConRef: window.web3.utils.toWei(
                    maxConRef.current.value.toString(),
                    "ether"
                ),
                preSaleStartRef:
                    new Date(preSaleStartRef.current.value).getTime() / 1000,
                preSaleEndRef:
                    new Date(preSaleEndRef.current.value).getTime() / 1000,
                liqudityLockTimeRef:
                    new Date(liqudityLockTimeRef.current.value).getTime() /
                    1000,
            };

            if (
                data.tokenAddress !== "" &&
                data.promoCodeRef !== "" &&
                data.hardCapRef !== "" &&
                data.liqudityRef !== "" &&
                data.selectRouterRef !== "" &&
                data.listingRateRef !== "" &&
                data.presaleRateRef !== "" &&
                data.minConRef !== "" &&
                data.maxConRef !== "" &&
                data.preSaleStartRef !== "" &&
                data.preSaleEndRef !== "" &&
                data.liqudityLockTimeRef !== ""
            ) {
                setNotice("Loading Please wait....");
                createPresleContract(data);
            } else {
                setNotice("Please fill all informations Correct");
            }
        }
    };

    const createPresleContract = async (data) => {
        const web3 = window.web3;
        const _preSaleContract = await new web3.eth.Contract(
            PresaleMasterABI,
            PRESALE_CONTRACT_ADDRESS
        );
        const presaleFee = await _preSaleContract.methods.presaleFee().call();
        try {
            // const _data = await _preSaleContract.methods.createNewPresale(data.promoCodeRef,data.tokenAddress,data.presaleRateRef,data.hardCapRef,data.minConRef,data.maxConRef,data.liqudityRef,data.listingRateRef,data.preSaleStartRef,data.preSaleEndRef,data.liqudityLockTimeRef,data.selectRouterRef).send({ from: account });
            console.log("promoCodeRef:", data.promoCodeRef);
            console.log("tokenAddress:", data.tokenAddress);
            console.log("presaleRateRef:", data.presaleRateRef);
            console.log("hardCapRef:", data.hardCapRef);
            console.log("minConRef:", data.minConRef);
            console.log("maxConRef:", data.maxConRef);
            console.log("liqudityRef:", data.liqudityRef);
            console.log("listingRateRef:", data.listingRateRef);
            console.log("preSaleStartRef:", data.preSaleStartRef);
            console.log("preSaleEndRef:", data.preSaleEndRef);
            console.log("liqudityLockTimeRef:", data.liqudityLockTimeRef);
            console.log("selectRouterRef:", data.selectRouterRef);
            await _preSaleContract.methods
                .createNewPresale(
                    // data.promoCodeRef,
                    data.tokenAddress,
                    data.presaleRateRef,
                    data.hardCapRef,
                    data.minConRef,
                    data.maxConRef,
                    data.liqudityRef,
                    data.listingRateRef,
                    data.preSaleStartRef,
                    data.preSaleEndRef,
                    data.liqudityLockTimeRef,
                    data.selectRouterRef
                )
                .send({ from: account, value: presaleFee });

            const _storageContract = await new web3.eth.Contract(
                ABI_StorageLaunchpad,
                STORAGE_CONTRACT_ADDRESS
            );
            const _totalProjects = await _storageContract.methods
                .getProjectsCount()
                .call();
            const _preSaleAddress = await _storageContract.methods
                .entryListByPresaleAddress(_totalProjects - 1)
                .call();
            console.log(_preSaleAddress);
            setPresaleAddress(_preSaleAddress);
            navigate("/dashboard/manage-presale?detailmodal=true");
        } catch (error) {
            console.log(error.message);
            setNotice(error.message);
        }
    };

    const createLaunchPadArray = [
        {
            name: "Token Address",
            placeholder: "Enter contact address",
            width: "w-full",
            forRef: tokenAddRef,
        },
        {
            name: "PromoCode",
            placeholder: "Enter promo code or None",
            forRef: promoCodeRef,
        },
        {
            name: "Hard Cap",
            warning: "Softcap is half of hardcap",
            placeholder: "Example 100 BNB",
            forRef: hardCapRef,
        },
        {
            name: "Liquidity %",
            placeholder: "01/01/22",
            select: ["51%", "60%", "70%", "80%", "90%", "100%"],
            initialValue: "70%",
            forRef: liqudityRef,
        },

        {
            name: "Select Router",
            select: ["PancakeSwap v2"],
            initialValue: "PancakeSwap v2",
            forRef: selectRouterRef,
        },
        {
            name: "Listing Rate",
            placeholder: "Example 10000",
            forRef: listingRateRef,
        },
        {
            name: "Presale Rate",
            placeholder: "Example 10000",
            forRef: presaleRateRef,
        },
        {
            name: "Minimum Contribution",
            placeholder: "0.1",
            forRef: minConRef,
        },
        {
            name: "Maximum Contribution",
            placeholder: "2",
            forRef: maxConRef,
        },
        {
            name: "Presale Start date",
            type: "date",
            forRef: preSaleStartRef,
        },
        {
            name: "Presale End date",
            type: "date",
            forRef: preSaleEndRef,
        },
        {
            name: "Liquity Lock Time",
            type: "date",
            warning: "Minimum 3 Months",
            width: "w-full",
            forRef: liqudityLockTimeRef,
        },
    ];

    return (
        <div className="flex flex-col mx-6 rounded-2xl component-container justify-center items-center text-center animation-fade-in">
            <PresaleDetails
                presaleAddress={presaleAddress}
                offChainData={{}}
                show={modalShow}
                setShow={setModalShow}
            />
            <div className="flex flex-col items-center p-4 lg:w-2/3">
                <PascalSvg className="fill-itemIndigo dark:fill-itemPurple" />
                <h5 className="py-2 size-1 font-bold text-itemIndigo dark:text-itemPurple">
                    Create Presale
                </h5>

                <span className="text-black dark:text-white">
                    Free to setup launchpad - We only charge if your project is
                    successful.{" "}
                </span>
                <span className="size-base py-1 text-mainOrange">
                    You must have the ability to whitelist (exclude Fromfee)
                    multiple addresses or turn off special transfers if any
                    burn, rebase or other special transfers are to take place.
                </span>
            </div>
            <div className="flex flex-wrap items-center justify-between text-left px-4 lg:w-2/3 gap-3">
                {createLaunchPadArray.map((el, i) => (
                    <InputItem key={i} {...el} />
                ))}
            </div>
            {active ? (
                <button
                    className="text-white button bg-buttonLightOrange dark:bg-buttonDarkOrange my-6 w-1/3"
                    onClick={checkAllDataForUpload}
                >
                    Next
                </button>
            ) : (
                <button
                    className="text-white button bg-buttonLightOrange dark:bg-buttonDarkOrange my-6 w-1/3"
                    disabled={true}
                >
                    Please Connect Wallect
                </button>
            )}
            <p>{notice}</p>
            {/* <div className="hidden MuiInput-formControl MuiInput-Input MuiSvgIcon-root" /> */}
        </div>
    );
};
export default CreatePresale;
