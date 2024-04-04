import { Container } from "react-bootstrap";
import AddPrompt from "../components/AddPrompt";
import ManagePrompts from "../components/ManagePrompts";
import "./Home.css";

const Home = () => {
  return (
    <div className="Home">
      <Container>
        <AddPrompt />
        <ManagePrompts />
      </Container>
    </div>
  );
};

export default Home;
