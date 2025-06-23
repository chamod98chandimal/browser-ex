# PassKeeper Wallet Extension

A modified MetaMask wallet extension specifically designed for PassKeeper integration. This browser extension provides secure cryptocurrency wallet functionality with enhanced features for the PassKeeper ecosystem.

## 🚀 Features

- **Enhanced MetaMask Functionality**: Built on the trusted MetaMask foundation with additional PassKeeper-specific features
- **Secure Wallet Management**: Store, send, and receive cryptocurrencies securely
- **Multi-Network Support**: Connect to various blockchain networks including Ethereum, Polygon, BSC, and more
- **DApp Integration**: Seamlessly interact with decentralized applications
- **PassKeeper Integration**: Special features designed for PassKeeper ecosystem compatibility
- **Multi-Language Support**: Available in 50+ languages

## 📥 Installation

### Method 1: Install as Unpacked Extension (Recommended for Development)

1. **Download the Extension**
   - Clone or download this repository to your local machine
   - Extract the files if downloaded as ZIP

2. **Open Browser Extension Settings**
   - **Chrome/Edge**: Navigate to `chrome://extensions/` or `edge://extensions/`
   - **Firefox**: Navigate to `about:debugging#/runtime/this-firefox`

3. **Enable Developer Mode**
   - Toggle "Developer mode" ON in the top-right corner (Chrome/Edge)
   - Click "This Firefox" then "Load Temporary Add-on" (Firefox)

4. **Load the Extension**
   - Click "Load unpacked" button (Chrome/Edge)
   - Select the folder containing the extension files
   - For Firefox: Select the `manifest.json` file directly

5. **Pin the Extension**
   - Click the extensions icon in your browser toolbar
   - Pin the PassKeeper Wallet extension for easy access

### Method 2: Manual Installation from Release

1. Download the latest release from the releases section
2. Follow the same steps as Method 1 using the downloaded files

## 🔧 Setup and Configuration

### First Time Setup

1. **Launch the Extension**
   - Click on the PassKeeper Wallet icon in your browser toolbar
   - The setup wizard will guide you through the initial configuration

2. **Create or Import Wallet**
   - **New Wallet**: Create a new wallet and securely store your seed phrase
   - **Import Wallet**: Use your existing MetaMask seed phrase or private key

3. **Set Password**
   - Create a strong password to protect your wallet
   - This password will be required each time you access the extension

4. **Backup Your Seed Phrase**
   - ⚠️ **CRITICAL**: Write down your 12-word seed phrase and store it securely
   - This is the only way to recover your wallet if you lose access

## 💡 Usage

### Basic Operations

1. **View Balance**: Your token balances are displayed on the main dashboard
2. **Send Tokens**: Click "Send" → Enter recipient address → Specify amount → Confirm
3. **Receive Tokens**: Click "Receive" to view your wallet address and QR code
4. **Connect to DApps**: Visit any supported DApp and connect your wallet when prompted

### PassKeeper Specific Features

- Access PassKeeper-specific functionality through the main interface
- Enhanced security features for PassKeeper ecosystem interactions
- Specialized transaction handling for PassKeeper protocols

### Network Management

1. **Switch Networks**: Click the network dropdown to change blockchain networks
2. **Add Custom Networks**: Go to Settings → Networks → Add Network
3. **Import Tokens**: Add custom tokens using their contract addresses

## 🔒 Security Best Practices

- **Never share your seed phrase** with anyone
- **Use strong passwords** and enable 2FA where possible
- **Verify transaction details** before confirming
- **Keep the extension updated** to the latest version
- **Only download from trusted sources**

## 🛠️ Development

### Building from Source

```bash
# Clone the repository
git clone [repository-url]
cd browser-ex

# Install dependencies (if applicable)
npm install

# Build the extension (if build process exists)
npm run build
```

### File Structure

```
browser-ex/
├── manifest.json          # Extension manifest
├── popup.html            # Main popup interface
├── background.html       # Background scripts
├── scripts/              # Core JavaScript files
├── images/               # Icons and graphics
├── _locales/            # Internationalization files
└── fonts/               # Custom fonts
```

## 🌐 Supported Networks

- Ethereum Mainnet
- Polygon
- Binance Smart Chain
- Arbitrum
- Optimism
- Avalanche
- And many more...

## 📋 Requirements

- **Browser Compatibility**:
  - Chrome 88+
  - Firefox 78+
  - Edge 88+
  - Safari 14+ (with limitations)

## ⚠️ Disclaimer

This is a modified version of MetaMask designed for PassKeeper integration. Use at your own risk and always:

- Test with small amounts first
- Verify all transactions before confirming
- Keep backups of your seed phrase
- Only use on trusted networks

## 🆘 Support

For issues and support:
1. Check the troubleshooting section below
2. Review existing GitHub issues
3. Create a new issue with detailed information

### Troubleshooting

**Extension won't load**: Ensure developer mode is enabled and try reloading the extension

**Can't connect to DApps**: Check that the extension is unlocked and the correct network is selected

**Transaction failures**: Verify you have sufficient gas fees and network connectivity

## 📄 License

This project is based on MetaMask and follows the same licensing terms. Please refer to the original MetaMask license for details.

---

**⚡ Get Started**: Install the extension and start managing your crypto assets securely with PassKeeper integration!