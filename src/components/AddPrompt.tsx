import { useState } from "react";
import { Button, Card, Container, Form, Spinner } from "react-bootstrap";
import { useThunk, addPrompt, ThunkFunction } from "../store";
import { AddPromptType } from "../store/types/prompt";
import ErrorModal from "./modals/ErrorModal";
import "./AddPrompt.css";

interface FieldState {
  value: string;
  isInvalid: boolean;
  error: string;
}

interface FieldsState {
  [key: string]: FieldState;
}

type HandlerReturn = { passed: boolean; msg?: string };
type Handler = (str: string) => HandlerReturn;

interface ValidationHandler {
  [key: string]: Handler[];
}

const initialFieldsState: FieldsState = {
  title: { value: "New prompt", isInvalid: false, error: "" },
  prompt: { value: "Do this, do that!", isInvalid: false, error: "" }
};

const validationHandlers: ValidationHandler = {
  title: [
    (str: string) =>
      str.length >= 3
        ? { passed: true }
        : { passed: false, msg: "Provide at least 3 characters for title" },
    (str: string) =>
      str.length <= 64
        ? { passed: true }
        : { passed: false, msg: "Provide at most 64 characters for title" }
  ],
  prompt: [
    (str: string) =>
      str.length >= 3
        ? { passed: true }
        : { passed: false, msg: "Provide at least 3 characters for prompt" },
    (str: string) =>
      str.length <= 256
        ? { passed: true }
        : { passed: false, msg: "Provide at most 256 characters for prompt" }
  ]
};

const AddPrompt = () => {
  const [fieldsState, setFieldsState] =
    useState<FieldsState>(initialFieldsState);

  // Type assertion:
  // useThunk knows thunk may or may not take an argument.
  // TypeScript alerts when thunk takes an argument.
  const [doAddPrompt, isLoading, error] = useThunk(
    addPrompt as ThunkFunction<AddPromptType>
  );

  const checkHandlers = (field: string, test: string) => {
    return validationHandlers[field]
      .map((fn: Handler) => fn(test))
      .reduce(
        (accumulator: HandlerReturn, currentValue: HandlerReturn) => {
          if (!currentValue.passed) return currentValue;

          return accumulator;
        },
        {
          passed: true
        }
      );
  };

  const isFormValid = () => {
    let isValid = true;

    for (const field in validationHandlers) {
      const { passed } = checkHandlers(field, fieldsState[field].value);

      if (!passed) {
        isValid = false;
        break;
      }
    }

    return isValid;
  };

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const el = event.target;

    const isValid = checkHandlers("title", el.value);

    setFieldsState({
      ...fieldsState,
      title: {
        value: el.value,
        isInvalid: !isValid.passed,
        error: isValid.msg ?? ""
      }
    });
  };

  const handlePrompt = (event: React.ChangeEvent<HTMLInputElement>) => {
    const el = event.target;

    const isValid = checkHandlers("prompt", el.value);

    setFieldsState({
      ...fieldsState,
      prompt: {
        value: el.value,
        isInvalid: !isValid.passed,
        error: isValid.msg ?? ""
      }
    });
  };

  const handleSubmit = async () => {
    if (isFormValid()) {
      const payload: AddPromptType = {
        title: fieldsState.title.value,
        prompt: fieldsState.prompt.value
      };

      doAddPrompt(payload);

      resetForm();
    }
  };

  const resetForm = () => {
    setFieldsState(initialFieldsState);
  };

  return (
    <div className="AddPrompt">
      <Container className="mt-3 pb-3">
        <Card>
          <Card.Header as="h5">Add new prompt</Card.Header>
          <Card.Body>
            <Form noValidate>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="title">Prompt title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter title"
                  id="title"
                  value={fieldsState.title.value}
                  onChange={handleTitle}
                  isInvalid={fieldsState.title.isInvalid}
                />
                <Form.Control.Feedback type="invalid">
                  {fieldsState.title.error}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Prompt</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter your prompt"
                  value={fieldsState.prompt.value}
                  onChange={handlePrompt}
                  isInvalid={fieldsState.prompt.isInvalid}
                />
                <Form.Control.Feedback type="invalid">
                  {fieldsState.prompt.error}
                </Form.Control.Feedback>
              </Form.Group>
            </Form>
          </Card.Body>
          <Card.Footer>
            <Button
              variant="primary"
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading || !isFormValid()}
            >
              Add prompt {isLoading && <Spinner animation="border" size="sm" />}
            </Button>
          </Card.Footer>
        </Card>
      </Container>
      {error && typeof error !== "boolean" && (
        <ErrorModal title="Error Adding Prompt" message={error.message} />
      )}
    </div>
  );
};

export default AddPrompt;
