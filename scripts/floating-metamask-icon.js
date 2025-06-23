/**
 * Floating MetaMask Icon Content Script
 * Injects a floating action button on all websites for quick access to MetaMask
 */

class FloatingMetaMaskIcon {
  constructor() {
    this.isVisible = false;
    this.init();
  }

  async init() {
    // Check if we should show the floating icon
    await this.loadSettings();
    
    // Create and inject the floating icon
    this.createFloatingIcon();
    
    // Set up event listeners
    this.setupEventListeners();
  }

  async loadSettings() {
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'GET_FLOATING_ICON_SETTINGS'
      });
      
      this.isVisible = response?.showFloatingIcon !== false; // Default to true
    } catch (error) {
      console.log('MetaMask floating icon: Using default settings');
      this.isVisible = true;
    }
  }

  createFloatingIcon() {
    if (!this.isVisible || document.getElementById('metamask-floating-icon')) {
      return;
    }

    // Create floating icon container
    const floatingContainer = document.createElement('div');
    floatingContainer.id = 'metamask-floating-icon';
    floatingContainer.className = 'metamask-floating-container';
    
    floatingContainer.innerHTML = `
      <div class="metamask-floating-icon-wrapper">
        <!-- Main MetaMask Icon -->
        <button class="metamask-floating-btn" id="metamask-main-btn" title="Open MetaMask">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.25 12.15L19.8 6.85C19.45 5.65 18.35 4.85 17.1 4.85H6.9C5.65 4.85 4.55 5.65 4.2 6.85L2.75 12.15C2.25 13.95 3.6 15.75 5.45 15.75H7V17.25C7 18.35 7.9 19.25 9 19.25H15C16.1 19.25 17 18.35 17 17.25V15.75H18.55C20.4 15.75 21.75 13.95 21.25 12.15Z" fill="#F6851B"/>
            <path d="M15.5 9.5C15.5 10.33 14.83 11 14 11C13.17 11 12.5 10.33 12.5 9.5C12.5 8.67 13.17 8 14 8C14.83 8 15.5 8.67 15.5 9.5Z" fill="white"/>
            <path d="M11.5 9.5C11.5 10.33 10.83 11 10 11C9.17 11 8.5 10.33 8.5 9.5C8.5 8.67 9.17 8 10 8C10.83 8 11.5 8.67 11.5 9.5Z" fill="white"/>
          </svg>
          <span class="metamask-floating-pulse"></span>
        </button>

        <!-- Expanded Menu -->
        <div class="metamask-floating-menu" id="metamask-floating-menu" style="display: none;">
          <div class="metamask-floating-menu-content">
            <!-- View Tab -->
            <button class="metamask-menu-item" id="open-dapp-tab-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M1 3H15V4H1V3ZM1 7H15V8H1V7ZM1 11H15V12H1V11ZM3 1H13C13.55 1 14 1.45 14 2V14C14 14.55 13.55 15 13 15H3C2.45 15 2 14.55 2 14V2C2 1.45 2.45 1 3 1Z" fill="currentColor"/>
              </svg>
              <span>View</span>
            </button>
          </div>
        </div>
      </div>
    `;

    // Add styles
    this.addFloatingIconStyles();

    // Inject into page
    document.body.appendChild(floatingContainer);

    // Make it draggable
    this.makeDraggable(floatingContainer);
  }

  addFloatingIconStyles() {
    if (document.getElementById('metamask-floating-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'metamask-floating-styles';
    style.textContent = `
      /* Floating MetaMask Icon Styles */
      .metamask-floating-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .metamask-floating-icon-wrapper {
        position: relative;
      }

      .metamask-floating-btn {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: linear-gradient(135deg, #F6851B 0%, #E2761B 100%);
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 20px rgba(246, 133, 27, 0.4);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
      }

      .metamask-floating-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 25px rgba(246, 133, 27, 0.6);
      }

      .metamask-floating-btn:active {
        transform: scale(0.95);
      }

      .metamask-floating-pulse {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: rgba(246, 133, 27, 0.3);
        animation: metamask-pulse 2s infinite;
        pointer-events: none;
      }

      @keyframes metamask-pulse {
        0% {
          transform: scale(1);
          opacity: 1;
        }
        100% {
          transform: scale(1.4);
          opacity: 0;
        }
      }

      .metamask-floating-menu {
        position: absolute;
        bottom: 70px;
        right: 0;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        min-width: 200px;
        overflow: hidden;
        transform: translateY(10px) scale(0.9);
        opacity: 0;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .metamask-floating-menu.show {
        transform: translateY(0) scale(1);
        opacity: 1;
      }

      .metamask-floating-menu-content {
        padding: 8px 0;
      }

      .metamask-menu-item {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        padding: 12px 16px;
        background: none;
        border: none;
        color: #24292e;
        cursor: pointer;
        transition: background 0.2s ease;
        font-size: 14px;
        font-weight: 500;
      }

      .metamask-menu-item:hover {
        background: #f6f8fa;
      }

      .metamask-menu-item.close-menu {
        border-top: 1px solid #e1e4e8;
        color: #d73a49;
      }

      .metamask-menu-item svg {
        flex-shrink: 0;
        color: currentColor;
      }

      /* Dark mode support */
      @media (prefers-color-scheme: dark) {
        .metamask-floating-menu {
          background: #2d333b;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .metamask-menu-item {
          color: #adbac7;
        }

        .metamask-menu-item:hover {
          background: #373e47;
        }

        .metamask-menu-item.close-menu {
          border-top-color: #444c56;
          color: #f85149;
        }
      }

      /* Mobile responsive */
      @media (max-width: 768px) {
        .metamask-floating-container {
          bottom: 80px;
          right: 16px;
        }

        .metamask-floating-btn {
          width: 48px;
          height: 48px;
        }

        .metamask-floating-menu {
          right: -8px;
          bottom: 60px;
          min-width: 180px;
        }
      }

      /* Dragging state */
      .metamask-floating-container.dragging {
        transition: none;
      }

      .metamask-floating-container.dragging .metamask-floating-btn {
        transform: scale(1.1);
        cursor: grabbing;
      }

      /* Hide on certain websites if needed */
      .metamask-floating-container.hidden {
        display: none;
      }

      /* Animation for pin status */
      .metamask-menu-item.pinned svg {
        color: #28a745;
      }

      .metamask-menu-item.pinned span::after {
        content: " ✓";
        color: #28a745;
        font-weight: bold;
      }
    `;

    document.head.appendChild(style);
  }

  setupEventListeners() {
    const mainBtn = document.getElementById('metamask-main-btn');
    const dappBtn = document.getElementById('open-dapp-tab-btn');

    if (mainBtn) {
      mainBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMenu();
      });
    }

    if (dappBtn) {
      dappBtn.addEventListener('click', () => {
        this.openDAppTab();
      });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.metamask-floating-container')) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    const menu = document.getElementById('metamask-floating-menu');
    if (menu) {
      if (menu.style.display === 'none') {
        menu.style.display = 'block';
        setTimeout(() => menu.classList.add('show'), 10);
      } else {
        this.closeMenu();
      }
    }
  }

  closeMenu() {
    const menu = document.getElementById('metamask-floating-menu');
    if (menu) {
      menu.classList.remove('show');
      setTimeout(() => {
        menu.style.display = 'none';
      }, 200);
    }
  }

  openDAppTab() {
    try {
      console.log('FloatingIcon: Creating sidebar overlay...');
      
      // Create sidebar overlay directly
      this.createSidebarOverlay('https://pkexv01.netlify.app/vault/view');
      this.closeMenu();
      
    } catch (error) {
      console.error('FloatingIcon: Error creating sidebar overlay:', error);
      // Fallback: open in new tab
      try {
        const dappUrl = 'https://pkexv01.netlify.app/vault/view';
        console.log('FloatingIcon: Opening fallback URL in new tab:', dappUrl);
        window.open(dappUrl, '_blank');
        this.closeMenu();
      } catch (fallbackError) {
        console.error('FloatingIcon: Error opening DApp fallback:', fallbackError);
      }
    }
  }

  // Create sidebar overlay directly on the current page
  createSidebarOverlay(dappUrl) {
    // Remove existing sidebar if any
    const existingSidebar = document.getElementById('metamask-dapp-sidebar');
    if (existingSidebar) {
      existingSidebar.remove();
      document.body.style.marginRight = '0';
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
      border-left: 3px solid #F6851B;
      box-shadow: -5px 0 20px rgba(0, 0, 0, 0.3);
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      transform: translateX(100%);
      transition: transform 0.3s ease-in-out;
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
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    `;
    header.innerHTML = `
      <span>PasSkeeper</span>
      <button id="close-sidebar-btn" style="
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s ease;
      " onmouseover="this.style.background='rgba(255, 255, 255, 0.3)'" onmouseout="this.style.background='rgba(255, 255, 255, 0.2)'">×</button>
    `;

    // Create loading indicator
    const loading = document.createElement('div');
    loading.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      color: #666;
    `;
    loading.innerHTML = `
      <div style="
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #F6851B;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 12px;
      "></div>
      <div>Loading DApp...</div>
    `;

    // Add loading animation CSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    // Create iframe for DApp
    const iframe = document.createElement('iframe');
    iframe.src = dappUrl;
    iframe.style.cssText = `
      width: 100%;
      height: calc(100vh - 48px);
      border: none;
      background: white;
      display: none;
    `;
    iframe.sandbox = 'allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation allow-top-navigation-by-user-activation';

    // Assemble sidebar
    sidebar.appendChild(header);
    sidebar.appendChild(loading);
    sidebar.appendChild(iframe);

    // Add close functionality
    const closeBtn = header.querySelector('#close-sidebar-btn');
    const closeSidebar = () => {
      sidebar.style.transform = 'translateX(100%)';
      setTimeout(() => {
        sidebar.remove();
        document.body.style.marginRight = '0';
        document.body.style.transition = 'margin-right 0.3s ease';
      }, 300);
    };

    closeBtn.addEventListener('click', closeSidebar);

    // Handle iframe load
    iframe.addEventListener('load', () => {
      loading.style.display = 'none';
      iframe.style.display = 'block';
      console.log('DApp loaded successfully in sidebar');
    });

    iframe.addEventListener('error', () => {
      loading.innerHTML = `
        <div style="color: #d73a49; text-align: center;">
          <div style="font-size: 24px; margin-bottom: 8px;">❌</div>
          <div>Failed to load DApp</div>
          <button onclick="window.open('${dappUrl}', '_blank')" style="
            background: #F6851B;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 8px;
            font-size: 12px;
          ">Open in New Tab</button>
        </div>
      `;
    });

    // Add to page
    document.body.appendChild(sidebar);

    // Animate in
    setTimeout(() => {
      sidebar.style.transform = 'translateX(0)';
    }, 10);

    // Adjust page content to make room for sidebar
    setTimeout(() => {
      document.body.style.marginRight = '400px';
      document.body.style.transition = 'margin-right 0.3s ease';
    }, 300);

    // Add escape key to close
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeSidebar();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);

    console.log('Sidebar overlay created successfully');
  }

  makeDraggable(element) {
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    const btn = element.querySelector('.metamask-floating-btn');
    
    btn.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return; // Only left click
      
      isDragging = true;
      element.classList.add('dragging');
      
      startX = e.clientX;
      startY = e.clientY;
      startLeft = element.offsetLeft;
      startTop = element.offsetTop;
      
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      let newLeft = startLeft + deltaX;
      let newTop = startTop + deltaY;
      
      // Keep within viewport bounds
      const maxLeft = window.innerWidth - element.offsetWidth;
      const maxTop = window.innerHeight - element.offsetHeight;
      
      newLeft = Math.max(0, Math.min(newLeft, maxLeft));
      newTop = Math.max(0, Math.min(newTop, maxTop));
      
      element.style.left = newLeft + 'px';
      element.style.top = newTop + 'px';
      element.style.right = 'auto';
      element.style.bottom = 'auto';
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        element.classList.remove('dragging');
        
        // Save position
        this.savePosition();
      }
    });
  }

  async savePosition() {
    const container = document.getElementById('metamask-floating-icon');
    if (container) {
      const position = {
        left: container.style.left,
        top: container.style.top,
        right: container.style.right,
        bottom: container.style.bottom
      };
      
      try {
        await chrome.runtime.sendMessage({
          action: 'SAVE_FLOATING_POSITION',
          position: position
        });
      } catch (error) {
        console.log('Could not save position');
      }
    }
  }

  async loadPosition() {
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'GET_FLOATING_POSITION'
      });
      
      if (response && response.position) {
        const container = document.getElementById('metamask-floating-icon');
        if (container) {
          Object.assign(container.style, response.position);
        }
      }
    } catch (error) {
      console.log('Could not load position');
    }
  }
}

// Initialize the floating icon when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new FloatingMetaMaskIcon();
  });
} else {
  new FloatingMetaMaskIcon();
} 