import '@testing-library/jest-dom'

declare module '@testing-library/react' {
  export const screen: {
    getByTestId: (testId: string) => HTMLElement;
    getByText: (text: string) => HTMLElement;
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