import moment from "moment-timezone";

export const DateFormat = (date) => {
    const formattedDate = moment(date).format("DD/MM/YYYY");
    return formattedDate;
}