import React from "react";
import { CgWebsite } from "react-icons/cg";
import { VscGithub } from "react-icons/vsc";
import { RiTwitterLine } from "react-icons/ri";
import { BsMedium, BsTelegram } from "react-icons/bs";
import { ImReddit } from "react-icons/im";

import { getTokenLink } from "../../utils/constants";

const SocialLinks = ({ offChainData }) => {
    const SocialLinksArray = [
        {
            type: "site",
            name: "Website Link",
            icon: <CgWebsite />,
            link: "#",
        },
        {
            type: "github",
            name: "Github Link",
            icon: <VscGithub />,
            link: "https://github.com/",
        },
        {
            type: "twitter",
            name: "Twitter Link",
            icon: <RiTwitterLine />,
            link: "https://twitter.com/",
        },
        {
            type: "medium",
            name: "Medium Link",
            icon: <BsMedium />,
            link: "https://medium.com",
        },
        {
            type: "telegram",
            name: "Telegram Link",
            icon: <BsTelegram />,
            link: "https://telegram.org/",
        },
        {
            type: "reddit",
            name: "Reddit Link",
            icon: <ImReddit />,
            link: "https://reddit.com/",
        },
    ];
    return (
        <>
            {SocialLinksArray.map((el, i) => {
                if (getTokenLink(offChainData, el.type) !== "")
                    return (
                        <a
                            href={getTokenLink(offChainData, el.type)}
                            target="_blank"
                            rel="noreferrer"
                            key={i}
                            className="hover:text-cyan-400 hover:scale-105 duration-150"
                        >
                            {el.icon}
                        </a>
                    );
                return null;
            })}
        </>
    );
};
export default SocialLinks;
