const trimWhiteSpaces = (param, value) => (param || '')
  .trim()
  .replace(/\s+/g, value || ' ');

export const checkNumber = (value, defaultValue) => Number.parseInt(value, 10) || defaultValue;

export const validateLocation = (location) => {
  const { name, male, female } = location;

  const parsedName = trimWhiteSpaces(name);
  const parsedMale = checkNumber(male, 0);
  const parsedFemale = checkNumber(female, 0);

  if (parsedName.length < 2 || !parsedMale || !parsedFemale) {
    return false;
  }

  return {
    ...location,
    name: parsedName,
    male: parsedMale,
    female: parsedFemale,
  };
};
