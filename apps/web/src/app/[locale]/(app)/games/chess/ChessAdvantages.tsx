import type { ChessMessages } from '@/shared/i18n/messages/games/chess';

type Advantages = NonNullable<
  ChessMessages['chess_v1']['landing']['advantages']
>;

interface Props {
  advantages: Advantages;
}

const ICONS: Record<string, string> = {
  engine: '🧠',
  bots: '🤖',
  variants: '🎲',
  friction: '⚡',
  puzzles: '🧩',
  analysis: '📊',
  tablebases: '📚',
  broadcast: '👁️',
  training: '🎓',
  cosmetics: '🎨',
  battlepass: '🏆',
  anticheat: '🛡️',
};

export function ChessAdvantages({ advantages }: Props) {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)] mb-2">
          {advantages.kicker}
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-12">
          {advantages.title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.items.map((item) => (
            <article
              key={item.key}
              className="glass-card rounded-xl p-6 border border-white/5 hover:border-[var(--accent)]/40 transition-all duration-200 hover:translate-y-[-2px]"
            >
              <div className="text-3xl mb-3">{ICONS[item.key] ?? '✦'}</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-white/70 leading-relaxed">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
