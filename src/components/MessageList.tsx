import React from "react";
import FeedbackComponent from "./feedbackComponent";
import { type Message } from "~/interfaces/message";
import MessageComponent from "./MessageComponent";

type Prop = {
  messages: Message[];
};

const MessageList = ({ messages }: Prop) => {
  return (
    <div>
      {messages.map( (message, idx) => (
        <MessageComponent  message={message} key={idx}>
          <FeedbackComponent chat={messages}/>
        </MessageComponent>
      ))}
    </div>
  );
};

export default MessageList;
