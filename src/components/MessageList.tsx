import React from "react";
import { type Message } from "~/interfaces/message";
import FeedbackButtons from "./FeedbackButtons";
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
          <FeedbackButtons chat={messages} />
          <CopyButton message={message} />
        </MessageComponent>
      ))}
    </div>
  );
};

export default MessageList;
