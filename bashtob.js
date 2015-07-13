// A script to connect to atob server using primus.io

var atob = require("./client");

var printer = require("./printer");

var url = "localhost:3300";
atob.connect(url, function(client) {
  var home_socket = client.channel('ctrl_home');
  var board_socket = client.channel('ctrl_boards');

  // list out the posts on a board
  //  board_socket.send("list_posts", "b", function(ret) {
  //    console.log("POSTS ARE", JSON.stringify(ret, null, 2)); 
  //  });

  //  get a specific post by ID (includes its parent and siblings)
  board_socket.send("get_post", "34817", function(ret) {
    printer.full_post(ret);
  });

});
