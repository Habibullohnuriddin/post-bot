// personModel.js or a separate utility file

const personModel = require("../models/personModel");

async function resetUserData(userId) {
  try {
    await personModel.findOneAndDelete({ id: userId });
    console.log(`User data for ID ${userId} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting user data: ${error}`);
  }
}

module.exports = { resetUserData };
