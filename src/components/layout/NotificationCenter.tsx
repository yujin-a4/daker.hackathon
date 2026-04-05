'use client';

import React from 'react';
import { Bell, Check, X, Users, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useNotificationStore, Notification } from '@/store/useNotificationStore';
import { useUserStore } from '@/store/useUserStore';
import { useTeamStore } from '@/store/useTeamStore';
import TeamDetailModal from '@/components/camp/TeamDetailModal';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

export default function NotificationCenter() {
  const { 
    getMyNotifications,
    acceptInvitation, 
    cancelAcceptance,
    declineInvitation, 
    markAllAsRead,
    markAsRead 
  } = useNotificationStore();
  const { currentUser } = useUserStore();

  const { teams } = useTeamStore();
  
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [selectedTeamData, setSelectedTeamData] = React.useState<any>(null);
  
  const { toast } = useToast();

  // 현재 로그인 유저의 알림만 표시
  const myNotifications = getMyNotifications();
  const pendingCount = myNotifications.filter(n => n.status === 'pending').length;
  const unreadCount = myNotifications.filter(n => !n.isRead).length;

  const handleAccept = (e: React.MouseEvent, id: string, teamName: string) => {
    e.stopPropagation();
    acceptInvitation(id);
    toast({
      title: '팀 합류 완료!',
      description: `${teamName} 팀의 일원이 되었습니다. 작전실을 확인해보세요.`,
    });
  };

  const handleDecline = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    declineInvitation(id);
    toast({
      title: '초대 거절',
      description: '팀 초대를 거절했습니다.',
      variant: 'destructive',
    });
  };

  const handleCancelAcceptance = (e: React.MouseEvent, id: string, teamName: string) => {
    e.stopPropagation();
    cancelAcceptance(id);
    toast({
      title: '참가 취소',
      description: `${teamName} 팀 참가를 취소했습니다.`,
      variant: 'default',
    });
  };

  const handleItemClick = (notification: Notification) => {
    markAsRead(notification.id);
    
    if (notification.type === 'invitation') {
      const team = teams.find(t => t.teamCode === notification.teamCode);
      if (team) {
        setSelectedTeamData(team);
        setIsDetailOpen(true);
      }
    }
  };

  return (
    <>
      <Popover onOpenChange={(open) => open && markAllAsRead()}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full">
            <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-background animate-in zoom-in duration-300">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[380px] p-0 overflow-hidden" align="end">
          <div className="flex items-center justify-between border-b px-4 py-3 bg-slate-50/50 dark:bg-slate-900/50">
            <h3 className="font-bold text-sm flex items-center gap-2">
              알림 센터
              {unreadCount > 0 && (
                <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                  {unreadCount}개의 새로운 소식
                </span>
              )}
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 text-xs text-muted-foreground hover:text-foreground"
              onClick={markAllAsRead}
            >
              모두 읽음
            </Button>
          </div>
          
          <div className="max-h-[450px] overflow-y-auto overflow-x-hidden">
            <AnimatePresence initial={false}>
              {myNotifications.length > 0 ? (
                <div className="divide-y divide-border/40">
                  {myNotifications.map((notification) => (
                    <NotificationItem 
                      key={notification.id} 
                      notification={notification}
                      onAccept={handleAccept}
                      onDecline={handleDecline}
                      onCancelAccept={handleCancelAcceptance}
                      onClick={() => handleItemClick(notification)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                    <Bell className="h-6 w-6 text-slate-300" />
                  </div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">도도한 정적...</p>
                  <p className="text-xs text-slate-500 mt-1">지금은 새로운 알림이 없습니다.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
          
          {myNotifications.length > 0 && (
            <div className="border-t p-2 text-center bg-slate-50/30 dark:bg-slate-900/30">
              <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground h-8">
                이전 알림 모두 보기
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>

      <TeamDetailModal 
        isOpen={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        team={selectedTeamData}
        onEdit={() => {}} // 초대받은 입장이므로 수정 기능은 노출되지 않음 (TeamDetailModal 내부 로직)
      />
    </>
  );
}

function NotificationItem({ 
  notification, 
  onAccept, 
  onDecline,
  onCancelAccept,
  onClick
}: { 
  notification: Notification;
  onAccept: (e: React.MouseEvent, id: string, teamName: string) => void;
  onDecline: (e: React.MouseEvent, id: string) => void;
  onCancelAccept: (e: React.MouseEvent, id: string, teamName: string) => void;
  onClick: () => void;
}) {
  const isInvitation = notification.type === 'invitation';
  const isPending = notification.status === 'pending';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      onClick={onClick}
      className={cn(
        "group p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer relative text-left",
        !notification.isRead && "bg-blue-50/30 dark:bg-blue-900/10"
      )}
    >
      {!notification.isRead && (
        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full" />
      )}
      
      <div className="flex gap-3">
        <div className={cn(
          "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
          isInvitation 
            ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400"
            : "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400"
        )}>
          {isInvitation ? <Users className="h-5 w-5" /> : <Info className="h-5 w-5" />}
        </div>
        
        <div className="flex-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
              {isInvitation ? (
                <span>
                  <strong className="text-primary">{notification.fromTeamName}</strong> 팀의 합류 초대장이 도착했습니다!
                </span>
              ) : (
                notification.hackathonTitle
              )}
            </h4>
          </div>
          
          <p className="text-xs text-slate-500 font-medium">
            {notification.hackathonTitle}
          </p>

          <p className="text-[10px] text-slate-400">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: ko })}
          </p>

          {isInvitation && isPending && (
            <div className="flex gap-2 pt-2">
              <Button 
                size="sm" 
                className="h-8 flex-1 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold"
                onClick={(e) => onAccept(e, notification.id, notification.fromTeamName)}
              >
                수락하기
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 flex-1 text-xs font-bold border-rose-200 text-rose-600 hover:bg-rose-50"
                onClick={(e) => onDecline(e, notification.id)}
              >
                거절
              </Button>
            </div>
          )}

          {notification.status === 'accepted' && (
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1.5 py-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 rounded-md w-fit">
                <Check className="h-3 w-3" /> 수락 완료
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-[10px] text-muted-foreground hover:text-rose-600 hover:bg-rose-50 px-2"
                onClick={(e) => onCancelAccept(e, notification.id, notification.fromTeamName)}
              >
                참가 취소
              </Button>
            </div>
          )}
          
          {notification.status === 'declined' && (
            <div className="flex items-center gap-1.5 py-1 text-[11px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/30 px-2 rounded-md w-fit">
              <X className="h-3 w-3" /> 거절됨
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
