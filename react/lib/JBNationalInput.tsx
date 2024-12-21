import React, { useRef, useEffect, useState, useImperativeHandle } from 'react';
import 'jb-national-input';
// eslint-disable-next-line no-duplicate-imports
import {JBNationalInputWebComponent} from 'jb-national-input';
import {useJBInputEvents,useJBInputAttribute, BaseProps } from 'jb-input/react';

export type Props = BaseProps<JBNationalInputWebComponent>
interface JBNationalInputType extends React.DetailedHTMLProps<React.HTMLAttributes<JBNationalInputWebComponent>, JBNationalInputWebComponent> {
  "class"?: string,
  "type"?: string,
  "label"?:string,
  "message"?:string,
  "placeholder"?:string,
}
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'jb-national-input': JBNationalInputType;
    }
  }
}
// eslint-disable-next-line react/display-name
const JBNationalInput = React.forwardRef((props:Props, ref) => {
  const element = useRef<JBNationalInputWebComponent>(null);
  const [refChangeCount, refChangeCountSetter] = useState(0);
  useImperativeHandle(
    ref,
    () => (element ? element.current : {}),
    [element],
  );
  useEffect(() => {
    refChangeCountSetter(refChangeCount + 1);
  }, [element.current]);
  useJBInputAttribute(element,props);
  useJBInputEvents<JBNationalInputWebComponent>(element,props);
  return (
    <jb-national-input ref={element} class={props.className?props.className:''}>
    </jb-national-input>
  );
});

JBNationalInput.displayName = "JBNationalInput";
export {JBNationalInput};