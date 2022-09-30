import Web3 from "web3";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import axios from "axios";
import Account from "../Account/Account";
import Chains from "../Chains/Chains";
import LoadingDots from "../UI/LoadingDots";
import { getCurrentPageTitle } from "../../utils/routes";
import { MdMenuOpen } from "react-icons/md";

import ABI_UNISWAP_V2_FACTORY from "../../abis/global/ABI_UNISWAP_V2_FACTORY.json";
import ABI_UNISWAP_V2_PAIR from "../../abis/global/ABI_UNISWAP_V2_PAIR.json";
import {
    useMyWeb3,
    usePCSFactoryV2,
    useStakingTokenAddress,
    useWBNBAddress,
} from "../../hooks";
import { SUBGRAPH_ENDPOINT } from "../../utils/constants";
import { searchTokensFromPairs } from "../../utils/apis";
import { getEllipsisTxt } from "../../helpers/formatters";

const Navbar = ({ collapsed, setCollapsed }) => {
    const web3 = useMyWeb3();
    const PCSV2_FACTORY_ADDRESS = usePCSFactoryV2();
    const WBNB_ADDRESS = useWBNBAddress();

    const titanAddress = useStakingTokenAddress();

    const navigate = useNavigate();
    const location = useLocation();
    const pageTitle = getCurrentPageTitle(location);
    const [searchData, setSearchData] = useState([]);

    const [searchParams] = useSearchParams();

    const tokenSearchRef = useRef(null);
    const ref = useRef(null);
    const [tokenLoading, setTokenLoading] = useState(false);
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                // alert(1);
                setSearchData([]);
            }
        };
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);

    const getPairInfo = async (token, symbol, name) => {
        try {
            const factoryV2Contract = new web3.eth.Contract(
                ABI_UNISWAP_V2_FACTORY,
                PCSV2_FACTORY_ADDRESS
            );
            const pairAddress = await factoryV2Contract.methods
                .getPair(token, WBNB_ADDRESS)
                .call();

            const pairContract = new web3.eth.Contract(
                ABI_UNISWAP_V2_PAIR,
                pairAddress
            );

            const reserves = await pairContract.methods.getReserves().call();

            return {
                pairAddress: pairAddress,
                address: token,
                id: token,
                price: reserves._reserve1 / reserves._reserve0,
                reserve0: reserves._reserve0,
                reserve1: reserves._reserve1,
                symbol,
                name,
            };
        } catch (error) {
            return {};
        }
    };

    const searchValue = async (query) => {
        if (query.length >= 2) {
            setTokenLoading(true);
            const _pairs = await searchTokensFromPairs(query);
            let result = [];
            _pairs.forEach((item) => {
                if (
                    item.pairAddress
                        .toLowerCase()
                        .startsWith(query.toLowerCase())
                )
                    result.push({
                        id: item.pairAddress,
                        name: `${item.token0Symbol}-${item.token1Symbol}`,
                        symbol: `${item.token0Symbol}-${item.token1Symbol}`,
                        reserve_usd: item.reserve_usd,
                    });
                if (
                    item.token0.toLowerCase().startsWith(query.toLowerCase()) ||
                    item.token0Name
                        .toLowerCase()
                        .startsWith(query.toLowerCase()) ||
                    item.token0Symbol
                        .toLowerCase()
                        .startsWith(query.toLowerCase())
                )
                    result.push({
                        id: item.token0,
                        name: item.token0Name,
                        symbol: item.token0Symbol,
                        reserve_usd: item.reserve_usd,
                    });

                if (
                    item.token1.toLowerCase().startsWith(query.toLowerCase()) ||
                    item.token1Name
                        .toLowerCase()
                        .startsWith(query.toLowerCase()) ||
                    item.token1Symbol
                        .toLowerCase()
                        .startsWith(query.toLowerCase())
                )
                    result.push({
                        id: item.token1,
                        name: item.token1Name,
                        symbol: item.token1Symbol,
                        reserve_usd: item.reserve_usd,
                    });
            });
            result = result
                .reverse()
                .filter((item, pos) => {
                    if (
                        result
                            .slice(pos + 1)
                            .filter((temp) => temp.id === item.id).length > 0
                    )
                        return false;
                    return true;
                })
                .sort((b, a) => a.reserve_usd - b.reserve_usd);

            setSearchData(result);
            setTokenLoading(false);
            console.log(result);
            // await searchToken(query);
        } else {
            setSearchData([]);
        }
    };

    // eslint-disable-next-line
    const searchToken = async (val) => {
        let body = {
            query: `
          {
            tokenSearch(text: "${val}"){
              name,
              id,
              symbol,
            }
          }
        `,
            variables: {},
        };
        let options = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        var response = await axios.post(SUBGRAPH_ENDPOINT, body, options);
        if (response.status === 200) {
            const dd = response.data.data;
            if (dd !== undefined) {
                let _pairArr = await Promise.all(
                    dd.tokenSearch.map((item) => {
                        return getPairInfo(item.id, item.symbol, item.name);
                    })
                );
                // console.log(dd.tokenSearch);
                console.log(
                    "_pairArr",
                    _pairArr
                        .filter((item) => item.reserve1 > 0)
                        .sort((b, a) => a.reserve1 - b.reserve1)
                );
                setSearchData(
                    _pairArr
                        .filter((item) => item.reserve1 > 0)
                        .sort(
                            (b, a) =>
                                parseInt(a.reserve1) - parseInt(b.reserve1)
                        )
                );
            } else {
                setSearchData([]);
            }
        }
    };

    const selectValue = async (item) => {
        window.open(`https://bscscan.com/address/${item.id}`, "_blank");
        tokenSearchRef.current.value = "";
        setSearchData([]);
        return;
        // eslint-disable-next-line
        navigate({
            pathname: `/dashboard/defi-exchange/${item.id}`,
            search: searchParams.toString(),
        });
    };
    return (
        <>
            <div className="flex justify-between h-[72px] min-h-[72px] items-center px-6">
                <div className="flex flex-row items-center">
                    <div className="flex text-black dark:text-white size-4 lg:size-3 mr-2 cursor-pointer hover:opacity-70">
                        <MdMenuOpen onClick={() => setCollapsed(!collapsed)} />
                    </div>
                    <span className="size-1 lg:size-2 font-semibold text-center text-black dark:text-white tracking-wider lg:min-w-[20rem] 2xl:min-w-[28rem]">
                        {pageTitle}
                    </span>
                    <div className="hidden lg:flex relative" ref={ref}>
                        <input
                            type="text"
                            className="bg-[#E2E5FA] h-10 w-[28rem]"
                            placeholder="Search token"
                            ref={tokenSearchRef}
                            onChange={(e) => {
                                if (e.target.value === "") {
                                    setSearchData([]);
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    setSearchData([]);
                                    searchValue(e.target.value);
                                }
                            }}
                        />
                        <div
                            className="absolute right-0 bg-itemIndigo h-full w-10 rounded cursor-pointer"
                            onClick={() => {
                                searchValue(tokenSearchRef.current.value);
                            }}
                        >
                            <BiSearch className="w-6 h-full m-auto text-white" />
                        </div>
                        <div className="absolute rounded-lg top-10 w-full bg-white max-h-[28rem] overflow-y-auto overflow-x-clip dark:bg-gray-700 text-black dark:text-white animation-enter z-10 shadow-lg">
                            {tokenLoading && <LoadingDots text="" />}
                            {searchData.length !== 0 &&
                                searchData.map((item, index) => {
                                    return (
                                        <div
                                            key={index}
                                            onClick={() => selectValue(item)}
                                            className="flex items-center w-auto p-1 cursor-pointer border-b border-gray-200"
                                        >
                                            <img
                                                src={`https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/${Web3.utils.toChecksumAddress(
                                                    item.id
                                                )}/logo.png`}
                                                className="w-8 h-8 rounded-full ml-1 mr-2"
                                                alt="token icon"
                                                onError={(e) => {
                                                    e.target.src =
                                                        "/images/unknown.svg";
                                                }}
                                            />
                                            <div className="flex flex-col">
                                                <span className="size-base whitespace-nowrap">
                                                    {`${item.symbol} (${item.name})`}
                                                </span>
                                                <span className="size-sm">
                                                    {getEllipsisTxt(
                                                        item.id,
                                                        12
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>

                <div className="flex">
                    <a
                        className="button text-black dark:text-white flex items-center bg-white dark:bg-walletIndigo rounded-lg hover:shadow-lg cursor-pointer group mr-4"
                        href={`https://pancakeswap.finance/swap?outputCurrency=${titanAddress}`}
                        rel="noreferrer"
                        target="_blank"
                    >
                        <img
                            src="/apple-touch-icon.png"
                            className="w-8 h-8 group-hover:scale-125 duration-300 mr-2"
                            alt="Buy on Pancakeswap"
                        />
                        <span className="size-base">Buy TitanX</span>
                    </a>
                    <Chains />
                    <Account />
                </div>
            </div>
        </>
    );
};
export default Navbar;
