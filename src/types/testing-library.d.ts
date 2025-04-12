import '@testing-library/jest-dom';

declare module '@testing-library/react' {
  export const screen: {
    getByLabelText(arg0: string): HTMLElement;
    getByPlaceholderText(arg0: string): HTMLElement;
    getByTestId: (testId: string) => HTMLElement;
    getByText: (text: string) => HTMLElement;
    queryByText: (text: string) => HTMLElement | null;
    getByRole: (role: string, options?: { name?: string | RegExp }) => HTMLElement;
  };
  export const fireEvent: {
    click: (element: HTMLElement) => void;
    mouseDown: (element: HTMLElement) => void;
    mouseUp: (element: HTMLElement) => void;
  };
  export const waitFor: (callback: () => void) => Promise<void>;
}

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toBeDisabled(): R;
    }
  }
} 