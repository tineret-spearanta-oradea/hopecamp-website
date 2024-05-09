//TODO: replace .toISOString() with formatDate
const formatDate = (date, format = "yyyy-mm-dd") => {
  if (!date) {
    return "";
  }
  if (format === "yyyy-mm-dd hh:mm:ss") {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;
  }
  if (format === "dd mmm yyyy") {
    return `${date.getDate()} ${date.toLocaleString("default", {
      month: "short",
    })} ${date.getFullYear()}`;
  }
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
};

const getNumberOfDays = (startDate, endDate) => {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((startDate - endDate) / oneDay));
};

export { formatDate, getNumberOfDays };
