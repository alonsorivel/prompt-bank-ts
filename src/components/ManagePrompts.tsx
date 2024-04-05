import { useEffect } from "react";
import { Alert, Card, Container, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useThunk, RootState, fetchPrompts } from "../store";
import { PromptType } from "../store/types/prompt";
import PromptItem from "./PromptItem";
import "./ManagePrompts.css";

const ManagePrompts = () => {
  const [doFetchPrompts, isLoading, error] = useThunk(fetchPrompts);
  const { data } = useSelector((state: RootState) => state.prompts);

  useEffect(() => {
    doFetchPrompts();
  }, [doFetchPrompts]);

  return (
    <div className="ManagePrompts">
      {isLoading && (
        <Container>
          <Spinner animation="grow" size="sm" /> Loading prompts...
        </Container>
      )}
      {error && (
        <Container>
          <Alert variant="danger">
            {error &&
              typeof error !== "boolean" &&
              `${error.message} while fetching prompts...`}
          </Alert>
        </Container>
      )}
      {data.length > 0 && (
        <Container>
          <Card>
            <Card.Header as="h5">Prompts list</Card.Header>
            <Card.Body className="mn-100 overflow-auto">
              {data.map((prompt: PromptType, i: number) => (
                <PromptItem
                  key={i}
                  prompt={prompt}
                  last={data.length === i + 1}
                />
              ))}
            </Card.Body>
          </Card>
        </Container>
      )}
    </div>
  );
};

export default ManagePrompts;
