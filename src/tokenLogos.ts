// Token logo URLs from CoinGecko CDN
const TOKEN_LOGOS: Record<string, string> = {
  BTC: 'https://assets.coingecko.com/coins/images/1/standard/bitcoin.png',
  ETH: 'https://assets.coingecko.com/coins/images/279/standard/ethereum.png',
  SOL: 'https://assets.coingecko.com/coins/images/4128/standard/solana.png',
};

/**
 * Get the logo URL for a given token symbol.
 * Accepts formats like "BTC", "BTC/USDC", "BTC-PERP" etc.
 */
export function getTokenLogo(symbolOrPair: string): string | null {
  const symbol = symbolOrPair
    .split('/')[0]
    .split('-')[0]
    .toUpperCase()
    .trim();
  return TOKEN_LOGOS[symbol] || null;
}
