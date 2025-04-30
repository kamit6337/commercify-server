import redisClient from "../redisClient.js";

export const getCountryFromLanLonFromRedis = async (
  lat,
  lon,
  radiusInKm = 1000
) => {
  if (!lat || !lon) return null;

  const key = "Geolocation";

  // Query locations within the given radius
  const nearbyLocations = await redisClient.georadius(
    key,
    lon,
    lat,
    radiusInKm,
    "km"
  );

  if (!nearbyLocations?.length) {
    return null; // No nearby locations found
  }

  // Fetch detailed data for the first nearby location
  const id = nearbyLocations[0]; // Choose the closest match
  const countryInfo = await redisClient.get(`CountryInfo:${id}`);

  return countryInfo ? JSON.parse(countryInfo) : null;
};

export const setCountryFromlanLonIntoRedis = async (lat, lon, data) => {
  if (!lat || !lon || !data) return null;

  const key = "Geolocation";
  const id = `${lat}:${lon}`; // Unique identifier for the location

  // Add the location to the Redis geospatial set
  await redisClient.geoadd(key, lon, lat, id);

  await redisClient.expire(key, 60 * 60 * 24);

  // Store the country info in a separate key
  await redisClient.set(
    `CountryInfo:${id}`,
    JSON.stringify(data),
    "EX",
    60 * 60 * 24
  );
};
