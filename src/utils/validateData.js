const validator = require("validator");

const validateData = ({ emailId, password, firstName, lastName }) => {
  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  }
  if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong");
  }
};

module.exports = { validateData };
