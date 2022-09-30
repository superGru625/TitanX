import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

import { BsImage } from "react-icons/bs";

import { CgWebsite } from "react-icons/cg";
import { VscGithub } from "react-icons/vsc";
import { RiTwitterLine } from "react-icons/ri";
import { BsMedium, BsTelegram } from "react-icons/bs";
import { ImReddit } from "react-icons/im";

import { getTokenLink, TG_PRICE_BOT } from "../../utils/constants";
import { setPresaleDetails, uploadToIpfs } from "../../utils/apis";

const PresaleDetails = ({
    presaleAddress,
    offChainData,
    visible,
    setVisible,
}) => {
    const [logoSelect, setLogoSelect] = useState("link");
    const [bannerSelect, setBannerSelect] = useState("link");
    const uploadLogoRef = useRef(null);
    const uploadBannerRef = useRef(null);
    useEffect(() => {
        presaleExtraDataForm.forEach((item, index) => {
            refArray[index].current.value = item.value;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    let presaleExtraDataForm = [
        {
            type: "logo",
            icon: <BsImage size={18} />,
            name: "Logo Link ( https URL and must end with a supported image format)",
            placeholder: "ex: https://example.com/static/img/logo.png",
            input: "select",
            inputRef: uploadLogoRef,
            state: logoSelect,
            stateManager: setLogoSelect,
            options: [
                { text: "Input logo link", value: "link" },
                { text: "Upload logo from local storage", value: "upload" },
            ],
            link: true,
            value: getTokenLink(offChainData, "logo"),
        },
        {
            type: "site",
            icon: <CgWebsite size={18} />,
            name: "Website Link",
            placeholder: "https://example.com",
            link: true,
            value: getTokenLink(offChainData, "site"),
            input: "input",
        },
        {
            type: "github",
            icon: <VscGithub size={18} />,
            name: "Github Link",
            placeholder: "https://github.com/example",
            link: true,
            input: "input",
            value: getTokenLink(offChainData, "github"),
        },
        {
            type: "twitter",
            icon: <RiTwitterLine size={18} />,
            name: "Twitter Link",
            placeholder: "https://twitter.com/example",
            link: true,
            input: "input",
            value: getTokenLink(offChainData, "twitter"),
        },
        {
            type: "medium",
            icon: <BsMedium size={18} />,
            name: "Medium Link",
            placeholder: "https://medium.com/example",
            link: true,
            input: "input",
            value: getTokenLink(offChainData, "medium"),
        },
        {
            type: "telegram",
            icon: <BsTelegram size={18} />,
            name: "Telegram Link",
            placeholder: "https://t.me/TitanXProject",
            link: true,
            input: "input",
            value: getTokenLink(offChainData, "telegram"),
        },
        {
            type: "reddit",
            icon: <ImReddit size={18} />,
            name: "Reddit Link",
            placeholder: "https://reddit/TitanXProject",
            link: true,
            input: "input",
            value: getTokenLink(offChainData, "reddit"),
        },
        {
            type: "description",
            name: "Project Description",
            placeholder: "",
            input: "textarea",
            value: offChainData.description ? offChainData.description : "",
        },
        {
            type: "banner",
            icon: <BsImage size={18} />,
            name: "Banner Link ( https URL and must end with a supported image format)",
            placeholder: "ex: https://example.com/static/img/logo.png",
            input: "select",
            inputRef: uploadBannerRef,
            state: bannerSelect,
            stateManager: setBannerSelect,
            options: [
                { text: "Input banner link", value: "link" },
                { text: "Upload banner from local storage", value: "upload" },
            ],
            link: true,
            value: getTokenLink(offChainData, "banner"),
        },
    ];
    let refArray = Array(10);
    refArray[0] = useRef(null);
    refArray[1] = useRef(null);
    refArray[2] = useRef(null);
    refArray[3] = useRef(null);
    refArray[4] = useRef(null);
    refArray[5] = useRef(null);
    refArray[6] = useRef(null);
    refArray[7] = useRef(null);
    refArray[8] = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let logo_link = "",
            banner_link = "";
        if (logoSelect === "upload" && uploadLogoRef.current.files[0]) {
            logo_link = await uploadToIpfs(uploadLogoRef.current.files[0]);
        }
        if (bannerSelect === "upload" && uploadBannerRef.current.files[0]) {
            banner_link = await uploadToIpfs(uploadBannerRef.current.files[0]);
        }
        let formData = {
            address: presaleAddress.toLowerCase(),
            external_links: [],
        };
        presaleExtraDataForm.forEach((item, i) => {
            const value = refArray[i].current.value;
            let newData = {
                name: item.type,
                link: value,
            };
            if (logoSelect === "upload" && item.type === "logo") {
                newData.link = logo_link;
            }
            if (bannerSelect === "upload" && item.type === "banner") {
                newData.link = banner_link;
            }
            if (newData.link?.trim() === "") return;
            if (item.link === true) {
                formData.external_links.push(newData);
            } else formData[item.type] = value;
        });
        console.log(formData);
        await setPresaleDetails(presaleAddress.toLowerCase(), formData);

        Swal.fire({
            title: "Successfully Updated!",
            text: "Add our Free & Ad free price bot to your community telegram!",
            icon: "success",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Add It!",
        }).then((result) => {
            if (result.value) {
                window.open(TG_PRICE_BOT, "_blank");
            }
            // console.log(result.value);
        });
        setVisible(false);
    };

    return (
        <div className={`${visible ? "flex" : "hidden"} ace-modal`}>
            <div
                className="ace-modal-overlay"
                onClick={() => setVisible(false)}
            />
            <div className="ace-modal-main w-10/12 md:w-1/3">
                <form onSubmit={handleSubmit}>
                    <div className="ace-modal-header">
                        <b>Submit Information</b>
                        <button
                            type="button"
                            className="ace-modal-close-button"
                            onClick={() => setVisible(false)}
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
                            {presaleExtraDataForm.map((el, i) => (
                                <div key={i} className="flex flex-col gap-1">
                                    <div className="flex flex-row items-center size-sm gap-1 pl-3 text-itemIndigo dark:text-white font-medium">
                                        {el.icon !== undefined && el.icon}
                                        {el.name}
                                    </div>
                                    {el.input === "select" && (
                                        <>
                                            <select
                                                className="border bg-white dark:bg-sideIndigo outline-none border-gray-300 rounded-2xl focus:ring-blue-500 focus:border-blue-500 block py-2 px-3 w-full"
                                                onChange={(e) => {
                                                    el.stateManager(
                                                        e.target.value
                                                    );
                                                }}
                                            >
                                                {el.options.map(
                                                    (item, index) => (
                                                        <option
                                                            key={index}
                                                            value={item.value}
                                                        >
                                                            {item.text}
                                                        </option>
                                                    )
                                                )}
                                            </select>

                                            <input
                                                ref={refArray[i]}
                                                className={`w-full rounded-full pl-4 bg-inputBg border-none ${
                                                    el.state === "link"
                                                        ? "block"
                                                        : "hidden"
                                                }`}
                                                onLoad={() => {
                                                    console.log("asdf");
                                                    refArray[i].current.value =
                                                        el.value;
                                                }}
                                                placeholder={el.placeholder}
                                            />
                                            <input
                                                type="file"
                                                ref={el.inputRef}
                                                className={`w-full rounded-full pl-4 bg-inputBg border-none ${
                                                    el.state === "upload"
                                                        ? "block"
                                                        : "hidden"
                                                }`}
                                                placeholder={el.placeholder}
                                            />
                                        </>
                                    )}
                                    {el.input === "input" && (
                                        <input
                                            ref={refArray[i]}
                                            className="w-full rounded-full pl-4 bg-inputBg border-none"
                                            placeholder={el.placeholder}
                                        />
                                    )}
                                    {el.input === "textarea" && (
                                        <textarea
                                            ref={refArray[i]}
                                            placeholder={el.placeholder}
                                            rows="3"
                                            cols="50"
                                            className="w-full rounded-2xl bg-inputBg"
                                        ></textarea>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            type="submit"
                            className="bg-buttonLightOrange dark:bg-buttonDarkOrange text-white mx-auto mt-3 px-16"
                        >
                            Submit
                        </button>
                    </div>
                    <div></div>
                </form>
            </div>
        </div>
    );
};
export default PresaleDetails;
