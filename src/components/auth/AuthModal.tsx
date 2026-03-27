'use client';

import { useState } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, LogIn } from 'lucide-react';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [nickname, setNickname] = useState('강유진');
  const [email, setEmail] = useState('');
  const { register, login } = useUserStore();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedNickname = nickname.trim();
    if (!trimmedNickname) {
      toast({ title: '닉네임을 입력해주세요.', variant: 'destructive' });
      return;
    }
    if (trimmedNickname.length < 2 || trimmedNickname.length > 12) {
      toast({ title: '닉네임은 2~12자로 입력해주세요.', variant: 'destructive' });
      return;
    }

    if (mode === 'register') {
      const trimmedEmail = email.trim();
      if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        toast({ title: '올바른 이메일을 입력해주세요.', variant: 'destructive' });
        return;
      }
      register(trimmedNickname, trimmedEmail);
      toast({ title: `환영합니다, ${trimmedNickname}님!`, description: '프로필 설정에서 선호 유형과 스킬을 등록해보세요.' });
    } else {
      login(trimmedNickname);
      toast({ title: `다시 만나서 반갑습니다, ${trimmedNickname}님!` });
    }

    setNickname('');
    setEmail('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {mode === 'register' ? '회원가입' : '로그인'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'register'
              ? 'DAKER에서 해커톤에 참여하려면 간단히 가입하세요.'
              : '닉네임으로 간편하게 로그인하세요.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="nickname">닉네임</Label>
            <Input
              id="nickname"
              placeholder="2~12자 닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={12}
              autoFocus
            />
          </div>

          {mode === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}

          <Button type="submit" className="w-full">
            {mode === 'register' ? (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                가입하기
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                로그인
              </>
            )}
          </Button>
        </form>

        <div className="text-center pt-2">
          {mode === 'register' ? (
            <p className="text-sm text-muted-foreground">
              이미 계정이 있나요?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-primary font-medium hover:underline"
              >
                로그인
              </button>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              처음이신가요?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-primary font-medium hover:underline"
              >
                회원가입
              </button>
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
