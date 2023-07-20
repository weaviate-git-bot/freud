/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState } from "react";
import { Button } from "./ui/button/Button";
import { Icon, IconName } from "./ui/icon/Icon";
import { Message } from "~/interfaces/message";

type Prop = {
  message: Message;
};

const CopyButton = ({ message }: Prop) => {
  const [buttonIcon, setButtonIcon] = useState("copy"); // Either copy, checkmarkSolid, or printer
  const [timeoutId, setTimeoutId] = useState<Timeout>(null);

  const copyToClipboard = async (): Promise<boolean> => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(message.content);
        return true;
      } else {
        let copySuccess = true;
        const textarea = document.createElement("textarea");
        textarea.textContent = message.content;
        textarea.style.position = "fixed";
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand("copy");
        } catch (error) {
          console.warn("Copy to clipboard failed:", error);
          copySuccess = false;
        } finally {
          document.body.removeChild(textarea);
          return copySuccess;
        }
      }
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
    return false;
  };

  const handleClick = async () => {
    const copyComplete = await copyToClipboard();

    if (copyComplete) {
      setButtonIcon("checkmarkSolid");
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const newTimeoutId = setTimeout(() => {
        setButtonIcon("copy");
        setTimeoutId(null);
      }, 1500);

      setTimeoutId(newTimeoutId);
    }
  };

  return (
    <div className="float-right ml-4">
      <Button onClick={handleClick}>
        <Icon name={buttonIcon as IconName}></Icon>
      </Button>
    </div>
  );
};
export default CopyButton;
