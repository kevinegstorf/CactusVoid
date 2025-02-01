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
var import_express = __toESM(require("express"));
var import_krakenService = require("./services/krakenService");
const host = process.env.HOST ?? "localhost";
const port = process.env.PORT ? Number(process.env.PORT) : 3e3;
const app = (0, import_express.default)();
const testKrakenAPI = async () => {
  try {
    console.log("Fetching asset prices...");
    const tickerData = await import_krakenService.KrakenService.publicRequest("/public/Ticker", {
      pair: "BTCUSD"
      // Example: Bitcoin to USD
    });
    console.log("Ticker Data:", tickerData);
    console.log("Fetching account balance...");
    const balanceData = await import_krakenService.KrakenService.privateRequest("/private/Balance");
    console.log("Account Balance:", balanceData);
    return { ...tickerData };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error testing Kraken API:", error.message);
    } else {
      console.error("Error testing Kraken API:", error);
    }
    throw error;
  }
};
app.get("/ticker", async (req, res) => {
  try {
    const tickerData = await testKrakenAPI();
    res.send({ message: "Hello Kraken api test", tickerData });
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch Kraken API data", error: error.message });
  }
});
app.get("/balance", (req, res) => {
  import_krakenService.KrakenService.privateRequest("/private/Balance").then((balanceData) => {
    res.send({ message: "Hello Kraken api test", balanceData });
  }).catch((error) => {
    res.status(500).send({ message: "Failed to fetch Kraken API data", error: error.message });
  });
});
app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
