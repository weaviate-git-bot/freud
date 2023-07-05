import { Meta } from '@storybook/react';

import { Button } from '../button/Button';
import { Icon } from '../icon/Icon';
import { Tooltip } from '../tooltip/Tooltip';
import { P } from '../typography/P';
import { Text } from '../typography/Text';

import Accordion from './Accordion';

export default {
  parameters: { docs: { canvas: { sourceState: 'shown' } } },
  component: Accordion,
} as Meta;

const Template = (props: React.ComponentProps<typeof Accordion>) => (
  <Accordion {...props} />
);
Template.args = undefined as undefined | React.ComponentProps<typeof Accordion>;

export const AccordionList = () => (
  <Accordion defaultValue={['example-2']} variant="list">
    <Accordion.Item
      value="example-1"
      headerLeft={
        <>
          <div>Behandlingsnotat</div>
          <Tooltip content="2022-06-03 21:30" align="start">
            <Text
              size="m"
              css={{ color: '$textMuted', lineHeight: 1, mt: '$1' }}
            >
              5 minutter siden
            </Text>
          </Tooltip>
        </>
      }
      headerRight={
        <>
          <Tooltip content="Flere valg" side="top" align="end">
            <Button color="transparent">
              <Icon name="dotsHorizontal" />
            </Button>
          </Tooltip>
        </>
      }
    >
      <P>
        Fremstår motivert for indre arbeid og så langt observasjoner som tyder
        på at pasienten profitterer på tilnærmingen skissert i behandlingsplan.
      </P>
      <P>
        Blir økende engstelig og aktivert rundt utforsking av sinne følelser og
        fremstår da sårbar for selvkritikk eller tilbaketrekning. Fremstår
        motivert for indre arbeid og så langt observasjoner som tyder på at
        pasienten profitterer på tilnærmingen skissert i behandlingsplan.
      </P>
      <P>
        Fremstår litt lettere ift. innkomstsamtale. Blir økende engstelig og
        aktivert rundt utforsking av sinne følelser og fremstår da sårbar for
        selvkritikk eller tilbaketrekning. Fremstår motivert for indre arbeid og
        så langt observasjoner som tyder på at pasienten profitterer på
        tilnærmingen skissert i behandlingsplan.
      </P>
    </Accordion.Item>
    <Accordion.Item value="example-2" headerLeft="Behandlingsnotat">
      <P>
        Fremstår motivert for indre arbeid og så langt observasjoner som tyder
        på at pasienten profitterer på tilnærmingen skissert i behandlingsplan.
      </P>
      <P>
        Blir økende engstelig og aktivert rundt utforsking av sinne følelser og
        fremstår da sårbar for selvkritikk eller tilbaketrekning. Fremstår
        motivert for indre arbeid og så langt observasjoner som tyder på at
        pasienten profitterer på tilnærmingen skissert i behandlingsplan.
      </P>
      <P>
        Fremstår litt lettere ift. innkomstsamtale. Blir økende engstelig og
        aktivert rundt utforsking av sinne følelser og fremstår da sårbar for
        selvkritikk eller tilbaketrekning. Fremstår motivert for indre arbeid og
        så langt observasjoner som tyder på at pasienten profitterer på
        tilnærmingen skissert i behandlingsplan.
      </P>
    </Accordion.Item>
    <Accordion.Item
      value="example-3"
      headerLeft={
        <>
          <div>Behandlingsnotat</div>
          <Tooltip content="2022-06-03 21:30" align="start">
            <Text
              size="m"
              css={{ color: '$textMuted', lineHeight: 1, mt: '$1' }}
            >
              5 minutter siden
            </Text>
          </Tooltip>
        </>
      }
    >
      <P>
        Fremstår motivert for indre arbeid og så langt observasjoner som tyder
        på at pasienten profitterer på tilnærmingen skissert i behandlingsplan.
      </P>
      <P>
        Blir økende engstelig og aktivert rundt utforsking av sinne følelser og
        fremstår da sårbar for selvkritikk eller tilbaketrekning. Fremstår
        motivert for indre arbeid og så langt observasjoner som tyder på at
        pasienten profitterer på tilnærmingen skissert i behandlingsplan.
      </P>
      <P>
        Fremstår litt lettere ift. innkomstsamtale. Blir økende engstelig og
        aktivert rundt utforsking av sinne følelser og fremstår da sårbar for
        selvkritikk eller tilbaketrekning. Fremstår motivert for indre arbeid og
        så langt observasjoner som tyder på at pasienten profitterer på
        tilnærmingen skissert i behandlingsplan.
      </P>
    </Accordion.Item>
  </Accordion>
);

export const AccordionCard = () => (
  <Accordion defaultValue={['example-2']} variant="card">
    <Accordion.Item
      value="example-1"
      headerLeft={
        <>
          <div>Behandlingsnotat</div>
          <Tooltip content="2022-06-03 21:30" align="start">
            <Text
              size="m"
              css={{ color: '$textMuted', lineHeight: 1, mt: '$1' }}
            >
              5 minutter siden
            </Text>
          </Tooltip>
        </>
      }
      headerRight={
        <>
          <Tooltip content="Flere valg" side="top" align="end">
            <Button color="transparent">
              <Icon name="dotsHorizontal" />
            </Button>
          </Tooltip>
        </>
      }
    >
      <P>
        Fremstår motivert for indre arbeid og så langt observasjoner som tyder
        på at pasienten profitterer på tilnærmingen skissert i behandlingsplan.
      </P>
      <P>
        Blir økende engstelig og aktivert rundt utforsking av sinne følelser og
        fremstår da sårbar for selvkritikk eller tilbaketrekning. Fremstår
        motivert for indre arbeid og så langt observasjoner som tyder på at
        pasienten profitterer på tilnærmingen skissert i behandlingsplan.
      </P>
      <P>
        Fremstår litt lettere ift. innkomstsamtale. Blir økende engstelig og
        aktivert rundt utforsking av sinne følelser og fremstår da sårbar for
        selvkritikk eller tilbaketrekning. Fremstår motivert for indre arbeid og
        så langt observasjoner som tyder på at pasienten profitterer på
        tilnærmingen skissert i behandlingsplan.
      </P>
    </Accordion.Item>
    <Accordion.Item value="example-2" headerLeft="Behandlingsnotat">
      <P>
        Fremstår motivert for indre arbeid og så langt observasjoner som tyder
        på at pasienten profitterer på tilnærmingen skissert i behandlingsplan.
      </P>
      <P>
        Blir økende engstelig og aktivert rundt utforsking av sinne følelser og
        fremstår da sårbar for selvkritikk eller tilbaketrekning. Fremstår
        motivert for indre arbeid og så langt observasjoner som tyder på at
        pasienten profitterer på tilnærmingen skissert i behandlingsplan.
      </P>
      <P>
        Fremstår litt lettere ift. innkomstsamtale. Blir økende engstelig og
        aktivert rundt utforsking av sinne følelser og fremstår da sårbar for
        selvkritikk eller tilbaketrekning. Fremstår motivert for indre arbeid og
        så langt observasjoner som tyder på at pasienten profitterer på
        tilnærmingen skissert i behandlingsplan.
      </P>
    </Accordion.Item>
    <Accordion.Item
      value="example-3"
      headerLeft={
        <>
          <div>Behandlingsnotat</div>
          <Tooltip content="2022-06-03 21:30" align="start">
            <Text
              size="m"
              css={{ color: '$textMuted', lineHeight: 1, mt: '$1' }}
            >
              5 minutter siden
            </Text>
          </Tooltip>
        </>
      }
    >
      <P>
        Fremstår motivert for indre arbeid og så langt observasjoner som tyder
        på at pasienten profitterer på tilnærmingen skissert i behandlingsplan.
      </P>
      <P>
        Blir økende engstelig og aktivert rundt utforsking av sinne følelser og
        fremstår da sårbar for selvkritikk eller tilbaketrekning. Fremstår
        motivert for indre arbeid og så langt observasjoner som tyder på at
        pasienten profitterer på tilnærmingen skissert i behandlingsplan.
      </P>
      <P>
        Fremstår litt lettere ift. innkomstsamtale. Blir økende engstelig og
        aktivert rundt utforsking av sinne følelser og fremstår da sårbar for
        selvkritikk eller tilbaketrekning. Fremstår motivert for indre arbeid og
        så langt observasjoner som tyder på at pasienten profitterer på
        tilnærmingen skissert i behandlingsplan.
      </P>
    </Accordion.Item>
  </Accordion>
);
