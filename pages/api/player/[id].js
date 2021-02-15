/**
 * Endpoint to retrieve player specific gameweek data.
 * Pass in player ID through req.query.id, and run request
 * Using https.request - maybe I can switch to something a bit less low-level in future
 * config file at end of file stops the unresolved requests Nextjs throws.
 */

var https = require('follow-redirects').https;

export default function handler(req, res) {

  var options = {
    'method': 'GET',
    'hostname': 'fantasy.premierleague.com',
    'path': `/api/element-summary/${req.query.id}/`,
    'maxRedirects': 20
  };
  
  var request = https.request(options, (rsp) => {
    var chunks = [];
  
    rsp.on("data", function (chunk) {
      chunks.push(chunk);
    });
  
    rsp.on("end", function (chunk) {
      var body = Buffer.concat(chunks);
      res.status(200).json(body)
    });
  
    rsp.on("error", function (error) {
      console.error(error);
    });
  })

  request.end()
}

// Being resolved by FPL's server
export const config = {
  api: {
    externalResolver: true,
  },
}
