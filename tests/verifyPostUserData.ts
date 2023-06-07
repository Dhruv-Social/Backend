// things to verify
/* 
username -> no special characters only alphabet and numbers no spaces 
password -> 7 characters no white space
location 
-> ["Auckland", "Christchurch", "Wellington", "Hamilton", "Tauranga", "Lower Hutt", "Dunedin", "Palmerston North", "Napier", "Porirua", "Hibiscus Coast", "	New Plymouth", "Rotorua", "Whangārei", "Nelson", "Hastings", "Invercargill", "Upper Hutt", "Whanganui", "Gisborne"]
*/

let correctUsername = "dhruvayat";
let inCorrectUsername = "dhruv rayat !@*&^#";

let correctPasword = "ILoveRickAstley123!@#";
let inCorrectPassword = "NO WAY IS THAT RICK ASTLEY";

let correctCity = "auckland";
let inCorrectCity = "no way among us";

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

console.log(verifyUsername(inCorrectUsername));
