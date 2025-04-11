const z = require("zod");
const { usernameValidation } = require("./users");

const macAddressValidation = z
  .string()
  .regex(/^[0-9A-Fa-f]{2}(:[0-9A-Fa-f]{2}){5}$/, {
    message: "Invalid MAC address",
  });

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
};
