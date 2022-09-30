import { AiOutlineHome /* AiOutlineLineChart*/ } from "react-icons/ai";
import { BiBot } from "react-icons/bi";
import { MdOutlineContactSupport /* MdOutlineSell*/ } from "react-icons/md";
import { IoIosRocket } from "react-icons/io";
import { BiLock, BiImageAdd } from "react-icons/bi";
import { RiMoneyDollarBoxLine } from "react-icons/ri";
import { GiMagnifyingGlass } from "react-icons/gi";
import { GoLaw } from "react-icons/go";

// import { GiNinjaMask } from "react-icons/gi";
import { FaMicrophoneAlt, FaYoutube, FaDiscord } from "react-icons/fa";
import { RiAdvertisementLine } from "react-icons/ri";
import {
    BsTelegram,
    BsSafe,
    BsFillDice6Fill,
    BsClockHistory,
} from "react-icons/bs";
import { ReactComponent as TelegramSvg } from "../assets/images/home/white-telegram.svg";
import { ReactComponent as InstagramSvg } from "../assets/images/home/white-instagram.svg";
// import { ReactComponent as YouTubeSvg } from "../assets/images/home/white-youtube.svg";
// import { ReactComponent as FacebookSvg } from "../assets/images/home/white-facebook.svg";
import { ReactComponent as TwitterSvg } from "../assets/images/home/white-twitter.svg";

export const ROUTE_LISTS = [
    {
        icon: <AiOutlineHome className="icon" />,
        title: "Homepage",
        link: "/",
    },
    // {
    //     icon: <AiOutlineLineChart className="icon" />,
    //     title: "DeFi Exchange",
    //     link: "/dashboard/defi-exchange",
    // },
    // {
    // icon: <MdOutlineSell className="icon" />,
    // title: "Private Sale",
    // link: "/dashboard/privateSale",
    // },
    // {
    //     icon: <GiNinjaMask className="icon" />,
    //     title: "Stealth Launch",
    //     nested: true,
    //     children: [
    //         {
    //             title: "Create Stealth",
    //             link: "/dashboard/create-stealth",
    //         },
    //         {
    //             title: "Dashboard",
    //             link: "/dashboard/stealth-dashboard",
    //         },
    //         {
    //             title: "Manage Stealth",
    //             link: "/dashboard/manage-stealth",
    //         },
    //     ],
    // },
    {
        icon: <IoIosRocket className="icon" />,
        title: "Launchpad",
        nested: true,
        children: [
            {
                title: "Create Launchpad",
                link: "/dashboard/create-launchpad",
            },
            {
                title: "Launchpad Dashboard",
                link: "/dashboard/launchpad",
            },
            {
                title: "Manage Presale",
                link: "/dashboard/manage-presale",
            },
        ],
    },
    {
        icon: <BiLock className="icon" />,
        title: "Lockers",
        nested: true,
        children: [
            {
                title: "Create Token Locker",
                link: "/dashboard/create-lock",
            },
            {
                title: "View Token Lockers",
                link: "/dashboard/lock-token",
            },
            // {
            //     title: "Create Liquidity Locker",
            //     link: "/dashboard/create-liquidity",
            // },
            {
                title: "Launchpad Lockers",
                link: "/dashboard/lock-liquidity",
            },
        ],
    },
    {
        icon: <BsFillDice6Fill className="icon" />,
        title: "Games",
        nested: true,
        children: [
            {
                icon: <BsClockHistory className="icon" />,
                title: "Intense",
                link: "/intense",
            },
        ],
    },
    {
        icon: <RiMoneyDollarBoxLine className="icon" />,
        title: "Stake",
        link: "/dashboard/stake",
    },
    {
        icon: <GiMagnifyingGlass className="icon" />,
        title: "Scan",
        link: "/dashboard/scan",
    },
    {
        icon: <BiImageAdd className="icon" />,
        title: "NFT Mint",
        link: "/dashboard/mint",
    },
    {
        icon: <FaMicrophoneAlt className="icon" />,
        title: "Lounge",
        link: "https://t.me/TitanTalks",
        external: true,
    },
    {
        icon: <BsSafe className="icon" />,
        title: "Audit/KYC",
        link: "/dashboard/submit-document",
    },
    {
        icon: <BsTelegram className="icon" />,
        title: "Community",
        link: "https://t.me/TitanXProject",
        external: true,
    },
    {
        icon: <RiAdvertisementLine className="icon" />,
        title: "Advertise",
        nested: true,
        children: [
            {
                icon: <MdOutlineContactSupport className="icon" />,
                title: "Book an AMA",
                link: "https://t.me/Titantalks",
                external: true,
            },
            {
                icon: <BiBot className="icon" />,
                title: "Free Price Bot",
                link: "https://t.me/TitanX_Pricebot",
                external: true,
            },
        ],
    },
    {
        icon: <GoLaw className="icon" />,
        title: "Public Documents",
        nested: true,
        children: [
            {
                title: "Terms and Contitions",
                link: "/dashboard/terms-conditions",
            },
            {
                title: "Privacy and Policy",
                link: "/dashboard/privacy-policy",
            },
            {
                title: "Whitepaper",
                link: "https://docs.google.com/presentation/d/15DYsEFvaysAFVgxTggOVBItdDFuY134W/edit?usp=sharing&ouid=113063085471049116357&rtpof=true&sd=true",
                external: true,
            },
            {
                title: "KYC",
                link: "https://idopresales.com/kyc-service/titanx-kyc-verification/",
                external: true,
            },
            {
                title: "Audit",
                link: "https://github.com/Tech-Audit/Smart-Contract-Audits/blob/main/TECHAUDIT_TITANX.pdf",
                external: true,
            },
        ],
    },
];

export const getCurrentPageTitle = (location) => {
    const curPath = location.pathname;
    for (let item of ROUTE_LISTS) {
        if (curPath === item.link) {
            return item.title;
        }
        if (item.children?.length) {
            for (let child of item.children) {
                if (curPath === child.link) {
                    return child.title;
                }
            }
        }
    }
    return "";
};

export const SOCIAL_LINKS = (clsName) => {
    return [
        {
            title: "Discord",
            icon: <FaDiscord className={clsName} />,
            link: "https://discord.gg/QgZrKMuH",
        },
        {
            title: "Telegram",
            icon: <TelegramSvg className={clsName} />,
            link: "https://t.me/TitanXProject",
        },
        {
            title: "Instagram",
            icon: <InstagramSvg className={clsName} />,
            link: "https://www.instagram.com/titanxproject/",
        },
        {
            title: "Twitter",
            icon: <TwitterSvg className={clsName} />,
            link: "https://twitter.com/TitanX_Project",
        },
        {
            title: "YouTube",
            icon: <FaYoutube className={clsName} />,
            link: "https://www.youtube.com/channel/UCKtNKCpqcrZfCxy1kRTy6kg",
        },
    ];
};
