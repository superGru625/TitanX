import React, { useState } from "react";

import {
    KeyboardDateTimePicker,
    MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import Selects from "./Select";

const InputItem = ({
    width,
    name,
    select,
    type,
    initialValue,
    placeholder,
    warning,
    forRef,
}) => {
    const [selectedDate, handleDateChange] = useState(new Date());
    return (
        <div className={`${width || "w-full lg:w-[48%]"} flex flex-col`}>
            <span className="pl-6 text-black dark:text-white">
                {name} <span className="ml-2 text-pink-500">{warning}</span>
            </span>
            <div>
                {!select && (
                    <>
                        {type ? (
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDateTimePicker
                                    variant="inline"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    style={{
                                        padding: "5px 0",
                                        color: "#fff",
                                        width: "100%",
                                    }}
                                    InputProps={{
                                        disableUnderline: true,
                                    }}
                                    format="yyyy/MM/dd HH:mm"
                                />
                                <input
                                    ref={forRef}
                                    value={selectedDate}
                                    style={{ display: "none" }}
                                    placeholder={placeholder}
                                />
                            </MuiPickersUtilsProvider>
                        ) : (
                            <input
                                ref={forRef}
                                className="smooth-input"
                                placeholder={placeholder}
                            />
                        )}
                    </>
                )}
                {select && (
                    <Selects
                        forRef2={forRef}
                        select={select}
                        initialValue={initialValue}
                    />
                )}
            </div>
        </div>
    );
};
export default InputItem;
