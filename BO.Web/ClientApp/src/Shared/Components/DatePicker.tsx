import React from "react";
import DateTime, { DatetimepickerProps } from "react-datetime";
import "react-datetime/css/react-datetime.css";

export const DatePicker = (props: DatetimepickerProps) => (
    <DateTime utc={false} dateFormat="DD/MM/YYYY" timeFormat="HH:mm" {...props} />
)