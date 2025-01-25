import axios from 'axios';
import { KrakenService } from '../services/krakenService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock environment variables
process.env.KRAKEN_API_KEY = 'mockApiKey';
process.env.KRAKEN_API_SECRET = 'mockApiSecret';

describe('KrakenService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch ticker data from public endpoint', async () => {
    const mockTickerData = {
      error: [],
      result: {
        XXBTZUSD: {
          a: ['104840.40000'],
          b: ['104839.90000'],
          c: ['104840.40000'],
          v: ['104840.40000'],
          p: ['104840.40000'],
          t: ['104840.40000'],
          l: ['104840.40000'],
          h: ['104840.40000'],
          o: '104840.40000',
        },
      },
    };

    mockedAxios.get.mockResolvedValue({ data: mockTickerData });

    const tickerData = await KrakenService.publicRequest('/public/Ticker', {
      pair: 'BTCUSD',
    });

    expect(tickerData).toEqual(mockTickerData);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://api.kraken.com/0/public/Ticker?pair=BTCUSD',
      { headers: {} },
    );
  });

  it('should fetch account balance from private endpoint', async () => {
    const mockBalanceData = {
      error: [],
      result: {
        ATOM: '0.00000000',
        'ETH.F': '0.0366863259',
        SOL: '0.0000000000',
        XETH: '0.0000000000',
      },
    };

    mockedAxios.post.mockResolvedValue({ data: mockBalanceData });

    const balanceData = await KrakenService.privateRequest('/private/Balance');

    expect(balanceData).toEqual(mockBalanceData);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://api.kraken.com/0/private/Balance',
      expect.any(String),
      expect.any(Object),
    );
  });
});
