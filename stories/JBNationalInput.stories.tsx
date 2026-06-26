import { JBNationalInput } from 'jb-national-input/react';
import type { Meta, StoryObj } from '@storybook/react';

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
  }
};