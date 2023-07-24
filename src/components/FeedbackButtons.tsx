import { ThumbState } from "@prisma/client";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import React, { useEffect, useState } from "react";
import { type Message } from "~/interfaces/message";
import { type Feedback } from "~/interfaces/feedback";
import { api } from "~/utils/api";
import { ButtonWithTooltip } from "./ButtonWithTooltip";
import { FeedbackForm } from "./FeedbackForm";
import { Icon } from "./ui/icon/Icon";
import { Popover } from "./ui/popover/Popover";

type Props = {
  chat: Message[];
};

// Delay before a de-selected thumb actually deletes the entry in the database
const THUMB_DELETE_DELAY = 1000; // 2 seconds

const FeedbackButtons = ({ chat }: Props) => {
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [thumb, setThumb] = useState<ThumbState>(ThumbState.none);
  const [comment, setComment] = useState("");
  const [showForm, setShowForm] = useState({
    up: false,
    down: false,
  });
  const [feedbackID, setFeedbackID] = useState<number | null>(null);

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
      setShowForm({ up: false, down: false });
    },
  });

  const setNewThumbFeedback = api.feedback.setThumb.useMutation({
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {
      console.debug("Thumbs " + thumb);
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
        <Popover
          content={form}
          side="bottom"
          closeButton={true}
          open={showForm.up && thumb !== ThumbState.none}
          onOpenChange={() => setShowForm({ up: !showForm.up, down: false })}
        >
          <ButtonWithTooltip
            tooltip={"Good answer"}
            color={thumb === ThumbState.up ? "green" : "transparent"}
            onClick={() => {
              thumb === ThumbState.up
                ? setThumb(ThumbState.none)
                : setThumb(ThumbState.up);
            }}
          >
            <Icon name={"handThumbsUp"} />
          </ButtonWithTooltip>
        </Popover>
        <Popover
          content={form}
          side="bottom"
          closeButton={true}
          open={showForm.down && thumb !== ThumbState.none}
          onOpenChange={() => setShowForm({ up: false, down: !showForm.down })}
        >
          <ButtonWithTooltip
            tooltip={"Unsatisfactory answer"}
            color={thumb === ThumbState.down ? "red" : "transparent"}
            onClick={() => {
              thumb === ThumbState.down
                ? setThumb(ThumbState.none)
                : setThumb(ThumbState.down);
            }}
          >
            <Icon name={"handThumbsDown"} />
          </ButtonWithTooltip>
        </Popover>
      </RadixTooltip.Provider>
      {showForm.up === false &&
        showForm.down === false &&
        feedbackID !== null && (
          <span className="absolute ml-4 w-fit text-base text-green750">
            Takk for tilbakemelding!
          </span>
        )}
    </div>
  );
};

export default FeedbackButtons;
