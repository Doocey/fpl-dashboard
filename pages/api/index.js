/**
 * Endpoint to retrieve default endpoint
 * Returns FPL game rules, overall stats, and every single footballer on the game.
 */

var https = require('follow-redirects').https;

export default function handler(req, res) {

  var options = {
    'method': 'GET',
    'hostname': 'fantasy.premierleague.com',
    'path': `/api/bootstrap-static/`,
    'headers': {
    },
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
