import { ThumbState } from "@prisma/client";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { FeedbackForm } from "./FeedbackForm";
import { Button } from "./ui/button/Button";
import { Icon } from "./ui/icon/Icon";
import { Popover } from "./ui/popover/Popover";
import { Tooltip } from "./ui/tooltip/Tooltip";
import { ButtonMinimal } from "./ui/buttonMinimal/ButtonMinimal";
import { type Feedback } from "@prisma/client";
import type { Message } from "@prisma/client";

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
  const [showForm, setShowForm] = useState(false);
  const [feedbackID, setFeedbackID] = useState<null | number>(null);

  useEffect(() => {
    // Thumb is de-selected
    if (thumb === ThumbState.none) {
      // TODO: delete feedback
      // -> consider adding a delay before deleting
      return;
    }

    // Create new feedback entry in database (thumbs only)
    if (feedbackID === null) {
      createFeedback();
    }

    // Update existing feedback entry (thumbs only)
    else {
      updateThumbFeedback();
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
      handleSubmit={updateCommentFeedback}
    />
  );

  const createNewFeedback = api.feedback.create.useMutation({
    onError: (error) => {
      console.error(error);
    },
    onSuccess: (data) => {
      console.info("Feedback sent!");
      console.info(data);
      setFeedbackID(data.id);
    },
  });

  const addCommentToFeedback = api.feedback.setComment.useMutation({
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {
      console.info("Comment submitted");
      setShowForm(false);
    },
  });

  const setNewThumbFeedback = api.feedback.setThumb.useMutation({
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {
      console.info("Thumb set to " + thumb);
    },
  });

  function createFeedback() {
    const feedback: Feedback = {
      name: name,
      email: email,
      thumb: thumb,
      messages: chat,
    };

    createNewFeedback.mutate(feedback);
  }

  function updateThumbFeedback() {
    if (!feedbackID) {
      console.error("Cannot submit comment before feedbackID is set");
      return;
    }

    const newThumb = {
      feedbackID: feedbackID,
      thumb: thumb,
    };

    setNewThumbFeedback.mutate(newThumb);
  }

  function updateCommentFeedback() {
    localStorage.setItem("email", email);
    localStorage.setItem("name", name);

    if (!feedbackID) {
      console.error("Cannot submit comment before feedbackID is set");
      return;
    }

    const feedbackComment = {
      feedbackID: feedbackID,
      comment: comment,
    };

    addCommentToFeedback.mutate(feedbackComment);
  }

  return (
    <div className="float-right ml-4">
      <RadixTooltip.Provider delayDuration={0}>
        <Tooltip content={"Good answer"}>
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
        </Tooltip>
        <Tooltip content={"Unsatisfactory answer"}>
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
        </Tooltip>
        {thumb !== ThumbState.none && (
          <Popover content={form} side="bottom" open={showForm}>
            <ButtonMinimal
              className="block text-base font-semibold text-green600"
              onClick={() => setShowForm(!showForm)}
            >
              Legg til kommentar
            </ButtonMinimal>
          </Popover>
        )}
      </RadixTooltip.Provider>
    </div>
  );
};

export default FeedbackButtons;
