/**
 * @example
 * {
 *   ENVIRONMENT: string; "local | dev | prod"
 *   mysql: {
 *     local: {
 *       host    : string; "localhost"
 *       user    : string; "root"
 *       password: string; ""
 *       database: string; "fizz_club"
 *     }
 *     dev: {
 *       host    : string; "mysql"
 *       user    : string; "root"
 *       password: string; "MySecretPassword"
 *       database: string; "fizz_club"
 *     }
 *     prod: {
 *       host    : string; "mysql"
 *       user    : string; "root"
 *       password: string; "MySecretPassword"
 *       database: string; "fizz_club"
 *     }
 *   }
 *   VERSION              : string; "PLACEHOLDER"
 *   CLIENT_ID_WEB_APP    : string; "PLACEHOLDER"
 *   CLIENT_SECRET_WEB_APP: string; "PLACEHOLDER"
 *   CLIENT_ID            : string; "PLACEHOLDER"
 *   CLIENT_SECRET        : string; "PLACEHOLDER"
 *   REDDIT_USER          : string; "PLACEHOLDER"
 *   REDDIT_PASS          : string; "PLACEHOLDER"
 *   RIOT_API_KEY         : string; "PLACEHOLDER"
 *   REDIRECT_URI         : string; "PLACEHOLDER"
 *   PLATFORM             : string; "PLACEHOLDER"
 *   SCOPE                : string; "PLACEHOLDER"
 * }
 */
export interface Config {
  ENVIRONMENT: string;
  mysql: {
    host    : string;
    user    : string;
    password: string;
    database: string;
  };
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

/**
 * @example
 * {
 *   host    : string; "mysql"
 *   user    : string; "root"
 *   password: string; "MySecretPassword"
 *   database: string; "fizz_club"
 * }
 */
export interface DatabaseInfo {
  host    : string;
  user    : string;
  password: string;
  database: string;
}
