// Defines an enum with the same values as the OpenAI API
// https://platform.openai.com/docs/guides/gpt/chat-completions-api
export enum Role {
  System = "system",
  User = "user",
  Assistant = "assistant",
}

export interface Message {
  role: Role;
  content: string;
}

export default Message;
