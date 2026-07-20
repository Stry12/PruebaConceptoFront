import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: 1 | 2 | 3 | 4 | 5 | null;
  readonly?: boolean;
}

export function RatingStars({ rating, readonly = true }: RatingStarsProps) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div
      role="img"
      aria-label={rating ? `Valoración: ${rating} de 5` : 'Sin valoración'}
      className="inline-flex items-center gap-0.5"
    >
      {stars.map((star) => (
        <Star
          key={star}
          size={16}
          style={{
            color: rating && star <= rating ? 'var(--color-accent)' : 'var(--color-neutral-300)',
            fill: rating && star <= rating ? 'var(--color-accent)' : 'none',
          }}
        />
      ))}
    </div>
  );
}
