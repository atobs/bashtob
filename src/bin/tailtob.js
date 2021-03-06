#!/usr/bin/env node
// A script to connect to atob server using primus.io

var atob = require("../client");
var printer = require("../printer");
var post_store = require("../post_store");

var timeout = 200;
var CLIENT;
// PARSE ARGS
// So... bashtob looks at a board or at a post...
var BOARD, POST, ORIG_POST;
var arg = process.argv[2];

var SINCE = Date.now() - (60 * 60 * 1000 * 24);

if (arg) {
  if (arg[0] == '/') {
    BOARD = arg.slice(1);
    console.log("Following", "/" +  BOARD);
  } else {
    POST = arg;
    ORIG_POST = POST;
  }
}

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

    console.log("Burtles sighted... tailing the tob!");

    var board_socket = client.channel('ctrl_boards');
    if (POST) {
      board_socket.send("get_post", POST, function(post) {
        POST = post.parent_id || post.thread_id || post.id;
        console.log("Following thread", "#" + POST, "(parent of", "#" + ORIG_POST + ")");
      });
    }


    var home_socket = client.channel('ctrl_home');

    board_socket.send("since", Date.now() - SINCE, function(ret) {
      if (ret.length > 30) {
        console.log("SKIPPING", ret.length - 30);
      }

      ret.reverse();
      ret = _.last(ret, 30);
      _.each(ret, filtered_print);
      SINCE = Date.now();
    });


    

    function filtered_print(ret) {
      SINCE = Date.now();
      post_store[ret.post_id || ret.id] = ret;

      if (!BOARD && !POST) {
        printer.post(ret);
        return;
      }

      if (BOARD) {
        if (ret.board_id == BOARD) {
          printer.post(ret);

        }
      }

      if (POST) {
        if (ret.thread_id == POST) {
          printer.post(ret);
        }
      }
    }

    // when a new post (thread) is made
    home_socket.on("new_post", filtered_print);
     
    // when a new reply is made
    home_socket.on("new_reply", filtered_print);

  });

}

process.on("uncaughtException", function(err) {
  console.log("Error", err);

  if (CLIENT) {
    CLIENT.end();
    CLIENT = null;
  }

  tailtob();
});

tailtob();
