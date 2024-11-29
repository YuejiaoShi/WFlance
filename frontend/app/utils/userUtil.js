import { sendGetRequest, handleResponse } from "./resHandler";

export async function getUserInfo() {
  const response = await sendGetRequest(
    `${process.env.NEXT_PUBLIC_API_URL}/api/user`,
    {
      credentials: "include",

      "X-rasmus": "rasmus",
      Authorization:
        "Bearer: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsInJvbGUiOiJEZXZlbG9wZXIiLCJpYXQiOjE3MzI5MDI4NTQsInNlc3Npb25JZCI6IjUtMTczMjkwMjg1NDY2MCIsImlzcyI6IllBUiBzb2x1dGlvbnMiLCJleHAiOjE3MzI5MDY0NTR9.zFiwWifiLc_ku8r8ZSq_SpNf2AGHBfNnI5CYvoLxkbI",
    }
  );
  return await handleResponse(response);
}

const USER_ROUTER = {
  Developer: "/dev-dashboard",
  Client: "/client-dashboard",
};

export function getUserPathByRole(userRole) {
  checkUserRole(userRole);
  return USER_ROUTER[userRole];
}

function checkUserRole(userRole) {
  if (!(userRole in USER_ROUTER)) {
    throw new Error("User role is neither Developer nor Client");
  }
}

export function checkURLMatchUserRole(URL, userRole) {
  if (!URL.startsWith(getUserPathByRole(userRole))) {
    throw new Error("User role " + userRole + " does not match URL " + URL);
  }
}
