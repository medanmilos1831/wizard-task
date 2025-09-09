import { Button } from "antd";
import styles from "./Modal.module.css";

interface ResetWarningProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const ResetWarning = ({ onConfirm, onCancel }: ResetWarningProps) => {
  return (
    <>
      <div className={styles.modalHeader}>Reset Wizard</div>

      <div className={styles.modalBody}>
        <div className={styles.dangerCard}>
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <div className={styles.dangerIcon}>🔄</div>
            <div style={{ flex: 1 }}>
              <h4 className={styles.dangerTitle}>Reset Warning</h4>
              <p className={styles.dangerText}>
                Resetting the wizard will clear all your progress and data will
                be lost.
              </p>
            </div>
          </div>
        </div>

        <p className={styles.confirmationText}>
          Are you sure you want to reset the entire wizard? This action cannot
          be undone.
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
          className={`${styles.modalButton} ${styles.modalButtonDanger}`}
          onClick={onConfirm}
        >
          Reset Wizard
        </Button>
      </div>
    </>
  );
};
