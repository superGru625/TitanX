import React, { useEffect, useRef, useState } from "react";

import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

const Selects = ({ select, initialValue, forRef2, handler }) => {
    const [dropdown, setDropdown] = useState(false);
    const [value, setValue] = useState(initialValue);

    const ref = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
    return (
        <div
            className="w-full relative cursor-pointer font-medium text-black dark:text-white"
            onClick={() => {
                setDropdown((dropdown) => !dropdown);
            }}
            ref={ref}
        >
            <div
                className={`flex justify-between items-center w-full input border-2  rounded-lg p-2.5 duration-150 ${
                    dropdown ? "border-cyan-400" : "border-inputBg"
                }`}
            >
                <span className="pl-3.5" ref={forRef2}>
                    {" "}
                    {value}
                </span>
                {dropdown ? (
                    <IoMdArrowDropup className="animation-fade-in size-base" />
                ) : (
                    <IoMdArrowDropdown className="animation-fade-in size-base" />
                )}
            </div>
            {dropdown && (
                <div className="absolute top-12 w-full backdrop-blur-md z-10 animation-fade-in">
                    {select.map((el, i) => (
                        <div
                            key={i}
                            className="p-2  bg-gray-200/20 dark:bg-gray-500/20 hover:bg-gray-200 hover:dark:bg-gray-500 duration-150"
                            onClick={() => {
                                setValue(el);
                                handler && handler(el);
                            }}
                        >
                            {el}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default Selects;
