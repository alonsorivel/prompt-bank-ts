import { useState } from "react";
import { Modal, Button } from "react-bootstrap";

interface ModalProps {
  title: string;
  message: string;
}

function ErrorModal({ title, message }: ModalProps) {
  const [show, setShow] = useState(true); // Initially show the modal

  const handleClose = () => setShow(false);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ErrorModal;
