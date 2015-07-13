global.window = {};
global.$ = require("cheerio");
global.window.md5 = require("md5sum").calculate;
global.marked = require("marked");

var xcolor = require("xcolor");
var tripcode = require("./tripcode");
var text = require("./text");



function print_post(post, options) {
  options = options || {};

  var colors = tripcode.get_colors_for_hash(post.tripcode);
  var color_str = _.map(colors, function(color) {
    return "{{bg #" + color + "}} {{/color}}";
  }).join("");



  var titleEl = $("<div />").text(post.title);
  text.format_text(titleEl);
  var textEl = $("<div />").text(post.text);
  text.format_text(textEl);
  var reply_str = "";
  if (post.parent_id) {
    reply_str = "(reply to #" + post.parent_id + ")";
  }

  xcolor.log(color_str, "#" + post.id || post.post_id, reply_str, titleEl.text());
  xcolor.log(textEl.text().trim());

}

module.exports = {
  post: function(post) {
    xcolor.log("");
    print_post(post);
    xcolor.log("\n"); 
  },
  full_post: function(post) {
    xcolor.log("");
    print_post(post);
    xcolor.log("\n"); 

    _.each(post.children, function(child) {
      print_post(child);
    });
    xcolor.log("\n"); 

  }

};
