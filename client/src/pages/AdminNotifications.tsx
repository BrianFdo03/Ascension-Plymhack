import { useState } from 'react';
import { Send, Bell } from 'lucide-react';
import { notificationService } from '../services/notificationService';
import Sidebar from '../components/common/Sidebar';

const AdminNotifications = () => {
  const [formData, setFormData] = useState({
    recipientType: 'all' as 'driver' | 'passenger' | 'all',
    recipientId: '',
    title: '',
    message: '',
    type: 'info' as 'info' | 'warning' | 'success' | 'error' | 'announcement',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await notificationService.createNotification({
        ...formData,
        recipientId: formData.recipientId || undefined,
      });
      setSuccess(true);
      // Reset form
      setFormData({
        recipientType: 'all',
        recipientId: '',
        title: '',
        message: '',
        type: 'info',
        priority: 'medium',
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  const quickNotifications = [
    {
      title: 'Service Update',
      message: 'Bus service will be temporarily suspended on Main Street due to road maintenance.',
      type: 'warning' as const,
      recipientType: 'all' as const,
    },
    {
      title: 'New Route Available',
      message: 'We are excited to announce a new express route from Colombo to Kandy!',
      type: 'announcement' as const,
      recipientType: 'passenger' as const,
    },
    {
      title: 'Safety Reminder',
      message: 'Please ensure all passengers wear seat belts during the journey.',
      type: 'info' as const,
      recipientType: 'driver' as const,
    },
  ];

  const sendQuickNotification = async (notification: typeof quickNotifications[0]) => {
    setLoading(true);
    try {
      await notificationService.createNotification({
        ...notification,
        priority: 'medium',
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Bell className="w-8 h-8 text-blue-600" />
              Send Notifications
            </h1>
            <p className="text-gray-600 mt-2">
              Send notifications to drivers, passengers, or everyone
            </p>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              ✅ Notification sent successfully!
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-6">Create Custom Notification</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Recipient Type
                      </label>
                      <select
                        value={formData.recipientType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            recipientType: e.target.value as any,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">Everyone</option>
                        <option value="driver">Drivers Only</option>
                        <option value="passenger">Passengers Only</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Specific User ID (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.recipientId}
                        onChange={(e) =>
                          setFormData({ ...formData, recipientId: e.target.value })
                        }
                        placeholder="Leave empty for all"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value as any })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="info">Info</option>
                        <option value="success">Success</option>
                        <option value="warning">Warning</option>
                        <option value="error">Error</option>
                        <option value="announcement">Announcement</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) =>
                          setFormData({ ...formData, priority: e.target.value as any })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                      placeholder="Enter notification title"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                      rows={4}
                      placeholder="Enter notification message"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                    {loading ? 'Sending...' : 'Send Notification'}
                  </button>
                </form>
              </div>
            </div>

            {/* Quick Notifications */}
            <div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Send</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Send pre-configured notifications
                </p>
                <div className="space-y-3">
                  {quickNotifications.map((notification, index) => (
                    <button
                      key={index}
                      onClick={() => sendQuickNotification(notification)}
                      disabled={loading}
                      className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      <div className="font-medium text-gray-900 mb-1">
                        {notification.title}
                      </div>
                      <div className="text-sm text-gray-600 line-clamp-2">
                        {notification.message}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {notification.recipientType}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {notification.type}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
