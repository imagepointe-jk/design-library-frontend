import styles from "./styles/ArrowButton.module.css";

type ArrowButtonProps = {
  direction: "left" | "right";
  onClick: () => void;
  className?: string;
  disabled?: boolean;
};

export function ArrowButton({
  direction,
  onClick,
  className,
  disabled,
}: ArrowButtonProps) {
  return (
    <button
      disabled={disabled}
      className={`${styles["main"]} ${className}`}
      onClick={onClick}
    >
      <i className={`fa-solid fa-chevron-${direction}`}></i>
    </button>
  );
}
