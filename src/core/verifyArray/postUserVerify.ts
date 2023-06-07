let verifyUsername = (username: string): boolean => {
  if (!/^[A-Za-z0-9]*$/.test(username)) {
    return false;
  }

  return true;
};

let verifyPassword = (password: string): boolean => {
  if (password.length < 7) {
    return false;
  }

  if (password.indexOf(" ") >= 0) {
    return false;
  }

  return true;
};

let verifyLocation = (city: string): boolean => {
  const cities = [
    "Auckland",
    "Christchurch",
    "Wellington",
    "Hamilton",
    "Tauranga",
    "Lower Hutt",
    "Dunedin",
    "Palmerston North",
    "Napier",
    "Porirua",
    "Hibiscus Coast",
    "New Plymouth",
    "Rotorua",
    "Whangārei",
    "Nelson",
    "Hastings",
    "Invercargill",
    "Upper Hutt",
    "Whanganui",
    "Gisborne",
  ];

  return cities.includes(
    city.toLowerCase().charAt(0).toUpperCase() +
      city.toLocaleLowerCase().slice(1)
  );
};

export { verifyUsername, verifyPassword, verifyLocation };
