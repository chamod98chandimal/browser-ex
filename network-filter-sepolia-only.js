/**
 * MetaMask Network Filter - Sepolia Only
 * This file modifies MetaMask to show only the Sepolia testnet
 */

// Sepolia network configuration
const SEPOLIA_ONLY_CONFIG = {
  chainId: '0xaa36a7', // 11155111 in decimal
  ticker: 'SepoliaETH',
  blockExplorerUrl: 'https://sepolia.etherscan.io',
  rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY'
};

// Function to filter networks to show only Sepolia
function filterNetworksToSepoliaOnly() {
  // Override the BUILT_IN_NETWORKS to include only Sepolia
  if (window.metamask && window.metamask.BUILT_IN_NETWORKS) {
    window.metamask.BUILT_IN_NETWORKS = {
      sepolia: SEPOLIA_ONLY_CONFIG
    };
  }

  // Override getAllNetworks selector to return only Sepolia
  const originalGetAllNetworks = window.getState?.metamask?.getAllNetworks;
  if (originalGetAllNetworks) {
    window.getState.metamask.getAllNetworks = function() {
      const allNetworks = originalGetAllNetworks.call(this);
      return allNetworks.filter(network => 
        network.chainId === '0xaa36a7' || network.chainId === 11155111
      );
    };
  }

  // Force show test networks to be true (since Sepolia is a test network)
  if (window.metamask && window.metamask.setShowTestNetworks) {
    window.metamask.setShowTestNetworks(true);
  }
}

// Apply the filter when the page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', filterNetworksToSepoliaOnly);
} else {
  filterNetworksToSepoliaOnly();
}

// Also apply when MetaMask is fully loaded
setTimeout(filterNetworksToSepoliaOnly, 1000);

console.log('MetaMask configured to show only Sepolia network'); 