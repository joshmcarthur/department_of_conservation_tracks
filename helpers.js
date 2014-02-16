(function() {
  var fs = require('graceful-fs');

  var collectFeatures = function(source_directory) {
    if (!source_directory) source_directory = './tracks';

    var features = [];

    var json_files = fs.readdirSync(source_directory)
    json_files.forEach(function(file) {
      // Move onto the next file if it does not have an
      // extension of GeoJSON
      if (!/\.geojson$/.test(file)) return;

      contents = fs.readFileSync(source_directory + file, 'utf-8')
      features.push(JSON.parse(contents));
    });

    return features;
  }

  module.exports = exports = {collectFeatures: collectFeatures};

})();