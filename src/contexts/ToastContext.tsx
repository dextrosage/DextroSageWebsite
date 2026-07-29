import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { AxiosError } from 'axios';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
}

interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (message: string, type: ToastType, title?: string) => void;
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showApiError: (error: unknown, fallbackMessage?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType, title?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message, title }]);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const showSuccess = useCallback((message: string, title?: string) => {
    showToast(message, 'success', title || 'Success');
  }, [showToast]);

  const showError = useCallback((message: string, title?: string) => {
    showToast(message, 'error', title || 'Error');
  }, [showToast]);

  const showApiError = useCallback((error: unknown, fallbackMessage = 'An unexpected error occurred') => {
    let status = 0;
    let detail = '';

    if (error && typeof error === 'object' && 'isAxiosError' in error) {
      const axiosErr = error as AxiosError<{ detail?: string | { msg: string }[] }>;
      status = axiosErr.response?.status || 0;
      const responseData = axiosErr.response?.data;
      
      if (responseData && typeof responseData === 'object') {
        if (typeof responseData.detail === 'string') {
          detail = responseData.detail;
        } else if (Array.isArray(responseData.detail)) {
          detail = responseData.detail.map(d => d.msg || JSON.stringify(d)).join(', ');
        }
      }
    }

    if (status === 401) {
      showToast(detail || 'Session expired or invalid credentials.', 'error', 'Unauthorized');
    } else if (status === 403) {
      showToast(detail || 'You do not have permission to access this resource.', 'error', 'Access Denied');
    } else if (status === 404) {
      showToast(detail || 'The requested resource was not found.', 'error', 'Not Found');
    } else if (status === 409) {
      showToast(detail || 'A conflict occurred (e.g. user already exists).', 'error', 'Conflict');
    } else if (status === 422) {
      showToast(detail || 'Input validation failed. Please check your data.', 'error', 'Validation Error');
    } else if (status >= 500) {
      showToast('Internal server error. Please try again later.', 'error', 'Server Error');
    } else {
      showToast(detail || fallbackMessage, 'error', 'Error');
    }
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, showSuccess, showError, showApiError, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start p-4 bg-white border border-gray-100 rounded-lg shadow-lg animate-fade-in transition-all overflow-hidden"
            role="alert"
          >
            <div className="flex-shrink-0 mr-3">
              {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-brand-500" />}
            </div>
            <div className="flex-1">
              {toast.title && <h4 className="text-sm font-semibold text-gray-900">{toast.title}</h4>}
              <p className="text-xs text-gray-500 mt-0.5">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
