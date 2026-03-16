import React, { useState } from 'react';
import { Order } from '../types';
import { formatCurrency } from '../utils';
import { motion, AnimatePresence } from 'motion/react';

interface OpenOrdersProps {
  orders: Order[];
  onCancel: (id: string) => void;
  onCancelAll: () => void;
  layout?: 'list' | 'grid';
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

function OrderCard({ order, onCancel }: { key?: string | number; order: Order; onCancel: (id: string) => void }) {
  const assetSymbol = order.pair.split('-')[0] || order.pair.split('/')[0];
  const isBuy = order.side === 'Buy';

  let typeColor = 'text-dm-text2 border-dm-border';
  if (order.type === 'Limit') typeColor = 'bg-dream-blue/10 text-dream-blue border-dream-blue/20';
  if (order.type === 'Take Profit') typeColor = 'bg-dream-green/10 text-dream-green border-dream-green/20';
  if (order.type === 'Stop Loss') typeColor = 'bg-dream-red/10 text-dream-red border-dream-red/20';

  return (
    <motion.div
      variants={cardVariants}
      className="premium-card relative overflow-hidden"
    >
      {/* Thinner, elegant accent stripe */}
      <div className={`absolute left-0 top-0 bottom-0 w-[2px] ${isBuy ? 'bg-dream-green' : 'bg-dream-red'}`} />

      <div className="p-3 pl-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-xs uppercase tracking-wide text-dm-text">{order.pair}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-sm font-bold ${isBuy ? 'bg-dream-green/10 text-dream-green' : 'bg-dream-red/10 text-dream-red'}`}>
              {order.side}
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-sm font-bold border ${typeColor}`}>
              {order.type}
            </span>
          </div>
          <span className="text-[11px] font-bold text-dm-text2">{order.size} <span className="text-dm-text3">{assetSymbol}</span></span>
        </div>

        <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-4">
          <div className="text-left">
            <p className="text-[9px] font-semibold text-dm-text3 uppercase tracking-wide">Trig. Price</p>
            <p className="text-xs font-bold text-dm-text mt-0.5">{formatCurrency(order.price)}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-semibold text-dm-text3 uppercase tracking-wide">Filled</p>
            <p className="text-xs font-bold text-dm-text mt-0.5">{(order.filled / order.size * 100).toFixed(2)}%</p>
          </div>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onCancel(order.id)}
            className="w-full py-1.5 rounded-sm text-[11px] font-bold uppercase tracking-wide bg-dm-surface-alt border border-dm-border text-dm-text2 hover:text-white hover:border-dream-red/50 hover:bg-dream-red transition-all"
          >
            Cancel Order
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

export function OpenOrders({ orders, onCancel, onCancelAll, layout = 'list' }: OpenOrdersProps) {
  const [filterType, setFilterType] = useState<string>('All');
  
  const filteredOrders = filterType === 'All' 
    ? orders 
    : orders.filter(o => o.type === filterType);

  return (
    <section>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xs font-bold text-dm-text3 uppercase tracking-wider">Open Orders</h2>
          {orders.length > 0 && (
            <motion.span
              key={orders.length}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-[10px] font-bold bg-dm-surface-raised border border-dm-border text-dm-text2 px-1.5 py-0.5 rounded-sm"
            >
              {orders.length}
            </motion.span>
          )}
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Order Type Filter */}
          <div className="flex relative bg-dm-surface-alt rounded-sm p-0.5 border border-dm-border flex-1 sm:flex-none">
            {['All', 'Limit', 'Take Profit', 'Stop Loss'].map((type, i) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`relative z-10 py-1.5 px-3 rounded-sm text-[10px] uppercase tracking-wide font-bold transition-all whitespace-nowrap flex-1 sm:flex-none ${
                   filterType === type ? 'text-white' : 'text-dm-text3 hover:text-dm-text2'
                }`}
              >
                {filterType === type && (
                  <motion.div
                    layoutId="openOrdersFilter"
                    className="absolute inset-0 bg-dm-surface-strong border border-dm-border rounded-sm -z-10"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
                {type === 'Take Profit' ? 'TP' : type === 'Stop Loss' ? 'SL' : type}
              </button>
            ))}
          </div>

          {orders.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCancelAll}
              className="bg-transparent border border-dm-border hover:bg-dream-red hover:border-dream-red/50 hover:text-white px-3 py-1.5 rounded-sm text-[10px] uppercase tracking-wider font-bold text-dm-text2 transition-all shrink-0"
            >
              Cancel All
            </motion.button>
          )}
        </div>
      </div>

      {layout === 'grid' ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col md:flex-row items-start gap-4"
        >
          <div className="flex-1 flex flex-col gap-4 w-full">
            {filteredOrders.filter((_, i) => i % 2 === 0).map((order) => (
              <OrderCard key={order.id} order={order} onCancel={onCancel} />
            ))}
          </div>
          <div className="flex-1 flex flex-col gap-4 w-full">
            {filteredOrders.filter((_, i) => i % 2 === 1).map((order) => (
              <OrderCard key={order.id} order={order} onCancel={onCancel} />
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-3"
        >
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} onCancel={onCancel} />
          ))}
        </motion.div>
      )}

      {filteredOrders.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.2 } }}
          className="py-16 text-center text-dm-text3 font-medium text-sm"
        >
          {orders.length === 0 ? "No active orders" : "No orders match filter"}
        </motion.div>
      )}
    </section>
  );
}
