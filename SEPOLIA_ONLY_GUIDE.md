# MetaMask Chrome Extension - Show Only Sepolia Network

This guide explains how to modify the MetaMask Chrome extension (version 12.4.0) to display only the Sepolia test network, hiding all other networks.

## Overview

MetaMask displays networks based on several configuration files and filtering logic. To show only Sepolia, we need to modify the network filtering mechanisms in the extension.

## Key Information

- **Sepolia Chain ID**: `0xaa36a7` (hex) or `11155111` (decimal)
- **Sepolia Ticker**: `SepoliaETH`
- **Extension Location**: `metamask-chrome-12.4.0/`

## Method 1: Modify Built-in Networks (Recommended)

### Step 1: Backup Original Files

Before making changes, backup these files:
- `common-8.js`
- `common-0.js` 
- `background-0.js`
- `scripts/contentscript.js`

### Step 2: Modify BUILT_IN_NETWORKS Configuration

Edit the following files to replace the `BUILT_IN_NETWORKS` object:

#### File: `common-8.js`
Find this line (around character position 326717):
```javascript
r.BUILT_IN_NETWORKS={[o.SEPOLIA]:{chainId:s.SEPOLIA,ticker:ot[o.SEPOLIA],blockExplorerUrl:`https://${o.SEPOLIA}.etherscan.io`},[o.LINEA_SEPOLIA]:{chainId:s.LINEA_SEPOLIA,ticker:ot[o.LINEA_SEPOLIA],block...
```

Replace with:
```javascript
r.BUILT_IN_NETWORKS={[o.SEPOLIA]:{chainId:s.SEPOLIA,ticker:ot[o.SEPOLIA],blockExplorerUrl:`https://${o.SEPOLIA}.etherscan.io`}}
```

#### File: `common-0.js`
Find and modify similar pattern:
```javascript
r.BUILT_IN_NETWORKS={[s.NetworkType.sepolia]:{chainId:s.ChainId.sepolia,ticker:s.NetworksTicker.sepolia,rpcPrefs:{blockExplorerUrl:`https://${s.NetworkType.sepolia}.etherscan.io`}}}
```

#### File: `background-0.js`
Update the network constants to include only Sepolia.

#### File: `scripts/contentscript.js`
Modify the BUILT_IN_NETWORKS export to include only Sepolia.

### Step 3: Modify Network List Selectors

#### File: `common-11.js`
Find the `getAllNetworks` and `getOrderedNetworksList` selectors and add filtering logic:

```javascript
// Add this filter to only show Sepolia
const SEPOLIA_CHAIN_ID = '0xaa36a7';

// Modify getAllNetworks selector
const filteredGetAllNetworks = (state) => {
  const allNetworks = originalGetAllNetworks(state);
  return allNetworks.filter(network => 
    network.chainId === SEPOLIA_CHAIN_ID || 
    network.chainId === 11155111 ||
    network.type === 'sepolia'
  );
};
```

## Method 2: Runtime Network Filtering

Add the following JavaScript to override network filtering at runtime:

### Step 1: Create Content Script Override

Create a new file `sepolia-filter.js` in the `scripts/` directory:

```javascript
// Override network filtering to show only Sepolia
(function() {
  const SEPOLIA_CHAIN_ID = '0xaa36a7';
  
  // Hook into network list rendering
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function(type, listener, options) {
    if (type === 'load' || type === 'DOMContentLoaded') {
      const wrappedListener = function(event) {
        // Filter networks after DOM loads
        setTimeout(() => {
          filterNetworksToSepoliaOnly();
        }, 100);
        return listener.call(this, event);
      };
      return originalAddEventListener.call(this, type, wrappedListener, options);
    }
    return originalAddEventListener.call(this, type, listener, options);
  };

  function filterNetworksToSepoliaOnly() {
    // Force enable test networks
    const showTestNetworksToggle = document.querySelector('[data-testid="advanced-setting-show-testnet-conversion"]');
    if (showTestNetworksToggle) {
      const toggle = showTestNetworksToggle.querySelector('input[type="checkbox"]');
      if (toggle && !toggle.checked) {
        toggle.click();
      }
    }

    // Hide network items that are not Sepolia
    const networkItems = document.querySelectorAll('[data-testid*="network-"]');
    networkItems.forEach(item => {
      const itemText = item.textContent.toLowerCase();
      if (!itemText.includes('sepolia')) {
        item.style.display = 'none';
      }
    });
  }
})();
```

### Step 2: Update Manifest

Add the new script to `manifest.json` content scripts:

```json
{
  "matches": ["file://*/*", "http://*/*", "https://*/*"],
  "js": [
    "scripts/disable-console.js",
    "scripts/lockdown-install.js", 
    "scripts/lockdown-run.js",
    "scripts/lockdown-more.js",
    "scripts/sepolia-filter.js",
    "scripts/contentscript.js"
  ],
  "run_at": "document_start",
  "all_frames": true
}
```

## Method 3: UI Component Modification

### Modify Network Selection Components

Edit the network list rendering in the UI components to filter networks:

#### File: `ui-5.js` (NetworkListMenu)
Find the network rendering logic and add Sepolia filtering:

```javascript
// In the network list rendering function
const filteredNetworks = networks.filter(network => 
  network.chainId === '0xaa36a7' || 
  network.type === 'sepolia' ||
  network.nickname?.toLowerCase().includes('sepolia')
);
```

## Verification Steps

After making the modifications:

1. **Check Network Dropdown**: The network selector should only show Sepolia
2. **Verify Settings**: In Settings > Networks, only Sepolia should be visible
3. **Test Network Switching**: Ensure you can only connect to Sepolia
4. **Check Console**: Look for any JavaScript errors

## Important Notes

⚠️ **Backup Warning**: Always backup the original extension files before modification

⚠️ **Update Compatibility**: These changes may need to be reapplied when updating MetaMask

⚠️ **Development Only**: This modification is intended for development/testing purposes

## Troubleshooting

### Networks Still Showing
- Clear browser cache and restart extension
- Check if all BUILT_IN_NETWORKS references were updated
- Verify the chain ID format (hex vs decimal)

### Extension Not Loading
- Restore from backup
- Check browser console for JavaScript errors
- Ensure all file modifications are syntactically correct

### Test Networks Not Visible
- Enable "Show test networks" in Settings > Advanced
- Verify Sepolia is configured as a test network

## Alternative: Browser Extension Override

For a non-invasive approach, create a separate browser extension that overrides MetaMask's network display:

```javascript
// In a custom extension's content script
const observer = new MutationObserver(() => {
  const networkElements = document.querySelectorAll('[data-network-name]');
  networkElements.forEach(el => {
    if (!el.dataset.networkName.includes('sepolia')) {
      el.style.display = 'none';
    }
  });
});

observer.observe(document.body, { childList: true, subtree: true });
```

This approach requires creating a separate Chrome extension that modifies the MetaMask UI without touching the original files. 