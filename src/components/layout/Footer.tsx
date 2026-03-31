'use client';

import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { initializeStore } from "@/store/initializer";

export default function Footer() {
  const { toast } = useToast();

  const handleResetData = () => {
    localStorage.clear();
    initializeStore();
    window.location.reload();
    toast({ title: "데이터가 초기화되었습니다." });
  };

  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-center py-8 text-center">
        <p className="text-sm text-muted-foreground">MAXER 해커톤 플랫폼</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          © 2026 MAXER. 이 서비스는 해커톤 과제로 제작된 데모입니다.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="link" className="mt-4 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">데이터 초기화</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>모든 데이터를 초기화하시겠습니까?</AlertDialogTitle>
              <AlertDialogDescription>
                모든 해커톤, 팀, 랭킹, 제출 데이터가 초기 시드 데이터로 리셋됩니다. 이 작업은 되돌릴 수 없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction onClick={handleResetData}>초기화</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </footer>
  );
}
