// This file contains env validation Joi Object

import { boolean, object, string } from 'joi';

// The Joi Object will validate env variables which are read from .env file
export const envValidationSchema = object({
  IGDB_API_BASE_URL: string().default('https://api.igdb.com/v4'),
  IGDB_API_TWITCH_OAUTH_TOKEN_URL: string().default(
    'https://id.twitch.tv/oauth2/token?client_id={twitchAppClientId}&client_secret={twitchAppClientSecret}&grant_type=client_credentials',
  ),
  IGDB_API_TWITCH_APP_CLIENT_ID: string().required(),
  IGDB_API_TWITCH_APP_CLIENT_SECRET: string().required(),

  POSTGRES_DB_URL: string().default('postgres://localhost:5432'),
  POSTGRES_DB_SSL_ENABLED: boolean().default(false),
  POSTGRES_DB_SSL_CA_CERT: string().when('POSTGRES_DB_SSL_ENABLED', {
    is: true,
    then: string().required(),
    otherwise: string().optional(),
  }),

  API_AUTH_SECRET_TOKEN: string().required(),
});
