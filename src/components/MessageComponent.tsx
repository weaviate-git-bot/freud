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
  console.log(message.content)



  const formatLinks = (input: string): React.JSX.Element => {
    try {

      var regex = /\[[0-9]+\]/g;

      const goodspaces = input.replaceAll("\n", " \n")

      const splittext = goodspaces.split(' ');

      let outputlist: any[] = []

      let mystring = "";
      splittext.map((split) => {
        if (regex.test(split)) {
          outputlist.push(mystring)
          mystring = ""
          for (let i = 1; i <= message.sources!.length; i++) {
            if (parseInt(split.charAt(1)) == i) {

              outputlist.push(<a href="#" onClick={() => { }}>[{i}].</a>)
            }
          }
        } else {
          mystring += split + " ";

        }
      })

      const output = <p className='whitespace-pre-wrap'>
        {outputlist}
      </p>


      return output;
    }
    catch {
      //Code above is bad. So if it breaks, sources wont be clickable.
      console.log("")
      return <p>input</p>
    }
  }


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
          <p className="pt-5 whitespace-pre-wrap">
            {message.content}
          </p>
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
            {formatLinks(message.content)}
          </div>
          <SourceList sources={message.sources ?? []} />
        </div>
      )}
    </div>
  );
};

export default MessageComponent;
