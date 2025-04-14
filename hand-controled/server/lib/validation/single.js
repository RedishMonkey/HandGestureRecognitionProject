const { z } = require('zod');

const usernameValidation = z
.string()
.min(3, {
  message: 'Username must be at least 3 characters long',
  check: 'passed',
})
.max(20, {
  message: 'Username must be at most 20 characters long',
  check: 'passed',
})
.regex(/^[a-zA-Z0-9_]+$/, {
  message: 'Username must contain only letters, numbers, and underscores',
  check: 'passed',
})

const passwordValidation = z
.string()
.min(8, {
  message: 'Password must be at least 8 characters long',
})
.max(20, {
  message: 'Password must be at most 15 characters long',
})


const macAddressValidation = z
  .string()
  .regex(/^[0-9A-Fa-f]{2}(:[0-9A-Fa-f]{2}){5}$/, {
    message: "Invalid MAC address",
  });

module.exports = {
  usernameValidation,
  passwordValidation,
  macAddressValidation,
};
