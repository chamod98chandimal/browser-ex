/**
 * MetaMask Sidebar Pin Handler
 * Handles the functionality for pinning MetaMask to the browser sidebar
 */

// Storage keys
const STORAGE_KEYS = {
  SIDEBAR_PINNED: 'metamask-sidebar-pinned',
  PIN_REMINDER_SHOWN: 'metamask-pin-reminder-shown',
  SIDEBAR_ACCESS_COUNT: 'metamask-sidebar-access-count'
};

class SidebarPinHandler {
  constructor() {
    this.isPinned = false;
    this.init();
  }

  async init() {
    // Load initial state
    await this.loadPinStatus();
    
    // Set up extension listeners
    this.setupListeners();
    
    // Initialize side panel
    await this.initializeSidePanel();
    
    // Check if we should show pin reminder
    this.checkPinReminder();
  }

  async loadPinStatus() {
    try {
      const result = await chrome.storage.local.get([STORAGE_KEYS.SIDEBAR_PINNED]);
      this.isPinned = result[STORAGE_KEYS.SIDEBAR_PINNED] || false;
    } catch (error) {
      console.warn('Unable to load pin status:', error);
      this.isPinned = false;
    }
  }

  async savePinStatus(pinned) {
    try {
      this.isPinned = pinned;
      await chrome.storage.local.set({
        [STORAGE_KEYS.SIDEBAR_PINNED]: pinned
      });
      
      // Track usage
      if (pinned) {
        this.incrementAccessCount();
      }
    } catch (error) {
      console.warn('Unable to save pin status:', error);
    }
  }

  setupListeners() {
    // Listen for messages from popup/content scripts
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
      return true; // Keep message channel open for async response
    });

    // Listen for extension icon clicks
    chrome.action.onClicked.addListener((tab) => {
      this.handleIconClick(tab);
    });

    // Listen for browser startup
    chrome.runtime.onStartup.addListener(() => {
      this.handleBrowserStartup();
    });
  }

  async handleMessage(message, sender, sendResponse) {
    switch (message.action) {
      case 'GET_PIN_STATUS':
        sendResponse({ isPinned: this.isPinned });
        break;
        
      case 'SET_PIN_STATUS':
        await this.savePinStatus(message.pinned);
        sendResponse({ success: true, isPinned: this.isPinned });
        break;
        
      case 'SHOW_PIN_INSTRUCTIONS':
        await this.showPinInstructions(message.type || 'pin');
        sendResponse({ success: true });
        break;
        
      case 'GET_SIDEBAR_STATS':
        const stats = await this.getSidebarStats();
        sendResponse(stats);
        break;

      case 'GET_FLOATING_ICON_SETTINGS':
        const settings = await this.getFloatingIconSettings();
        sendResponse(settings);
        break;

      case 'SAVE_FLOATING_POSITION':
        await this.saveFloatingPosition(message.position);
        sendResponse({ success: true });
        break;

      case 'GET_FLOATING_POSITION':
        const position = await this.getFloatingPosition();
        sendResponse({ position: position });
        break;

      case 'OPEN_METAMASK':
        await this.openMetaMaskPopup();
        sendResponse({ success: true });
        break;

      case 'OPEN_DAPP_SIDEBAR':
        await this.openDAppInSidebar();
        sendResponse({ success: true });
        break;
        
      default:
        sendResponse({ error: 'Unknown action' });
    }
  }

  handleIconClick(tab) {
    // Increment access count when extension is accessed
    this.incrementAccessCount();
    
    // If not pinned, show reminder after a few uses
    if (!this.isPinned) {
      this.checkPinReminder();
    }
  }

  handleBrowserStartup() {
    // Check pin status on browser startup
    this.loadPinStatus();
  }

  async showPinInstructions(type = 'pin') {
    try {
      // Create notification or send message to active tabs
      const instructions = this.getInstructions(type);
      
      // Try to send to active tab first
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tabs.length > 0) {
        try {
          await chrome.tabs.sendMessage(tabs[0].id, {
            action: 'SHOW_PIN_INSTRUCTIONS',
            type: type,
            instructions: instructions
          });
        } catch (error) {
          // If content script is not available, show notification
          this.showNotification(instructions);
        }
      }
    } catch (error) {
      console.warn('Unable to show pin instructions:', error);
    }
  }

  getInstructions(type) {
    if (type === 'pin') {
      return {
        title: 'Pin MetaMask to Sidebar',
        steps: [
          'Click the browser\'s Extensions menu (puzzle piece icon)',
          'Find MetaMask in the list',
          'Click the pin icon next to MetaMask',
          'Right-click on the MetaMask icon and select "Show in sidebar"'
        ]
      };
    } else {
      return {
        title: 'Unpin MetaMask from Sidebar',
        steps: [
          'Right-click on the MetaMask icon in the sidebar',
          'Select "Hide from sidebar" or "Remove from sidebar"'
        ]
      };
    }
  }

  async showNotification(instructions) {
    try {
      await chrome.notifications.create({
        type: 'basic',
        iconUrl: 'images/icon-48.png',
        title: instructions.title,
        message: instructions.steps.join('\n\n')
      });
    } catch (error) {
      console.warn('Unable to show notification:', error);
    }
  }

  async incrementAccessCount() {
    try {
      const result = await chrome.storage.local.get([STORAGE_KEYS.SIDEBAR_ACCESS_COUNT]);
      const count = (result[STORAGE_KEYS.SIDEBAR_ACCESS_COUNT] || 0) + 1;
      
      await chrome.storage.local.set({
        [STORAGE_KEYS.SIDEBAR_ACCESS_COUNT]: count
      });
    } catch (error) {
      console.warn('Unable to increment access count:', error);
    }
  }

  async checkPinReminder() {
    try {
      if (this.isPinned) return;
      
      const results = await chrome.storage.local.get([
        STORAGE_KEYS.PIN_REMINDER_SHOWN,
        STORAGE_KEYS.SIDEBAR_ACCESS_COUNT
      ]);
      
      const reminderShown = results[STORAGE_KEYS.PIN_REMINDER_SHOWN] || false;
      const accessCount = results[STORAGE_KEYS.SIDEBAR_ACCESS_COUNT] || 0;
      
      // Show reminder after 5 uses if not already shown
      if (!reminderShown && accessCount >= 5) {
        await this.showPinReminder();
        await chrome.storage.local.set({
          [STORAGE_KEYS.PIN_REMINDER_SHOWN]: true
        });
      }
    } catch (error) {
      console.warn('Unable to check pin reminder:', error);
    }
  }

  async showPinReminder() {
    try {
      await chrome.notifications.create({
        type: 'basic',
        iconUrl: 'images/icon-48.png',
        title: 'Pin MetaMask for Easy Access',
        message: 'Pin MetaMask to your sidebar for quick access while browsing. Click to learn how!'
      });
    } catch (error) {
      console.warn('Unable to show pin reminder:', error);
    }
  }

  async getSidebarStats() {
    try {
      const results = await chrome.storage.local.get([
        STORAGE_KEYS.SIDEBAR_PINNED,
        STORAGE_KEYS.SIDEBAR_ACCESS_COUNT,
        STORAGE_KEYS.PIN_REMINDER_SHOWN
      ]);
      
      return {
        isPinned: results[STORAGE_KEYS.SIDEBAR_PINNED] || false,
        accessCount: results[STORAGE_KEYS.SIDEBAR_ACCESS_COUNT] || 0,
        reminderShown: results[STORAGE_KEYS.PIN_REMINDER_SHOWN] || false
      };
    } catch (error) {
      console.warn('Unable to get sidebar stats:', error);
      return {
        isPinned: false,
        accessCount: 0,
        reminderShown: false
      };
    }
  }

  // Utility method to detect browser type
  getBrowserType() {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
      return 'chrome';
    } else if (userAgent.includes('Edg')) {
      return 'edge';
    } else if (userAgent.includes('Firefox')) {
      return 'firefox';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      return 'safari';
    }
    return 'unknown';
  }

  // Check if sidebar is supported in current browser
  isSidebarSupported() {
    const browserType = this.getBrowserType();
    // Sidebar is primarily supported in Chrome and Edge
    return ['chrome', 'edge'].includes(browserType);
  }

  // Get floating icon settings
  async getFloatingIconSettings() {
    try {
      const results = await chrome.storage.local.get(['showFloatingIcon']);
      return {
        showFloatingIcon: results.showFloatingIcon !== false // Default to true
      };
    } catch (error) {
      console.warn('Unable to get floating icon settings:', error);
      return { showFloatingIcon: true };
    }
  }

  // Save floating icon position
  async saveFloatingPosition(position) {
    try {
      await chrome.storage.local.set({
        'floating-icon-position': position
      });
    } catch (error) {
      console.warn('Unable to save floating position:', error);
    }
  }

  // Get floating icon position
  async getFloatingPosition() {
    try {
      const results = await chrome.storage.local.get(['floating-icon-position']);
      return results['floating-icon-position'] || null;
    } catch (error) {
      console.warn('Unable to get floating position:', error);
      return null;
    }
  }

  // Open MetaMask popup
  async openMetaMaskPopup() {
    try {
      // Try to open the popup
      await chrome.action.openPopup();
    } catch (error) {
      console.warn('Unable to open popup:', error);
      // Fallback: try to open popup in new window
      try {
        await chrome.windows.create({
          url: chrome.runtime.getURL('popup.html'),
          type: 'popup',
          width: 357,
          height: 600
        });
      } catch (fallbackError) {
        console.warn('Unable to open popup window:', fallbackError);
      }
    }
  }

  // Open DApp in browser sidebar
  async openDAppInSidebar() {
    try {
      console.log('Attempting to open DApp in sidebar...');
      
      // Method 1: Try actual browser sidePanel API if available
      if (chrome.sidePanel && chrome.sidePanel.open) {
        try {
          await chrome.sidePanel.setOptions({
            path: 'sidebar-dapp.html',
            enabled: true
          });
          
          await chrome.sidePanel.open({});
          console.log('DApp opened in browser sidebar successfully');
          return;
        } catch (sidePanelError) {
          console.log('SidePanel API failed, trying alternative method:', sidePanelError.message);
        }
      }
      
      // Method 2: Inject content script to modify current page
      const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (activeTab) {
        await chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          func: this.createSidebarOverlay,
          args: ['https://pkexv01.netlify.app/vault/view']
        });
        console.log('DApp sidebar overlay created successfully');
        return;
      }
      
      throw new Error('No active tab found');
      
    } catch (error) {
      console.error('Unable to open DApp in sidebar:', error);
      console.log('Falling back to new tab...');
      
      // Fallback: open in new tab
      try {
        const dappUrl = 'https://pkexv01.netlify.app/vault/view';
        await chrome.tabs.create({ url: dappUrl });
        console.log('Opened DApp in new tab as fallback');
      } catch (fallbackError) {
        console.error('Unable to open DApp in new tab:', fallbackError);
      }
    }
  }

  // Function to inject sidebar overlay into current page
  createSidebarOverlay(dappUrl) {
    // Remove existing sidebar if any
    const existingSidebar = document.getElementById('metamask-dapp-sidebar');
    if (existingSidebar) {
      existingSidebar.remove();
    }

    // Create sidebar container
    const sidebar = document.createElement('div');
    sidebar.id = 'metamask-dapp-sidebar';
    sidebar.style.cssText = `
      position: fixed;
      top: 0;
      right: 0;
      width: 400px;
      height: 100vh;
      background: white;
      border-left: 2px solid #F6851B;
      box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    // Create header
    const header = document.createElement('div');
    header.style.cssText = `
      background: linear-gradient(135deg, #F6851B 0%, #E2761B 100%);
      color: white;
      padding: 12px 16px;
      font-size: 14px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: space-between;
    `;
    header.innerHTML = `
      <span>PasSkeeper</span>
      <button id="close-sidebar" style="
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">×</button>
    `;

    // Create iframe for DApp
    const iframe = document.createElement('iframe');
    iframe.src = dappUrl;
    iframe.style.cssText = `
      width: 100%;
      height: calc(100vh - 44px);
      border: none;
      background: white;
    `;
    iframe.sandbox = 'allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation';

    // Assemble sidebar
    sidebar.appendChild(header);
    sidebar.appendChild(iframe);

    // Add close functionality
    header.querySelector('#close-sidebar').addEventListener('click', () => {
      sidebar.remove();
    });

    // Add to page
    document.body.appendChild(sidebar);

    // Adjust page content to make room for sidebar
    document.body.style.marginRight = '400px';
    document.body.style.transition = 'margin-right 0.3s ease';

    // Add click outside to close
    const clickOutsideHandler = (e) => {
      if (!sidebar.contains(e.target)) {
        sidebar.remove();
        document.body.style.marginRight = '0';
        document.removeEventListener('click', clickOutsideHandler);
      }
    };
    
    setTimeout(() => {
      document.addEventListener('click', clickOutsideHandler);
    }, 100);
  }

  // Initialize side panel
  async initializeSidePanel() {
    try {
      // Set default side panel options
      await chrome.sidePanel.setPanelBehavior({ 
        openPanelOnActionClick: false 
      });
      
      console.log('Side panel initialized successfully');
    } catch (error) {
      console.warn('Unable to initialize side panel:', error);
    }
  }

  // Get current window ID
  async getCurrentWindowId() {
    try {
      const windows = await chrome.windows.getCurrent();
      return windows.id;
    } catch (error) {
      console.warn('Unable to get current window ID:', error);
      return undefined;
    }
  }
}

// Initialize the sidebar pin handler
const sidebarPinHandler = new SidebarPinHandler();

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SidebarPinHandler;
} 