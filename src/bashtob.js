#!/usr/bin/env node

// A script to connect to atob server using primus.io

var atob = require("./client");

var printer = require("./printer");
var sys = require("sys");

var arg = process.argv[2];

function show_usage_and_exit() {
  console.log("Usage:", process.argv[0], "[/board] [post number]");
  process.exit(0);
}


if (!arg) {
  show_usage_and_exit();
}




// PARSE ARGS
// So... bashtob looks at a board or at a post...
var board, post;
if (arg[0] == '/') {
  board = arg.slice(1);
} else {

  post = arg;

  if (!/^\d+!?$/.test(post)) {
    show_usage_and_exit();
  }
}

  
// CONNECT AND PRINT STUFF OUT
var url = "atob.xyz";
atob.connect(url, function(client) {
  var board_socket = client.channel('ctrl_boards');

  if (board) {
    // list out the posts on a board
    board_socket.send("list_posts", board, function(ret) {
      _.map(ret, printer.post);
      process.exit(0);
    });
  }

  if (post) {
    var show_full = false;
    if (post.indexOf("!") !== -1) {
      show_full = true;
      
    }
    post = post.replace(/!/, '');
    //  get a specific post by ID (includes its parent and siblings)
    board_socket.send("get_post", post, function(ret) {
      if (show_full) { 
        printer.full_post(ret);
      } else {
        printer.post(ret);
      }
      process.exit(0);
    });
  }


});
