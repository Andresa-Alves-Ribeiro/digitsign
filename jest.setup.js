// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import 'whatwg-fetch'
import { act } from '@testing-library/react'

beforeAll(() => {
  jest.useFakeTimers()
})

afterEach(async () => {
  await act(async () => {
    jest.runOnlyPendingTimers()
    jest.clearAllTimers()
    jest.clearAllMocks()
  })
})

// Clean up after all tests
afterAll(() => {
  jest.useRealTimers()
})

// Mock do next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    const { fill, priority, ...restProps } = props;
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...restProps} />;
  },
}));

// Mock do next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}));

// Mock do next-auth
jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: null,
    status: 'unauthenticated',
  }),
  signIn: jest.fn(),
  signOut: jest.fn(),
  SessionProvider: ({ children }) => children,
})); 