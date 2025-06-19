const isLocalhostOrigin = (req) => {
  if (!req?.headers?.origin) {
    return null;
  }

  const origin = req.headers.origin;

  console.log("origin", origin);

  if (origin.startsWith("http://localhost")) {
    return req.headers.origin;
  }

  return null;
};

export default isLocalhostOrigin;
