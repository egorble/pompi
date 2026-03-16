import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Wallet, ArrowDownToLine, ArrowUpFromLine, Clock, Copy, Check, ChevronDown } from 'lucide-react';
import { useStore } from '../store';
import { useAccount, useDisconnect, useBalance, useChainId, useSwitchChain } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { mainnet, arbitrum, optimism, base, polygon } from 'wagmi/chains';

interface AccountPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'assets' | 'deposit' | 'withdraw' | 'history';

interface DepositRecord {
  id: string;
  type: 'deposit' | 'withdraw';
  asset: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  time: string;
}

const mockHistory: DepositRecord[] = [
  { id: '1', type: 'deposit', asset: 'USDC', amount: 5000, status: 'completed', time: '2026-03-15 14:30' },
  { id: '2', type: 'deposit', asset: 'ETH', amount: 1.5, status: 'completed', time: '2026-03-14 09:15' },
  { id: '3', type: 'withdraw', asset: 'USDC', amount: 1000, status: 'pending', time: '2026-03-16 08:00' },
  { id: '4', type: 'deposit', asset: 'BTC', amount: 0.05, status: 'completed', time: '2026-03-13 18:45' },
];

const supportedChains = [mainnet, arbitrum, optimism, base, polygon];

export function AccountPanel({ isOpen, onClose }: AccountPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('assets');
  const { setWalletAddress, usdcBalance } = useStore();
  const [copied, setCopied] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositAsset, setDepositAsset] = useState('USDC');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAsset, setWithdrawAsset] = useState('USDC');
  const [showChainSelect, setShowChainSelect] = useState(false);

  // Wagmi hooks
  const { address, isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  // Fetch ETH balance for connected wallet
  const { data: ethBalance } = useBalance({
    address: address,
  });

  // Sync wallet address with zustand store
  useEffect(() => {
    if (address) {
      setWalletAddress(address);
    }
  }, [address, setWalletAddress]);

  const currentChain = supportedChains.find(c => c.id === chainId);

  const shortenAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnect = () => {
    openConnectModal?.();
  };

  const handleDisconnect = () => {
    disconnect();
    setWalletAddress('');
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'assets', label: 'Assets' },
    { id: 'deposit', label: 'Deposit' },
    { id: 'withdraw', label: 'Withdraw' },
    { id: 'history', label: 'History' },
  ];

  const displayBalance = usdcBalance > 0 ? usdcBalance : 10000;

  const assets = [
    {
      symbol: 'USDC',
      name: 'USD Coin',
      balance: usdcBalance > 0 ? usdcBalance : 10000,
      value: usdcBalance > 0 ? usdcBalance : 10000,
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      balance: ethBalance ? Number(ethBalance.value) / 1e18 : 0,
      value: ethBalance ? (Number(ethBalance.value) / 1e18) * 2500 : 0,
    },
  ];

  const statusColor = (status: string) => {
    if (status === 'completed') return 'text-dream-green';
    if (status === 'pending') return 'text-yellow-500';
    return 'text-dream-red';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[100]"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-[420px] bg-dm-surface z-[101] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-dm-border shrink-0">
              <h2 className="text-base font-extrabold text-dm-text">Account</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-dm-surface-alt hover:bg-dm-surface-raised text-dm-text2 hover:text-dm-text transition-colors"
              >
                <X size={16} />
              </motion.button>
            </div>

            {/* Wallet Connection */}
            <div className="px-5 py-4 border-b border-dm-border shrink-0">
              {isConnected && address ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-dream-blue/10 flex items-center justify-center">
                        <Wallet size={18} className="text-dream-blue" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-dm-text">{shortenAddress(address)}</span>
                          <motion.button
                            whileTap={{ scale: 0.8 }}
                            onClick={handleCopy}
                            className="text-dm-text3 hover:text-dm-text transition-colors"
                          >
                            {copied ? <Check size={12} className="text-dream-green" /> : <Copy size={12} />}
                          </motion.button>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-dream-green" />
                          <span className="text-[10px] font-medium text-dm-text3">
                            {connector?.name || 'Connected'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDisconnect}
                      className="px-3 py-1.5 text-xs font-bold text-dream-red bg-dream-red/10 hover:bg-dream-red/20 rounded-lg transition-colors"
                    >
                      Disconnect
                    </motion.button>
                  </div>

                  {/* Chain Selector */}
                  <div className="relative">
                    <button
                      onClick={() => setShowChainSelect(!showChainSelect)}
                      className="flex items-center gap-2 px-3 py-2 bg-dm-surface-alt border border-dm-border2 rounded-lg text-xs font-bold text-dm-text2 hover:text-dm-text transition-colors w-full"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-dream-green" />
                      {currentChain?.name || 'Unknown Network'}
                      <ChevronDown size={12} className="ml-auto" />
                    </button>
                    <AnimatePresence>
                      {showChainSelect && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="absolute top-full left-0 right-0 mt-1 bg-dm-surface border border-dm-border2 rounded-2xl shadow-lg overflow-hidden z-10"
                        >
                          {supportedChains.map(chain => (
                            <button
                              key={chain.id}
                              onClick={() => {
                                switchChain({ chainId: chain.id });
                                setShowChainSelect(false);
                              }}
                              className={`w-full px-3 py-2.5 text-xs font-bold text-left flex items-center gap-2 transition-colors ${
                                chain.id === chainId
                                  ? 'bg-dream-blue/10 text-dream-blue'
                                  : 'text-dm-text2 hover:bg-dm-surface-alt hover:text-dm-text'
                              }`}
                            >
                              <div className={`w-1.5 h-1.5 rounded-full ${chain.id === chainId ? 'bg-dream-blue' : 'bg-dm-text3'}`} />
                              {chain.name}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleConnect}
                  className="w-full py-3 rounded-2xl bg-dream-blue text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
                >
                  <Wallet size={16} />
                  Connect Wallet
                </motion.button>
              )}
            </div>

            {/* Total Balance */}
            <div className="px-5 py-4 border-b border-dm-border shrink-0">
              <span className="text-[10px] font-bold text-dm-text3 uppercase tracking-wider">Total Balance</span>
              <div className="text-2xl font-extrabold text-dm-text mt-1">
                ${displayBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-5 pt-3 border-b border-dm-border shrink-0">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-2.5 px-3 text-xs font-bold transition-colors relative ${
                    activeTab === tab.id ? 'text-dream-blue' : 'text-dm-text3 hover:text-dm-text2'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div layoutId="accountTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-dream-blue rounded-t-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
              <AnimatePresence mode="wait">
                {activeTab === 'assets' && (
                  <motion.div
                    key="assets"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="p-5 space-y-2"
                  >
                    {!isConnected && (
                      <div className="flex flex-col items-center justify-center py-8 text-dm-text3">
                        <Wallet size={32} className="mb-3 opacity-50" />
                        <span className="text-sm font-medium mb-3">Connect wallet to view assets</span>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={handleConnect}
                          className="px-4 py-2 rounded-lg bg-dream-blue text-white text-xs font-bold"
                        >
                          Connect
                        </motion.button>
                      </div>
                    )}
                    {isConnected && assets.map(asset => (
                      <div
                        key={asset.symbol}
                        className="flex items-center justify-between p-3 bg-dm-surface-alt rounded-2xl border border-dm-border hover:border-dm-border2 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-dm-surface-raised flex items-center justify-center text-xs font-extrabold text-dm-text">
                            {asset.symbol.slice(0, 2)}
                          </div>
                          <div>
                            <span className="text-sm font-bold text-dm-text">{asset.symbol}</span>
                            <div className="text-[10px] text-dm-text3 font-medium">{asset.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-dm-text">
                            {asset.balance.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                          </div>
                          <div className="text-[10px] text-dm-text3 font-medium">
                            ${asset.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'deposit' && (
                  <motion.div
                    key="deposit"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="p-5 space-y-4"
                  >
                    {!isConnected ? (
                      <div className="flex flex-col items-center justify-center py-8 text-dm-text3">
                        <Wallet size={32} className="mb-3 opacity-50" />
                        <span className="text-sm font-medium mb-3">Connect wallet to deposit</span>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={handleConnect}
                          className="px-4 py-2 rounded-lg bg-dream-blue text-white text-xs font-bold"
                        >
                          Connect
                        </motion.button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="text-[10px] font-bold text-dm-text3 uppercase tracking-wider mb-2 block">Select Token</label>
                          <div className="flex gap-2">
                            {['USDC', 'ETH'].map(a => (
                              <motion.button
                                key={a}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setDepositAsset(a)}
                                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-colors border ${
                                  depositAsset === a
                                    ? 'bg-dream-blue/10 border-dream-blue/30 text-dream-blue'
                                    : 'bg-dm-surface-alt border-dm-border2 text-dm-text2 hover:text-dm-text'
                                }`}
                              >
                                {a}
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        <div className="p-4 bg-dm-surface-alt rounded-2xl border border-dm-border space-y-3">
                          <div className="flex items-center gap-2">
                            <ArrowDownToLine size={14} className="text-dream-green" />
                            <span className="text-xs font-bold text-dm-text">Send {depositAsset} to this address</span>
                          </div>

                          <div className="bg-dm-surface rounded-lg border border-dm-border2 p-3">
                            <span className="text-[10px] font-bold text-dm-text3 uppercase tracking-wider block mb-1.5">
                              {currentChain?.name || 'Network'} Address
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-dm-text break-all flex-1">{address}</span>
                              <motion.button
                                whileTap={{ scale: 0.8 }}
                                onClick={handleCopy}
                                className="text-dm-text3 hover:text-dm-text transition-colors shrink-0 p-1"
                              >
                                {copied ? <Check size={14} className="text-dream-green" /> : <Copy size={14} />}
                              </motion.button>
                            </div>
                          </div>

                          <div className="text-[10px] text-dm-text3 font-medium leading-relaxed">
                            Only send <span className="text-dm-text2 font-bold">{depositAsset}</span> on <span className="text-dm-text2 font-bold">{currentChain?.name || 'this network'}</span>. Sending other tokens or using wrong network may result in loss of funds.
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}

                {activeTab === 'withdraw' && (
                  <motion.div
                    key="withdraw"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="p-5 space-y-4"
                  >
                    {!isConnected ? (
                      <div className="flex flex-col items-center justify-center py-8 text-dm-text3">
                        <Wallet size={32} className="mb-3 opacity-50" />
                        <span className="text-sm font-medium mb-3">Connect wallet to withdraw</span>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={handleConnect}
                          className="px-4 py-2 rounded-lg bg-dream-blue text-white text-xs font-bold"
                        >
                          Connect
                        </motion.button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="text-[10px] font-bold text-dm-text3 uppercase tracking-wider mb-2 block">Asset</label>
                          <div className="flex gap-2">
                            {['USDC', 'ETH'].map(a => (
                              <motion.button
                                key={a}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setWithdrawAsset(a)}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors border ${
                                  withdrawAsset === a
                                    ? 'bg-dream-blue/10 border-dream-blue/30 text-dream-blue'
                                    : 'bg-dm-surface-alt border-dm-border2 text-dm-text2 hover:text-dm-text'
                                }`}
                              >
                                {a}
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-dm-text3 uppercase tracking-wider mb-2 block">Amount</label>
                          <div className="relative">
                            <input
                              type="number"
                              value={withdrawAmount}
                              onChange={e => setWithdrawAmount(e.target.value)}
                              placeholder="0.00"
                              className="w-full py-3 pl-4 pr-16 bg-dm-surface-alt border border-dm-border2 rounded-2xl font-bold text-sm text-dm-text focus:border-dream-blue/30 focus:ring-2 focus:ring-dream-blue/20 outline-none transition-all"
                            />
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                              <span className="text-dm-text2 font-bold text-xs">{withdrawAsset}</span>
                            </div>
                          </div>
                          <div className="flex justify-between mt-1.5 px-1">
                            <span className="text-[10px] text-dm-text3 font-medium">Available</span>
                            <span className="text-[10px] text-dm-text2 font-bold">
                              {assets.find(a => a.symbol === withdrawAsset)?.balance.toLocaleString(undefined, { maximumFractionDigits: 6 }) || '0'} {withdrawAsset}
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-dm-text3 uppercase tracking-wider mb-2 block">Withdraw To</label>
                          <input
                            type="text"
                            placeholder="0x..."
                            defaultValue={address}
                            className="w-full py-3 pl-4 pr-4 bg-dm-surface-alt border border-dm-border2 rounded-2xl font-medium text-xs text-dm-text focus:border-dream-blue/30 focus:ring-2 focus:ring-dream-blue/20 outline-none transition-all"
                          />
                        </div>

                        <div className="space-y-1.5 p-3 bg-dm-surface-alt rounded-2xl border border-dm-border">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-dm-text3 font-medium">Network Fee</span>
                            <span className="font-bold text-dm-text2">~$0.50</span>
                          </div>
                          <div className="flex justify-between text-[11px]">
                            <span className="text-dm-text3 font-medium">Estimated Time</span>
                            <span className="font-bold text-dm-text2">~2 min</span>
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full py-3 rounded-2xl bg-dream-red text-white font-bold text-sm flex items-center justify-center gap-2 neon-button-red"
                        >
                          <ArrowUpFromLine size={16} />
                          Withdraw {withdrawAsset}
                        </motion.button>
                      </>
                    )}
                  </motion.div>
                )}

                {activeTab === 'history' && (
                  <motion.div
                    key="history"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="p-5 space-y-2"
                  >
                    {mockHistory.map(record => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between p-3 bg-dm-surface-alt rounded-2xl border border-dm-border hover:border-dm-border2 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            record.type === 'deposit' ? 'bg-dream-green/10' : 'bg-dream-red/10'
                          }`}>
                            {record.type === 'deposit'
                              ? <ArrowDownToLine size={14} className="text-dream-green" />
                              : <ArrowUpFromLine size={14} className="text-dream-red" />
                            }
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-bold text-dm-text capitalize">{record.type}</span>
                              <span className="text-xs font-medium text-dm-text2">{record.asset}</span>
                            </div>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Clock size={10} className="text-dm-text3" />
                              <span className="text-[10px] text-dm-text3 font-medium">{record.time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-bold ${record.type === 'deposit' ? 'text-dream-green' : 'text-dream-red'}`}>
                            {record.type === 'deposit' ? '+' : '-'}{record.amount.toLocaleString()} {record.asset}
                          </div>
                          <span className={`text-[10px] font-bold capitalize ${statusColor(record.status)}`}>
                            {record.status}
                          </span>
                        </div>
                      </div>
                    ))}

                    {mockHistory.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-12 text-dm-text3">
                        <Clock size={32} className="mb-3 opacity-50" />
                        <span className="text-sm font-medium">No transaction history</span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
