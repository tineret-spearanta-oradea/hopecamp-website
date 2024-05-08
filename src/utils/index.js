//TODO: replace .toISOString() with formatDate
const formatDate = (date, format = "yyyy-mm-dd") => {
  if (!date) {
    return "";
  }
  if (format === "yyyy-mm-dd hh:mm:ss") {
    return `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

export { formatDate };
