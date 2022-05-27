// This file will convert the env variables read from .env file to a proper object format

import { registerAs } from '@nestjs/config';

// This will register the applicationConfig as a provider with key = 'ENV_VARIABLES'
// We can access .env variables in the object format by just injecting this provider as dependency
export const applicationConfig = registerAs('ENV_VARIABLES', () => ({
  igdbApi: {
    baseURL: process.env.IGDB_API_BASE_URL,
    twitchAppOauthURL: process.env.IGDB_API_TWITCH_OAUTH_TOKEN_URL,
    twitchAppClientId: process.env.IGDB_API_TWITCH_APP_CLIENT_ID,
    twitchAppClientSecret: process.env.IGDB_API_TWITCH_APP_CLIENT_SECRET,
  },
  postgresDB: {
    url: process.env.POSTGRES_DB_URL,
    sslEnabled: process.env.POSTGRES_DB_SSL_ENABLED === 'true',
    sslCACert: process.env.POSTGRES_DB_SSL_CA_CERT,
  },
  apiAuth: {
    secretToken: process.env.API_AUTH_SECRET_TOKEN,
  },
}));

export default applicationConfig;
