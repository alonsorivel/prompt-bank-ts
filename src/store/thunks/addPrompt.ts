import { createAsyncThunk, nanoid } from "@reduxjs/toolkit";
import { AddPromptType, PromptType } from "../types/prompt";
import axios from "axios";

const addPrompt = createAsyncThunk(
  "prompts/add",
  async (item: AddPromptType): Promise<PromptType> => {
    const payload: PromptType = {
      id: nanoid(13),
      title: item.title,
      prompt: item.prompt,
      createdAt: Date.now()
    };

    const { data } = await axios.post("http://localhost:3005/prompts", payload);

    // await pause(1000);

    return data;
  }
);

// // DEV ONLY!!!
// const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export { addPrompt };
