export enum Side {
  Buy = 'Buy',
  Sell = 'Sell',
}

export enum OrderType {
  Limit = 'Limit',
  Market = 'Market',
}

export enum OrderStatus {
  Open = 'Open',
  PartiallyFilled = 'PartiallyFilled',
  Filled = 'Filled',
  Cancelled = 'Cancelled',
  Rejected = 'Rejected',
}

export interface Order {
  id: string; // UUID
  market_id: string;
  trader: string;
  side: Side;
  order_type: OrderType;
  price: number;
  size: number;
  remaining_size: number;
  status: OrderStatus;
  created_at: string; // ISO 8601
}

export interface CreateOrderRequest {
  market_id: string;
  trader: string;
  side: Side;
  order_type: OrderType;
  price: number;
  size: number;
}

export interface BackendPosition {
  position_id: string;
  trader: string;
  market_id: string;
  side: Side;
  size: string;
  collateral: string;
  entry_price: string;
  status: 'Open' | 'Closed' | 'Liquidated';
  created_at: string;
}
