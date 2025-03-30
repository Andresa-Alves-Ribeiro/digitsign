// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

beforeAll(() => {
  jest.useFakeTimers()
})

afterEach(() => {
  jest.runOnlyPendingTimers()
  jest.clearAllTimers()
  jest.clearAllMocks()
})

// Clean up after all tests
afterAll(() => {
  jest.useRealTimers()
}) 