const fs = require("fs");

let data = fs.readFileSync("src/constants/eventsData.js", "utf8");

const photoBank = {
  coding: [
    "1555066931-4365d14bab8c",
    "1504384308090-c894fdcc538d",
    "1547658719-da2b51169166",
    "1517694712202-14dd9538aa97",
    "1498050108023-c5249f4df085",
    "1516321318423-f06f85e504b3",
    "1537432376710-30f148b59e66",
    "1528312635001-4437f2bebc56",
  ],
  ai: [
    "1677442135703-1787eea5ce01",
    "1686191128892-3b37add4c844",
    "1614313913007-2b4ae8ce32d6",
    "1555255707-c128de1ab916",
    "1655635643532-fa9ba2648cbe",
    "1620712943543-bcc4688e7485",
  ],
  cybersecurity: [
    "1526374965328-7f61d4dc18c5",
    "1518770660439-4636190af475",
    "1563206767-5b18f218e8de",
    "1550751827-4bd374c3f58b",
    "1614064065662-7e9f3b890868",
    "1603530006765-caea66b3b5cc",
  ],
  civil: [
    "1541888946425-d81bb19240f5",
    "1504307651254-35680f356dfd",
    "1581092160562-40aa08e78837",
    "1486406146926-c627a92ad1ab",
    "1600880292203-757bb62b4baf",
    "1503387837-d1a63c3d5268",
  ],
  mechanical: [
    "1619642751034-765dfdf7c58e",
    "1581092335397-9583eb92d232",
    "1537462715879-360eeb6ce67c",
    "1565439364964-b0451cf29875",
    "1504917595217-d4bb5ece1222",
    "1580983511871-33ed6b45070f",
  ],
  electronics: [
    "1518770660439-4636190af475",
    "1563770660941-20978e870e26",
    "1592659762303-90081d34b277",
    "1517077304055-6e89babf81ce",
    "1611078449448-6a581e2858b4",
    "1581092926715-da4869c9b56f",
  ],
  design: [
    "1586717791821-3f44a563fa4c",
    "1601813600867-4ca1c77d1e4f",
    "1561070791-2ca8205f458d",
    "1576153192396-180ecef2a715",
    "1558655146-d49348e9ae97",
    "1561070791-2ca8205f458d",
  ],
  sports: [
    "1519766030049-a3f70168d11e",
    "1571019613454-1cb2f99b2d8b",
    "1526676037777-05a232554f77",
    "1461896836920-20f00115ea41",
    "1534438327276-14e5300c3a48",
    "1504150558240-6b4e79e5e601",
    "1512133202110-388e404b9ea6",
    "1541532713-71b569566ce0",
  ],
  dance_art: [
    "1579783902614-a3fb3927b6a5",
    "1533174072545-e8d4aa97edf9",
    "1508700115892-45af05efa256",
    "1516450360452-9312f5e86fc7",
    "1460661419201-e58b8f0ca49db",
    "1514525253161-7a46d19cd819",
    "1486851147575-dc3895e7bcdc",
  ],
  gaming: [
    "1556438064-2d7646166914",
    "1542751371-adc38448a05e",
    "1493711662062-fa541adb3fc8",
    "1511512578047-dfb367046420",
    "1538481199705-c710c4e965fc",
    "1518770660439-w2eh1hdn3bf4",
  ],
  generic: [
    "1451187580459-43490279c0fa",
    "1488590528505-98d2b5dba041",
    "1484417142883-7c3ff5c18683",
    "1519389950473-47ba0277781c",
    "1531482615713-2afd69097998",
    "1564858487739-12a842fed73d",
    "1503387837-d1a63c3d5268",
    "1551288049-bebda4e38f71",
    "1535223289-56ebbbdc74c2",
  ],
};

let used = new Set();
let catPointers = {};

function getPhoto(category) {
  let pool = photoBank[category];
  if (!pool) pool = photoBank["generic"];

  // Shuffle or pick next unused
  for (let p of pool) {
    if (!used.has(p)) {
      used.add(p);
      return p;
    }
  }

  // If all used in this category, return a random one
  return pool[Math.floor(Math.random() * pool.length)];
}

data = data.replace(
  /id:\s*"([^"]+)"([\s\S]*?)image:\s*"([^"]+)"/g,
  (m, id, middle, img) => {
    const t = id.toLowerCase();
    let cat = "generic";

    if (
      t.includes("code") ||
      t.includes("hack") ||
      t.includes("web") ||
      t.includes("tictionary") ||
      t.includes("uiux")
    )
      cat = "coding";
    else if (
      t.includes("game") ||
      t.includes("escape") ||
      t.includes("puzzle") ||
      t.includes("mystery") ||
      t.includes("treasure") ||
      t.includes("trivia") ||
      t.includes("cornhole")
    )
      cat = "gaming";
    else if (
      t.includes("ai") ||
      t.includes("genai") ||
      t.includes("data") ||
      t.includes("sql") ||
      t.includes("simulat")
    )
      cat = "ai";
    else if (
      t.includes("cyber") ||
      t.includes("cryptography") ||
      t.includes("blind") ||
      t.includes("sharks")
    )
      cat = "cybersecurity";
    else if (
      t.includes("civil") ||
      t.includes("bridge") ||
      t.includes("cad") ||
      t.includes("bidding") ||
      t.includes("build")
    )
      cat = "civil";
    else if (t.includes("mech") || t.includes("engine") || t.includes("robo"))
      cat = "mechanical";
    else if (
      t.includes("ece") ||
      t.includes("eee") ||
      t.includes("circuit") ||
      t.includes("vlsi") ||
      t.includes("sensor") ||
      t.includes("plc") ||
      t.includes("electro")
    )
      cat = "electronics";
    else if (
      t.includes("dance") ||
      t.includes("flashmob") ||
      t.includes("paint") ||
      t.includes("animat") ||
      t.includes("meme")
    )
      cat = "dance_art";
    else if (
      t.includes("run") ||
      t.includes("sport") ||
      t.includes("dodgeball") ||
      t.includes("sumo") ||
      t.includes("cricket") ||
      t.includes("ping") ||
      t.includes("bottle") ||
      t.includes("pushup")
    )
      cat = "sports";
    else if (
      t.includes("ui/ux") ||
      t.includes("design") ||
      t.includes("poster")
    )
      cat = "design";

    const photoId = getPhoto(cat);
    const newImg = `https://images.unsplash.com/photo-${photoId}?w=800&q=80`;
    return 'id: "' + id + '"' + middle + 'image: "' + newImg + '"';
  },
);

fs.writeFileSync("src/constants/eventsData.js", data);
console.log("Applied curated theme-based Unsplash images successfully!");
