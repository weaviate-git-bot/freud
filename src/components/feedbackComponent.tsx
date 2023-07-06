import React, { useState } from 'react'
import { colors } from '~/stitches/colors'
import { Button } from './button/Button'
import { Icon } from './icon/Icon'
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { InputField } from './inputField/InputField';
import { TextArea } from './textArea/TextArea';
import { TextAreaField } from './textAreaField/TextAreaField';
import { Message } from '~/interfaces/message';
import { Label } from './label/Label';

Modal.setAppElement('#__next');

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        innerHeight: '80vh',
        bottom: 'auto',
        right: 'auto',
        // marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '3rem'
    },
};

type Props = {
    chat: Message[]
}

type FeedbackSchema = {
    name: string | null | undefined,
    email: string | null | undefined,
    feedback: string
    chat: Message[]
}


const FeedbackComponent = ({ chat }: Props) => {

    let thanku: HTMLParagraphElement;
    const [feedback, setFeedback] = useState<string | null>();
    const [name, setName] = useState<string | undefined>();
    const [email, setEmail] = useState<string | null>();
    const [positive, setNegative] = useState<string | null>();
    const [modalIsOpen, setIsOpen] = useState(false);


    function openModal() {
        setIsOpen(true);
        setName("")
        setEmail("")
        setFeedback("")
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        thanku.style.display = 'none';
    }

    function closeModal() {
        setIsOpen(false);
    }

    function sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function handleSubmit() {
        console.log(feedback)
        if (feedback == undefined || feedback == null || feedback == "") {
            return
        }
        thanku.style.display = "block";

        const userfeedback: FeedbackSchema = {
            name: name,
            email: email,
            feedback: feedback,
            chat: chat
        }
        console.log(userfeedback)
        await sleep(1 * 1000);
        closeModal()
    }


    return (
        <div className='float-right ml-4'>
            <Button onClick={openModal}><Icon name={'mail'}></Icon></Button>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <h1 className='font-bold text-2xl'>Tilbakemeldingskjema</h1>
                <p>Både tilbakemelding og samtalen du har hatt vil bli sendt inn til oss</p>
                <form>
                    <InputField id='' label='Navn (valgfritt)' onChange={(e) => setName(e.target.value)}></InputField>
                    <InputField id='' label='E-mail (valgfritt)' onChange={(e) => setEmail(e.target.value)}></InputField>
                    <Label>Tilbakemelding</Label>
                    <TextArea id={'feedback'} className="w-[40rem] h-[40rem]" onChange={(e) => setFeedback(e.target.value)} />
                </form>
                <Button className='float-right' color={"green"} onClick={handleSubmit}>Send inn</Button>
                <Button className='float-right' color={"red"} onClick={closeModal}>Cancel</Button>
                <p ref={(_thanku) => (thanku = _thanku!)} className="text-green550">Tusentakk for din tilbakemelding</p>
            </Modal>
        </div >
    )
}

export default FeedbackComponent