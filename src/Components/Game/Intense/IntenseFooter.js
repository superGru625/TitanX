import { SOCIAL_LINKS } from "../../../utils/routes";
import LinkWithSearchParams from "../../UI/LinkWithSearchParams";

const IntenseFooter = () => {
    return (
        <div className="py-3 px-2 md:py-6 md:px-4 2xl:py-9 2xl:px-6 border-t border-itemPurple flex flex-col md:flex-row text-white justify-between items-center gap-y-3 size-base md:size-1">
            <div className="w-full flex flex-row items-center">
                <LinkWithSearchParams
                    to={{ pathname: "/" }}
                    className="footer-logo hover:opacity-70"
                />
                <span className="ml-auto md:ml-3">
                    © 2022 - All rights reserved.
                </span>
            </div>
            <div className="w-full flex flex-row justify-center md:justify-end gap-3 md:gap-12 items-center">
                <LinkWithSearchParams
                    to={{ pathname: "/dashboard/terms-conditions" }}
                >
                    Terms and Conditions
                </LinkWithSearchParams>
                <LinkWithSearchParams
                    to={{ pathname: "/dashboard/privacy-policy" }}
                >
                    Privacy policy
                </LinkWithSearchParams>
                <div className="flex flex-row gap-2 md:gap-4">
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
                </div>
            </div>
        </div>
    );
};
export default IntenseFooter;
