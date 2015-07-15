#!/usr/bin/env node

// A script to connect to atob server using primus.io

var atob = require("../client");
var xcolor = require("xcolor");

var printer = require("../printer");
var sys = require("sys");

var arg = process.argv[2];

function show_usage_and_exit() {
  console.log("Usage:", process.argv[0], "[/board] [post number]");
  process.exit(0);
}

// PARSE ARGS
// So... bashtob looks at a board or at a post...
var BOARD, POST;

if (arg) {
  if (arg[0] == '/') {
    BOARD = arg.slice(1);
  } else {
    POST = arg;

  }
}

  
// CONNECT AND PRINT STUFF OUT
atob.connect(function(err, client) {
  var board_socket = client.channel('ctrl_boards');

  if (!BOARD && !POST) {
    board_socket.send("recent_posts", function(ret) {
      console.log("");
      xcolor.log("{{#32CD32}}{{underline}}RECENT THREADS");
      _.each(_.first(ret.posts, 10), function(post) {
        console.log("");
        printer.post(post);
      });

      console.log("");
      xcolor.log("{{#32CD32}}{{underline}}RECENT REPLIES");
      _.each(_.first(ret.replies, 10), function(post) {
        printer.post(post);
      });

      process.exit(0);
    });

  }

  if (BOARD) {
    // list out the posts on a board
    board_socket.send("list_posts", BOARD, function(ret) {
      _.map(ret, printer.post);
      console.log("");
      process.exit(0);
    });
  }

  if (POST) {
    var show_full = false;
    if (POST.indexOf("!") !== -1) {
      show_full = true;
      
    }
    var post = POST.replace(/!/, '');
    //  get a specific post by ID (includes its parent and siblings)
    board_socket.send("get_post", post, function(ret) {
      if (show_full) { 
        printer.full_post(ret);
      } else {
        if (post !== (ret.post_id || ret.id)) {
          var children = _.filter(ret.children, function(r) {
            return (r.id || r.post_id) == post;
          });

          if (children.length) {
            ret = children[0];  
          }
        }

        printer.post(ret);
        console.log("");
      }
      process.exit(0);
    });
  }


});
