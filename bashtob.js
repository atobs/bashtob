// A script to connect to atob server using primus.io

var request = require("request");
var Cookie = require("cookie");
var Primus = require("primus.io");

// To connect to ATOB server, we need to:
// 1. get a valid cookie
// 2. connect the socket server
// 3. subscribe to channels we are into
// 4. figure out how to post and list on the server...


// URL of server + where primus lives
var url = "localhost:3300";


function connect_to_atob(server_url, cb) {
  var spec_path = "primus/spec";
  var atob_socket_path = "http://" + url;


  // Connect to atob server and get cookies so we can use them for auth
  request.get("http://" + url, function(err, response) {
    if (err) {
      console.log("ERROR CONNECTING TO SERVER", err);
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
        var Socket = Primus.createSocket({ transformer: spec.transformer, parser: spec.parser } );

        // Find our signed connect.sid cookie
        var client = new Socket("ws://" + url + "?connect.sid=" + sid_cookie, options);

        cb(client);


    
    });


  });


}

connect_to_atob(url, function(client) {
  var home_socket = client.channel('ctrl_home');
  var board_socket = client.channel('ctrl_boards');

  // shows anonicators
  home_socket.on("anons", console.log);

  // burtle meter
  home_socket.on('meter', console.log);

  // when a new post (thread) is made
  home_socket.on("new_post", console.log);

  // when a new reply is made
  home_socket.on("new_reply", console.log);

  // list out the posts on a board
  //  board_socket.send("list_posts", "b", function(ret) {
  //    console.log("POSTS ARE", JSON.stringify(ret, null, 2)); 
  //  });

  // get a specific post by ID (includes its parent and siblings)
  // board_socket.send("get_post", "34817", function(ret) {
  //   console.log(JSON.stringify(ret, null, 2));
  // });

  // TODO: check if this works
  // write a new reply
  //  board_socket.send("new_reply", 
  //    { post_id: some_id, text: "some text", author: "anon", tripcode: "some hash value" });
  //
});
