# React Redux Toolkit TypeScript Guide

## Typing Custom Hooks with Thunk Actions

This guide provides a comprehensive walkthrough for typing custom React hooks that utilize thunk actions in a Redux Toolkit and TypeScript setup. It addresses common issues with type safety when dispatching thunk actions and offers a solution to ensure a seamless development experience.

### Introduction

When integrating Redux Toolkit with TypeScript in a React project, developers often face challenges in maintaining type safety, especially when dispatching thunk actions. This README outlines a strategy for typing custom hooks that use thunks, ensuring that type safety is preserved throughout the application.

### Step 1: Define the Thunk Type

Firstly, it's crucial to define a type for the thunk parameter. This type should accurately represent a thunk action, which is a function that accepts specific arguments and returns a Redux action.

```typescript
import { AsyncThunkAction } from "@reduxjs/toolkit";

type ThunkFunction<T> = (arg: T) => AsyncThunkAction<any, T, {}>;
```

### Step 2: Apply the Thunk Type

Next, apply the defined type to the custom hook. This involves making the hook generic, allowing it to accept different types of thunk actions.

```typescript
import { SerializedError, AsyncThunkAction } from "@reduxjs/toolkit";
import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { AddPrompt, Prompt } from "../types/prompt";
import { AppDispatch } from "../index";

interface ActualEventsModel {
  onSuccess: () => void;
  onError: () => void;
  onFinally: () => void;
}

interface EventsModel {
  onSuccess?: () => void;
  onError?: () => void;
  onFinally?: () => void;
}

type ThunkArgs = Prompt | AddPrompt | null;
type ThunkFunction<T> = (arg: T) => AsyncThunkAction<any, T, {}>;

export const useThunk = <T extends ThunkArgs>(
  thunk: ThunkFunction<T>
): [
  (arg: T, events?: EventsModel) => void,
  boolean,
  Error | boolean | null
] => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<SerializedError | boolean | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const runThunk = useCallback(
    (arg: T, events: EventsModel = {}) => {
      // Events model
      const actualEvents: ActualEventsModel = {
        onSuccess: () => {},
        onError: () => {},
        onFinally: () => {}
      };

      // Update events
      const doEvent = { ...actualEvents, ...events };

      setIsLoading(true);
      setError(null);
      dispatch(thunk(arg))
        .unwrap()
        .then(() => {
          setError(false);
          doEvent.onSuccess();
        })
        .catch((err: SerializedError) => {
          setError(err);
          doEvent.onError();
        })
        .finally(() => {
          setIsLoading(false);
          doEvent.onFinally();
        });
    },
    [dispatch, thunk]
  );

  return [runThunk, isLoading, error];
};
```

### Conclusion

This guide demonstrates how to maintain type safety in a Redux Toolkit and TypeScript setup, specifically within custom hooks that dispatch thunk actions. By defining and applying appropriate types, developers can ensure that their applications are robust, maintainable, and free from type-related errors.
