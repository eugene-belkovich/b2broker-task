export const isValidJSONResponse = (message) => {
  try {
    JSON.parse(message);
  } catch (e) {
    return false;
  }
  return true;
};
