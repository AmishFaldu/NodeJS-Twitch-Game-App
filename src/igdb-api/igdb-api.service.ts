import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import applicationConfig from '../config/application.config';
import { IGDBGameDTO } from './dtos/igdb-game.dto';
import { GetSpecificGameDTO } from './dtos/get-specific-game.dto';

@Injectable()
export class IgdbApiService {
  // This is the auth token provided by the twitch api
  // This will be used in igdb api bearer auth token
  private authToken: string;

  // This is the date at which the auth token will expire
  // We will use this to update the auth token when it is expired
  private authTokenExpiryDate: Date;

  // This is the base axios instance which contains all the basic and common stuff for making api calls to igdb api
  private axiosInstance: AxiosInstance;

  constructor(
    @Inject(applicationConfig.KEY)
    private appConfig: ConfigType<typeof applicationConfig>,
  ) {
    this.axiosInstance = axios.create({
      baseURL: appConfig.igdbApi.baseURL,
      headers: { 'Client-ID': appConfig.igdbApi.twitchAppClientId },
    });
  }

  /**
   * This method is used to set the updated expiry date for the new token generated.
   * It adds the seconds to the date object.
   * @param tokenExpirySeconds Number of seconds to add to the date
   */
  private setAuthTokenExpiryDate(tokenExpirySeconds: number): void {
    const currentDate = new Date();

    // We will minus 100 seconds from actual seconds
    // So we update the auth token before its actual expiry time
    const secondsToAddToDate = tokenExpirySeconds - 100;
    currentDate.setSeconds(currentDate.getSeconds() + secondsToAddToDate);
    this.authTokenExpiryDate = currentDate;
  }

  /**
   * This method is used to check whether the auth token is expired or not
   * @returns boolean
   */
  private isAuthTokenExpired(): boolean {
    if (!this.authTokenExpiryDate || !this.authToken) {
      return true;
    }

    const currentDate = new Date();
    if (currentDate >= this.authTokenExpiryDate) {
      return true;
    }

    return false;
  }

  /**
   * This getter is used commonly to fetch all the fields of the game object
   */
  private get gameFields() {
    const fields = [];
    fields.push('alternative_names.name');
    fields.push('category');
    fields.push('collection.name,collection.slug,collection.url');
    fields.push('cover.url');
    fields.push('created_at');
    fields.push('first_release_date');
    fields.push('follows');
    fields.push('franchise.name,franchise.slug,franchise.url');
    fields.push('game_engines.name,game_engines.description,game_engines.url');
    fields.push('game_modes.name,game_modes.slug,game_modes.url');
    fields.push('genres.name,genres.url,hypes,name,slug');
    fields.push('platforms.name,platforms.url,rating,rating_count');
    fields.push('release_dates.human');
    fields.push('screenshots.url,status');
    fields.push('websites.url');
    fields.push(
      'storyline,summary,total_rating,total_rating_count,url,version_title',
    );
    fields.push('videos.video_id,videos.name');
    return fields;
  }

  /**
   * This method is used to update the auth token used by igdb api
   */
  private async updateToken() {
    try {
      // Before updating token check if this auth token requires update
      const shouldUpdateToken = this.isAuthTokenExpired();
      if (!shouldUpdateToken) {
        return;
      }

      let twitchOauthUrl = this.appConfig.igdbApi.twitchAppOauthURL;
      twitchOauthUrl = twitchOauthUrl.replace(
        '{twitchAppClientId}',
        this.appConfig.igdbApi.twitchAppClientId,
      );
      twitchOauthUrl = twitchOauthUrl.replace(
        '{twitchAppClientSecret}',
        this.appConfig.igdbApi.twitchAppClientSecret,
      );

      const requestConfig: AxiosRequestConfig = {
        method: 'POST',
        url: twitchOauthUrl,
      };
      const response = await axios(requestConfig);
      this.authToken = response.data.access_token;
      this.setAuthTokenExpiryDate(response.data.expires_in);

      // Update axios instance to use the updated auth token
      this.axiosInstance = axios.create({
        baseURL: this.appConfig.igdbApi.baseURL,
        headers: {
          'Client-ID': this.appConfig.igdbApi.twitchAppClientId,
          Authorization: `Bearer ${this.authToken}`,
        },
      });
    } catch (error) {
      Logger.error(
        `igdb-api.service : updateToken : Something went wrong while getting token from twitch : ${error}`,
        error,
      );
    }
  }

  /**
   * This method is used to fetch all the games in paginated fashion
   * @param skip The number of games to skip
   * @param limit The number of games to return
   * @returns An array of all the game objects
   */
  async getAllGamesPaginated({
    skip,
    limit,
  }: {
    skip: number;
    limit: number;
  }): Promise<IGDBGameDTO[]> {
    try {
      // Before calling API update token if it is necessary
      await this.updateToken();

      const response = await this.axiosInstance.post(
        '/games',
        `fields ${this.gameFields}; limit ${limit}; offset ${skip};`,
      );
      return response.data;
    } catch (error) {
      Logger.error(
        `igdb-api.service : getAllGamesPaginated : Something went wrong while getting games from igdb : ${error}`,
      );
    }
    return [];
  }

  /**
   * This method is used to query for specific games only
   * @param payload GetSpecificGameDTO
   * @param skip The number of games to skip
   * @param limit The number of games to return
   * @returns An array of all the filtered game objects
   */
  async getSpecificGame({
    payload,
    skip,
    limit,
  }: {
    payload: GetSpecificGameDTO;
    skip: number;
    limit: number;
  }): Promise<IGDBGameDTO[]> {
    try {
      // Before calling API update token if it is necessary
      await this.updateToken();

      let searchClause = null;
      if (payload?.name) {
        searchClause = ` search "${payload.name}";`;
      }

      let whereClause = null;
      if (
        payload?.followers >= 0 ||
        payload?.rating >= 0 ||
        payload?.totalRating >= 0
      ) {
        whereClause = ` where`;
        if (payload?.followers >= 0) {
          whereClause += ` follows >= ${payload.followers} &`;
        }

        if (payload?.rating >= 0) {
          whereClause += ` rating >= ${payload.rating} &`;
        }

        if (payload?.totalRating >= 0) {
          whereClause += ` total_rating >= ${payload.totalRating} &`;
        }

        whereClause = whereClause.slice(0, -2);
        whereClause += ';';
      }

      let dataToPass = `fields ${this.gameFields}; limit ${limit}; offset ${skip};`;

      if (searchClause) {
        dataToPass += searchClause;
      }

      if (whereClause) {
        dataToPass += whereClause;
      }

      const response = await this.axiosInstance.post('/games', dataToPass);

      return response.data;
    } catch (error) {
      Logger.error(
        `igdb-api.service : getAllSpecificGames : Something went wrong while getting games from igdb : ${error}`,
      );
    }
    return [];
  }
}
