import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

export const NotificationToast = () => {
  const { notifications, showNotification, setShowNotification } = useNotifications();

  const latestNotification = notifications[0];

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showNotification, setShowNotification]);

  if (!showNotification || !latestNotification) return null;

  const getToastStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 border-green-600';
      case 'warning':
        return 'bg-yellow-500 border-yellow-600';
      case 'error':
        return 'bg-red-500 border-red-600';
      case 'announcement':
        return 'bg-blue-500 border-blue-600';
      default:
        return 'bg-gray-800 border-gray-900';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'announcement': return '📢';
      default: return 'ℹ️';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] animate-slide-in-right">
      <div
        className={`${getToastStyles(
          latestNotification.type
        )} text-white rounded-lg shadow-2xl border-l-4 p-4 min-w-[320px] max-w-md`}
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">{getIcon(latestNotification.type)}</span>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white mb-1">{latestNotification.title}</h4>
            <p className="text-sm text-white/90 line-clamp-2">{latestNotification.message}</p>
          </div>
          <button
            onClick={() => setShowNotification(false)}
            className="text-white/80 hover:text-white flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
