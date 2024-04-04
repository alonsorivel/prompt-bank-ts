import { configureStore } from "@reduxjs/toolkit";
import promptsReducer from "./slices/promptsSlice";

export const store = configureStore({
  reducer: {
    prompts: promptsReducer
  }
});

// Infer RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export reducers directly from the store
export { setExpandedPrompt } from "./slices/promptsSlice";

// Export thunks directly from the store
export * from "./hooks/useThunk";
export * from "./thunks/addPrompt";
export * from "./thunks/fetchPrompts";
export * from "./thunks/removePrompt";
export * from "./thunks/updatePrompt";
