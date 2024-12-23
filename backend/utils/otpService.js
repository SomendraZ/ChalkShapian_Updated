const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const otpExpiration = Date.now() + 10 * 60 * 1000; // 10 minutes
  return { otp, otpExpiration };
};

module.exports = { generateOtp };
