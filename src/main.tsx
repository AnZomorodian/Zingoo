import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialize theme from localStorage or system preference
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('messenger-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('messenger-theme', theme);
};

// Initialize theme before rendering
initializeTheme();

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('messenger-theme')) {
    const theme = e.matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }
});

// Performance monitoring
if (import.meta.env.DEV) {
  // Log performance metrics in development
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    console.log('App loaded in:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
  });
}

// Error boundary for better error handling
class ErrorBoundary extends StrictMode {
  constructor(props: any) {
    super(props);
  }

  static getDerivedStateFromError(error: Error) {
    console.error('App Error:', error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
}

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Service worker registration for PWA capabilities
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Handle online/offline status
window.addEventListener('online', () => {
  document.body.classList.remove('offline');
  console.log('App is online');
});

window.addEventListener('offline', () => {
  document.body.classList.add('offline');
  console.log('App is offline');
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + K for search
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const searchInput = document.querySelector('.search-input-wrapper input') as HTMLInputElement;
    searchInput?.focus();
  }
  
  // Escape to close modals
  if (e.key === 'Escape') {
    const activeModal = document.querySelector('.modal.active, .emoji-picker, .chat-options-menu');
    if (activeModal) {
      const closeButton = activeModal.querySelector('[data-close]') as HTMLButtonElement;
      closeButton?.click();
    }
  }
});

// Prevent context menu on production
if (import.meta.env.PROD) {
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });
}

// Handle app updates
if (import.meta.hot) {
  import.meta.hot.accept();
}
