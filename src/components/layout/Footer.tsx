'use client';

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

  const handleResetData = () => {
    localStorage.clear();
    initializeStore();
    window.location.reload();
  };
  
  return (
    <footer className="border-t bg-white">
      <div className="container flex flex-col items-center justify-center py-8 text-center">
        <p className="text-sm text-slate-500">DAKER 해커톤 플랫폼</p>
        <p className="mt-1 text-xs text-slate-400">
          © 2026 DAKER. 이 서비스는 해커톤 과제로 제작된 데모입니다.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="link" className="mt-4 text-xs text-slate-400 hover:text-slate-600">데이터 초기화</Button>
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
              <AlertDialogAction onClick={handleResetData} className="bg-indigo-600 hover:bg-indigo-700">초기화</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </footer>
  );
}
