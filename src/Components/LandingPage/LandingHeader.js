import { useEffect } from "react";
import LinkWithSearchParams from "../UI/LinkWithSearchParams";

const LandingHeader = () => {
    useEffect(() => {
        document.documentElement.classList.add("dark");
    }, []);

    return (
        <div
            className={`fixed flex items-center justify-between border-b-2 border-b-white w-full top-0 lg:px-8 px-4 py-6 z-10 transition-all duration-300 backdrop-blur-md`}
        >
            <div className="home-logo"></div>
            <div className="hidden lg:flex items-center gap-8 mx-auto uppercase">
                {header_scoll_items.map((item, index) => {
                    if (item.scrollTo)
                        return (
                            <a
                                key={index}
                                href={`#${item.targetId}`}
                                className="text-darkGray font-bold size-base rounded-lg px-3 py-2 hover:bg-black/10 duration-150"
                            >
                                {item.title}
                            </a>
                        );
                    if (item.internal_link)
                        return (
                            <LinkWithSearchParams
                                key={index}
                                to={{ pathname: item.path }}
                                className="text-darkGray font-bold size-1 rounded-lg px-3 py-2 hover:bg-black/10 duration-150"
                            >
                                {item.title}
                            </LinkWithSearchParams>
                        );
                    return <></>;
                })}
            </div>
            <LinkWithSearchParams
                to={{ pathname: "/dashboard/launchpad" }}
                className="blueGradient-button py-2 lg:py-4 size-base"
            >
                Launch App
            </LinkWithSearchParams>
        </div>
    );
};

export default LandingHeader;

const header_scoll_items = [
    // {
    //     scrollTo: true,
    //     targetId: "welcome_div",
    //     title: "Home",
    // },
    {
        scrollTo: true,
        targetId: "welcome_div",
        title: "What we do",
    },
    {
        scrollTo: true,
        targetId: "launchpad_div",
        title: "Launchpad",
    },
    {
        scrollTo: true,
        targetId: "chart_div",
        title: "Chart",
    },
    {
        scrollTo: true,
        targetId: "stake_div",
        title: "Stake",
    },
    {
        scrollTo: true,
        targetId: "nft_div",
        title: "NFT Mint",
    },
    {
        scrollTo: true,
        targetId: "connect_us_div",
        title: "Connect With Us",
    },
    // {
    //     internal_link: true,
    //     path: "/dashboard/launchpad",
    //     title: "Launchpad",
    // },
    // {
    //     internal_link: true,
    //     path: "/dashboard/nft",
    //     title: "NFT Mint",
    // },
];

/*
Home
What we do
Launchpad (Link to dashboard)
DeFi Exchange (LTD)
NFT Mint
Connect with us
*/
