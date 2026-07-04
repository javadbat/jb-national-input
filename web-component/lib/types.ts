import { EventTypeWithTarget } from "jb-core";
import { JBNationalInputWebComponent } from "./jb-national-input";

export type JBNationalInputEventType<TEvent> = EventTypeWithTarget<TEvent,JBNationalInputWebComponent>