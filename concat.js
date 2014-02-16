/* concat.js
 * Given a directory of geojson files, concatenate them
 * into a single feature collection.
 */

(function() {
  var source_directory = "./tracks/";
  var output_filename = "all_tracks.geojson"
  var helpers = require('./helpers');
  var fs = require('graceful-fs');



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
    base.features = helpers.collectFeatures(source_directory);

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