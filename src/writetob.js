#!/usr/bin/env node
// A script to connect to atob server using primus.io

var atob = require("./client");
var printer = require("./printer");
var prompt = require("prompt");

function calculate_md5(text) {
  var crypto = require('crypto');
  var md5sum = crypto.createHash('md5');

  return md5sum.update(text).digest('hex');


}

function write_post(client, board_id) {
  var board_socket = client.channel('ctrl_boards');
  prompt.start();

  prompt.message = ">";
  prompt.delimiter = ":";
  var schema = {
    properties: {
      board: {
        default: board_id
      },
      title: {

      },
      text: {

      },
      author: {
        default: "anon"
      },
      tripcode: {

      }
    }
  };


  prompt.get(schema, function(err, result) {
    if (err) {
      process.exit(-1);
    }

    var tripcode = result.tripcode;

    var reply_data = { 
      text: result.text,
      post_id: 0,
      board: result.board || "b",
      author: result.author,
      title: result.title,
      tripcode: calculate_md5(result.author + ":" + calculate_md5(tripcode))
    };

    printer.post(reply_data);

    prompt.get([ {
      name: "submit", default: "y" }], function(err, result) {
      if (err) {
        process.exit(0);
      }

      reply_data.tripcode = calculate_md5(tripcode);

      if (result.submit !== "yes" && result.submit !== "y") {
        process.exit(0);
      }

      board_socket.send("new_post", reply_data, function() {
        console.log("Submitted post!");
        process.exit(0);
      });
    });
  });



}

function write_reply(client, post_id) {
  var board_socket = client.channel('ctrl_boards');
  // get a specific post by ID (includes its parent and siblings)
  board_socket.send("get_post", post_id, function(ret) {
    printer.full_post(ret);

    if (!ret) {
      console.log("Couldn't find post", post_id);
    }

    console.log("^^^^ REPLYING TO ^^^^\n");
    prompt.start();

    prompt.message = ">";
    prompt.delimiter = ":";
    var schema = {
      properties: {
        text: {

        },
        author: {
          default: "anon"
        },
        tripcode: {

        }
      }
    };

    prompt.get(schema, function(err, result) {
      if (err) {
        process.exit(-1);
      }

      var post_id = ret.post_id || ret.id; 
      var tripcode = result.tripcode;

      var reply_data = { 
        post_id: post_id,
        text: result.text,
        author: result.author,
        title: "",
        tripcode: calculate_md5(result.author + ":" + calculate_md5(tripcode))
      };

      printer.post(reply_data);

      prompt.get([ {
        name: "submit", default: "y" }], function(err, result) {
        if (err) {
          process.exit(0);
        }

        reply_data.tripcode = calculate_md5(tripcode);

        if (result.submit !== "yes" && result.submit !== "y") {
          process.exit(0);
        }

        board_socket.send("new_reply", reply_data, function() {
          console.log("Submitted reply!");
          process.exit(0);
        });
      });
    });

  });
  
}

var url = process.env.ATOB_HOST || "atob.xyz";
atob.connect(url, function(err, client) {

  var arg = process.argv[2];

  if (arg.indexOf("/") === 0) {
    write_post(client, arg.slice(1));
  } else {
    write_reply(client, arg);
  }


});
