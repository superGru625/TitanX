import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "./output.css";
import App from "./App";
import { BrowserRouter, useLocation } from "react-router-dom";
import { RecoilRoot } from "recoil";
import RecoilNexus from "recoil-nexus";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { Toaster } from "react-hot-toast";

require("dotenv").config();

function getLibrary(provider) {
    const library = new Web3Provider(provider);
    library.pollingInterval = 12000;
    return library;
}

const Scroll2Top = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

ReactDOM.render(
    <RecoilRoot>
        <Web3ReactProvider getLibrary={getLibrary}>
            <RecoilNexus />
            <BrowserRouter>
                <Toaster position="top-right" reverseOrder={false} />
                <Scroll2Top />
                <App />
            </BrowserRouter>
        </Web3ReactProvider>
    </RecoilRoot>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
