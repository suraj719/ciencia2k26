require("dotenv").config();
const mongoose = require("mongoose");
const Registration = require("./models/Registration");

async function check() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");
    const regs = await Registration.find({});
    console.log("Total registrations:", regs.length);
    if (regs.length > 0) {
      console.log("First reg:", JSON.stringify(regs[0], null, 2));
    }
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

check();
