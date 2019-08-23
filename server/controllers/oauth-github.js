const request = require("request");
const URI = require("urijs");

module.exports = (oauthClientId, oauthSecret) => {
    const oAuthUri = URI("https://github.com/login/oauth/authorize").query({
        client_id: oauthClientId
    }).toString();

    authorise = (req, callback) => {
        const code = req.query.code;
        request({
            url: URI("https://github.com/login/oauth/access_token")
                .query({
                    "client_id": oauthClientId,
                    "client_secret": oauthSecret,
                    "code": code
                }).toString(),
            headers: { "Accept": "application/json" }
        }, (error, response, body) => {
            body = JSON.parse(body);
            if (body.error) {
                callback(null);
            } else {
                const token = body.access_token;
                request({
                    url: "https://api.github.com/user",
                    headers: { "User-Agent": "chat-grad-project", "Authorization": "token " + token }
                }, (err, res, bd) => {
                    const githubUser = JSON.parse(bd);
                    callback(githubUser, token);
                });
            }
        });
    }

    return {
      authorise: authorise,
      oAuthUri: oAuthUri
    };
};
