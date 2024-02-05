type ImageWithFallbackProps = {
  className?: string;
  id?: string;
  src?: string;
  alt?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
};

export function ImageWithFallback({
  alt,
  src,
  className,
  id,
  onClick,
  style,
}: ImageWithFallbackProps) {
  return (
    <img
      className={className}
      id={id}
      alt={alt}
      src={src}
      onClick={onClick}
      style={style}
      onError={(e) => {
        (e.target as any).src = "https://placehold.co/300x300?text=Not+Found";
      }}
    />
  );
}
