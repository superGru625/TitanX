import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";
import { Routes, Route, useSearchParams } from "react-router-dom";

import LandingPage from "./Pages/LandingPage";
import Dashboard from "./Dashboard";
import Intense from "./Pages/Intense";
import { NETWORKS } from "./utils/constants";
import { useEagerConnect, useInactiveListener } from "./hooks";

function App() {
    const { chainId } = useWeb3React();
    const [searchParams, setSearchParams] = useSearchParams();
    const triedEager = useEagerConnect();
    useInactiveListener(!triedEager);
    useEffect(() => {
        let updatedSearchParams = new URLSearchParams(searchParams.toString());
        // console.log(NETWORKS[chainId]?.name, chainId);
        updatedSearchParams.set(
            "chain",
            chainId ? NETWORKS[chainId]?.name : "bsc"
        );
        setSearchParams(updatedSearchParams.toString());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chainId, searchParams]);

    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="dashboard/*" element={<Dashboard />} />
            <Route path="intense" element={<Intense />} />
        </Routes>
    );
}

export default App;
