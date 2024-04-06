import { AsyncThunkAction } from "@reduxjs/toolkit";
import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { AddPromptType, PromptType } from "../types/prompt";
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

interface Error {
  message: string;
}

type ThunkArg = AddPromptType | PromptType | void;
type ThunkReturn = PromptType | PromptType[];

export interface ThunkFunction<T> {
  (thunkArg?: T): AsyncThunkAction<ThunkReturn, T, object>;
}

export const useThunk = <T extends ThunkArg>(
  thunk: ThunkFunction<T>
): [
  (returnedArg?: T, events?: EventsModel) => void,
  boolean,
  Error | boolean | null
] => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | boolean | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const runThunk = useCallback(
    (arg?: T, events: EventsModel = {}) => {
      // Events model
      const actualEvents: ActualEventsModel = {
        onSuccess: () => {},
        onError: () => {},
        onFinally: () => {}
      };

      // Update events
      const doEvent = { ...actualEvents, ...events };

      // Check if thunk comes with arguments
      const checkedThunk = arg === undefined ? thunk() : thunk(arg);

      setIsLoading(true);
      setError(null);
      dispatch(checkedThunk)
        .unwrap()
        .then(() => {
          setError(false);
          doEvent.onSuccess();
        })
        .catch((err: Error) => {
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
