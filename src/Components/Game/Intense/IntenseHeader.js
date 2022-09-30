// import Web3 from "web3";

import { useEffect } from "react";
import LinkWithSearchParams from "../../UI/LinkWithSearchParams";

import Account from "../../Account/Account";

import { SOCIAL_LINKS } from "../../../utils/routes";
import Chains from "../../Chains/Chains";

const IntenseHeader = () => {
    useEffect(() => {
        document.documentElement.classList.add("dark");
    }, []);

    return (
        <div className="fixed flex flex-row justify-between w-full top-0 lg:px-8 px-4 h-24 z-10 transition-all duration-300 items-center bg-intenseBg bg-opacity-90">
            <LinkWithSearchParams
                to={{ pathname: "/" }}
                className="sidebar-logo logo-transform"
            />
            <div className="flex gap-2 md:gap-4 items-center">
                {SOCIAL_LINKS(
                    "lg:w-8 lg:h-8 w-6 h-6 fill-itemPurple hover:fill-white duration-300"
                ).map((item, i) => (
                    <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        key={i}
                    >
                        {item.icon}
                    </a>
                ))}
                <Chains />
                <Account />
            </div>
        </div>
    );
};

export default IntenseHeader;
