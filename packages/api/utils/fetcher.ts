const get = async (url: string, token?: string, blob?: boolean) => {
  let tokenValue;
  let headers: any = {
    'Content-Type': 'application/json',
  };

  const apiEndpoint = new URL(url, process.env.NEXT_PUBLIC_API_URL);

  if (token) {
    tokenValue = token;
  } else if (typeof window !== 'undefined') {
    const tokenJSON = localStorage.getItem('accessToken');

    if (tokenJSON) {
      tokenValue = JSON.parse(tokenJSON);
    }
  }

  if (tokenValue) {
    headers = {
      ...headers,
      Authorization: `Bearer ${tokenValue}`,
    };
  }

  const res = await fetch(apiEndpoint.toString(), {
    method: 'GET',
    headers,
  });

  let result;

  if (blob) {
    result = res.blob();
  } else {
    result = res.json();
  }

  return result;
};

export { get };
