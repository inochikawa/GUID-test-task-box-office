import moment from "moment";

export const dateTimeToShortString = (date: string | undefined) =>
    date ? moment(date).format("DD/MM/YYYY HH:mm") : "";