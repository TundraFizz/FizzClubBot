_selectFlairUser(_ref15) {
  var _this15 = this;
  var subredditName = _ref15.subredditName,
    name            = _ref15.name,
    flairTemplateId = _ref15.flairTemplateId,
    text            = _ref15.text;

  return this._promiseWrap(_Promise.default.resolve(subredditName).then(function (displayName) {
    return _this15._post({
      uri: "r/".concat(displayName, "/api/selectflair"),
      form: {
        api_type,
        name: name,
        flair_template_id: flairTemplateId,
        text: text
      }
    });
  }));
}
