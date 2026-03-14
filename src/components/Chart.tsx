import React from 'react';
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';
import { Pair } from '../types';

interface ChartProps {
  pair?: Pair;
}

export function Chart({ pair }: ChartProps) {
  // Format pair symbol for TradingView (e.g., "BTC/USDC" -> "BINANCE:BTCUSDT")
  // TradingView uses USDT pairs on Binance, not USDC
  const base = pair ? pair.pair.split('/')[0] : 'BTC';
  const symbol = `BINANCE:${base}USDT`;

  return (
    <section className="bg-white rounded-[16px] dream-shadow flex-grow relative overflow-hidden h-full min-h-0">
      <div className="w-full h-full">
        {/* @ts-ignore - passing favorites to override TradingView defaults */}
        <AdvancedRealTimeChart
          symbol={symbol}
          theme="light"
          autosize
          allow_symbol_change={false}
          hide_side_toolbar={true}
          hide_top_toolbar={false}
          hide_legend={true}
          enable_publishing={false}
          save_image={false}
          style="1"
          timezone="Etc/UTC"
          withdateranges={false}
          details={false}
          hotlist={false}
          calendar={false}
          favorites={{ chartTypes: [] }}
        />
      </div>
    </section>
  );
}
