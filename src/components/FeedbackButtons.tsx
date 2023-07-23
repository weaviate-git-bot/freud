import { ThumbState } from "@prisma/client";
// import * as RadixPopover from "@radix-ui/react-tooltip";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import React, { useEffect, useState } from "react";
// import { type Feedback } from "~/interfaces/feedback";
import { type Message } from "~/interfaces/message";
import { api } from "~/utils/api";
import { FeedbackForm } from "./FeedbackForm";
import { Button } from "./ui/button/Button";
import { Icon } from "./ui/icon/Icon";
import { Popover } from "./ui/popover/Popover";
import { Tooltip } from "./ui/tooltip/Tooltip";

type Props = {
  chat: Message[];
};

const FeedbackButtons = ({ chat }: Props) => {
  const [name, setName] = useState<string>(localStorage.getItem("name") || "");
  const [email, setEmail] = useState<string>(
    localStorage.getItem("email") || ""
  );
  const [thumb, setThumb] = useState<ThumbState>(ThumbState.none);
  const [comment, setComment] = useState<string>("");

  useEffect(() => {
    if (thumb !== ThumbState.none) {
      console.debug(thumb);
    }
  }, [thumb]);
  const form = (
    <FeedbackForm
      name={name}
      email={email}
      comment={comment}
      setName={setName}
      setEmail={setEmail}
      setComment={setComment}
      handleSubmit={handleSubmit}
    />
  );
  const mutateFeedback = api.feedback.createNewFeedback.useMutation({
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {
      console.info("Feedback sent!");
      setComment("");
    },
  });
  function handleSubmit() {
    localStorage.setItem("email", email);
    localStorage.setItem("name", name);

    if (comment.length > 0) {
      const feedback = {
        comment: comment,
        name: name,
        email: email,
        thumb: thumb,
        messages: chat,
      };
      mutateFeedback.mutate(feedback);
    }
  }

  return (
    <div className="float-right ml-4">
      <RadixTooltip.Provider>
        <Tooltip content={"Report good answer"}>
          <Popover content={form} side="bottom">
            <Button
              color={thumb === ThumbState.up ? "green" : "transparent"}
              onClick={() => {
                thumb === ThumbState.up
                  ? setThumb(ThumbState.none)
                  : setThumb(ThumbState.up);
              }}
            >
              <Icon name={"handThumbsUp"} />
            </Button>
          </Popover>
        </Tooltip>
        <Tooltip content={"Report unsatisfactory answer"}>
          <Popover content={form} side="bottom">
            <Button
              color={thumb === ThumbState.down ? "red" : "transparent"}
              onClick={() => {
                thumb === ThumbState.down
                  ? setThumb(ThumbState.none)
                  : setThumb(ThumbState.down);
              }}
            >
              <Icon name={"handThumbsDown"} />
            </Button>
          </Popover>
        </Tooltip>
      </RadixTooltip.Provider>
    </div>
  );
};

export default FeedbackButtons;
