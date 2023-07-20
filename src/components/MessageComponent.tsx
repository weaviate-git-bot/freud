import React from "react";
import Image from "next/image";
import { type Message, Role } from "~/interfaces/message";
import { colors } from "~/stitches/colors";
import SourceList from "./FreudSource/SourceList";

type Prop = {
  message: Message;
  children: React.ReactNode;
};

const AVATAR_IMAGE_SIZE = 50;

const MessageComponent = ({ message, children }: Prop) => {
  return (
    <div className="container border-b-2 border-gray900 py-10">
      {message.role === Role.User ? (
        <div className="flex items-start space-x-4">
          <Image
            className="mt-3"
            src="/chatter_avatar_2.png"
            alt="This is text"
            width={AVATAR_IMAGE_SIZE}
            height={AVATAR_IMAGE_SIZE}
          />
          <p className="pt-5">{message.content}</p>
        </div>
      ) : (
        <div>
          <div className="relative">
            <Image
              className="float-left mr-4"
              src="/sigmund_freud_avatar.png"
              alt="This is text"
              width={AVATAR_IMAGE_SIZE}
              height={AVATAR_IMAGE_SIZE}
            />
            {children}
            <p color={colors.beige400}>{message.content}</p>
          </div>
          <SourceList sources={message.sources} />
        </div>
      )}
    </div>
  );
};

export default MessageComponent;
