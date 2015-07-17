module.exports = function calculate_md5(text) {
  var crypto = require('crypto');
  var md5sum = crypto.createHash('md5');

  return md5sum.update(text).digest('hex');
};
