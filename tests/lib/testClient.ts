import axios, { AxiosInstance } from "axios";

const baseURL =
  process.env.TEST_API_BASE_URL ?? "https://api.dfoldlab.co.uk/api/v1";

export function createTestClient(headers: Record<string, string>): AxiosInstance {
  return axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    validateStatus: () => true,
  });
}
