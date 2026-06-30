import type { JBNationalInputWebComponent } from 'jb-national-input';

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
