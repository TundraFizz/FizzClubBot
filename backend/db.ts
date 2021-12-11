/* eslint-disable brace-style */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable promise/param-names */

import * as mysql  from "mysql2";
// import axios from "axios";
// import { config } from "./server";
import { DatabaseInfo } from "./interfaces";

export class Database {
  private db: any; // eslint-disable-line

  constructor(dbInfo: DatabaseInfo) {
    this.db = mysql.createPool({
      host    : dbInfo.host,
      user    : dbInfo.user,
      password: dbInfo.password,
      database: dbInfo.database,
      multipleStatements: true
    }).promise();
  }

  async Query(sql: string, args?: any): Promise<any> { // eslint-disable-line
    let [rows]: any = await this.db.query(sql, args); // eslint-disable-line
    return rows;
  }

  // ==================== SELECT ====================
  async CheckSecret(secret: string): Promise<string|null> {
    const results = await this.Query(`SELECT username FROM users WHERE secret=?`, [secret]);
    if (results.length) return results[0].username;
    else                return null;
  }

  // ==================== INSERT ====================
  async InsertSecret(username: string, secret: string): Promise<void> {
    await this.Query(`
      INSERT INTO users (username, secret)
      VALUES (?,?)
      ON DUPLICATE KEY UPDATE
      username=VALUES(username), secret=VALUES(secret)
    `, [username, secret]);
  }

  // ==================== UPDATE ====================

  // ==================== DELETE ====================
}
