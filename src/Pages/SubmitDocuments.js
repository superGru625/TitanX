import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { useRef, useState } from "react";

import toast from "react-hot-toast";

import { HiDocumentSearch } from "react-icons/hi";

import PARTNER_00 from "../assets/images/kyc/partner_00.png";
import PARTNER_01 from "../assets/images/kyc/partner_01.png";
import PARTNER_02 from "../assets/images/kyc/partner_02.png";
import PARTNER_03 from "../assets/images/kyc/partner_03.png";
import PARTNER_04 from "../assets/images/kyc/partner_04.png";

import ABI_StorageLaunchpad from "../abis/ABI_StorageLaunchpad.json";
import { useStorageContractAddress } from "../hooks";

const SubmitDocuments = () => {
    const STORAGE_CONTRACT_ADDRESS = useStorageContractAddress();
    const { active, account } = useWeb3React();

    const [verified, setVerified] = useState(false);

    const partnerAddressRef = useRef(null);

    const typeSelectRef = useRef(null);
    const projectAddressRef = useRef(null);
    const certificateLinkRef = useRef(null);

    const verifyAddress = async () => {
        try {
            if (!active) {
                toast.error(`You need to connect Wallet to our App`, {
                    style: {
                        borderRadius: "10px",
                        background: "#333",
                        color: "#fff",
                    },
                });
                return;
            }

            const web3 = new Web3(Web3.givenProvider);
            const presaleContract = await new web3.eth.Contract(
                ABI_StorageLaunchpad,
                STORAGE_CONTRACT_ADDRESS
            );
            const isPartner = await presaleContract.methods
                .Partners(partnerAddressRef.current.value)
                .call();
            if (isPartner === false)
                toast.error(`You are not our Partner!`, {
                    style: {
                        borderRadius: "10px",
                        background: "#333",
                        color: "#fff",
                    },
                });
            if (isPartner === true) setVerified(true);
        } catch (error) {
            toast.error(`Something Went Wrong!`, {
                style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                },
            });
        }
    };
    const uploadDocument = async () => {
        try {
            if (!active) {
                toast.error(`You need to connect Wallet to our App`, {
                    style: {
                        borderRadius: "10px",
                        background: "#333",
                        color: "#fff",
                    },
                });
                return;
            }

            const web3 = new Web3(Web3.givenProvider);
            const presaleContract = await new web3.eth.Contract(
                ABI_StorageLaunchpad,
                STORAGE_CONTRACT_ADDRESS
            );
            // alert(account);
            // Is KYC
            if (typeSelectRef.current.value === "KYC") {
                await presaleContract.methods
                    .editKYC(
                        projectAddressRef.current.value,
                        certificateLinkRef.current.value,
                        account.toString(),
                        true
                    )
                    .send({ from: account });
            }
            // Is Audit
            if (typeSelectRef.current.value === "Audit") {
                await presaleContract.methods
                    .editAudit(
                        projectAddressRef.current.value,
                        certificateLinkRef.current.value,
                        account.toString(),
                        true
                    )
                    .send({ from: account });
            }
            toast.success(`Information was submitted successfully!`, {
                style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                },
            });
        } catch (error) {
            toast.error(`Something Went Wrong!`, {
                style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                },
            });
        }
        // setVerified(false);

        // alert(typeSelectRef.current.value);
    };
    return (
        <div className="main-container animation-fade-in component-container p-6 flex flex-col items-center">
            <HiDocumentSearch className="text-itemIndigo dark:text-itemPurple size-8" />
            <span className="text-itemIndigo dark:text-itemPurple size-3 font-semibold">
                Audit / KYC Upload
            </span>
            <div className="w-full md:w-3/4 grid grid-cols-2 md:grid-cols-3 my-6 md:my-10 items-center">
                <span className="size-1">Our Partners</span>
                <div className="flex flex-row gap-3 size-4 justify-center text-mainOrange dark:text-buttonLightOrange">
                    {PARTNERS.map((item, i) => {
                        return (
                            <div
                                key={i}
                                className="bg-white rounded-full flex items-center"
                            >
                                <img
                                    src={item.img}
                                    className="w-32"
                                    alt="partner"
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
            {!verified && (
                <div className="w-full md:w-1/2 mb-6 flex flex-col gap-4 animation-fade-in">
                    <input
                        ref={partnerAddressRef}
                        className="rounded-full bg-transparent pl-8 py-3 w-full dark:placeholder-[#FFF4] dark:text-white text-itemPurple border-2 border-itemPurple size-base"
                        placeholder="Enter partnered address"
                    />
                    <button
                        className="rounded-full bg-itemIndigo dark:bg-itemPurple hover:opacity-70 text-white ml-auto px-6 md:px-10"
                        onClick={verifyAddress}
                    >
                        Login
                    </button>
                </div>
            )}
            {verified && (
                <div className="flex flex-col gap-y-5 w-full md:w-4/5 animation-fade-in">
                    <div className="flex flex-col md:flex-row justify-between items-center size-base gap-y-2">
                        <span className="w-full md:w-3/12 md:text-right">
                            KYC or Audit
                        </span>
                        <div className="w-full md:w-8/12">
                            <select
                                className="border bg-white dark:bg-sideIndigo outline-none border-gray-300 rounded-2xl focus:ring-blue-500 focus:border-blue-500 block py-3 px-4 w-full"
                                ref={typeSelectRef}
                            >
                                <option value="KYC">KYC</option>
                                <option value="Audit">Audit</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center size-base gap-y-2">
                        <span className="w-full md:w-3/12 md:text-right">
                            Presale address
                        </span>
                        <div className="w-full md:w-8/12">
                            <input
                                ref={projectAddressRef}
                                className="border bg-white dark:bg-sideIndigo dark:text-white outline-none border-gray-300 rounded-2xl focus:ring-blue-500 focus:border-blue-500 block py-3 px-4 w-full"
                                placeholder="Enter address"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center size-base gap-y-2">
                        <span className="w-full md:w-3/12 md:text-right">
                            Certificate link
                        </span>
                        <div className="w-full md:w-8/12">
                            <input
                                ref={certificateLinkRef}
                                className="border bg-white dark:bg-sideIndigo dark:text-white outline-none border-gray-300 rounded-2xl focus:ring-blue-500 focus:border-blue-500 block py-3 px-4 w-full"
                                placeholder="https://...."
                            />
                        </div>
                    </div>

                    <button
                        className="rounded-full bg-itemIndigo dark:bg-itemPurple hover:opacity-70 text-white ml-auto px-6 md:px-10"
                        onClick={uploadDocument}
                    >
                        Upload
                    </button>
                </div>
            )}
        </div>
    );
};
export default SubmitDocuments;

const PARTNERS = [
    {
        img: PARTNER_00,
    },
    {
        img: PARTNER_01,
    },
    {
        img: PARTNER_02,
    },
    {
        img: PARTNER_03,
    },
    {
        img: PARTNER_04,
    },
];
