export interface AddPromptType {
  title: string;
  prompt: string;
}

export interface PromptType extends AddPromptType {
  id: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface PromptInStateType extends PromptType {
  expanded?: boolean;
}
