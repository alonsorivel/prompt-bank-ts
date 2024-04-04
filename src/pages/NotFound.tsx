import { Container } from "react-bootstrap";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="NotFound">
      <Container className="d-flex align-items-center justify-content-center vh-100">
        <h1 className="text-center">404 Page does not exist</h1>
      </Container>
    </div>
  );
};

export default NotFound;
