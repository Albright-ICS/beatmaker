import dynamic from 'next/dynamic';

const BeatMakerApp = dynamic(() => import('../components/BeatMakerApp').then((m) => m.BeatMakerApp), {
  ssr: false
});

export default function Page() {
  return (
    <main className="min-h-screen">
      <BeatMakerApp />
    </main>
  );
}
