import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Component for managing the "Pin to Sidebar" functionality
 * Allows users to pin MetaMask to their browser's sidebar for easy access
 */
const SidebarPinComponent = ({ onClose, isVisible }) => {
  const [isPinned, setIsPinned] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if the browser supports sidebar pinning
    checkSidebarSupport();
    // Check current pin status
    checkPinStatus();
  }, []);

  const checkSidebarSupport = () => {
    // Check if running in Chrome/Chromium browsers that support sidebar
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    const isEdge = /Edg/.test(navigator.userAgent);
    setIsSupported(isChrome || isEdge);
  };

  const checkPinStatus = async () => {
    try {
      // Check if extension is currently pinned to sidebar
      // This would typically involve checking browser storage or API
      const pinnedStatus = localStorage.getItem('metamask-sidebar-pinned');
      setIsPinned(pinnedStatus === 'true');
    } catch (error) {
      console.warn('Unable to check pin status:', error);
    }
  };

  const handlePinToSidebar = async () => {
    try {
      if (!isPinned) {
        // Guide user to pin to sidebar
        await guidePinToSidebar();
        setIsPinned(true);
        localStorage.setItem('metamask-sidebar-pinned', 'true');
      } else {
        // Guide user to unpin from sidebar
        await guideUnpinFromSidebar();
        setIsPinned(false);
        localStorage.setItem('metamask-sidebar-pinned', 'false');
      }
    } catch (error) {
      console.error('Error toggling sidebar pin:', error);
    }
  };

  const guidePinToSidebar = async () => {
    // Show instructions for pinning to sidebar
    // This could open a modal or tooltip with visual instructions
    const instructionModal = document.createElement('div');
    instructionModal.className = 'metamask-sidebar-instruction-modal';
    instructionModal.innerHTML = `
      <div class="instruction-overlay">
        <div class="instruction-content">
          <h3>Pin MetaMask to Sidebar</h3>
          <div class="instruction-steps">
            <div class="step">
              <span class="step-number">1</span>
              <span class="step-text">Click the browser's Extensions menu (puzzle piece icon)</span>
            </div>
            <div class="step">
              <span class="step-number">2</span>
              <span class="step-text">Find MetaMask in the list</span>
            </div>
            <div class="step">
              <span class="step-number">3</span>
              <span class="step-text">Click the pin icon next to MetaMask</span>
            </div>
            <div class="step">
              <span class="step-number">4</span>
              <span class="step-text">Right-click on the MetaMask icon and select "Show in sidebar"</span>
            </div>
          </div>
          <button class="instruction-close-btn" onclick="this.parentElement.parentElement.remove()">
            Got it!
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(instructionModal);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (instructionModal.parentNode) {
        instructionModal.remove();
      }
    }, 10000);
  };

  const guideUnpinFromSidebar = async () => {
    // Show instructions for unpinning from sidebar
    const instructionModal = document.createElement('div');
    instructionModal.className = 'metamask-sidebar-instruction-modal';
    instructionModal.innerHTML = `
      <div class="instruction-overlay">
        <div class="instruction-content">
          <h3>Unpin MetaMask from Sidebar</h3>
          <div class="instruction-steps">
            <div class="step">
              <span class="step-number">1</span>
              <span class="step-text">Right-click on the MetaMask icon in the sidebar</span>
            </div>
            <div class="step">
              <span class="step-number">2</span>
              <span class="step-text">Select "Hide from sidebar" or "Remove from sidebar"</span>
            </div>
          </div>
          <button class="instruction-close-btn" onclick="this.parentElement.parentElement.remove()">
            Got it!
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(instructionModal);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (instructionModal.parentNode) {
        instructionModal.remove();
      }
    }, 10000);
  };

  if (!isVisible || !isSupported) {
    return null;
  }

  return (
    <div className="sidebar-pin-component">
      <div className="sidebar-pin-header">
        <h4>Browser Integration</h4>
        {onClose && (
          <button className="close-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        )}
      </div>
      
      <div className="sidebar-pin-content">
        <div className="sidebar-pin-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 21V19H21V21H3ZM3 17V15H21V17H3ZM3 13V11H21V13H3ZM3 9V7H21V9H3ZM3 5V3H21V5H3Z" fill="currentColor"/>
          </svg>
        </div>
        
        <div className="sidebar-pin-info">
          <h5>{isPinned ? 'Pinned to Sidebar' : 'Pin to Sidebar'}</h5>
          <p>
            {isPinned 
              ? 'MetaMask is accessible from your browser sidebar for quick access while browsing'
              : 'Access MetaMask quickly from the sidebar without interrupting your browsing experience'
            }
          </p>
        </div>
        
        <button 
          className={`sidebar-pin-btn ${isPinned ? 'unpin' : 'pin'}`}
          onClick={handlePinToSidebar}
          aria-label={isPinned ? 'Unpin from sidebar' : 'Pin to sidebar'}
        >
          {isPinned ? (
            <>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L6 6H10L8 2Z" fill="currentColor"/>
                <path d="M7 8H9V14H7V8Z" fill="currentColor"/>
              </svg>
              Unpin
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L10 6H6L8 2Z" fill="currentColor"/>
                <path d="M7 8H9V14H7V8Z" fill="currentColor"/>
              </svg>
              Pin to Sidebar
            </>
          )}
        </button>
      </div>
    </div>
  );
};

SidebarPinComponent.propTypes = {
  onClose: PropTypes.func,
  isVisible: PropTypes.bool
};

SidebarPinComponent.defaultProps = {
  onClose: null,
  isVisible: true
};

export default SidebarPinComponent; 