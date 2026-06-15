export const TechIcon = ({
  slug,
  className = "w-4 h-4",
}: {
  slug: string;
  className?: string;
}) => {
  // Simple Icons CDN dynamically fetches the SVG based on the slug
  return (
    <img
      src={`https://cdn.simpleicons.org/${slug}`}
      alt={slug}
      loading="lazy"
      className={`${className} opacity-80 dark:invert`}
    />
  );
};
