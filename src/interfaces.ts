export interface Config {
  VERSION              : string;
  CLIENT_ID_WEB_APP    : string;
  CLIENT_SECRET_WEB_APP: string;
  CLIENT_ID            : string;
  CLIENT_SECRET        : string;
  REDDIT_USER          : string;
  REDDIT_PASS          : string;
  RIOT_API_KEY         : string;
  REDIRECT_URI         : string;
  PLATFORM             : string;
  SCOPE                : string;
}

export interface Flair {
  name    : string;
  text    : string;
  cssClass: string;
}
