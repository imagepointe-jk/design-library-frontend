import styles from "./styles/ToggleSwitch.module.css";

type ToggleSwitchOption = {
  label: string;
  id: string;
};

type ToggleSwitchProps = {
  className?: string;
  option1: ToggleSwitchOption;
  option2: ToggleSwitchOption;
  name: string;
  stacked: boolean;
  checked: "one" | "two";
  onClick: (clicked: "one" | "two") => void;
};

export function ToggleSwitch({
  className,
  option1,
  option2,
  name,
  stacked,
  checked,
  onClick,
}: ToggleSwitchProps) {
  const option1Checked = checked === "one";
  return (
    <div
      className={`${styles["main"]} ${stacked ? styles["stacked"] : ""} ${
        className || ""
      }`}
    >
      <input
        type="radio"
        name={name}
        id={option1.id}
        checked={option1Checked}
        onClick={() => onClick("one")}
      />
      <label htmlFor={option1.id}>{option1.label}</label>
      <input
        type="radio"
        name={name}
        id={option2.id}
        checked={!option1Checked}
        onClick={() => onClick("two")}
      />
      <label htmlFor={option2.id}>{option2.label}</label>
    </div>
  );
}
