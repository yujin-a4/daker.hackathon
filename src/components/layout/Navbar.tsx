'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Dna, Sun, Moon, LogIn, Megaphone } from 'lucide-react'; // Megaphone 아이콘 추가

import { useUserStore } from '@/store/useUserStore';
import { useThemeStore } from '@/store/useThemeStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import AuthModal from '@/components/auth/AuthModal';
import UserDropdown from '@/components/auth/UserDropdown';

const navLinks = [
  { href: '/hackathons', label: '해커톤' },
  { href: '/camp', label: '팀 찾기' },
  { href: '/rankings', label: '랭킹' },
  { href: '/mypage', label: '마이페이지' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser } = useUserStore();
  const { theme, setTheme } = useThemeStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(true); // 배너 표시 상태 추가

  useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      {/* 마감 임박 공지 배너 (시니어의 센스 한 스푼 🥄) */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0, overflow: 'hidden' }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-purple-600 w-full"
          >
            <div className="container mx-auto flex h-10 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex-1 flex items-center justify-center space-x-2 text-white text-xs sm:text-sm font-medium">
                <Megaphone className="h-4 w-4 animate-pulse" />
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] sm:text-xs font-bold backdrop-blur-sm border border-white/30">
                  마감임박
                </span>
                <span className="truncate">
                  🚨 긴급 인수인계 해커톤 제출 마감 <span className="font-bold text-yellow-300">D-3</span>! 늦기 전에 결과물을 제출하세요!
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-white hover:bg-white/20 hover:text-white rounded-full transition-colors shrink-0 ml-2"
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
          {/* 로고 */}
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Dna className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl text-primary">DAKER</span>
          </Link>

          {/* 데스크탑 내비게이션 */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
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

          {/* 우측 영역 */}
          <div className="flex flex-1 items-center justify-end space-x-2">
            {/* 다크모드 토글 */}
            {mounted && (
              <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
            )}

            {/* 로그인 상태에 따라 분기 */}
            {mounted && (
              currentUser ? (
                <UserDropdown />
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

            {/* 모바일 메뉴 버튼 */}
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

      {/* 모바일 사이드 메뉴 */}
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
                  <Dna className="h-6 w-6 text-primary" />
                  <span className="font-bold text-xl text-primary">DAKER</span>
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

              {/* 모바일 로그인/유저 영역 */}
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

      {/* 인증 모달 */}
      <AuthModal open={isAuthOpen} onOpenChange={setIsAuthOpen} />
    </>
  );
}
