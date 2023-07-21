/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState } from "react";
import { Button } from "./ui/button/Button";
import { Icon, IconName } from "./ui/icon/Icon";
import { type Message } from "~/interfaces/message";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { Tooltip } from "./ui/tooltip/Tooltip";

type Prop = {
  message: Message;
};

const CopyButton = ({ message }: Prop) => {
    
    const [buttonIcon, setButtonIcon] = useState("copy"); // Either copy, checkmarkSolid, or printer
    const [timeoutId, setTimeoutId] = useState<any>(null);

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
      <RadixTooltip.Provider delayDuration={0}>
        <Tooltip content={"Copy"}>
          <Button className="float-right ml-4" onClick={handleClick}>
            <Icon name={buttonIcon as IconName}></Icon>
          </Button>
        </ Tooltip>
      </RadixTooltip.Provider>

    );
};


CopyButton.displayName = "CopyButton";

export default CopyButton;
