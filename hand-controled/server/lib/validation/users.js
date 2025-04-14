const { z } = require('zod');
const { usernameValidation, passwordValidation, macAddressValidation } = require('./single');


const signUpSchema = z.object({
  username: usernameValidation,

  email: z.string().email(),

  password: passwordValidation,
});

const signInSchema = z.object({
  username: usernameValidation,

  password: passwordValidation,
});

const setProfileImgSchema = z.object({
  profileImg: z.string(),
});

const removeRobotSchema = z.object({
  macAddress: macAddressValidation,
});

const setRobotNicknameSchema = z.object({
  macAddress: macAddressValidation,
  nickname: z.string(),
});

const setRobotStateSchema = z.object({
  macAddress: macAddressValidation,
  state: z.enum(["forward", "backward", "left", "right", "stop"], {
    message: "Invalid robot state",
  }),
});


const getRobotStateSchema = z.object({
  macAddress: macAddressValidation,
});

module.exports = {
  signUpSchema,
  signInSchema,
  usernameValidation,
  setProfileImgSchema,
  removeRobotSchema,
  setRobotNicknameSchema,
  setRobotStateSchema,
  getRobotStateSchema,
}
