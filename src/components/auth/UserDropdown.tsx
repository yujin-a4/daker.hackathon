'use client';

import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/useUserStore';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut, Trophy } from 'lucide-react';

export default function UserDropdown() {
  const currentUser = useUserStore((s) => s.currentUser);
  const { toast } = useToast();
  const router = useRouter();

  if (!currentUser) return null;

  const getInitials = (name: string) => (name ? name.charAt(0).toUpperCase() : '?');

  const handleLogout = () => {
    useUserStore.getState().logout();
    toast({ title: '로그아웃 되었습니다.' });
    router.push('/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full p-1 pr-3 hover:bg-accent transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
              {getInitials(currentUser.nickname)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-foreground hidden sm:inline">
            {currentUser.nickname}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-3 py-2">
          <p className="text-sm font-medium">{currentUser.nickname}</p>
          {currentUser.email && (
            <p className="text-xs text-muted-foreground">{currentUser.email}</p>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/mypage')}>
          <User className="w-4 h-4 mr-2" />
          마이페이지
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/mypage/profile')}>
          <Settings className="w-4 h-4 mr-2" />
          프로필 설정
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/rankings')}>
          <Trophy className="w-4 h-4 mr-2" />
          랭킹
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
          <LogOut className="w-4 h-4 mr-2" />
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
