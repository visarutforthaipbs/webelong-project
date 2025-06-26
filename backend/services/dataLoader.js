const fs = require("fs");
const path = require("path");

function loadJSON(filename) {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, "../data", filename), "utf-8")
  );
}

const minimumWages = loadJSON("minimum_wages.json");
const wageMultipliers = loadJSON("wage_multipliers.json");
const severancePay = loadJSON("severance_pay.json");
const leaveEntitlements = loadJSON("leave_entitlements.json");

module.exports = {
  minimumWages,
  wageMultipliers,
  severancePay,
  leaveEntitlements,
};
