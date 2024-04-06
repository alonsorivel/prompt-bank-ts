import { useState } from "react";
import { Badge, Card, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  useThunk,
  removePrompt,
  setExpandedPrompt,
  ThunkFunction
} from "../store";
import UpdatePrompt from "./UpdatePrompt";
import { PromptInStateType, PromptType } from "../store/types/prompt";
import ErrorModal from "./modals/ErrorModal";
import { format } from "date-fns/format";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faChevronDown,
  faChevronUp
} from "@fortawesome/free-solid-svg-icons";
import "./PromptItem.css";

interface PromptItemProps {
  prompt: PromptInStateType;
  last: boolean;
}

const unixToDateTime = (ms: number) => {
  return format(new Date(ms), "MMM do, yyyy HH:mm:ss");
};

const PromptItem = ({ prompt, last }: PromptItemProps) => {
  const dispatch = useDispatch();

  const [isUpdating, setIsUpdating] = useState(false);

  // Type assertion:
  // useThunk knows thunk may or may not take an argument.
  // TypeScript alerts when thunk takes an argument.
  const [doRemovePrompt, isLoading, error] = useThunk(
    removePrompt as ThunkFunction<PromptType>
  );

  const isExpanded = prompt.expanded ? prompt.expanded : false;

  const handleRemove = () => {
    doRemovePrompt(prompt);
  };

  const handleExpand = () => {
    dispatch(setExpandedPrompt({ ...prompt, expanded: !isExpanded }));
  };

  const ExpandButton = () => {
    return (
      <Button
        className="float-end"
        variant="light"
        size="sm"
        onClick={handleExpand}
      >
        <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
      </Button>
    );
  };

  return (
    <div className="PromptItem">
      {!isUpdating && (
        <Card className={!last ? "mb-2" : ""}>
          <Card.Header as="h5">
            {prompt.title} <ExpandButton />
          </Card.Header>
          {isExpanded && (
            <>
              <Card.Body>
                <div className="text-wrap">{prompt.prompt}</div>
                {!prompt.updatedAt && prompt.createdAt && (
                  <Badge className="mt-3" pill bg="secondary" text="light">
                    Created on {unixToDateTime(prompt.createdAt)}
                  </Badge>
                )}
                {prompt.updatedAt && (
                  <Badge className="mt-3" pill bg="secondary" text="light">
                    Updated on {unixToDateTime(prompt.updatedAt)}
                  </Badge>
                )}
              </Card.Body>
              <Card.Footer>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={isLoading}
                  onClick={() => setIsUpdating(true)}
                >
                  Update prompt
                </Button>
                <Button
                  className="float-end"
                  variant="danger"
                  size="sm"
                  onClick={handleRemove}
                  disabled={isLoading}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </Card.Footer>
            </>
          )}
        </Card>
      )}
      {isUpdating && (
        <UpdatePrompt prompt={prompt} handleCancel={setIsUpdating} />
      )}
      {error && typeof error !== "boolean" && (
        <ErrorModal title="Error Removing Prompt" message={error.message} />
      )}
    </div>
  );
};

export default PromptItem;
