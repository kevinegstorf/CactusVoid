var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var import_node_cron = __toESM(require("node-cron"));
var import_crypto = __toESM(require("crypto"));
var import_krakenService = require("./services/krakenService");
var import_db = require("./db");
var import_schema = require("./schema");
const TIME = "*/15 * * * *";
import_node_cron.default.schedule("* * * * *", async () => {
  try {
    console.log("Fetching ticker data...");
    const tickerData = await import_krakenService.KrakenService.publicRequest("/public/Ticker", {
      pair: "BTCUSD"
      // Example: Bitcoin to USD
    });
    await import_db.db.insert(import_schema.tickerDataTable).values({
      id: import_crypto.default.randomUUID(),
      // Generate a unique ID
      data: tickerData
      // Store the ticker data as JSONB
    });
    console.log("Ticker data saved to database:", tickerData);
  } catch (error) {
    console.error("Error fetching or saving ticker data:", error);
  }
});
console.log("Cron job scheduled");
//# sourceMappingURL=cron.js.map
