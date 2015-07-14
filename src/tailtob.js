#!/usr/bin/env node
// A script to connect to atob server using primus.io

var atob = require("./client");
var url = process.env.ATOB_HOST || "atob.xyz";
var printer = require("./printer");

var timeout = 200;
var CLIENT;
function tailtob() {
  timeout = timeout * 2;
  timeout = Math.min(timeout, 30000);
  atob.connect(url, function(err, client) {
    if (err) {
      console.log("Error connecting to server, reconnecting in", timeout + "ms");
      setTimeout(tailtob, timeout);
      return;
    }

    CLIENT = client;

    timeout = 1000;

    console.log("Burtles sighted... tailing the tob!");


    var home_socket = client.channel('ctrl_home');

    // when a new post (thread) is made
    home_socket.on("new_post", printer.post);

    // when a new reply is made
    home_socket.on("new_reply", printer.post);
    
  });

}

process.on("uncaughtException", function() {
  console.log("Error... reconnecting...");
  if (CLIENT) {
    CLIENT.end();
    CLIENT = null;
  }

  tailtob();
});

tailtob();
