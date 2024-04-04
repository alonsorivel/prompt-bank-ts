import { useState } from "react";
import { Button, Card, Form, Spinner } from "react-bootstrap";
import { useThunk, updatePrompt } from "../store";
import { PromptInStateType } from "../store/types/prompt";
import ErrorModal from "./modals/ErrorModal";

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

interface UpdatePromptProps {
  prompt: PromptInStateType;
  handleCancel: (arg: boolean) => void;
}

const UpdatePrompt = ({ prompt, handleCancel }: UpdatePromptProps) => {
  const initialFieldsState: FieldsState = {
    title: { value: prompt.title, isInvalid: false, error: "" },
    prompt: { value: prompt.prompt, isInvalid: false, error: "" }
  };

  const [fieldsState, setFieldsState] =
    useState<FieldsState>(initialFieldsState);
  const [doUpdatePrompt, isLoading, error] = useThunk(updatePrompt);

  const checkHandlers = (field: string, test: string) => {
    return validationHandlers[field]
      .map((fn) => fn(test))
      .reduce(
        (accumulator, currentValue) => {
          if (!currentValue.passed) return currentValue;

          return accumulator;
        },
        {
          passed: true
        }
      );
  };

  const isFormValid = () => {
    let isValid = false;

    // Check for changes
    for (const field in initialFieldsState) {
      if (fieldsState[field].value !== initialFieldsState[field].value) {
        isValid = true;
        break;
      }
    }

    // Do only if there's any change
    if (isValid) {
      for (const field in validationHandlers) {
        const { passed } = checkHandlers(field, fieldsState[field].value);

        if (!passed) {
          isValid = false;
          break;
        }
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
      doUpdatePrompt(
        {
          id: prompt.id,
          title: fieldsState.title.value,
          prompt: fieldsState.prompt.value
        },
        { onSuccess: () => handleCancel(false) }
      );
    }
  };

  return (
    <div className="UpdatePrompt">
      <Card className="mb-2">
        <Card.Header className="bg-warning text-white" as="h5">
          Update prompt
        </Card.Header>
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
            className="text-white"
            type="submit"
            variant="warning"
            size="sm"
            onClick={handleSubmit}
            disabled={isLoading || !isFormValid()}
          >
            Update prompt{" "}
            {isLoading && <Spinner animation="border" size="sm" />}
          </Button>
          <Button
            className="float-end"
            variant="link"
            size="sm"
            onClick={() => handleCancel(false)}
          >
            Cancel
          </Button>
        </Card.Footer>
      </Card>
      {error && typeof error !== "boolean" && (
        <ErrorModal title="Error Updating Prompt" message={error.message} />
      )}
    </div>
  );
};

export default UpdatePrompt;
