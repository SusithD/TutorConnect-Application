import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext';
import { Bell, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NotificationDropdownProps {
  onClose: () => void;
}

const NotificationDropdown = ({ onClose }: NotificationDropdownProps) => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
    }
    onClose();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'BOOKING_REQUEST':
      case 'BOOKING_CONFIRMATION':
      case 'BOOKING_CANCELLATION':
        return <Bell className="h-5 w-5 text-blue-500" />;
      case 'NEW_MESSAGE':
        return <Bell className="h-5 w-5 text-green-500" />;
      case 'SYSTEM_ALERT':
        return <Bell className="h-5 w-5 text-yellow-500" />;
      case 'PAYMENT':
        return <Bell className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-md shadow-lg w-80 max-h-96 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-medium">Notifications</h3>
        <button 
          onClick={() => {
            markAllAsRead();
            onClose();
          }}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          <Check className="h-4 w-4 mr-1" />
          Mark all as read
        </button>
      </div>
      
      <div className="divide-y divide-gray-100">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No notifications to display
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`p-4 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
            >
              <div className="flex">
                <div className="mr-3 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div>
                  <div className="font-medium">{notification.title}</div>
                  <div className="text-sm text-gray-600 mt-1">{notification.message}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;