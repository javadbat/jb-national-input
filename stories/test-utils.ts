import type { JBNationalInputWebComponent } from 'jb-national-input';
import { expect } from 'storybook/test';

export function getNationalInput(canvasElement: HTMLElement, index = 0) {
  const nationalInput = canvasElement.querySelectorAll<JBNationalInputWebComponent>('jb-national-input')[index];
  expect(nationalInput).toBeTruthy();
  expect(nationalInput!.shadowRoot).toBeTruthy();
  return nationalInput!;
}

export function getNativeInput(nationalInput: JBNationalInputWebComponent) {
  const input = nationalInput.shadowRoot?.querySelector<HTMLInputElement>('input');
  expect(input).toBeTruthy();
  return input!;
}

export function getMessageText(nationalInput: JBNationalInputWebComponent) {
  return nationalInput.shadowRoot?.querySelector<HTMLElement>('.message-box')?.textContent ?? '';
}
