import React, { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
      <div className="bg-red-50 text-red-800 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-red-600" />
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
};

export default Toast;