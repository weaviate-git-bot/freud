import { ThumbState, type Feedback } from "@prisma/client";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import React, { useEffect, useState } from "react";
import { type Message } from "~/interfaces/message";
import { api } from "~/utils/api";
import { FeedbackForm } from "./FeedbackForm";
import { Button } from "./ui/button/Button";
import { ButtonMinimal } from "./ui/buttonMinimal/ButtonMinimal";
import { Icon } from "./ui/icon/Icon";
import { Popover } from "./ui/popover/Popover";
import { Tooltip } from "./ui/tooltip/Tooltip";

type Props = {
  chat: Message[];
};

// Delay before a de-selected thumb actually deletes the entry in the database
const THUMB_DELETE_DELAY = 2000; // 2 seconds

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
    let thumbChangedToNone = true;

    // Thumb is de-selected
    // Delete feedback after a delay, unless a new thumb is selected in the meantime
    // Note: feedbackID is set to null in the onSuccess function
    if (thumb === ThumbState.none) {
      const deleteTimeout = setTimeout(() => {
        if (thumbChangedToNone) {
          deleteFeedback();
        }
      }, THUMB_DELETE_DELAY);

      return () => clearTimeout(deleteTimeout);
    }

    // Create new feedback entry in database (thumbs only)
    if (feedbackID === null) {
      createFeedback();
    }

    // Update existing feedback entry (thumbs only)
    else {
      updateThumbFeedback();
    }

    return () => {
      // If thumb changes before the delay, cancel the delete signal
      thumbChangedToNone = false;
    };
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

  const deleteCreatedFeedback = api.feedback.delete.useMutation({
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {
      console.info("Feedback deleted");
      setFeedbackID(null);
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

  function deleteFeedback() {
    if (!feedbackID) {
      console.error("Cannot delete feedback since feedbackID isn't set");
      return;
    }

    deleteCreatedFeedback.mutate({
      feedbackID: feedbackID,
    });
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
