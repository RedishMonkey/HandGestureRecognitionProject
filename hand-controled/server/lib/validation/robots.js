const z = require("zod");
const { usernameValidation, macAddressValidation } = require("./single");

const linkRobotSchema = z.object({
  macAddress: macAddressValidation,
  usersUsername: usernameValidation,
});

const getUsersLinkReqsSchema = z.object({
  username: usernameValidation,
});

const acceptLinkReqSchema = z.object({
  username: usernameValidation,
  macAddress: macAddressValidation,
});

const getUsersRobotsSchema = z.object({
  username: usernameValidation,
});

const denyLinkReqSchema = z.object({
  username: usernameValidation,
  macAddress: macAddressValidation,
});

module.exports = {
  linkRobotSchema,
  getUsersLinkReqsSchema,
  acceptLinkReqSchema,
  getUsersRobotsSchema,
  getUsersRobotsSchema,
  denyLinkReqSchema,  
  macAddressValidation,
};
