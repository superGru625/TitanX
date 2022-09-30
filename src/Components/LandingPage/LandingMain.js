import { useEffect, useRef } from "react";
// import HomeIllustration from "../../assets/images/home/home-illustration.png";
import IPhone_Img from "../../assets/images/home/landing-iphone-view.png";
import Mac_Img from "../../assets/images/home/landing-mac-view.png";
import Presale_Card from "../../assets/images/home/landing-launchpad-card.png";
import ChartView from "../../assets/images/home/landing-chartview.svg";
import StakeView from "../../assets/images/home/landing-stakeview.svg";
import NftView from "../../assets/images/home/landing-nftview.png";
import Landing_Binance_Img from "../../assets/images/home/community/binance.png";
import Landing_Coinbase_Img from "../../assets/images/home/community/coinbase.png";
import Landing_PCS_Img from "../../assets/images/home/community/pancakeswap.png";
import Landing_Cronos_Img from "../../assets/images/home/community/cronos.png";

import LinkWithSearchParams from "../UI/LinkWithSearchParams";
import { FaDiscord } from "react-icons/fa";
import { FiArrowRightCircle } from "react-icons/fi";

const LandingMain = () => {
    const IPhone_Ref = useRef(null);
    useEffect(() => {
        function handleMouseMove(event) {
            if (IPhone_Ref === null) return;
            const [x, y] = [event.clientX, event.clientY];
            var rect = IPhone_Ref.current.getBoundingClientRect();
            const [cx, cy] = [
                (rect.right + rect.left) / 2,
                (rect.top + rect.bottom) / 2,
            ];

            if (Math.abs(cy) > y * 2) return;
            IPhone_Ref.current.style.transform = `rotateX(${
                (cy - y) / 25
            }deg) rotateY(${(x - cx) / 25}deg)`;
        }
        // document.addEventListener("mousemove", handleMouseMove);
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
        };
    }, [IPhone_Ref]);
    return (
        <div className="flex flex-col w-full text-black">
            <div
                className="flex flex-col md:flex-row pt-40 pb-20 2xl:pb-32"
                id="welcome_div"
            >
                <div className="w-full flex flex-col my-auto items-center md:items-start text-center md:text-left px-4 md:px-16 2xl:px-32">
                    <span className="size-4 linear-wipe font-bold font-yukita text-darkBlue">
                        Welcome to TitanX
                    </span>
                    <span className="size-1 my-6">
                        TitanX is a full DeFi platform, designed to integrate
                        all utility into one easy to use application. From
                        portfolio management, presales, charting and NFT’s,
                        TitanX is your only stop needed to fully manage your
                        current investments as well as research and purchase
                        your next investment. For developers, we offer
                        everything you need to launch, chart, advertise and
                        connect your project with our ever expanding investor
                        base
                    </span>
                    <div className="flex flex-row mt-3 gap-4">
                        <LinkWithSearchParams
                            to={{ pathname: "/dashboard/launchpad" }}
                            className="nav-button w-40 2xl:w-60 p-4 text-center blueGradient-button size-1"
                        >
                            Explore More
                        </LinkWithSearchParams>
                        {/* <LinkWithSearchParams
                            to={{ pathname: "/dashboard/defi-exchange" }}
                            className="nav-button w-40 2xl:w-60 text-center text-yellow border-yellow border-4"
                        >
                            Charts
                        </LinkWithSearchParams> */}
                    </div>
                    {/* <LinkWithSearchParams
                        to={{ pathname: "/intense" }}
                        className="nav-button hover:shadow-itemCyan text-itemCyan border-itemCyan border-4 flex flex-row size-2 px-6 group gap-2 mt-4"
                    >
                        <span className="group-hover:animate-spin">⌛</span>
                        Intense Here
                    </LinkWithSearchParams> */}
                </div>
                <div className="w-full relative aspect-[4/3] mt-6 lg:mt-0 overflow-hidden">
                    <img
                        className="grayscale lg:grayscale-0 h-4/5 lg:h-full mt-auto -right-24 lg:right-0 top-12 lg:top-0 absolute"
                        src={Mac_Img}
                        alt="mac view"
                    />
                    <div className="iphone-perspective grayscale-0 lg:grayscale h-full lg:h-4/5 mt-auto bottom-0 left-24 md:left-0 absolute">
                        <img
                            className="h-full"
                            alt="iphone view"
                            src={IPhone_Img}
                            ref={IPhone_Ref}
                        />
                    </div>
                    {/* <div className="w-2/4 h-3 mx-auto bg-black rounded-[100px] blur-lg translate-y-1/2"></div> */}
                </div>
            </div>
            <div className="w-full px-16 py-8 text-center font-yukita font-bold">
                <h3>
                    Powered by the{" "}
                    <font className="text-darkBlue">Community</font>
                </h3>
                <div className="px-8 lg:px-32 flex flex-row items-center lg:justify-around py-12 overflow-x-auto">
                    {trusting_community.map((item, index) => {
                        return (
                            <img
                                key={index}
                                className="h-12 grayscale hover:grayscale-0 duration-300 cursor-pointer"
                                src={item.image}
                                alt={item.title}
                                title={item.title}
                            />
                        );
                    })}
                </div>
            </div>
            <div className="flex flex-col px-4 text-black"></div>
            <div className="w-11/12 md:w-3/4 mx-auto bg-white shadow-lg flex flex-row items-center justify-center py-4 lg:py-12 rounded-lg">
                <div className="w-full flex flex-col items-center gap-2 py-2 border-r-2 border-r-gray-300">
                    <span className="font-bold font-yukita size-4 text-darkBlue">
                        99k
                    </span>
                    <span className="text-comment text-center">
                        People have joined
                    </span>
                </div>
                <div className="w-full flex flex-col items-center gap-2 py-2 border-r-2 border-r-gray-300">
                    <span className="font-bold font-yukita size-4 text-darkBlue">
                        50k
                    </span>
                    <span className="text-comment text-center">
                        People have joined
                    </span>
                </div>
                <div className="w-full flex flex-col items-center gap-2 py-2">
                    <span className="font-bold font-yukita size-4 text-darkBlue">
                        100+
                    </span>
                    <span className="text-comment text-center">
                        People have joined
                    </span>
                </div>
            </div>
            <div
                className="w-full flex flex-col lg:flex-row justify-between px-8 lg:px-32 py-12 lg:pt-40 lg:pb-24"
                id="launchpad_div"
            >
                <div className="lg:hidden w-full lg:w-6/12 flex justify-center">
                    <div className="feature-wrapper">
                        <div className="card">
                            <img src={Presale_Card} alt="launchpad view" />
                            <LinkWithSearchParams
                                className="link"
                                to={{ pathname: "/dashboard/launchpad" }}
                            >
                                <FiArrowRightCircle className="w-16 h-16 stroke-darkGray hover:stroke-blueGrEd duration-200" />
                            </LinkWithSearchParams>
                        </div>
                    </div>
                </div>
                <div className="hidden lg:block w-full lg:w-5/12 relative mt-8">
                    <img
                        src={Presale_Card}
                        className="w-1/2 top-80 left-60 rotate-[4deg] hover:rotate-0 shadow-sm hover:shadow-lg duration-300 rounded-2xl absolute cursor-pointer hover:z-[1] hover:scale-110"
                        alt="launchpad card"
                    />
                    <img
                        src={Presale_Card}
                        className="w-1/2 top-32 left-40 rotate-6 hover:rotate-0 shadow-sm hover:shadow-lg duration-300 rounded-2xl absolute cursor-pointer hover:z-[1] hover:scale-110"
                        alt="launchpad card"
                    />
                    <img
                        src={Presale_Card}
                        className="w-1/2 right-0 -rotate-6 hover:rotate-0 shadow-sm hover:shadow-lg duration-300 rounded-2xl absolute cursor-pointer hover:z-[1] hover:scale-110"
                        alt="launchpad card"
                    />
                </div>
                <div className="w-full lg:w-6/12 flex flex-col">
                    <h1 className="text-darkGray font-bold font-yukita py-8">
                        Launchpad
                    </h1>
                    <span className="text-comment size-base">
                        TitanX offers the ability to host your presale on one of
                        the most innovative, cost effective launchpads operating
                        today. Friendly UI, customizable landing page to make
                        your project standout as well as best in class support
                        and security. Innovation never sleeps, and neither do
                        we. Our launchpad is integrated into the larger TitanX
                        Ecosystem, giving you access to a diverse array of
                        investors, and with smart, impactful ways to reach those
                        investors, using TitanLaunch is a must for any new
                        project.
                    </span>
                    <h4 className="text-darkGray font-bold py-4">Cost</h4>
                    <span className="text-comment size-base">
                        We believe in innovation across Crypto. High presale
                        fees can stall growth, especically when project tokens
                        come into play. TitanX never takes project tokens and
                        has a basic .2BNB to setup plus 2% of total raised.
                    </span>
                    <h4 className="text-darkGray font-bold py-4">Security</h4>
                    <span className="text-comment size-base">
                        We are partnered with some of the best KYC and Audit
                        companies operating today. This ensures that when your
                        project displays a KYC or Audit, the commmunity knows
                        that is coming from a trusted, reputable source.
                    </span>
                    <h4 className="text-darkGray font-bold py-4">Community</h4>
                    <span className="text-comment size-base">
                        Our Launchpad is part of the larger Titan ecosystem. Our
                        goal is to always offer innovative ways to conect your
                        presale to these investors. From setting alerts, to push
                        notifications to more traditional advertising, we are
                        always looking at how we can best bridge you to your
                        potential investors.
                    </span>
                </div>
            </div>
            <div
                className="w-full px-8 lg:px-32 py-12 lg:pt-40 lg:pb-24 flex flex-col-reverse lg:flex-row justify-between"
                id="chart_div"
            >
                <div className="w-full lg:w-5/12 flex flex-col justify-center">
                    <h1 className="text-darkGray font-bold font-yukita py-8">
                        Chart
                    </h1>
                    <span className="text-comment size-base">
                        Charting done right. Easy to read, fast, intuitive and
                        with the information you need without getting lost in
                        the background. Our charts give investors everything
                        they need to track all of your existing portfolio as
                        well as any potential projects you come accross. It
                        doesn’t end there though, with full DEX support
                        purchasing the latest token doesn’t have to be a burden
                        and can be done without ever having to leave the page.
                    </span>
                    <h4 className="text-darkGray font-bold py-4">
                        Full integration
                    </h4>
                    <span className="text-comment size-base">
                        Our charting, like all of our components, is integrated
                        into the larger ecosystem. This means innovation beyond
                        just traditional charting. Manage your entire portfolio,
                        with instant one click access to charting. Create wish
                        lists and instantly come back to check the projects
                        charts and purchase when ready.
                    </span>
                    <h4 className="text-darkGray font-bold py-4">
                        Constant Innovation
                    </h4>
                    <span className="text-comment size-base">
                        With an ever expanding ecosystem, our charting is just
                        one way we offer investors the tools they need to manage
                        their entire token portfolio. Expansion across multiple
                        blockchains and better integration with your wallet is
                        just some of what we are doing to continue to innovate.
                    </span>
                </div>
                <div className="w-full lg:w-6/12 flex justify-center">
                    <div className="feature-wrapper">
                        <div className="card">
                            <img src={ChartView} alt="chart view" />
                            <LinkWithSearchParams
                                className="link"
                                to={{ pathname: "/dashboard/defi-exchange" }}
                            >
                                <FiArrowRightCircle className="w-16 h-16 stroke-darkGray hover:stroke-blueGrEd duration-200" />
                            </LinkWithSearchParams>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="w-full px-8 lg:px-32 py-12 lg:pt-40 lg:pb-24 flex flex-col lg:flex-row justify-between"
                id="stake_div"
            >
                <div className="w-full lg:w-6/12 flex items-center">
                    <div className="feature-wrapper">
                        <div className="card">
                            <img src={StakeView} alt="staking view" />
                            <LinkWithSearchParams
                                className="link"
                                to={{ pathname: "/dashboard/stake" }}
                            >
                                <FiArrowRightCircle className="w-16 h-16 stroke-darkGray hover:stroke-blueGrEd" />
                            </LinkWithSearchParams>
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-5/12 flex flex-col justify-center">
                    <h1 className="text-darkGray font-bold font-yukita py-8">
                        Staking
                    </h1>
                    <span className="text-comment size-base">
                        At TitanX, we are always looking for ways we can better
                        build financial stability for our investors. Staking is
                        a key component to this as it allows for passive income
                        without selling your initial stake. Any investmenet that
                        drives passive income without having to sell is a smart
                        investment. Our staking pays out in BNB rewards and
                        because we offer revenue sharing accross our utility,
                        there are always funds being driven into the token and
                        the staking pool.
                    </span>
                    <h4 className="text-darkGray font-bold py-4">
                        Future expansion in mind
                    </h4>
                    <span className="text-comment size-base">
                        We keep expansion in mind as we design and build out our
                        ecosystem and the token that supports it. When it comes
                        to staking rewards, payouts need to occur regardless of
                        which blockchain you originate on. We have an intuitive
                        DAO ready to go so that as we expand, we can ensure our
                        staking protocol can support multiple blockchains and
                        ensure the best payout and ease of operation for our
                        investors.
                    </span>
                </div>
            </div>
            <div
                className="w-full px-8 lg:px-32 py-12 lg:pt-40 lg:pb-24 flex flex-col-reverse lg:flex-row justify-between"
                id="nft_div"
            >
                <div className="w-full lg:w-5/12 flex flex-col justify-center">
                    <h1 className="text-darkGray font-bold font-yukita py-8">
                        NFTs
                    </h1>
                    <span className="text-comment size-base">
                        TitanX is excited to offer our Boxhead NFT’s. Conceived,
                        designed and developed in house, they offer investors a
                        fun, unique ability to own a piece of TitanX. Our NFT’s
                        are more than just an NFT though; they give investors
                        early access to TitanX utility, as we roll that out, as
                        well are whitelisting on NFT launches through our
                        upcoming NFT launchpad. Speaking of which, our goal is
                        not just internal, we are in development of an NFT
                        marketplace and launchpad, integrated within our larger
                        Ecosystem, to support the larger NFT space and be a key
                        player moving foward.
                    </span>
                    <h4 className="text-darkGray font-bold py-4">
                        Benefits to Own
                    </h4>
                    <span className="text-comment size-base">
                        NFT owners get early access to upcoming utility
                        rollouts, as well as access to premium tools and contect
                        that would otherwise require minimum token holding
                        amounts. Whitelist to NFT launches and other benefits
                        await.
                    </span>
                    <h4 className="text-darkGray font-bold py-4">
                        More than just an NFT
                    </h4>
                    <span className="text-comment size-base">
                        Our goal with NFT’s is not just in our ability to create
                        our own, but in offering full support for the larger NFT
                        base. We believe we can be the go to place to launch
                        your NFT line as well as the preferred marketplace for
                        hosting, trading and selling NFT’s.
                    </span>
                </div>
                <div className="w-full lg:w-6/12 flex items-center">
                    <div className="feature-wrapper">
                        <div className="card">
                            <img src={NftView} alt="Enter to NFT" />
                            <LinkWithSearchParams
                                className="link"
                                to={{ pathname: "/dashboard/nft" }}
                            >
                                <FiArrowRightCircle className="w-16 h-16 stroke-darkGray hover:stroke-blueGrEd" />
                            </LinkWithSearchParams>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="w-full lg:mt-40 pb-8 lg:pb-24 relative bg-gradient-to-r from-blueGrSt to-blueGrEd overflow-hidden"
                id="connect_us_div"
            >
                <div className="absolute left-0 top-0 w-full h-full bg-community-mask"></div>
                <FaDiscord className="w-16 h-16 lg:w-32 lg:h-32 left-0 top-0 rotate-[60deg] absolute fill-white" />
                <FaDiscord className="w-16 h-16 lg:w-32 lg:h-32 right-0 bottom-0 absolute fill-white" />
                <div className="flex flex-col items-center relative z-[1]">
                    <h1 className="font-yukita font-bold text-white text-center py-8 lg:py-12">
                        Join the community
                    </h1>
                    <span className="size-1 text-white text-center px-8">
                        Join our DAO Discord Community, warmly introduce
                        yourself, and connect with other Dapp builders!
                    </span>
                    <div className="w-11/12 lg:w-2/3 flex flex-col mt-6 p-6 bg-white rounded-lg shadow-xl">
                        <span className="text-darkGray size-1">Email</span>
                        <div className="flex flex-col lg:flex-row gap-4 pt-4">
                            <input
                                className="rounded-lg w-full bg-darkGray bg-opacity-10 size-base pl-4 py-4"
                                placeholder="Enter email"
                            />
                            <button className="blueGradient-button w-2/3 lg:w-80 py-4 lg:py-6 mx-auto size-base">
                                Explore More
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingMain;

const trusting_community = [
    {
        image: Landing_Binance_Img,
        title: "Binance",
        link: "",
    },
    {
        image: Landing_PCS_Img,
        title: "Tether",
        link: "",
    },
    {
        image: Landing_Cronos_Img,
        title: "Cronos",
        link: "",
    },
    {
        image: Landing_Coinbase_Img,
        title: "Coinbase",
        link: "",
    },
];
