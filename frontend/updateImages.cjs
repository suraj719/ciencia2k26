const fs = require("fs");
let data = fs.readFileSync("src/constants/eventsData.js", "utf8");

data = data.replace(
  /id:\s*"([^"]+)"([\s\S]*?)image:\s*"([^"]+)"/g,
  (m, id, middle, img) => {
    return (
      'id: "' +
      id +
      '"' +
      middle +
      'image: "https://picsum.photos/seed/' +
      id +
      '-ciencia/800/600"'
    );
  },
);

fs.writeFileSync("src/constants/eventsData.js", data);
console.log("Images replaced successfully!");
