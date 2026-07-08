export async function refreshAccessToken() {
  const refresh = localStorage.getItem("refresh");

  const response = await fetch("http://127.0.0.1:8000/api/refresh/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh,
    }),
  });

  if (!response.ok) {
    throw new Error("Couldn't refresh token");
  }

  const data = await response.json();

  localStorage.setItem("access", data.access);

  return data.access;
}

export async function authFetch(url, options = {}) {
  let access = localStorage.getItem("access");

  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${access}`,
  };

  let response = await fetch(url, options);

  if (response.status === 401) {
    access = await refreshAccessToken();

    options.headers.Authorization = `Bearer ${access}`;

    response = await fetch(url, options);
  }

  return response;
}