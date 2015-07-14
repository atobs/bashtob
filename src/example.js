// A script to connect to atob server using primus.io

var atob = require("./client");

var url = "localhost:3300";
atob.connect(url, function(client) {
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

  //  write a new post and then respond to it
  //  var board = "test";
  //  board_socket.send("new_post", { 
  //      text: "some text from bashtob", 
  //      title: "bashtop post", 
  //      author: "anon", 
  //      tripcode: "some hash value", // the tripcode should be the md5sum of the input text, not the plain text
  //      board: board 
  //    }, function(post_id) {
  //        console.log("added new thread to atob in", "/" + board, post_id); 
  //
  //        board_socket.send("new_reply", { 
  //          post_id: post_id, 
  //          text: "some reply text from bashtob", 
  //          author: "anon", 
  //          tripcode: "diff hash value" 
  //        }, function() {
  //             console.log("responded to thread", post_id, "in", "/" + board);
  //          });
  //
  //     });
  
});
