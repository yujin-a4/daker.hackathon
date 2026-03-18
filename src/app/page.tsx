import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 text-center bg-background">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-6xl font-headline">
          VibeHack에 오신 것을 환영합니다.
        </h1>
        <p className="text-lg text-muted-foreground">
          새로운 세대의 해커톤 플랫폼.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
                <Link href="/hackathons">해커톤 둘러보기</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
                <Link href="/camp">팀 캠프 가기</Link>
            </Button>
        </div>
      </div>
    </main>
  );
}
