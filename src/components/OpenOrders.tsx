import React, { useState } from 'react';
import { Order } from '../types';
import { formatCurrency } from '../utils';
import { motion, AnimatePresence } from 'motion/react';

interface OpenOrdersProps {
  orders: Order[];
  onCancel: (id: string) => void;
  onCancelAll: () => void;
  layout?: 'list' | 'grid';
  customTitle?: React.ReactNode;
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
      className="bg-transparent border border-dm-border rounded-[24px] p-4 relative overflow-hidden"
    >
      {/* Main content */}
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
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onCancel(order.id)}
            className="flex-1 py-1.5 rounded-2xl text-[11px] font-bold border transition-all bg-transparent text-dream-red border-dream-red/30 hover:border-dream-red/60"
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

export function OpenOrders({ orders, onCancel, onCancelAll, layout = 'list', customTitle }: OpenOrdersProps) {
  return (
    <section className="bg-dm-surface border border-dm-border rounded-[24px] p-4 lg:p-6 w-full flex flex-col flex-1 shrink-0 relative z-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-3">
          {customTitle || <h2 className="text-xs font-bold text-dm-text3 uppercase tracking-wider">Open Orders</h2>}
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
        
        {!customTitle && orders.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCancelAll}
              className="bg-transparent border border-dm-border hover:bg-dm-surface-strong hover:text-white px-3 py-1.5 rounded-sm text-[10px] uppercase tracking-wider font-bold text-dm-text3 transition-all shrink-0"
            >
              Cancel All
            </motion.button>
          )}
      </div>

      {layout === 'grid' ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="w-full"
        >
          {/* Mobile: 1 col */}
          <div className="grid md:hidden grid-cols-1 gap-6">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} onCancel={onCancel} />
            ))}
          </div>

          {/* Tablet: 2 cols */}
          <div className="hidden md:grid lg:hidden grid-cols-2 gap-6 items-start">
            <div className="flex flex-col gap-6">
              {orders.filter((_, i) => i % 2 === 0).map((order) => (
                <OrderCard key={order.id} order={order} onCancel={onCancel} />
              ))}
            </div>
            <div className="flex flex-col gap-6">
              {orders.filter((_, i) => i % 2 === 1).map((order) => (
                <OrderCard key={order.id} order={order} onCancel={onCancel} />
              ))}
            </div>
          </div>

          {/* Desktop: 3 cols */}
          <div className="hidden lg:grid grid-cols-3 gap-6 items-start">
            <div className="flex flex-col gap-6">
              {orders.filter((_, i) => i % 3 === 0).map((order) => (
                <OrderCard key={order.id} order={order} onCancel={onCancel} />
              ))}
            </div>
            <div className="flex flex-col gap-6">
              {orders.filter((_, i) => i % 3 === 1).map((order) => (
                <OrderCard key={order.id} order={order} onCancel={onCancel} />
              ))}
            </div>
            <div className="flex flex-col gap-6">
              {orders.filter((_, i) => i % 3 === 2).map((order) => (
                <OrderCard key={order.id} order={order} onCancel={onCancel} />
              ))}
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-3"
        >
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} onCancel={onCancel} />
          ))}
        </motion.div>
      )}

      {orders.length === 0 && (
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
