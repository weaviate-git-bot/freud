import React from "react";
import { type Message } from "~/interfaces/message";
import FeedbackComponent from "./FeedbackComponent";
import MessageComponent from "./MessageComponent";
import CopyButton from "./CopyButton";

type Prop = {
  messages: Message[];
};

const MessageList = ({ messages }: Prop) => {
  return (
    <div>
      {messages.map((message, idx) => (
        <MessageComponent message={message} key={idx}>
          <FeedbackComponent chat={messages} />
          <CopyButton message={message}></CopyButton>
        </MessageComponent>
      ))}
    </div>
  );
};

export default MessageList;
