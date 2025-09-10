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
  let buttonClasses = styles.answerButton;
  
  if (disabled) {
    buttonClasses += ` ${styles.inactive}`;
  } else if (isActive) {
    buttonClasses += ` ${styles.active}`;
  }

  return (
    <button
      className={buttonClasses}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export { AnswerButton };
