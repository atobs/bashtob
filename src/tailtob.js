#!/usr/bin/env node
// A script to connect to atob server using primus.io

var atob = require("./client");
var url = process.env.ATOB_HOST || "atob.xyz";
var printer = require("./printer");

atob.connect(url, function(client) {
  var home_socket = client.channel('ctrl_home');

  // when a new post (thread) is made
  home_socket.on("new_post", printer.post);

  // when a new reply is made
  home_socket.on("new_reply", printer.post);
  
});
