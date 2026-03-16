import { CreateOrderRequest, Order, BackendPosition } from './types';

const API_BASE_URL = 'http://localhost:8080';

export interface BackendMarket {
  id: string;
  base: string;
  quote: string;
  active: boolean;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  public async getHealth(): Promise<{ status: string; markets: string[] }> {
    return this.request('/health');
  }

  public async getMarkets(): Promise<BackendMarket[]> {
    return this.request<BackendMarket[]>('/markets');
  }

  public async createOrder(order: CreateOrderRequest): Promise<Order> {
    return this.request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  }

  public async getOrder(id: string): Promise<Order | null> {
    return this.request<Order | null>(`/orders/${id}`);
  }

  public async getOrdersByMarket(marketId: string): Promise<Order[]> {
    return this.request<Order[]>(`/markets/${marketId}/orders`);
  }

  public async getPositions(trader: string): Promise<BackendPosition[]> {
    return this.request<BackendPosition[]>(`/positions/${trader}`);
  }

  public async getOrderBook(marketId: string): Promise<{ market_id: string; asks: [number, number][]; bids: [number, number][]; timestamp: number }> {
    return this.request(`/orderbook/${marketId}`);
  }

  public async getTrades(marketId: string): Promise<any[]> {
    return this.request(`/trades/${marketId}`);
  }

  public async getTicker(marketId: string): Promise<MarketTicker> {
    return this.request<MarketTicker>(`/markets/${marketId}/ticker`);
  }

  public async getAccount(address: string): Promise<AccountInfo> {
    return this.request<AccountInfo>(`/account/${address}`);
  }
}

export interface MarketTicker {
  market_id: string;
  price: number;
  price_24h_ago: number;
  change_24h_pct: number;
  volume_24h_usd: number;
  trade_count_24h: number;
  open_interest_usd: number;
  long_ratio: number;
  short_ratio: number;
  funding_rate_pct: number;
  fee_open_bps: number;
  fee_close_bps: number;
  funding_interval_sec: number;
  updated_at: number;
}

export interface AccountInfo {
  address: string;
  usdc_balance: number;
  usdc_balance_raw: string;
  token: string;
}

export const apiClient = new ApiClient(API_BASE_URL);
