import React, { useState, useRef, useEffect } from "react";
import { BsPlus } from "react-icons/bs";
import { Switch } from "@headlessui/react";
import toast from "react-hot-toast";

const PreSalesTools = ({
    tokenDetails,
    showDetailModal,
    setWhitelistModalVisible,
    presaleContract,
    account,
    lockerLPContract,
}) => {
    const [promoModalVisible, setPromoModalVisible] = useState(false);
    const [checked, setChecked] = useState(tokenDetails.isWhitelist);
    const promoRef = useRef(null);

    const [lockedTimestamp, setLockedTimeStamp] = useState(0);

    useEffect(() => {
        const lockedLockedTimeStamp = async () => {
            const _lockedTimeStamp = await lockerLPContract.methods
                .LockedTimestamp()
                .call();
            setLockedTimeStamp(_lockedTimeStamp);
        };
        lockedLockedTimeStamp();
    }, [lockerLPContract]);

    const toggleWhitelist = async (isWhitelist) => {
        if (isWhitelist) {
            await presaleContract.methods
                .activateWhitelist()
                .send({ from: account });
        } else {
            await presaleContract.methods
                .disableWhitelist()
                .send({ from: account });
        }
        setChecked(isWhitelist);

        toast(
            isWhitelist
                ? "Whitelist is activated!"
                : "Whitelist is deactivated!",
            {
                icon: isWhitelist ? "👏" : "🌚",
                style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                },
            }
        );
    };
    const cancelPresaleOwner = async () => {
        await presaleContract.methods
            .cancelPresaleOwner()
            .send({ from: account });
    };
    const finalizePresale = () => {
        setPromoModalVisible(true);
    };

    const submitFinalize = async () => {
        if (
            tokenDetails.weiRaised >=
            tokenDetails.hardCap + tokenDetails.minContribution
        ) {
            await presaleContract.methods
                .finalizePresale()
                .send({ from: account });
        } else {
            console.log("finalizePresaleForSoftcap");
            await presaleContract.methods
                .finalizePresaleForSoftcap()
                .send({ from: account });
        }
        toast("Finalised Successfully!", {
            icon: "👏",
            style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
            },
        });
        setPromoModalVisible(false);
    };

    const addDiscountCode = async () => {
        const code = parseInt(promoRef.current.value);
        if (isNaN(code)) {
            return;
        }
        await presaleContract.methods
            .setDiscountCode(code)
            .send({ from: account });

        toast("Promocode added!", {
            icon: "👏",
            style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
            },
        });
    };

    const withdrawLiquidity = async () => {
        try {
            await lockerLPContract.methods
                .claimLockedTokens()
                .send({ from: account });
            toast("Successfully withdrew liquidity tokens!", {
                icon: "👏",
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
    };

    const burnLeftOverToken = async () => {
        try {
            await lockerLPContract.methods
                .burnLeftOverToken()
                .send({ from: account });
            toast("Successfully burnt left tokens!", {
                icon: "👏",
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
    };
    const withdrawTokensFailedPresale = async () => {
        try {
            await presaleContract.methods
                .withdrawTokensFailedPresale()
                .send({ from: account });
            toast("Successfully withdrew failed tokens!", {
                icon: "👏",
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
    };

    const PromoCodeModal = () => {
        return (
            <div
                className={`${promoModalVisible ? "flex" : "hidden"} ace-modal`}
            >
                <div
                    className="ace-modal-overlay"
                    onClick={() => setPromoModalVisible(false)}
                />
                <div className="ace-modal-main w-10/12 md:w-96">
                    <div className="ace-modal-header">
                        Got a Promo Code?
                        <button
                            type="button"
                            className="ace-modal-close-button"
                            onClick={() => setPromoModalVisible(false)}
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
                    <div className="ace-modal-body p-4 md:p-6 flex flex-col">
                        <div className="flex flex-col gap-3">
                            <span>Use promo code for 12.5% BNB back!</span>
                            <input
                                placeholder="Enter Promocode"
                                ref={promoRef}
                                className="rounded-full pl-8"
                            />
                            <div className="flex flex-row gap-4 justify-center">
                                <button
                                    className="size-sm lg:size-base bg-itemIndigo dark:bg-itemPurple text-white rounded-full w-32 py-1"
                                    onClick={addDiscountCode}
                                >
                                    Add
                                </button>
                                <button
                                    className="size-sm lg:size-base border-2 border-itemIndigo dark:border-itemPurple text-itemIndigo dark:text-itemPurple rounded-full w-32 py-1"
                                    onClick={submitFinalize}
                                >
                                    Finalise
                                </button>
                            </div>
                            <span>If no promocode you can just finalise</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="component-container rounded-2xl shadow-lg p-6 flex flex-col h-full">
            {PromoCodeModal()}
            <span className="size-2 font-semibold pb-2">Update Details</span>
            <div className="flex flex-row justify-between py-2">
                <span>Update Presale Details</span>
                <span
                    className="px-3 border-black dark:border-white border-[1px] rounded-full size-1 cursor-pointer"
                    onClick={() => showDetailModal(true)}
                >
                    <BsPlus />
                </span>
            </div>
            <div className="flex flex-row justify-between py-2 items-center">
                <span>
                    Presale whitelist:
                    <span
                        className={
                            checked ? "text-[#62AB06]" : "text-[#FF6E38]"
                        }
                    >
                        {checked ? " Enabled" : " Disabled"}
                    </span>
                </span>
                <Switch
                    checked={checked}
                    onChange={toggleWhitelist}
                    className={`${
                        checked ? "border-[#62AB06]" : "border-[#FF6E38]"
                    } border-[1px] relative inline-flex items-center h-[18px] w-[36px] rounded-full odd-button`}
                >
                    <span
                        className={`${
                            checked
                                ? "translate-x-6 bg-[#62AB06]"
                                : "bg-[#FF6E38]"
                        } inline-block aspect-square h-full transform rounded-full`}
                    />
                </Switch>
            </div>
            <div className="flex flex-row justify-between py-2 items-baseline">
                <div className="flex flex-col">
                    <span>Add/Remove Adresses </span>
                    <span> (Whitelist)</span>
                </div>
                <span
                    className="px-3 border-black dark:border-white border-[1px] rounded-full size-1 cursor-pointer"
                    onClick={() => setWhitelistModalVisible(true)}
                >
                    <BsPlus />
                </span>
            </div>
            <div className="flex flex-row justify-between py-2 items-center">
                <span>Withdraw Liquidity tokens</span>
                <div className="flex justify-end flex-col items-end">
                    <button
                        className="w-40 bg-itemIndigo dark:bg-itemPurple hover:opacity-80 size-base font-medium text-white"
                        onClick={withdrawLiquidity}
                    >
                        Withdraw
                    </button>
                    <span className="size-sm text-right">
                        {new Date(lockedTimestamp * 1000).toLocaleString()}
                        {/* <MyCountDown date={new Date(lockedTimestamp * 1000)} /> */}
                    </span>
                </div>
            </div>

            <div className="flex flex-row justify-between py-2 items-center">
                <span>Burn unused tokens</span>
                <div className="flex justify-end flex-col items-end">
                    <button
                        className="w-40 bg-itemIndigo dark:bg-itemPurple hover:opacity-80 size-base font-medium text-white"
                        onClick={burnLeftOverToken}
                    >
                        Burn
                    </button>
                </div>
            </div>

            <div className="flex flex-row justify-between py-2 items-center">
                <span>Claim Failed tokens</span>
                <div className="flex justify-end flex-col items-end">
                    <button
                        className="w-40 bg-itemIndigo dark:bg-itemPurple hover:opacity-80 size-base font-medium text-white"
                        onClick={withdrawTokensFailedPresale}
                    >
                        Claim
                    </button>
                </div>
            </div>

            <div className="flex flex-row justify-around pt-2 items-center flex-wrap gap-y-3">
                <button
                    className="w-40 2xl:w-64 bg-buttonLightOrange dark:bg-buttonDarkOrange text-white rounded-full size-base font-medium"
                    onClick={cancelPresaleOwner}
                >
                    Cancel Presale
                </button>
                <button
                    className="w-40 2xl:w-64 border-buttonDarkOrange dark:border-buttonLightOrange hover:bg-[#FF7A4922] border-[1px] text-buttonLightOrange dark:text-buttonDarkOrange rounded-full size-base font-medium"
                    onClick={finalizePresale}
                >
                    Finalise
                </button>
            </div>
        </div>
    );
};
export default PreSalesTools;
