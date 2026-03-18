type Props = {
  params: { slug: string };
};

export default function HackathonDetailPage({ params }: Props) {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold font-headline">해커톤 상세: {params.slug}</h1>
      <p className="mt-4 text-muted-foreground">준비 중입니다.</p>
    </div>
  );
}
