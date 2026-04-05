'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Dna, Sun, Moon, LogIn, Megaphone, Trophy, Users } from 'lucide-react';

import { useUserStore } from '@/store/useUserStore';
import { useTeamStore } from '@/store/useTeamStore';
import { useHackathonStore } from '@/store/useHackathonStore';
import { useThemeStore } from '@/store/useThemeStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { isHackathonRecruiting } from '@/lib/hackathon-utils';

import AuthModal from '@/components/auth/AuthModal';
import UserDropdown from '@/components/auth/UserDropdown';
import NotificationCenter from './NotificationCenter';

const navLinks = [
  { href: '/hackathons', label: '해커톤' },
  { href: '/camp', label: '팀 빌딩' },
  { href: '/rankings', label: '랭킹' },
  { href: '/mypage', label: '마이페이지' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser } = useUserStore();
  const { teams } = useTeamStore();
  const { hackathons } = useHackathonStore();
  const { theme, setTheme } = useThemeStore();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [currentNoticeIndex, setCurrentNoticeIndex] = useState(0);

  // 🔥 유저 이름과 참가 중인 해커톤 제목 동적 할당 + 빈 상태 예외 처리
  const notices = useMemo(() => {
    const userName = currentUser ? currentUser.nickname : '참가자';
    const dynamicNotices: Array<{id: string, type: string, icon: any, bgClass: string, text: string}> = [];
    const now = new Date();
    
    // 유저가 속한 팀을 찾고, 그 팀이 참여 중인 해커톤의 마감일 공지를 유저가 참여 중인 *모든* 해커톤에 대해 생성
    if (currentUser && currentUser.teamCodes.length > 0) {
      // 중복 방지를 위해 slug set 수집
      const myActiveHackathons = Array.from(new Set(currentUser.teamCodes.map(code => {
        const team = teams.find(t => t.teamCode === code);
        return team ? team.hackathonSlug : null;
      }))).filter(Boolean);

      myActiveHackathons.forEach(slug => {
        const hackathon = hackathons.find(h => h.slug === slug && isHackathonRecruiting(h));
        if (hackathon) {
          const deadline = new Date(hackathon.period.submissionDeadlineAt);
          const diffMs = deadline.getTime() - now.getTime();
          let dDayText = '마감됨';
          
          if (diffMs > 0) {
            const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
            dDayText = diffDays === 0 ? 'D-Day' : `D-${diffDays}`;
          }

          dynamicNotices.push({
            id: `deadline-${hackathon.slug}`,
            type: '마감임박',
            icon: Megaphone,
            bgClass: 'bg-rose-500', 
            text: `🚨 <span class="font-bold text-yellow-300">${userName}</span>님이 참가 중인 [${hackathon.title}] 제출 마감이 <span class="font-bold text-yellow-300">${dDayText}</span> 남았습니다!`
          });
        }
      });
    }

    // 참가 중인 대회가 하나도 없으면 참여 유도 멘트
    if (dynamicNotices.length === 0) {
      dynamicNotices.push({
        id: 'no-participation',
        type: '해커톤모집',
        icon: Megaphone,
        bgClass: 'bg-rose-500', 
        text: `🔥 아직 참가 중인 해커톤이 없네요! 지금 바로 <span class="font-bold text-yellow-300">새로운 팀</span>에 합류해 보세요!`
      });
    }

    const openTeamCount = teams.filter(t => t.isOpen).length;
    
    dynamicNotices.push({
      id: 'ranking',
      type: '랭킹업데이트',
      icon: Trophy,
      bgClass: 'bg-blue-600', 
      text: `🏆 현재 <span class="font-bold text-yellow-300">${hackathons.filter(isHackathonRecruiting).length}개</span>의 해커톤이 모집 중입니다!`
    });

    dynamicNotices.push({
      id: 'recruitment',
      type: '팀원모집',
      icon: Users,
      bgClass: 'bg-emerald-600', 
      text: `🤝 현재 <span class="font-bold text-yellow-300">${openTeamCount}개 팀</span>이 팀원을 모집 중입니다! <span class="font-bold text-yellow-300">팀 빌딩</span> 탭에서 합류하세요.`
    });
    
    return dynamicNotices;
  }, [currentUser, teams, hackathons]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!showBanner || notices.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentNoticeIndex((prevIndex) => (prevIndex + 1) % notices.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [showBanner, notices.length]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const CurrentNotice = notices[currentNoticeIndex];
  const CurrentIcon = CurrentNotice.icon;

  return (
    <>
      <AnimatePresence>
        {mounted && showBanner && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0, overflow: 'hidden' }}
            transition={{ duration: 0.3 }}
            className={cn(
              "w-full overflow-hidden transition-colors duration-500",
              CurrentNotice.bgClass
            )}
          >
            <div className="container mx-auto flex h-10 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 relative">
              <div className="flex-1 h-full flex items-center justify-center relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={CurrentNotice.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="flex items-center space-x-2 text-white text-xs sm:text-sm font-medium absolute inset-0 justify-center"
                  >
                    <CurrentIcon className="h-4 w-4 shrink-0" />
                    <span className="rounded-full bg-white/25 px-2 py-0.5 text-[10px] sm:text-xs font-bold backdrop-blur-md border border-white/30 shrink-0 shadow-sm">
                      {CurrentNotice.type}
                    </span>
                    <span 
                      className="truncate"
                      dangerouslySetInnerHTML={{ __html: CurrentNotice.text }}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-white hover:bg-white/20 hover:text-white rounded-full transition-colors shrink-0 ml-2 relative z-10"
                onClick={() => setShowBanner(false)}
                aria-label="Close banner"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-7xl items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Dna className="h-6 w-6 text-[#6366F1]" />
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-[#6366F1] to-[#06B6D4]">
              MAXER
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-[15px] font-bold tracking-widest uppercase">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative text-muted-foreground transition-colors hover:text-primary',
                  pathname.startsWith(link.href) && 'text-primary'
                )}
              >
                {link.label}
                {pathname.startsWith(link.href) && (
                  <span className="absolute bottom-[-19px] left-0 w-full h-0.5 bg-primary" />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex flex-1 items-center justify-end space-x-2">
            {mounted && (
              <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
            )}

            {mounted && (
              currentUser ? (
                <div className="flex items-center space-x-2">
                  <NotificationCenter />
                  <UserDropdown />
                </div>
              ) : (
                <Button
                    variant="default"
                    size="sm"
                    onClick={() => setIsAuthOpen(true)}
                    className="hidden sm:inline-flex"
                >
                  <LogIn className="w-4 h-4 mr-1.5" />
                  로그인
                </Button>
              )
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ y: '-100%' }}
              animate={{ y: '0%' }}
              exit={{ y: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute top-0 left-0 w-full bg-background p-4 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <Link
                  href="/"
                  className="flex items-center space-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Dna className="h-6 w-6 text-[#6366F1]" />
                  <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-[#6366F1] to-[#06B6D4]">
                    MAXER
                  </span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                  <X className="h-6 w-6" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </div>

              <nav className="flex flex-col space-y-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      'text-lg font-medium text-foreground',
                      pathname.startsWith(link.href) && 'text-primary'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t">
                {currentUser ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{currentUser.nickname}</p>
                      {currentUser.email && (
                        <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        useUserStore.getState().logout();
                        setIsMenuOpen(false);
                      }}
                      className="text-red-500 border-red-500/30"
                    >
                      로그아웃
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsAuthOpen(true);
                    }}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    로그인 / 회원가입
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal open={isAuthOpen} onOpenChange={setIsAuthOpen} />
    </>
  );
}
