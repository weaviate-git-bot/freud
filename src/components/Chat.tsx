import React, { type Dispatch, type FormEvent, type SetStateAction, createRef, useEffect, useRef, useState } from 'react'
import { type Message, Role } from '~/interfaces/message';
import { colors } from '~/stitches/colors';
import { Button } from './button/Button';
import FeedbackComponent from './feedbackComponent';
import { Icon } from './icon/Icon';
import { Spinner } from './icon/icons/Spinner';
import QuickAskComponent from './quickAskComponent';
import SourceComponent from './sourceComponent';
import { TextArea } from './textArea/TextArea';
import Image from "next/image";
import { api } from '~/utils/api';
import useAutosizeTextArea from './useAutosizeTextArea';

type Prop = {
    messages: Message[],
    setMessages: Dispatch<SetStateAction<Message[]>>,
}

const AVATAR_IMAGE_SIZE = 50;

const Chat = ({ messages, setMessages }: Prop) => {
    const [isLoadingReply, setIsLoadingReply] = useState(false);
    const [suggestedQuestions, setSuggestedQuestions] = React.useState<string[]>([
        "How can I help my patient with anxiety?",
        "How do I assess trauma in a patient?",
        "What do I do if my patient is very silent?",
    ]);
    const [query, setQuery] = useState("");

    // Autosize textarea (grow height with input)
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    useAutosizeTextArea(textAreaRef.current, query);

    // Used for textarea commit on enter. Shift-enter is new line.
    const myFormRef = createRef<HTMLFormElement>()
    const onEnterPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && e.shiftKey == false) {
            e.preventDefault();
            myFormRef.current?.dispatchEvent(
                new Event("submit", { cancelable: true, bubbles: true })
            );
        }
    };

    //Auto scrolldown on new messages
    const bottomRef = useRef<null | HTMLDivElement>(null);
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        }
    }, [messages]);

    const mutation = api.langchain.conversation.useMutation({
        onError: (error) => {
            console.error(error);
            setIsLoadingReply(false);
        },
        onSuccess: (message) => {
            if (!message) {
                return;
            }
            setMessages([...messages, message.reply]);
            setQuery("");
            setIsLoadingReply(false);

            setSuggestedQuestions(message.generated_followup_questions);
        },
    });

    function handleQuickSubmit(n: number) {
        const question = suggestedQuestions[n];
        if (!question) {
            throw new Error("Index of clicked question is out of bounds");
        }
        setQuery(question);

        setIsLoadingReply(true);
        const message = {
            role: Role.User,
            content: question,
        };
        setMessages([...messages, message]);
        mutation.mutate([...messages, message]);
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        //Quickfix for empty query
        if (query.length == 0) {
            return;
        }

        setIsLoadingReply(true);
        const message = {
            role: Role.User,
            content: query,
        };
        setMessages([...messages, message]);
        mutation.mutate([...messages, message]);
    }

    return (
        <>
            <div
                className={`min-h-[1rem] w-full text-2xl transition-all duration-1000 ${messages.length > 0 ? "grow" : ""
                    } flex flex-col items-center`}
            >
                {messages.map((message, idx) => {
                    return (
                        <div
                            key={idx.toString()}
                            className="container border-b-2 border-gray900 py-10"
                        >
                            {message.role === Role.User ? (
                                <div key={idx} className="flex items-start space-x-4">
                                    <Image
                                        className="mt-3"
                                        src="/chatter_avatar_2.png"
                                        alt="This is text"
                                        width={AVATAR_IMAGE_SIZE}
                                        height={AVATAR_IMAGE_SIZE}
                                    />
                                    <p className="pt-5" key={idx}>
                                        {message.content}
                                    </p>
                                </div>
                            ) : (
                                <div key={idx}>
                                    <div className="relative">
                                        <Image
                                            className="float-left mr-4"
                                            src="/sigmund_freud_avatar.png"
                                            alt="This is text"
                                            width={AVATAR_IMAGE_SIZE}
                                            height={AVATAR_IMAGE_SIZE}
                                        />
                                        <FeedbackComponent chat={messages} />
                                        <p
                                            color={colors.beige400}
                                            className=""
                                            key={"reply-" + idx.toString()}
                                        >
                                            {message.content}
                                        </p>
                                    </div>

                                    <div className="mb-3">
                                        {message.sources == undefined ||
                                            message.sources?.length == 0 ? (
                                            <p className="bold py-2 font-bold text-yellow550">
                                                Fant ingen kilder til dette spørsmålet
                                            </p>
                                        ) : (
                                            <div>
                                                <p className="bold py-2 font-bold">Kilder</p>

                                                <ul>
                                                    {message.sources.map((source, sourceIdx) => {
                                                        return (
                                                            <SourceComponent
                                                                key={sourceIdx}
                                                                source={source}
                                                            ></SourceComponent>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
                {isLoadingReply && (
                    <Spinner className={"p-10"} size="7em" color="green" />
                )}
            </div>

            <div className="align-center flex w-[100%] flex-col items-center">
                <QuickAskComponent
                    suggestedQuestions={suggestedQuestions}
                    onClick={handleQuickSubmit}
                    isLoadingReply={isLoadingReply}
                />
                <form
                    onSubmit={handleSubmit}
                    className="mb-0 mt-8 flex w-[50%] flex-row gap-3"
                    ref={myFormRef}
                >
                    <TextArea
                        disabled={isLoadingReply}
                        value={query}
                        ref={textAreaRef}
                        rows={1}
                        onKeyDown={onEnterPress}
                        onChange={(event) => {
                            setQuery(event.target.value);
                        }}
                        style={{
                            resize: "none",
                            transition: "border-color 150ms ease",
                            padding: "1rem",
                        }}
                        placeholder="What is your question for Freud?"
                        id={"submitquestion"}
                    />
                    <Button
                        type="submit"
                        color={"lightGreen"}
                        withBorder={true}
                        disabled={isLoadingReply}
                        className="h-10 self-center"
                    >
                        <Icon name={"arrowNarrowRight"} color={colors.green600}></Icon>
                    </Button>
                </form>
                <div ref={bottomRef} />
            </div>
        </>
    )
}

export default Chat