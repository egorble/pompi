import { CreateOrderRequest, Order, SetBalanceRequest, BackendPosition } from './types';

const API_BASE_URL = 'http://localhost:8080';

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

  public async setBalance(data: SetBalanceRequest): Promise<string> {
    return this.request<string>('/debug/balance', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async getPositions(trader: string): Promise<BackendPosition[]> {
    return this.request<BackendPosition[]>(`/positions/${trader}`);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
