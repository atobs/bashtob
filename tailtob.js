// A script to connect to atob server using primus.io

var atob = require("./client");
var url = "localhost:3300";
var printer = require("./printer");

atob.connect(url, function(client) {
  var home_socket = client.channel('ctrl_home');
  var board_socket = client.channel('ctrl_boards');

  // when a new post (thread) is made
  home_socket.on("new_post", printer.post);

  // when a new reply is made
  home_socket.on("new_reply", printer.post);
  
});
