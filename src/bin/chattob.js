#!/usr/bin/env node

var atob = require("../client");
var printer = require("../printer");


var CLIENT;
var SINCE = Date.now() - (60 * 1000 * 60 * 24);
var timeout = 200;
function tailtob() {
  timeout = timeout * 2;
  timeout = Math.min(timeout, 30000);
  atob.connect(function(err, client) {
    if (err) {
      console.log("Error connecting to server, reconnecting in", timeout + "ms");
      setTimeout(tailtob, timeout);
      return;
    }

    CLIENT = client;

    timeout = 1000;

    console.log("Shouting into the void...");

    var board_socket = client.channel('ctrl_boards');
    var home_socket = client.channel('ctrl_home');

    board_socket.send("chats", Date.now() - SINCE, function(ret) {
      if (ret.length > 30) {
        console.log("SKIPPING", ret.length - 30);
      }

      ret.reverse();
      ret = _.last(ret, 30);
      _.each(ret, printer.post);
      SINCE = Date.now();
    });



    // when a new reply is made
    home_socket.on("new_chat", printer.post);

  });

}

process.on("uncaughtException", function(err) {
  console.log("Error... reconnecting...");
  console.log(err);

  if (CLIENT) {
    CLIENT.end();
    CLIENT = null;
  }

  tailtob();
});

tailtob();

