/* concat.js
 * Given a directory of geojson files, concatenate them
 * into a single feature collection.
 */

(function() {
  var fs = require('graceful-fs');
  var source_directory = "./tracks/";
  var output_filename = "all_tracks.geojson"

  function collectFeatures() {
    var features = [];

    var json_files = fs.readdirSync(source_directory)
    json_files.forEach(function(file) {
      // Move onto the next file if it does not have an
      // extension of GeoJSON
      if (!/\.geojson$/.test(file)) return;

      contents = fs.readFileSync(source_directory + file, 'utf-8')
      features.push(JSON.parse(contents));
    });

    console.log(features.length);

    return features;
  }

  function skeletonFeatureCollection() {
    return {
      type: 'FeatureCollection',
      crs: {
        type: "name",
        properties: {
          name: "urn:ogc:def:crs:OGC:1.3:CRS84"
        }
      },
      features: []
    }
  }

  function concat_geojson() {
    var base = skeletonFeatureCollection();
    base.features = collectFeatures();

    fs.writeFile(
      output_filename,
      JSON.stringify(base),
      function(err) {
        if (err) throw err;
        console.log("Saved to " + output_filename);
      }
    );
  }


  concat_geojson();

})();