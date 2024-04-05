import { createAsyncThunk } from "@reduxjs/toolkit";
import { AddPromptType, PromptType } from "../types/prompt";
import axios from "axios";

type ThunkArg = PromptType | AddPromptType | null;

const fetchPrompts = createAsyncThunk(
  "prompts/fetch",
  async (arg: ThunkArg): Promise<PromptType[]> => {
    const response = await axios.get("http://localhost:3005/prompts");

    console.log(arg);

    // await pause(1000);

    return response.data.sort(
      (a: PromptType, b: PromptType) => (b.createdAt || 0) - (a.createdAt || 0)
    );
  }
);

// // DEV ONLY!!!
// const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export { fetchPrompts };
