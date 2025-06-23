# MetaMask Sidebar Pin Feature

## Overview

The **Pin to Sidebar** feature allows users to pin MetaMask to their browser's sidebar for easy access while browsing. This enhancement improves user experience by providing quick access to MetaMask without interrupting the browsing flow.

## Features

### 🌟 **Floating Icon on All Websites**
- **Always Visible**: A floating MetaMask icon appears on every website you visit
- **Instant Access**: Click the floating icon to access MetaMask without searching for the extension
- **Pin to Sidebar**: Easy access to pin/unpin functionality directly from websites
- **Draggable**: Move the floating icon to your preferred position on screen
- **Smart Menu**: Expandable menu with quick actions (Pin to Sidebar, Open MetaMask, Connect to Site)

### 📌 **Pin to Sidebar Functionality**
- **Quick Access**: Pin MetaMask to your browser sidebar for instant access
- **Visual Instructions**: Step-by-step guidance on how to pin/unpin the extension
- **Smart Reminders**: Automatic reminders to pin after frequent usage
- **Browser Compatibility**: Supports Chrome and Edge browsers with sidebar functionality
- **Usage Tracking**: Tracks how often users access the extension
- **Persistent Settings**: Remembers pin preferences across browser sessions

## Files Added/Modified

### New Files
1. **`scripts/floating-metamask-icon.js`** - Content script that injects floating icon on all websites
2. **`sidebar-pin-component.jsx`** - React component for the pin to sidebar interface
3. **`sidebar-pin-styles.css`** - CSS styles for the component
4. **`scripts/sidebar-pin-handler.js`** - Background script handling pin functionality
5. **`popup-menu-extension.html`** - Demo HTML showing integration with popup menu
6. **`floating-icon-demo.html`** - Demo page showing the floating icon in action

### Modified Files
1. **`_locales/en/messages.json`** - Added new localization strings for the feature

## Usage

### For Users

#### 🌟 **Using the Floating Icon (Recommended)**

1. **Find the Floating Icon**:
   - Look for the orange MetaMask fox icon in the bottom-right corner of any website
   - The icon appears with a subtle pulsing animation

2. **Access Pin to Sidebar**:
   - Click the floating MetaMask icon
   - Select "Pin to Sidebar" from the dropdown menu
   - Follow the step-by-step visual instructions

3. **Additional Actions**:
   - **Open MetaMask**: Launch the full MetaMask interface
   - **Connect to Site**: Connect your wallet to the current website
   - **Move Icon**: Drag the floating icon to your preferred position

#### 📱 **Alternative Access Methods**

1. **Via Extension Popup**:
   - Click the MetaMask extension icon in your browser toolbar
   - Open the menu (three lines icon)
   - Select "Pin to sidebar"

2. **Pin to Sidebar Process**:
   - Click the "Pin to Sidebar" button
   - Follow the visual instructions provided
   - MetaMask will be accessible from your browser sidebar

3. **Unpin from Sidebar**:
   - Right-click the MetaMask icon in the sidebar
   - Select "Hide from sidebar" or "Remove from sidebar"

### For Developers

#### Integration Steps

1. **Add the Component to Your UI**:
```jsx
import SidebarPinComponent from './sidebar-pin-component.jsx';

// In your component
<SidebarPinComponent 
  isVisible={true} 
  onClose={() => setShowPinComponent(false)} 
/>
```

2. **Include the Styles**:
```html
<link rel="stylesheet" href="./sidebar-pin-styles.css" />
```

3. **Add Background Script**:
Add to your manifest.json:
```json
{
  "background": {
    "service_worker": "scripts/sidebar-pin-handler.js"
  }
}
```

## API Reference

### SidebarPinComponent Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isVisible` | boolean | `true` | Whether the component is visible |
| `onClose` | function | `null` | Callback when component is closed |

### Background Script Messages

#### GET_PIN_STATUS
```javascript
chrome.runtime.sendMessage({
  action: 'GET_PIN_STATUS'
}, (response) => {
  console.log('Is pinned:', response.isPinned);
});
```

#### SET_PIN_STATUS
```javascript
chrome.runtime.sendMessage({
  action: 'SET_PIN_STATUS',
  pinned: true
}, (response) => {
  console.log('Pin status updated:', response.success);
});
```

#### SHOW_PIN_INSTRUCTIONS
```javascript
chrome.runtime.sendMessage({
  action: 'SHOW_PIN_INSTRUCTIONS',
  type: 'pin' // or 'unpin'
}, (response) => {
  console.log('Instructions shown:', response.success);
});
```

## Browser Support

### Supported Browsers
- **Chrome** 88+ (with sidebar support)
- **Microsoft Edge** 88+ (with sidebar support)

### Unsupported Browsers
- Firefox (different sidebar implementation)
- Safari (no sidebar support)
- Opera (limited sidebar support)

## Localization

The feature includes localization support with the following keys:

```json
{
  "pinToSidebar": {
    "message": "Pin to sidebar"
  },
  "pinToSidebarDescription": {
    "message": "Pin MetaMask to your browser sidebar for easy access while browsing"
  },
  "pinToSidebarTitle": {
    "message": "Pin to sidebar"
  },
  "pinnedToSidebar": {
    "message": "Pinned to sidebar"
  },
  "unpinFromSidebar": {
    "message": "Unpin from sidebar"
  },
  "sidebarAccessDescription": {
    "message": "Access MetaMask quickly from the sidebar without interrupting your browsing experience"
  }
}
```

## Implementation Details

### Storage Keys
- `metamask-sidebar-pinned`: Boolean indicating pin status
- `metamask-pin-reminder-shown`: Boolean for reminder display tracking
- `metamask-sidebar-access-count`: Number tracking extension usage

### CSS Variables Used
The component uses MetaMask's design system variables:
- `--color-background-default`
- `--color-border-muted`
- `--color-text-default`
- `--color-primary-default`
- `--shadow-size-sm`

### Accessibility Features
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels and semantic HTML
- **High Contrast**: Support for high contrast mode
- **Focus Management**: Proper focus indicators

## Testing

### Manual Testing
1. Install the extension in Chrome/Edge
2. Verify the "Pin to sidebar" option appears in the menu
3. Test the pin/unpin functionality
4. Verify instructions display correctly
5. Test with different browser themes (light/dark)

### Browser Testing Matrix
| Browser | Version | Sidebar Support | Status |
|---------|---------|----------------|--------|
| Chrome | 88+ | ✅ | ✅ Supported |
| Edge | 88+ | ✅ | ✅ Supported |
| Firefox | Any | ❌ | ❌ Not Supported |
| Safari | Any | ❌ | ❌ Not Supported |

## Benefits

### For Users
- **Improved Productivity**: Quick access without opening new tabs
- **Better UX**: Seamless integration with browsing workflow
- **Reduced Friction**: One-click access to wallet functions

### For MetaMask
- **Increased Engagement**: More frequent usage due to easier access
- **Better Retention**: Improved user experience leads to higher retention
- **Competitive Advantage**: Unique feature not available in other wallets

## Future Enhancements

1. **Auto-Detection**: Automatically detect if extension is pinned
2. **Customization**: Allow users to customize sidebar appearance
3. **Shortcuts**: Keyboard shortcuts for sidebar access
4. **Analytics**: Enhanced usage analytics and insights
5. **Multi-Browser**: Extended support for other browsers

## Troubleshooting

### Common Issues

**Q: The pin button doesn't work**
A: Ensure you're using Chrome 88+ or Edge 88+ with sidebar support enabled.

**Q: Instructions don't appear**
A: Check that notifications are enabled for the extension in browser settings.

**Q: Component doesn't match theme**
A: Verify that CSS variables are properly imported and the component has access to the design system.

## Contributing

When contributing to this feature:

1. Follow MetaMask's coding standards
2. Update localization files for new text
3. Test across supported browsers
4. Update this documentation for any changes
5. Ensure accessibility compliance

## License

This feature is part of MetaMask and follows the same licensing terms. 