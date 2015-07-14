var request = require("request");
var Cookie = require("cookie");
var Primus = require("primus.io");

var _ = require("underscore");
global._ = _;
// To connect to ATOB server, we need to:
// 1. get a valid cookie
// 2. connect the socket server
// 3. subscribe to channels we are into


// URL of atob server


var url = process.env.ATOB_HOST || "atob.xyz";
function connect_to_atob(cb) {
  var atob_socket_path = "http://" + url;


  // Connect to atob server and get cookies so we can use them for auth
  request.get("http://" + url + "/pkg/status", function(err, response) {
    if (err) {
      cb(err);
      return;
    }

    // Parse cookies
    var cookie_header = response.headers['set-cookie'][0] || "";
    var cookies = Cookie.parse(cookie_header);

    // TODO: persist this cookie to disk so we don't create endless atob cups...
    var sid_cookie = cookies['connect.sid'];

    request.get(atob_socket_path + "/primus/spec", function(error, response, body) {
        var spec = JSON.parse(body);


        var options = { 
          path: spec.pathname,
        };

        // create a compatible primus server side client using the same parameters as the atob server
        var Socket = Primus.createSocket({ transformer: spec.transformer, parser: spec.parser } );

        // send our signed connect.sid cookie in the URL
        var client = new Socket("ws://" + url + "?connect.sid=" + sid_cookie, options);
        cb(null, client);


    
    });


  });


}

module.exports = {
  connect: connect_to_atob
};
