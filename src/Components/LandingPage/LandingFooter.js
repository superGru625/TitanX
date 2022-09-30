import { SOCIAL_LINKS } from "../../utils/routes";
import LinkWithSearchParams from "../UI/LinkWithSearchParams";
const LandingFooter = () => {
    return (
        <>
            <div className="flex flex-col lg:flex-row w-full rounded-t-2xl p-4 lg:p-16 lg:pb-4">
                <div className="hidden lg:flex flex-col grow mr-5 lg:max-w-[40vw]">
                    <div className="home-logo"></div>
                    <span className="size-base font-normal py-4">
                        TitanX is a full DeFi multi tool platform
Real time BSC data analysis, Decentralized
Launchpad Protocol.
                    </span>
                </div>
                <div className="hidden lg:flex flex-col flex-initial w-48 2xl:w-64 mx-5">
                    <h5 className="mb-4 font-bold font-yukita">Quick links</h5>
                    <div className="flex flex-col gap-2">
                        {navigate_links.map((item, i) => {
                            return (
                                <LinkWithSearchParams
                                    className="font-light"
                                    key={i}
                                    to={{ pathname: item.link }}
                                >
                                    {item.text}
                                </LinkWithSearchParams>
                            );
                        })}
                    </div>
                </div>
                <div className="hidden lg:flex flex-col flex-initial w-48 2xl:w-64 mx-5">
                    <h5 className="mb-4 font-bold font-yukita">Doucments</h5>
                    <div className="flex flex-col gap-2">
                        {privacy_links.map((item, i) => {
                            return (
                                <LinkWithSearchParams
                                    className="font-light"
                                    key={i}
                                    to={{ pathname: item.link }}
                                >
                                    {item.text}
                                </LinkWithSearchParams>
                            );
                        })}
                        {privacy_links_extern.map((item, i) => {
                            return (
                                <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    key={i}
                                >
                                    {item.text}
                                </a>
                            );
                        })}
                    </div>
                </div>
                <div className="flex flex-col flex-initial w-full lg:w-64 mx-5">
                    <h5 className="mb-4 font-bold font-yukita">Contact Us</h5>
                    <div className="flex flex-col gap-2 size-base">
                        {contact_links_extern.map((item, i) => {
                            return (
                                <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    key={i}
                                >
                                    {item.text}
                                </a>
                            );
                        })}
                    </div>
                    <h5 className="my-4 font-bold font-yukita">Community</h5>

                    <div className="flex gap-4">
                        {SOCIAL_LINKS(
                            "w-8 h-8 fill-blueGrEd hover:fill-blueGrSt duration-300"
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
                    </div>
                </div>
            </div>

            <div className="w-full border-t-2 border-t-darkGray/40 p-4 lg:px-16 lg:pb-4 size-base">
                © 2022. All rights reserved.
            </div>
        </>
    );
};

export default LandingFooter;

const navigate_links = [
    {
        text: "Launchpad Dashboard",
        link: "/dashboard/launchpad",
    },
    {
        text: "DeFi Exchange",
        link: "/dashboard/deFi-exchange",
    },
    {
        text: "Lockers",
        link: "/dashboard/lock-token",
    },
    {
        text: "Stake",
        link: "/dashboard/stake",
    },
    {
        text: "Scan",
        link: "/dashboard/scan",
    },
    {
        text: "NFT Mint",
        link: "/dashboard/mint",
    },
];

const privacy_links = [
    {
        text: "Privacy and Policy",
        link: "/dashboard/privacy-policy",
    },
    {
        text: "Terms and Conditions",
        link: "/dashboard/terms-conditions",
    },
];

const privacy_links_extern = [
    {
        text: "Whitepaper",
        link: "https://docs.google.com/presentation/d/15DYsEFvaysAFVgxTggOVBItdDFuY134W/edit?usp=sharing&ouid=113063085471049116357&rtpof=true&sd=true",
        external: true,
    },
    {
        text: "KYC",
        link: "https://idopresales.com/kyc-service/titanx-kyc-verification/",
        nested: true,
        external: true,
    },
    {
        text: "Audit",
        link: "https://github.com/Tech-Audit/Smart-Contract-Audits/blob/main/TECHAUDIT_TITANX.pdf",
        external: true,
    },
];

const contact_links_extern = [
    // {
    //     text: "Community",
    //     link: "https://t.me/TitanXProject",
    //     external: true,
    // },
    {
        text: "Support",
        link: "https://t.me/TitanDevSupport",
        nested: true,
        external: true,
    },
    {
        text: "E-Mail: Social@titanx.org",
        link: "mailto:Social@titanx.org",
        external: true,
    },
];
