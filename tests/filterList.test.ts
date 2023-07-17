const json = [
  {
    uuid: "e",
    age: "10",
    name: "Dhruv",
  },
  {
    uuid: "123",
    age: "16",
    name: "Siddy",
  },
];

const filteredJson = json.filter((obj) => obj.uuid !== "e");

console.log(filteredJson);
