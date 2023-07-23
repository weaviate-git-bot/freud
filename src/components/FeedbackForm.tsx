import React from "react";
import { Button } from "./ui/button/Button";
import { InputField } from "./ui/inputField/InputField";
import { Label } from "./ui/label/Label";
import { TextArea } from "./ui/textArea/TextArea";

const textSize = "text-sm";

export const FeedbackForm = ({
  name,
  email,
  comment,
  setName,
  setEmail,
  setComment,
  handleSubmit,
}) => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Tilbakemeldingskjema</h1>
      <p>
        Både tilbakemelding og samtalen du har hatt vil bli sendt inn til oss
      </p>
      <form>
        <Label>Tilbakemelding</Label>
        <TextArea
          id={"feedback"}
          className="h-[6rem] w-[6rem]"
          onChange={(e) => setComment(e.target.value)}
          value={comment}
        />
        <InputField
          id=""
          label="Navn (valgfritt)"
          onChange={(e) => setName(e.target.value)}
          value={name}
        ></InputField>
        <InputField
          id=""
          label="E-mail (valgfritt)"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        ></InputField>
      </form>
      <Button className="float-right" color={"green"} onClick={handleSubmit}>
        Send inn
      </Button>
      <Button
        className="float-right"
        color={"red"}
        // onClick={() => setModalIsOpen(false)}
      >
        Cancel
      </Button>
    </div>
  );
};
