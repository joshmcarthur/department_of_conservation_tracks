/* load_from_arcgis_server
 * Loads JSON from ArcGIS DOC Tracks server, then parses
 * it to get tracks path data in turn
 */

(function() {
  var http = require('http');
  var fs   = require('fs');

  function queryLayer(callback) {
    console.log("Loading all feature IDs...")
    request_callback = function(response) {
      var data = '';
      response.on('data', function(chunk) { data += chunk; });
      response.on('end', function() { callback(JSON.parse(data).objectIds); });
    }

    http.request(
      {
        host: 'geoportal.doc.govt.nz',
        path: '/ArcGIS/rest/services/GeoportalServices/DOC_Tracks/MapServer/0/query?geometryType=esriGeometryPoint&spatialRel=esriSpatialRelIntersects&where=1%3D1&returnCountOnly=false&returnIdsOnly=true&returnGeometry=false&f=pjson'
      },
      request_callback
    ).end();
  }

  function logFeature(feature_id, current, total) {
    console.log("Saving Feature #" + feature_id + " (" + current + " of " + total + ")\n");
  }

  function saveFeature(feature_id) {
    http.request(
      {
        host: 'geoportal.doc.govt.nz',
        path: '/ArcGIS/rest/services/GeoportalServices/DOC_Tracks/MapServer/0/' + feature_id + "?f=json"
      },
      function(response) {
        var data = ''
        response.on('data', function(chunk) { data += chunk })
        response.on('end', function() {
          var filename = generateFilename(feature_id)
          fs.writeFile(filename, data, function(err) {
            if (err) {
              console.log("Error saving feature #" + feature_id + ": " + err);
            } else {
              console.log("Saved to " + filename);
            }
          });
        });
      }
    ).end();

    return null;
  }

  function generateFilename(feature_id) {
    return "feature_" + feature_id.toString().replace(/\W/, '_') + ".json"
  }

  queryLayer(function(feature_ids) {
    feature_ids.forEach(
      function (feature_id) {
        logFeature(feature_id, feature_ids.indexOf(feature_id), feature_ids.length);
        saveFeature(feature_id);
      }
    )
  });

})();

