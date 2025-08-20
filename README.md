# 🚀 KaiaFi - DeFi Lending Protocol on Kaia Network

**Korea Stablecoin Hackathon 2025 Project**

A decentralized lending and borrowing protocol built on the Kaia Network, featuring dynamic interest rates, liquidation mechanisms, and support for multiple assets including USDT, KAI, and KRW stablecoins.

## 🏆 Hackathon Track

**Kaia-Native USDT DeFi Hackathon** - Building innovative DeFi protocols using Kaia Network's native USDT capabilities.

## ✨ Features

- **Multi-Asset Lending**: Support for USDT, KAI, and KRW stablecoins
- **Dynamic Interest Rates**: Kink-based interest rate model with utilization-based pricing
- **Risk Management**: Automated liquidation system with health factor monitoring
- **Modern UI**: Beautiful React frontend with Tailwind CSS
- **Kaia Network Integration**: Built specifically for Kaia Network ecosystem
- **LINE MiniDapp Ready**: Designed for potential LINE Messenger integration

## 🏗️ Architecture

### Smart Contracts
- **LendingPool.sol**: Main lending protocol with supply/borrow functionality
- **InterestRateModel.sol**: Dynamic interest rate calculation
- **Liquidation.sol**: Risk management and liquidation execution
- **Mock Tokens**: USDT, KAI, and KRW for testing

### Frontend
- **React + TypeScript**: Modern web application
- **Tailwind CSS**: Beautiful, responsive UI
- **Web3 Integration**: Wallet connection and blockchain interaction
- **Context API**: State management for lending operations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MetaMask or Web3 wallet
- Kaia Network testnet access

### Installation

1. **Clone and install dependencies**
```bash
cd frontend
npm install
```

2. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your private key and RPC URLs
```

3. **Compile smart contracts**
```bash
npm run compile
```

4. **Deploy to Kaia testnet**
```bash
npm run deploy:testnet
```

5. **Start frontend**
```bash
npm run dev
```

## 🔧 Configuration

### Environment Variables
```env
# Kaia Network Configuration
KAIA_TESTNET_RPC=https://testnet-rpc.kaia.network
KAIA_MAINNET_RPC=https://mainnet-rpc.kaia.network
KAIA_EXPLORER_API_KEY=your_api_key_here

# Deployment
PRIVATE_KEY=your_wallet_private_key
```

### Network Configuration
- **Testnet**: Chain ID 1337, RPC: `https://testnet-rpc.kaia.network`
- **Mainnet**: Chain ID 1, RPC: `https://mainnet-rpc.kaia.network`

## 📊 Smart Contract Details

### LendingPool
- **Supply**: Deposit assets to earn interest
- **Withdraw**: Remove supplied assets (if healthy)
- **Borrow**: Borrow against collateral
- **Repay**: Pay back borrowed amounts
- **Health Factor**: Risk monitoring system

### Interest Rate Model
- **Base Rate**: 2% minimum rate
- **Multiplier**: 20% utilization multiplier
- **Jump Multiplier**: 300% for high utilization
- **Kink Point**: 80% utilization threshold

### Liquidation
- **Health Threshold**: 1.0 health factor
- **Close Factor**: 50% maximum liquidation
- **Incentive**: 5% liquidator reward
- **Automated**: Triggers when health factor < 1.0

## 🎯 Usage

### 1. Connect Wallet
- Install MetaMask or compatible wallet
- Connect to Kaia Network testnet
- Ensure you have testnet tokens

### 2. Supply Assets
- Navigate to Lending page
- Select asset to supply
- Enter amount and confirm transaction
- Start earning interest immediately

### 3. Borrow Assets
- Navigate to Borrowing page
- Select asset to borrow
- Choose collateral asset
- Confirm borrowing transaction

### 4. Monitor Portfolio
- View total supplied/borrowed amounts
- Check health factor status
- Monitor interest earned
- Track transaction history

## 🔒 Security Features

- **Reentrancy Protection**: All external calls protected
- **Access Control**: Owner-only admin functions
- **Input Validation**: Comprehensive parameter checks
- **Emergency Pause**: Ability to pause operations
- **Liquidation Protection**: Automated risk management

## 🌐 Kaia Network Integration

### Why Kaia Network?
- **High Performance**: Fast block times and low fees
- **Interoperability**: Cross-chain asset support
- **Korean Focus**: Strong presence in Korean market
- **Stablecoin Ecosystem**: Native USDT support
- **Developer Friendly**: Comprehensive tooling and documentation

### LINE MiniDapp Potential
- **Messenger Integration**: Built-in wallet support
- **User Experience**: Seamless DeFi access
- **Korean Market**: Strong LINE adoption in Korea
- **Bonus Points**: Hackathon judges specifically mentioned this

## 🧪 Testing

### Local Testing
```bash
npm run node          # Start local Hardhat node
npm run deploy:local  # Deploy to local network
npm run test          # Run test suite
```

### Testnet Testing
```bash
npm run deploy:testnet  # Deploy to Kaia testnet
# Test with real transactions
```

## 📈 Performance Metrics

- **Gas Optimization**: Optimized Solidity code
- **Batch Operations**: Efficient multi-asset operations
- **Interest Accrual**: Real-time interest calculation
- **Liquidation Speed**: Fast unhealthy position resolution

## 🚧 Development Roadmap

### Phase 1: Core Protocol ✅
- [x] Smart contract development
- [x] Basic frontend UI
- [x] Lending/borrowing functionality
- [x] Interest rate model

### Phase 2: Advanced Features 🚧
- [ ] Liquidation bot integration
- [ ] Advanced risk management
- [ ] Multi-collateral positions
- [ ] Flash loan support

### Phase 3: Ecosystem Integration 📋
- [ ] LINE MiniDapp deployment
- [ ] Cross-chain bridge support
- [ ] Governance token (KAI)
- [ ] DAO governance

## 🤝 Contributing

This is a hackathon project, but contributions are welcome:

1. Fork the repository
2. Create feature branch
3. Make changes
4. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

## 🏆 Hackathon Submission

### Project Details
- **Name**: KaiaFi - DeFi Lending Protocol
- **Track**: Kaia-Native USDT DeFi Hackathon
- **Team**: Korea Stablecoin Hackathon 2025
- **Innovation**: Dynamic interest rates + Korean market focus

### Technical Highlights
- **Smart Contracts**: Production-ready Solidity code
- **Frontend**: Modern React + TypeScript application
- **Integration**: Kaia Network native support
- **Potential**: LINE MiniDapp integration ready

### Business Value
- **Korean Market**: Addresses local DeFi needs
- **Stablecoin Focus**: Leverages KRW stablecoin ecosystem
- **User Experience**: Intuitive interface for DeFi newcomers
- **Scalability**: Designed for mass adoption

## 📞 Contact

- **Project**: KaiaFi Lending Protocol
- **Hackathon**: Korea Stablecoin Hackathon 2025
- **Network**: Kaia Network
- **Track**: DeFi Protocol Development

---

**Built with ❤️ for the Korea Stablecoin Hackathon 2025**
