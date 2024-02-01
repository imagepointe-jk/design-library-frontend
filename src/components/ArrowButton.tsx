import styles from "./styles/NodeScrollView.module.css";

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
      className={`${styles["arrow-button"]} ${className}`}
      onClick={onClick}
    >
      <i className={`fa-solid fa-chevron-${direction}`}></i>
    </button>
  );
}
