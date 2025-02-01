var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var krakenService_exports = {};
__export(krakenService_exports, {
  KrakenService: () => KrakenService
});
module.exports = __toCommonJS(krakenService_exports);
var import_axios = __toESM(require("axios"));
var import_crypto = __toESM(require("crypto"));
var import_dotenv = __toESM(require("dotenv"));
import_dotenv.default.config();
const KRAKEN_API_BASE_URL = "https://api.kraken.com";
const getApiKey = () => process.env.KRAKEN_API_KEY || "";
const getApiSecret = () => process.env.KRAKEN_API_SECRET || "";
const createSignature = (path, nonce, requestData, apiSecret) => {
  const message = `${nonce}${requestData}`;
  const secretBuffer = Buffer.from(apiSecret, "base64");
  const hash = import_crypto.default.createHash("sha256").update(message).digest();
  return import_crypto.default.createHmac("sha512", secretBuffer).update(Buffer.concat([Buffer.from(path), hash])).digest("base64");
};
const krakenRequest = async (endpoint, method, params = {}, isPrivate = false, apiKey, apiSecret) => {
  const path = `/0${endpoint}`;
  let url = `${KRAKEN_API_BASE_URL}${path}`;
  const nonce = Date.now().toString();
  let headers = {};
  let body = "";
  if (isPrivate) {
    const requestData = new URLSearchParams({ ...params, nonce }).toString();
    const signature = createSignature(path, nonce, requestData, apiSecret);
    headers = {
      "API-Key": apiKey,
      "API-Sign": signature
    };
    body = requestData;
  } else {
    const queryParams = new URLSearchParams(params).toString();
    url += queryParams ? `?${queryParams}` : "";
  }
  try {
    const response = await (method === "GET" ? import_axios.default.get(url, { headers }) : import_axios.default.post(url, body, { headers }));
    return response.data;
  } catch (error) {
    if (import_axios.default.isAxiosError(error)) {
      console.error("Kraken API error:", error.response?.data || error.message);
    } else {
      console.error("Kraken API error:", error.message);
    }
    throw error;
  }
};
const KrakenService = {
  publicRequest: (endpoint, params = {}) => krakenRequest(endpoint, "GET", params, false, "", ""),
  privateRequest: (endpoint, params = {}) => krakenRequest(endpoint, "POST", params, true, getApiKey(), getApiSecret())
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  KrakenService
});
