  /**
  * Assigns flair to this user on a given subreddit (as a moderator).
  * @param {object} options
  * @param {string} options.subredditName The subreddit that flair should be assigned on
  * @param {string} [options.text=''] The text that the user's flair should have
  * @param {string} [options.cssClass=''] The CSS class that the user's flair should have
  * @returns {Promise} A Promise that fulfills with the current user after the request is complete
  * @example r.getUser('not_an_aardvark').assignFlair({subredditName: 'snoowrap', text: "Isn't an aardvark"})
  */
  selectFlairUser(options) {
    return this._r._selectFlairUser(_objectSpread({}, options, {
      name: this.name
    })).return(this);
  }
