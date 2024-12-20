const unidentifiedError = (req, res, next) => {
  return next(
    new HandleGlobalError(
      `Somethings went wrong. Please check your Url - ${req.originalUrl}`,
      500,
      "Fail"
    )
  );
};

export default unidentifiedError;
