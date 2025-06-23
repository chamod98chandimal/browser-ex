/**
 * Sepolia-Only Network Filter for MetaMask
 * This script modifies MetaMask to display only the Sepolia test network
 * 
 * Installation:
 * 1. Add this file to the scripts/ directory of your MetaMask extension
 * 2. Update manifest.json to include this script
 * 3. Reload the extension
 */

(function() {
  'use strict';

  const SEPOLIA_CHAIN_ID = '0xaa36a7';
  const SEPOLIA_DECIMAL_ID = 11155111;
  
  console.log('Sepolia-only filter loading...');

  // Function to hide non-Sepolia networks in the UI
  function hideNonSepoliaNetworks() {
    // Hide network items in the network menu
    const networkItems = document.querySelectorAll('.multichain-network-list-item, .networks-tab__networks-list-item, .network-dropdown-item');
    
    networkItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      const isSepoliaNetwork = text.includes('sepolia') || 
                              text.includes('11155111') || 
                              item.dataset.chainId === SEPOLIA_CHAIN_ID;
      
      if (!isSepoliaNetwork) {
        item.style.display = 'none';
      }
    });

    // Hide network options in settings
    const settingsNetworkItems = document.querySelectorAll('.networks-tab__content .networks-tab__networks-list-name');
    settingsNetworkItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (!text.includes('sepolia')) {
        const container = item.closest('.networks-tab__networks-list-item');
        if (container) {
          container.style.display = 'none';
        }
      }
    });

    // Hide popular networks that aren't Sepolia
    const popularNetworkItems = document.querySelectorAll('[data-testid*="popular-network"]');
    popularNetworkItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (!text.includes('sepolia')) {
        item.style.display = 'none';
      }
    });
  }

  // Function to ensure test networks are enabled
  function enableTestNetworks() {
    // Find and enable the "Show test networks" toggle
    const testNetworkToggle = document.querySelector('[data-testid="advanced-setting-show-testnet-conversion"] input[type="checkbox"]');
    if (testNetworkToggle && !testNetworkToggle.checked) {
      testNetworkToggle.click();
      console.log('Enabled test networks to show Sepolia');
    }
  }

  // Override network filtering at the data level
  function overrideNetworkData() {
    // Intercept fetch requests for network data
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      return originalFetch.apply(this, args).then(response => {
        if (response.url && response.url.includes('networks')) {
          return response.json().then(data => {
            if (Array.isArray(data)) {
              data = data.filter(network => 
                network.chainId === SEPOLIA_CHAIN_ID || 
                network.chainId === SEPOLIA_DECIMAL_ID ||
                (network.name && network.name.toLowerCase().includes('sepolia'))
              );
            }
            return new Response(JSON.stringify(data), {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers
            });
          });
        }
        return response;
      });
    };
  }

  // Function to modify network list rendering
  function modifyNetworkRendering() {
    // Hook into React rendering (if applicable)
    if (window.React && window.ReactDOM) {
      const originalRender = window.ReactDOM.render;
      window.ReactDOM.render = function(element, container, callback) {
        // Filter network props if present
        if (element && element.props && element.props.networks) {
          element.props.networks = element.props.networks.filter(network =>
            network.chainId === SEPOLIA_CHAIN_ID || 
            network.chainId === SEPOLIA_DECIMAL_ID
          );
        }
        return originalRender.call(this, element, container, callback);
      };
    }
  }

  // Main execution function
  function applySepolia() {
    enableTestNetworks();
    hideNonSepoliaNetworks();
    overrideNetworkData();
    modifyNetworkRendering();
  }

  // Apply filtering immediately
  applySepolia();

  // Apply filtering when DOM changes (for dynamic content)
  const observer = new MutationObserver((mutations) => {
    let shouldReapply = false;
    
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const hasNetworkContent = node.textContent && 
            (node.textContent.includes('Network') || 
             node.textContent.includes('Mainnet') ||
             node.textContent.includes('Testnet'));
          
          if (hasNetworkContent || 
              node.classList.contains('network') ||
              node.querySelector && node.querySelector('[data-testid*="network"]')) {
            shouldReapply = true;
          }
        }
      });
    });

    if (shouldReapply) {
      setTimeout(applySepolia, 100);
    }
  });

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'data-testid']
  });

  // Reapply filters periodically (backup mechanism)
  setInterval(applySepolia, 5000);

  // Handle route changes in single-page applications
  let currentPath = window.location.pathname;
  setInterval(() => {
    if (window.location.pathname !== currentPath) {
      currentPath = window.location.pathname;
      setTimeout(applySepolia, 500);
    }
  }, 1000);

  console.log('Sepolia-only filter active');

})(); 