import styles from "./answerButton.module.css";
const AnswerButton = ({
  label,
  onClick,
  isActive = false,
  disabled = false,
}: {
  label: string;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
}) => {
  return (
    <div
      className={`${styles.answerButton} ${
        isActive ? styles.active : styles.inactive
      } ${disabled ? styles.disabled : ""}`}
      onClick={disabled ? undefined : onClick}
      style={{ cursor: disabled ? "not-allowed" : "pointer" }}
    >
      {label}
    </div>
  );
};

export { AnswerButton };
