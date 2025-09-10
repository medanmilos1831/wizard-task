import { Button } from "antd";
import styles from "./Modal.module.css";

/**
 * Props for the WarningModal component
 */
interface WarningModalProps {
  /** Callback function called when user confirms the action */
  onConfirm: () => void;
  /** Callback function called when user cancels the action */
  onCancel: () => void;
}

/**
 * Modal component that displays a warning message about selecting the same option
 * Used when user tries to select an account type they've already selected
 * 
 * @param props - Component props
 * @returns JSX element representing the warning modal
 */
export const WarningModal = ({ onConfirm, onCancel }: WarningModalProps) => {
  return (
    <>
      <div className={styles.modalHeader}>Selection Warning</div>

      <div className={styles.modalBody}>
        <div className={styles.warningCard}>
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <div className={styles.warningIcon}>⚠️</div>
            <div style={{ flex: 1 }}>
              <h4 className={styles.warningTitle}>Same Selection</h4>
              <p className={styles.warningText}>
                You have already selected this option. Please choose a different
                account type to continue.
              </p>
            </div>
          </div>
        </div>

        <p className={styles.confirmationText}>
          Would you like to continue with a different selection?
        </p>
      </div>

      <div className={styles.modalFooter}>
        <Button
          className={`${styles.modalButton} ${styles.modalButtonSecondary}`}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          className={`${styles.modalButton} ${styles.modalButtonPrimary}`}
          onClick={onConfirm}
        >
          Continue
        </Button>
      </div>
    </>
  );
};
