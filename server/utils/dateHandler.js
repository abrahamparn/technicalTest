const moment = require("moment");

const changeDate = (due_date) => {
  let formattedDueDate = due_date ? moment(due_date, "DD/MM/YYYY").format("YYYY-MM-DD") : null;
  return formattedDueDate;
};

module.exports = {
  changeDate,
};
