const cookieParams = {
  httpOnly: true,
  //secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

module.export= cookieParams;
