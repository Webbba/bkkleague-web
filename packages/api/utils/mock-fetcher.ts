import ApiRoutes from '../routes';

const fetcher = async (url: ApiRoutes) => {
  const apiEndpoint = new URL(`/api/${url}`, 'http://localhost:3000');
  const res = await fetch(apiEndpoint.toString());

  if (!res.ok) {
    const error: Error & { status?: number } = new Error(
      'An error occurred while fetching the data.',
    );
    // Attach extra info to the error object.
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export default fetcher;
