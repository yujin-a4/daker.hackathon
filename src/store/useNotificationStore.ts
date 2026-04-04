import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useUserStore } from './useUserStore';
import { useTeamStore } from './useTeamStore';

export type NotificationType = 'invitation' | 'message' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  fromTeamName: string;
  hackathonTitle: string;
  teamCode: string;
  status: 'pending' | 'accepted' | 'declined';
  isRead: boolean;
  createdAt: string;
}

export interface SentInvitation {
  id: string;
  teamCode: string;
  toUserNickname: string;
  status: 'pending' | 'accepted' | 'declined';
  sentAt: string;
}

interface NotificationState {
  notifications: Notification[];
  sentInvitations: SentInvitation[];
  
  // 수신측 액션
  addNotification: (notification: Omit<Notification, 'id' | 'isRead' | 'status' | 'createdAt'>) => void;
  acceptInvitation: (id: string) => void;
  cancelAcceptance: (id: string) => void;
  declineInvitation: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  
  // 발신측(팀장) 액션
  addSentInvitation: (invitation: Omit<SentInvitation, 'id' | 'status' | 'sentAt'>) => void;
  updateSentInvitationStatus: (teamCode: string, toUserNickname: string, status: 'pending' | 'accepted' | 'declined') => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      sentInvitations: [],
      
      addNotification: (data) => {
        const newNotification: Notification = {
          ...data,
          id: Math.random().toString(36).substring(2, 9),
          status: 'pending',
          isRead: false,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
        }));
      },

      addSentInvitation: (data) => {
        const newSent: SentInvitation = {
          ...data,
          id: Math.random().toString(36).substring(2, 9),
          status: 'pending',
          sentAt: new Date().toISOString(),
        };
        set((state) => ({
          sentInvitations: [newSent, ...state.sentInvitations],
        }));
      },

      updateSentInvitationStatus: (teamCode, toUserNickname, status) => {
        set((state) => ({
          sentInvitations: state.sentInvitations.map((si) =>
            si.teamCode === teamCode && si.toUserNickname === toUserNickname
              ? { ...si, status }
              : si
          ),
        }));
      },

      acceptInvitation: (id) => {
        const notification = get().notifications.find(n => n.id === id);
        if (notification && notification.type === 'invitation') {
          const team = useTeamStore.getState().teams.find((item) => item.teamCode === notification.teamCode);
          // 1. 유저 스토어에 팀 코드 추가
          useUserStore.getState().addTeamCode(notification.teamCode);
          if (team) {
            useTeamStore.getState().updateTeam(notification.teamCode, {
              memberCount: Math.min(Math.max(team.memberCount + 1, 1), team.maxTeamSize),
            });
          }
          
          // 2. 수신 알림 상태 업데이트
          set((state) => ({
            notifications: state.notifications.map((n) =>
              n.id === id ? { ...n, status: 'accepted', isRead: true } : n
            ),
          }));

          // 3. (시뮬레이션) 발신자 사이드 상태 업데이트
          // 현재 유저가 수락하면, 보낸 팀(teamCode)의 기록도 수락됨으로 변경
          get().updateSentInvitationStatus(notification.teamCode, useUserStore.getState().currentUser?.nickname || '', 'accepted');
        }
      },

      cancelAcceptance: (id) => {
        const notification = get().notifications.find(n => n.id === id);
        if (notification && notification.type === 'invitation') {
          // 1. 유저 스토어에서 팀 코드 제거
          const team = useTeamStore.getState().teams.find((item) => item.teamCode === notification.teamCode);
          useUserStore.getState().removeTeamCode(notification.teamCode);
          if (team) {
            useTeamStore.getState().updateTeam(notification.teamCode, {
              memberCount: Math.max(team.memberCount - 1, 1),
            });
          }
          
          // 2. 수신 알림 상태를 다시 배정 대기 중(pending)으로 변경
          set((state) => ({
            notifications: state.notifications.map((n) =>
              n.id === id ? { ...n, status: 'pending', isRead: false } : n
            ),
          }));

          // 3. (시뮬레이션) 발신자 사이드 상태 변경
          get().updateSentInvitationStatus(notification.teamCode, useUserStore.getState().currentUser?.nickname || '', 'pending');
        }
      },

      declineInvitation: (id) => {
        const notification = get().notifications.find(n => n.id === id);
        if (notification) {
          set((state) => ({
            notifications: state.notifications.map((n) =>
              n.id === id ? { ...n, status: 'declined', isRead: true } : n
            ),
          }));

          // (시뮬레이션) 발신자 사이드 상태 업데이트
          get().updateSentInvitationStatus(notification.teamCode, useUserStore.getState().currentUser?.nickname || '', 'declined');
        }
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        }));
      },
    }),
    {
      name: 'notification-storage',
    }
  )
);
