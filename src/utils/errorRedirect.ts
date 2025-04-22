import { NextRouter } from 'next/router';

/**
 * Redirects to the appropriate error page based on the error status code
 * @param router Next.js router instance
 * @param statusCode HTTP status code
 */
export const redirectToErrorPage = (router: NextRouter, statusCode: number): void => {
  switch (statusCode) {
    case 401:
      router.push('/401');
      break;
    case 403:
      router.push('/403');
      break;
    case 404:
      router.push('/404');
      break;
    case 500:
    default:
      router.push('/500');
      break;
  }
}; 