require("dotenv").config();

const mongoose = require("mongoose");
const config = require("../../config");
const User = require("../models/user");
const Logger = require("./logger");
const seed = require("./data.json");

const log = new Logger("Utils:Seeder");
console.log('We are here')

mongoose.set("useCreateIndex", true);
/* eslint-disable */
/**
 * Seeder utility
 */
class Seeder {
  /**
   * @param  {string} databaseName
   */
  constructor(databaseName) {
    this.setUp(databaseName);
  }

  async setUp(databaseName) {
    await mongoose.connect(databaseName, { useNewUrlParser: true });
  }

  /**
   * @param  {string} message
   * performs seeding
   */
  async seed(data) {
    let validUser = {};
    await Promise.all(
      data.map(async (item, i) => {
        if (!(await User.exists({ email: item.email }))) {
          validUser = new User(item);
          await validUser.setPassword(item.password);
          await validUser.save();
          log.info(`seeding ${item.email}  ...`);
        } else {
          log.info(`${item.email} already exist, maintaining old user`);
        }
        if (i + 1 === data.length) await this.closeConnection();
      })
    );
    log.info("seeding complete");
  }

  async closeConnection() {
    await mongoose.disconnect();
  }
}

const newSeed = new Seeder('mongodb://127.0.0.1:27017/fastFood?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.0');
newSeed.seed(seed);

module.exports = {
  Seeder,
};
