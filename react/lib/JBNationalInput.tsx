'use client';
import React, { useRef, useImperativeHandle } from 'react';
import 'jb-national-input';
// eslint-disable-next-line no-duplicate-imports
import type { JBNationalInputWebComponent } from 'jb-national-input';
import { useJBInputEvents, useJBInputAttribute, type BaseProps } from 'jb-input/react';

export type Props = BaseProps<JBNationalInputWebComponent>
interface JBNationalInputType extends React.DetailedHTMLProps<React.HTMLAttributes<JBNationalInputWebComponent>, JBNationalInputWebComponent> {
  "class"?: string,
  "type"?: string,
  "label"?: string,
  "message"?: string,
  "placeholder"?: string,
}
declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'jb-national-input': JBNationalInputType;
    }
  }
}
// eslint-disable-next-line react/display-name
const JBNationalInput = React.forwardRef((props: Props, ref) => {
  const element = useRef<JBNationalInputWebComponent>(null);
  useImperativeHandle(
    ref,
    () => element.current ?? undefined,
    [element],
  );
  const {disabled,required,validationList,value,children,onBeforeinput,onBlur,onChange,onEnter,onFocus,onInput,onKeydown,onKeyup , ...otherProps} = props;
  useJBInputAttribute<JBNationalInputWebComponent>(element, {disabled,required,validationList,value,...otherProps});
  useJBInputEvents<JBNationalInputWebComponent>(element, {onBeforeinput,onBlur,onChange,onEnter,onFocus,onInput,onKeydown,onKeyup,...otherProps});
  return (
    <jb-national-input ref={element} {...otherProps}>
      {children}
    </jb-national-input>
  );
});

JBNationalInput.displayName = "JBNationalInput";
export { JBNationalInput };
