
// Dummy API mock for frontend-only testing
const api = {
  defaults: {
    headers: {
      common: {},
    },
  },
  post: (url, data) => {
    console.log(`Fake POST request → ${url}`, data);

    // Return fake login/register responses
    if (url.includes("login")) {
      return Promise.resolve({
        data: {
          accessToken: "fake-jwt-token",
          user: { username: data.usernameOrEmail || "guest_user" },
        },
      });
    }

    if (url.includes("register")) {
      return Promise.resolve({
        data: {
          message: "User registered successfully",
          user: { username: data.username },
        },
      });
    }

    return Promise.resolve({ data: {} });
  },
  get: (url) => {
    console.log(`Fake GET request → ${url}`);
    return Promise.resolve({ data: {} });
  },
};

export default api;
