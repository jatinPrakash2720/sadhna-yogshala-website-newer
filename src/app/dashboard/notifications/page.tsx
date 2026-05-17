"use client";

import { motion } from "framer-motion";
import { 
  Bell, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  MoreVertical, 
  Trash2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { cn } from "@/lib/utils";

const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    type: "class",
    title: "Upcoming Class Reminder",
    message: "Your Morning Vinyasa Flow starts in 30 minutes. Get your mat ready!",
    time: "30m ago",
    unread: true,
    icon: Calendar,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: "2",
    type: "enrollment",
    title: "Course Enrollment Successful",
    message: "Welcome to 'Yoga for Deep Relaxation'. You now have full access to all lessons.",
    time: "2h ago",
    unread: true,
    icon: CheckCircle2,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    id: "3",
    type: "profile",
    title: "Complete Your Profile",
    message: "Add your health interests to get personalized course recommendations.",
    time: "1d ago",
    unread: false,
    icon: AlertCircle,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    id: "4",
    type: "new_course",
    title: "New Course Available",
    message: "Expert instructor Sarah Woods just released 'Advanced Breathwork Masterclass'.",
    time: "2d ago",
    unread: false,
    icon: BookOpen,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Bell className="h-8 w-8 text-brand-600" />
            Notifications
          </h1>
          <p className="text-sage-500">
            Stay updated with your classes, enrollments, and platform news.
          </p>
        </div>
        {unreadCount > 0 && (
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={markAllAsRead}
            className="w-fit"
          >
            Mark all as read
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notif, index) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "group relative p-5 rounded-2xl border transition-all duration-200",
                notif.unread 
                  ? "bg-white border-brand-100 shadow-sm ring-1 ring-brand-50" 
                  : "bg-gray-50/50 border-gray-100 opacity-80"
              )}
            >
              <div className="flex gap-4">
                <div className={cn(
                  "h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110",
                  notif.bgColor,
                  notif.color
                )}>
                  <notif.icon className="h-6 w-6" />
                </div>
                
                <div className="flex-1 min-w-0 pr-8">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={cn(
                      "font-bold text-base transition-colors",
                      notif.unread ? "text-gray-900" : "text-gray-600"
                    )}>
                      {notif.title}
                    </h3>
                    {notif.unread && (
                      <span className="h-2 w-2 rounded-full bg-brand-600 animate-pulse" />
                    )}
                  </div>
                  <p className="text-sm text-sage-600 leading-relaxed mb-2">
                    {notif.message}
                  </p>
                  <div className="flex items-center gap-4 text-xs font-medium text-sage-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {notif.time}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-cream-100 text-brand-700 capitalize">
                      {notif.type.replace("_", " ")}
                    </span>
                  </div>
                </div>

                <div className="absolute top-4 right-4 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => deleteNotification(notif.id)}
                    className="p-2 text-sage-400 hover:text-red-500 transition-colors"
                    title="Delete notification"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-sage-400 hover:text-gray-600 transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100"
          >
            <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Bell className="h-10 w-10 text-sage-200" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">All caught up!</h2>
            <p className="text-sage-500 max-w-xs mx-auto">
              You don&apos;t have any notifications at the moment. Check back later!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
