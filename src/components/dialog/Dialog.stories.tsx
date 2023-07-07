import { Meta } from '@storybook/react';

import { Div } from '../basic/Div';
import { Button } from '../button/Button';
import { P } from '../typography/P';

import { Dialog } from './Dialog';

export default {
  parameters: { docs: { canvas: { sourceState: 'shown' } } },
  component: Dialog,
} as Meta;

const Template = (props: React.ComponentProps<typeof Dialog>) => (
  <Dialog {...props} />
);
Template.args = undefined as undefined | React.ComponentProps<typeof Dialog>;

export const LittleContent = () => (
  <>
    <Dialog
      content={
        <>
          <Dialog.Title>Edit profile</Dialog.Title>
          <Dialog.Description>
            Make changes to your profile here. Click save when your done.
          </Dialog.Description>
          <Div
            css={{ display: 'flex', marginTop: 25, justifyContent: 'flex-end' }}
          >
            <Dialog.Close asChild>
              <Button color="transparent" css={{ mr: '$2' }}>
                Close
              </Button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <Button color="green">Save changes</Button>
            </Dialog.Close>
          </Div>
        </>
      }
    >
      <Button>Åpne dialog</Button>
    </Dialog>
  </>
);

export const LotsOfContent = () => (
  <>
    <Dialog
      content={
        <>
          <Dialog.Title>Edit profile</Dialog.Title>
          <Dialog.Description>
            Make changes to your profile here. Click save when your done.
          </Dialog.Description>
          <P>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro
            voluptatem sint laboriosam laudantium fugit debitis. Atque eius quos
            reprehenderit odio explicabo, impedit nemo blanditiis dicta
            provident ipsa facilis est eaque!
          </P>
          <P>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro
            voluptatem sint laboriosam laudantium fugit debitis. Atque eius quos
            reprehenderit odio explicabo, impedit nemo blanditiis dicta
            provident ipsa facilis est eaque!
          </P>
          <P>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro
            voluptatem sint laboriosam laudantium fugit debitis. Atque eius quos
            reprehenderit odio explicabo, impedit nemo blanditiis dicta
            provident ipsa facilis est eaque!
          </P>
          <P>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro
            voluptatem sint laboriosam laudantium fugit debitis. Atque eius quos
            reprehenderit odio explicabo, impedit nemo blanditiis dicta
            provident ipsa facilis est eaque!
          </P>
          <P>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro
            voluptatem sint laboriosam laudantium fugit debitis. Atque eius quos
            reprehenderit odio explicabo, impedit nemo blanditiis dicta
            provident ipsa facilis est eaque!
          </P>
          <P>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro
            voluptatem sint laboriosam laudantium fugit debitis. Atque eius quos
            reprehenderit odio explicabo, impedit nemo blanditiis dicta
            provident ipsa facilis est eaque!
          </P>
          <P>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro
            voluptatem sint laboriosam laudantium fugit debitis. Atque eius quos
            reprehenderit odio explicabo, impedit nemo blanditiis dicta
            provident ipsa facilis est eaque!
          </P>
          <P>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro
            voluptatem sint laboriosam laudantium fugit debitis. Atque eius quos
            reprehenderit odio explicabo, impedit nemo blanditiis dicta
            provident ipsa facilis est eaque!
          </P>
          <P>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro
            voluptatem sint laboriosam laudantium fugit debitis. Atque eius quos
            reprehenderit odio explicabo, impedit nemo blanditiis dicta
            provident ipsa facilis est eaque!
          </P>
          <Dialog.Close asChild>
            <Button>Close</Button>
          </Dialog.Close>
        </>
      }
    >
      <Button>Åpne dialog</Button>
    </Dialog>
  </>
);

export const BlurredBackground = () => (
  <Dialog
    overlayCSS={{ backdropFilter: 'blur(10px)' }}
    content={
      <>
        <Dialog.Title>Edit profile</Dialog.Title>
        <Dialog.Description>
          Make changes to your profile here. Click save when your done.
        </Dialog.Description>
        <Div
          css={{ display: 'flex', marginTop: 25, justifyContent: 'flex-end' }}
        >
          <Dialog.Close asChild>
            <Button color="transparent" css={{ mr: '$2' }}>
              Close
            </Button>
          </Dialog.Close>
          <Dialog.Close asChild>
            <Button color="green">Save changes</Button>
          </Dialog.Close>
        </Div>
      </>
    }
  >
    <Button>Åpne dialog</Button>
  </Dialog>
);

export const CustomStyling = () => (
  <>
    <Dialog
      css={{
        maxWidth: '$256',
        borderRadius: '$full',
        px: '$24',
        py: '$12',
        color: 'White',
        bg: 'hotpink',
      }}
      content={
        <>
          <Dialog.Title css={{ color: 'white' }}>Oh god, my eyes!</Dialog.Title>
          <Dialog.Description css={{ color: '#fffb' }}>
            Please take me away as quickly as possible
          </Dialog.Description>
          <Dialog.Close asChild>
            <Button>Aaaaaaaaahhhhhh!</Button>
          </Dialog.Close>
        </>
      }
    >
      <Button>Åpne dialog</Button>
    </Dialog>
  </>
);

export const WithFooter = () => (
  <>
    <Dialog
      content={
        <>
          <Dialog.Title>Edit profile</Dialog.Title>
          <Dialog.Description>
            Make changes to your profile here. Click save when your done.
          </Dialog.Description>
          <Dialog.Footer>
            <Div
              css={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <Dialog.Close asChild>
                <Button color="transparent" css={{ mr: '$2' }}>
                  Close
                </Button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <Button color="green">Save changes</Button>
              </Dialog.Close>
            </Div>
          </Dialog.Footer>
        </>
      }
    >
      <Button>Åpne dialog</Button>
    </Dialog>
  </>
);

export const WithX = () => (
  <>
    <Dialog
      content={
        <>
          <Dialog.X />
          <Dialog.Title>Edit profile</Dialog.Title>
          <Dialog.Description>
            Make changes to your profile here. Click save when your done.
          </Dialog.Description>
        </>
      }
    >
      <Button>Åpne dialog</Button>
    </Dialog>
  </>
);
