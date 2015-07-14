global.window = {};
global.$ = require("cheerio");
global.marked = require("marked");

var xcolor = require("xcolor");
var tripcode = require("./tripcode");
var text = require("./text");



function print_post(post, options) {
  options = options || {};

  var colors = tripcode.get_colors_for_hash(post.tripcode);
  var color_str = _.map(colors, function(color) {
    return "{{bg #" + color + "}}  {{/color}}";
  }).join("");



  var titleEl = $("<div />").text(post.title);
  text.format_text(titleEl);
  var textEl = $("<div />").text(post.text);
  text.format_text(textEl);
  var reply_str = "";
  if (post.parent_id) {
    reply_str = "(reply to #" + post.parent_id + ")";
    xcolor.log("#" + (post.id || post.post_id) + " " + color_str, titleEl.text().trim(), textEl.text().trim());
  } else {

    xcolor.log(color_str, "#" + (post.id || post.post_id), reply_str, titleEl.text());
    if (textEl.text().trim()) {
      xcolor.log(textEl.text().trim());
    }
  }

}

module.exports = {
  post: function(post) {
    xcolor.log("");
    print_post(post);
  },
  full_post: function(post) {
    xcolor.log("");
    print_post(post);
    xcolor.log(""); 

    _.each(post.children, function(child) {
      print_post(child);
    });
    xcolor.log("\n"); 

  }

};
