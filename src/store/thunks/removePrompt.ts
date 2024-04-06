import { createAsyncThunk } from "@reduxjs/toolkit";
import { PromptType } from "../types/prompt";
import axios from "axios";

const removePrompt = createAsyncThunk(
  "prompts/remove",
  async (item: PromptType): Promise<PromptType> => {
    await axios.delete(`http://localhost:3005/prompts/${item.id}`);

    //   await pause(1000);

    return item;
  }
);

// // DEV ONLY!!!
// const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export { removePrompt };
