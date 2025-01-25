import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const KRAKEN_API_BASE_URL = 'https://api.kraken.com';
const API_KEY = process.env.KRAKEN_API_KEY;
const API_SECRET = process.env.KRAKEN_API_SECRET;

if (!API_KEY || !API_SECRET) {
  throw new Error('Missing API keys in environment variables.');
}

/**
 * Generate the API signature required for private endpoints.
 * @param path API endpoint path (e.g., '/0/private/Balance')
 * @param nonce Unique nonce value
 * @param requestData Additional data sent with the request
 */
const createSignature = (
  path: string,
  nonce: string,
  requestData: string,
): string => {
  const message = `${nonce}${requestData}`;
  const secretBuffer = Buffer.from(API_SECRET, 'base64');
  const hash = crypto.createHash('sha256').update(message).digest();
  return crypto
    .createHmac('sha512', secretBuffer)
    .update(Buffer.concat([Buffer.from(path), hash]))
    .digest('base64');
};

/**
 * Send a request to Kraken's API.
 * @param endpoint API endpoint (e.g., '/0/private/Balance')
 * @param method HTTP method ('GET' or 'POST')
 * @param params Query or body parameters
 * @param isPrivate Whether the endpoint requires authentication
 */
const krakenRequest = async (
  endpoint: string,
  method: 'GET' | 'POST',
  params: Record<string, string> = {},
  isPrivate = false,
) => {
  const path = `/0${endpoint}`;
  let url = `${KRAKEN_API_BASE_URL}${path}`;
  const nonce = Date.now().toString();

  let headers = {};
  let body = '';

  if (isPrivate) {
    // Generate request body and signature
    const requestData = new URLSearchParams({ ...params, nonce }).toString();
    const signature = createSignature(path, nonce, requestData);

    headers = {
      'API-Key': API_KEY,
      'API-Sign': signature,
    };
    body = requestData;
  } else {
    // For public endpoints, pass params as query strings
    const queryParams = new URLSearchParams(params).toString();
    url += queryParams ? `?${queryParams}` : '';
  }

  try {
    const response = await axios({
      method,
      url,
      headers,
      data: body,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Kraken API error:', error.response?.data || error.message);
    } else {
      console.error('Kraken API error:', error);
    }
    throw error;
  }
};

// Exported methods for public and private endpoints
export const KrakenService = {
  publicRequest: (endpoint: string, params: Record<string, string> = {}) =>
    krakenRequest(endpoint, 'GET', params, false),

  privateRequest: (endpoint: string, params: Record<string, string> = {}) =>
    krakenRequest(endpoint, 'POST', params, true),
};
