import Link from 'next/link';
import { getLatestArticles } from '@/lib/cms-client';
import ArticleCard from '@/components/cards/ArticleCard';

export const metadata = {
  title: 'Ao vivo',
  description: 'Placares e cobertura ao vivo do esporte brasileiro',
};

export default async function AoVivoPage() {
  const articles = await getLatestArticles(12);

  return (
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        <header className="border-b-4 border-primary pb-3">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Tempo real
          </p>
          <h1 className="mt-1 font-display text-4xl uppercase tracking-wide text-secondary md:text-5xl">
            Ao vivo
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Placares, lances e atualizações do esporte brasileiro.
          </p>
        </header>

        <section
          aria-label="Placar"
          className="overflow-x-auto rounded-lg bg-[#0B3D2E] text-white"
        >
          <div className="flex min-w-max divide-x divide-white/10">
            {[
              { label: 'BRA x ARG', home: '2', away: '1', status: 'AO VIVO' },
              { label: 'FLA x PAL', home: '0', away: '0', status: "67'" },
              { label: 'COR x SAO', home: '1', away: '2', status: 'FT' },
            ].map((s) => (
              <div key={s.label} className="px-5 py-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-accent">
                  {s.status}
                </p>
                <p className="mt-1 text-sm font-semibold">{s.label}</p>
                <p className="font-display text-3xl tabular-nums">
                  {s.home} – {s.away}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-end justify-between">
            <h2 className="font-display text-2xl uppercase tracking-wide text-secondary">
              Últimas
            </h2>
            <Link
              href="/categoria/esportes"
              className="text-xs font-semibold uppercase text-primary hover:underline"
            >
              Ver esportes
            </Link>
          </div>
          <div className="divide-y divide-black/10 rounded border border-black/10 bg-white">
            {articles.map((article) => (
              <div key={article.id} className="px-3">
                <ArticleCard article={article} variant="horizontal" />
              </div>
            ))}
          </div>
        </section>
      </div>
  );
}
