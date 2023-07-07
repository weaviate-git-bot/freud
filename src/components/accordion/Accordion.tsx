import * as RadixAccordion from '@radix-ui/react-accordion';
import React, { ComponentProps, forwardRef, MouseEventHandler } from 'react';

import { CSS } from '../../stitches';

import {
  StyledAccordion,
  StyledContentInner,
  StyledContentOuter,
  StyledHeader,
  StyledHeaderLeftAbsolute,
  StyledHeaderRight,
  StyledItem,
  StyledTrigger,
} from './StyledAccordion';

type Props = {
  children: React.ReactNode;
  variant: 'list' | 'card';
  id?: string;

  // Root props
  value?: RadixAccordion.AccordionMultipleProps['value'];
  defaultValue?: RadixAccordion.AccordionMultipleProps['defaultValue'];
  onValueChange?: RadixAccordion.AccordionMultipleProps['onValueChange'];
};

const Accordion = ({
  children,
  variant,
  value,
  defaultValue,
  onValueChange,
  ...rest
}: Props) => {
  return (
    <StyledAccordion
      type="multiple"
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      data-variant={variant}
      {...rest}
    >
      {children}
    </StyledAccordion>
  );
};

type ItemProps = {
  headerLeft: React.ReactNode;
  headerLeftAbsolute?: React.ReactNode;
  headerRight?: React.ReactNode;
  headerRightCss?: CSS;
  paddingHeader?: CSS['padding'];
  paddingContent?: CSS['padding'];
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
} & ComponentProps<typeof StyledItem>;

const AccordionItem = forwardRef(
  (
    {
      value,
      headerLeft,
      headerLeftAbsolute,
      headerRight,
      headerRightCss,
      children,
      paddingHeader,
      paddingContent,
      onClick,
      ...props
    }: ItemProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) => (
    <StyledItem value={value} {...props} ref={forwardedRef}>
      <RadixAccordion.Header asChild>
        <StyledHeader>
          <StyledTrigger
            onClick={onClick}
            css={{
              padding: paddingHeader
                ? `${paddingHeader} !important`
                : undefined,
            }}
          >
            {headerLeft}
          </StyledTrigger>
          {!!headerRight && (
            <StyledHeaderRight css={headerRightCss}>
              {headerRight}
            </StyledHeaderRight>
          )}
          {!!headerLeftAbsolute && (
            <StyledHeaderLeftAbsolute>
              {headerLeftAbsolute}
            </StyledHeaderLeftAbsolute>
          )}
        </StyledHeader>
      </RadixAccordion.Header>
      <StyledContentOuter>
        <StyledContentInner
          css={{
            padding: paddingContent
              ? `${paddingContent} !important`
              : undefined,
          }}
        >
          {children}
        </StyledContentInner>
      </StyledContentOuter>
    </StyledItem>
  ),
);
AccordionItem.displayName = 'AccordionItem';
Accordion.Item = AccordionItem;

export default Accordion;
