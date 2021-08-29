import cryptoRandomString from "crypto-random-string";
import axios from "axios";
import dayjs from "dayjs";

const saveTokenDetails = (data) => {
  const tokenExpiry = dayjs().add(data.expires_in, "seconds").unix();

  localStorage.setItem("USER_TOKEN", data.access_token);
  localStorage.setItem("USER_TOKEN_REFRESH", data.refresh_token);
  localStorage.setItem("USER_TOKEN_EXPIRY", tokenExpiry);
};

const cleanupAuthDetails = () => {
  localStorage.removeItem("CODE_VERIFIER");
  localStorage.removeItem("AUTHORISATION_TOKEN");
};

export const loginUser = async (setLoggedIn) => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  const baseURL = localStorage.getItem("BASE_URL");

  if (code) localStorage.setItem("AUTHORISATION_TOKEN", code);

  const authorisationCode = localStorage.getItem("AUTHORISATION_TOKEN");

  if (!authorisationCode) {
    const newCodeVerifier = cryptoRandomString({ length: 128 });
    localStorage.setItem("CODE_VERIFIER", newCodeVerifier);

    window.location.href = `https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${
      process.env.PREACT_APP_CLIENT_ID
    }&code_challenge=${newCodeVerifier}&redirect_uri=${encodeURIComponent(
      baseURL
    )}`;
  } else {
    try {
      const codeVerifier = localStorage.getItem("CODE_VERIFIER");

      const response = await axios.post(
        `${process.env.PREACT_APP_API_URL}/access_token`,
        {
          code: authorisationCode,
          codeVerifier,
          redirectUri: baseURL,
        }
      );

      saveTokenDetails(response.data);
      setLoggedIn(true);

      window.location.href = window.location.href.split("?")[0];
      cleanupAuthDetails();
    } catch (err) {
      console.error("Could not log in user...", err);
    }
  }
};

export const refreshTokens = async (setLoggedIn) => {
  try {
    const refreshToken = localStorage.getItem("USER_TOKEN_REFRESH");

    const response = await axios.post(
      `${process.env.PREACT_APP_API_URL}/refresh_token`,
      {
        refreshToken,
        redirectUri: localStorage.getItem("BASE_URL"),
      }
    );

    saveTokenDetails(response.data);
    setLoggedIn(true);
  } catch (err) {
    console.error("Could not refresh user tokens...", err);
  }
};

export const titleCase = (val) => `${val[0].toUpperCase()}${val.substr(1)}`;

export const radixFormat = (number) =>
  Array.from((number ?? 0).toString())
    .reverse()
    .map((num, i) => ((i + 1) % 3 === 0 ? `,${num}` : num))
    .reverse()
    .join("");

export const mathClamp = (val, min, max) => Math.max(Math.min(val, max), min);
