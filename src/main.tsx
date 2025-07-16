import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Performance monitoring and analytics
const initializePerformanceMonitoring = () => {
  if (import.meta.env.DEV) {
    // Development performance logging
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const loadTime = perfData.loadEventEnd - perfData.fetchStart;
      console.log(`🚀 App loaded in: ${loadTime.toFixed(2)}ms`);
      
      // Log Core Web Vitals
      if ('web-vital' in window) {
        console.log('📊 Core Web Vitals monitoring enabled');
      }
    });

    // Memory usage monitoring
    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      console.log('💾 Memory usage:', {
        used: `${(memInfo.usedJSHeapSize / 1048576).toFixed(2)}MB`,
        total: `${(memInfo.totalJSHeapSize / 1048576).toFixed(2)}MB`,
        limit: `${(memInfo.jsHeapSizeLimit / 1048576).toFixed(2)}MB`
      });
    }
  }
};

// Theme initialization with system preference detection
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('messenger-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  
  document.documentElement.className = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('messenger-theme', theme);

  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleThemeChange = (e: MediaQueryListEvent) => {
    if (!localStorage.getItem('messenger-theme')) {
      const newTheme = e.matches ? 'dark' : 'light';
      document.documentElement.className = newTheme;
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  };

  mediaQuery.addEventListener('change', handleThemeChange);
  
  return () => mediaQuery.removeEventListener('change', handleThemeChange);
};

// Network status monitoring
const initializeNetworkMonitoring = () => {
  const updateOnlineStatus = () => {
    const isOnline = navigator.onLine;
    document.body.classList.toggle('offline', !isOnline);
    
    if (isOnline) {
      console.log('🌐 App is online');
      // Dispatch custom event for app components
      window.dispatchEvent(new CustomEvent('app:online'));
    } else {
      console.log('📴 App is offline');
      window.dispatchEvent(new CustomEvent('app:offline'));
    }
  };

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  
  // Initial status check
  updateOnlineStatus();

  return () => {
    window.removeEventListener('online', updateOnlineStatus);
    window.removeEventListener('offline', updateOnlineStatus);
  };
};

// Global keyboard shortcuts
const initializeKeyboardShortcuts = () => {
  const handleKeyDown = (e: KeyboardEvent) => {
    const isModifierPressed = e.ctrlKey || e.metaKey;
    
    // Prevent default shortcuts in production
    if (import.meta.env.PROD) {
      // Disable F12, Ctrl+Shift+I, Ctrl+U, etc.
      if (
        e.key === 'F12' ||
        (isModifierPressed && e.shiftKey && e.key === 'I') ||
        (isModifierPressed && e.key === 'u')
      ) {
        e.preventDefault();
        return false;
      }
    }

    // App-specific shortcuts
    switch (true) {
      // Ctrl/Cmd + K for search
      case isModifierPressed && e.key === 'k':
        e.preventDefault();
        const searchInput = document.querySelector('.search-input input') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
        break;

      // Ctrl/Cmd + N for new chat
      case isModifierPressed && e.key === 'n':
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('app:new-chat'));
        break;

      // Ctrl/Cmd + T for theme toggle
      case isModifierPressed && e.key === 't':
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('app:toggle-theme'));
        break;

      // Escape to close modals/overlays
      case e.key === 'Escape':
        const activeModal = document.querySelector('.modal.active, .dropdown.active, .overlay.active');
        if (activeModal) {
          const closeButton = activeModal.querySelector('[data-close]') as HTMLButtonElement;
          closeButton?.click();
        }
        break;

      // Arrow keys for chat navigation
      case e.key === 'ArrowUp' || e.key === 'ArrowDown':
        if (e.altKey) {
          e.preventDefault();
          window.dispatchEvent(new CustomEvent('app:navigate-chat', { 
            detail: { direction: e.key === 'ArrowUp' ? 'up' : 'down' }
          }));
        }
        break;
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  
  return () => document.removeEventListener('keydown', handleKeyDown);
};

// Service Worker registration for PWA capabilities
const initializeServiceWorker = async () => {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });

      console.log('✅ Service Worker registered:', registration.scope);

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available
              window.dispatchEvent(new CustomEvent('app:update-available'));
            }
          });
        }
      });

      // Handle controller change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });

    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
    }
  }
};

// Error boundary and global error handling
const initializeErrorHandling = () => {
  // Global error handler
  window.addEventListener('error', (event) => {
    console.error('🚨 Global error:', event.error);
    
    // In production, you might want to send this to an error reporting service
    if (import.meta.env.PROD) {
      // Example: sendToErrorReporting(event.error);
    }
  });

  // Unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 Unhandled promise rejection:', event.reason);
    
    if (import.meta.env.PROD) {
      // Example: sendToErrorReporting(event.reason);
    }
  });
};

// Accessibility enhancements
const initializeAccessibility = () => {
  // Announce page changes to screen readers
  const announcePageChange = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  // Listen for route changes or important updates
  window.addEventListener('app:chat-changed', (e: any) => {
    announcePageChange(`Switched to chat with ${e.detail.chatName}`);
  });

  // Focus management
  let lastFocusedElement: HTMLElement | null = null;
  
  window.addEventListener('app:modal-opened', () => {
    lastFocusedElement = document.activeElement as HTMLElement;
  });

  window.addEventListener('app:modal-closed', () => {
    if (lastFocusedElement) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  });
};

// App initialization
const initializeApp = async () => {
  console.log('🚀 Initializing Messenger App...');

  // Initialize all systems
  const cleanupTheme = initializeTheme();
  const cleanupNetwork = initializeNetworkMonitoring();
  const cleanupKeyboard = initializeKeyboardShortcuts();
  
  initializePerformanceMonitoring();
  initializeErrorHandling();
  initializeAccessibility();
  
  await initializeServiceWorker();

  // Cleanup function for development hot reload
  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      cleanupTheme();
      cleanupNetwork();
      cleanupKeyboard();
    });
  }

  console.log('✅ App initialization complete');
};

// Prevent context menu in production
if (import.meta.env.PROD) {
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  // Disable text selection on UI elements
  document.addEventListener('selectstart', (e) => {
    const target = e.target as HTMLElement;
    if (target.closest('.no-select, button, .icon-button, .sidebar-header')) {
      e.preventDefault();
    }
  });
}

// Initialize app and render
initializeApp().then(() => {
  const root = createRoot(document.getElementById('root')!);
  
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});

// Hot module replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}