import { useRef } from 'react';
import { JBButton } from 'jb-button/react';
import { JBNationalInput } from 'jb-national-input/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { getMessageText, getNationalInput, getNativeInput } from './test-utils';

const meta = {
  title: "Components/form elements/Inputs/JBNationalInput",
  component: JBNationalInput,
} satisfies Meta<typeof JBNationalInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    label: 'national id',
    message: "please enter your national code",
  },
  play: async ({ canvasElement, args }) => {
    const nationalInput = getNationalInput(canvasElement);
    const nativeInput = getNativeInput(nationalInput);

    await userEvent.type(nativeInput, 'abc0012345679123');

    await waitFor(() => {
      expect(nationalInput.value).toBe('0012345679');
      expect(nationalInput.displayValue).toBe('0012345679');
      expect(nativeInput.value).toBe('0012345679');
      expect(nationalInput.reportValidity()).toBe(true);
      expect(getMessageText(nationalInput)).toBe(args.message);
    });

    nativeInput.focus();
    await userEvent.keyboard('{Control>}a{/Control}{Backspace}');
    await userEvent.type(nativeInput, '0012345678');

    await waitFor(() => {
      expect(nationalInput.value).toBe('0012345678');
      expect(nationalInput.reportValidity()).toBe(false);
      expect(getMessageText(nationalInput)).toBe('The entered national code is invalid');
      expect(nationalInput.hasState('invalid')).toBe(true);
    });

    nativeInput.focus();
    await userEvent.keyboard('{Control>}a{/Control}{Backspace}');
    await userEvent.type(nativeInput, '۰۰۱۲۳۴۵۶۷۹');

    await waitFor(() => {
      expect(nationalInput.value).toBe('0012345679');
      expect(nationalInput.displayValue).toBe('۰۰۱۲۳۴۵۶۷۹');
      expect(nationalInput.reportValidity()).toBe(true);
      expect(nationalInput.hasState('invalid')).toBe(false);
    });
  }
};

export const InitialValue: Story = {
  render: (args) => {
    const formRef = useRef<HTMLFormElement>(null);
    return (
      <form ref={formRef}>
        <JBNationalInput {...args} />
        <JBButton type="button" onClick={() => formRef.current?.reset()}>Reset</JBButton>
      </form>
    );
  },
  args: {
    label: 'initial national id',
    initialValue: '۰۰۱۲۳۴۵۶۷۹',
  },
  play: async ({ canvasElement }) => {
    const nationalInput = getNationalInput(canvasElement);
    const resetButton = canvasElement.querySelector('jb-button')?.shadowRoot?.querySelector<HTMLButtonElement>('button');

    expect(resetButton).toBeTruthy();

    await waitFor(() => {
      // Persian input is canonicalized once and used consistently as baseline.
      expect(nationalInput.initialValue).toBe('0012345679');
      expect(nationalInput.value).toBe('0012345679');
      expect(nationalInput.isDirty).toBe(false);
    });

    nationalInput.value = '0013545679';
    await userEvent.click(resetButton!);

    await waitFor(() => {
      expect(nationalInput.value).toBe('0012345679');
      expect(nationalInput.isDirty).toBe(false);
    });
  },
};

export const InitialValueDoesNotOverrideValue: Story = {
  args: {
    initialValue: '۰۰۱۲۳۴۵۶۷۹',
    value: '0013545679',
  },
  play: async ({ canvasElement }) => {
    const nationalInput = getNationalInput(canvasElement);

    await waitFor(() => {
      expect(nationalInput.initialValue).toBe('0012345679');
      expect(nationalInput.value).toBe('0013545679');
      expect(nationalInput.isDirty).toBe(true);
    });
  },
};

export const ExplicitNullValueDoesNotFallBackToInitialValue: Story = {
  args: {
    initialValue: '۰۰۱۲۳۴۵۶۷۹',
    value: null,
  },
  play: async ({ canvasElement }) => {
    const nationalInput = getNationalInput(canvasElement);

    await waitFor(() => {
      expect(nationalInput.initialValue).toBe('0012345679');
      expect(nationalInput.value).toBe('');
      expect(nationalInput.isDirty).toBe(true);
    });
  },
};
