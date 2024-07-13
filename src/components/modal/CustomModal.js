import React, { useEffect } from "react";
import { Modal } from "react-responsive-modal";

const CustomModal = ({
  open,
  onCloseModal,
  showCloseIcon = false,
  children,
}) => {
  useEffect(() => {
    // Add the disable-scroll class to the body when the modal is open
    if (open) {
      document.body.classList.add("disable-scroll");
    } else {
      document.body.classList.remove("disable-scroll");
    }

    // Clean up the class when the component unmounts
    return () => {
      document.body.classList.remove("disable-scroll");
    };
  }, [open]);
  return (
    <Modal
      open={open}
      onClose={onCloseModal}
      showCloseIcon={showCloseIcon}
      center
      closeOnOverlayClick={false}
      styles={{
        modal: {
          width: "98%",
          margin: "0",
          paddingLeft: "5px",
          paddingRight: "5px",
          borderRadius: "4px",
          /* Remove overflow style */
        },
        overlay: {
          background: "rgba(0, 0, 0, 0.5)",
          pointerEvents: "none",
        },
      }}
    >
      {children}
    </Modal>
  );
};

export default CustomModal;
