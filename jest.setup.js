require('@testing-library/jest-dom')

// Polyfill for Request, Response and other Web APIs
const { Headers, Request, Response } = require('node-fetch')

global.Headers = global.Headers || Headers
global.Request = global.Request || Request
global.Response = global.Response || Response

// Mock next/headers
jest.mock('next/headers', () => ({
  cookies: () => ({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  }),
  headers: () => ({}),
}))
