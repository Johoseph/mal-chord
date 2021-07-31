import express from "express";
import axios from "axios";
import { Cache } from "memory-cache";

const animeCache = new Cache();

export const router = express.Router();

const generateHeaders = (clientId) => ({
  "Content-Type": "application/x-www-form-urlencoded",
  "X-MAL-Client-ID": process.env.CLIENT_ID,
  Authorization: `Bearer ${clientId}`,
});

const getSecondsWatched = (anime) => {
  const info = anime.node;
  const duration = info.average_episode_duration;
  let epsWatched = info.my_list_status.num_episodes_watched;

  if (info.my_list_status.is_rewatching)
    epsWatched +=
      info.num_episodes * (info.my_list_status.num_times_rewatched + 1);

  return duration * epsWatched;
};

// Get Access Token
router.post("/access_token", async (req, res) => {
  const response = await axios
    .post(
      "https://myanimelist.net/v1/oauth2/token",
      `client_id=${process.env.CLIENT_ID}&client_secret=${
        process.env.CLIENT_SECRET
      }&code=${req.body.code}&code_verifier=${
        req.body.codeVerifier
      }&grant_type=authorization_code&redirect_uri=${encodeURIComponent(
        req.body.redirectUri
      )}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
    .catch((err) => console.error(err));

  return res.status(200).json(response.data);
});

// Refresh access token
router.post("/refresh_token", async (req, res) => {
  const response = await axios
    .post(
      "https://myanimelist.net/v1/oauth2/token",
      `client_id=${process.env.CLIENT_ID}&client_secret=${
        process.env.CLIENT_SECRET
      }&refresh_token=${
        req.body.refreshToken
      }&grant_type=refresh_token&redirect_uri=${encodeURIComponent(
        "http://localhost:8080"
      )}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
    .catch((err) => console.error(err));

  return res.status(200).json(response.data);
});

// Get User Details
router.post("/user_details", async (req, res) => {
  const response = await axios
    .get("https://api.myanimelist.net/v2/users/@me", {
      headers: generateHeaders(req.body.userToken),
    })
    .catch((err) => console.error(err));

  return res.status(200).json(response.data);
});

// Get Anime/List Details
router.post("/user_anime_list", async (req, res) => {
  const userToken = req.body.userToken;

  // Empty large cache
  if (animeCache.size() >= 50) animeCache.clear();

  // Check cache
  if (animeCache.get(userToken))
    return res.status(200).json(animeCache.get(userToken));

  const response = await axios
    .get(
      `https://api.myanimelist.net/v2/users/@me/animelist?limit=1000&fields=genres,studios,rating,rank,popularity,average_episode_duration,num_episodes,my_list_status{num_times_rewatched},alternative_titles`,
      {
        headers: generateHeaders(userToken),
      }
    )
    .catch((err) => console.error(err));

  // Transform response
  const formattedResponse = response.data.data.map((anime) => ({
    title: anime.node.alternative_titles.en || anime.node.title,
    secondsWatched: getSecondsWatched(anime),
    genres: anime.node.genres.map((genre) => genre.name),
    image: anime.node.main_picture.medium,
    status: anime.node.my_list_status.status,
    score: anime.node.my_list_status.score,
    lastUpdated: anime.node.my_list_status.updated_at,
    popularity: anime.node.popularity,
    rank: anime.node.rank,
    rating: anime.node.rating,
    studios: anime.node.studios.map((studio) => studio.name),
  }));

  animeCache.put(userToken, formattedResponse, 600000);

  return res.status(200).json(formattedResponse);
});
