/* load_from_arcgis_server
 * Loads JSON from ArcGIS DOC Tracks server, then parses
 * it to get tracks path data in turn
 */

(function() {
  var http = require('http');
  var fs   = require('fs');
  var esri2geo = require('esri2geo');
  var transform = require('proj4geojson');

  var sourceProjectionString = "+proj=tmerc +lat_0=0 +lon_0=173 +k=0.9996 +x_0=1600000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";

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
    console.log("Queueing Feature #" + feature_id + " (" + current + " of " + total + ")\n");
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
        response.on('end', function() { writeGeoJSON(data); });
      }
    ).end();

    return null;
  }

  function generateFilename(feature_id) {
    return "tracks/track_" + feature_id.toString().replace(/\W/, '_') + ".geojson"
  }

  function prepareGeoJSON(esriFeature) {
    var geojson = {
      type: "Feature",
      properties: esriFeature.feature.attributes,
      geometry: function(paths) {
        if (paths.length === 1) {
          return {type: "LineString", coordinates: paths[0]};
        } else {
          return {type: "MultiLineString", coordinates: paths};
        }
      }(esriFeature.feature.geometry.paths)
    }

    // ESRI coordinates seem to be longitude-latitude, and the transformation
    // breaks if this is reversed. For this reason, we transform in-place, and
    // then reverse the order.

    var transformed = transform.to(geojson, sourceProjectionString);
    if (transformed.geometry.type == "MultiLineString") {
      transformed.geometry.coordinates.forEach(function(coordinates) {
        processCoordinatesArray(coordinates);
      });
    } else {
      processCoordinatesArray(transformed.geometry.coordinates);
    }

    return transformed;
  }

  function writeGeoJSON(response) {
    if(typeof response === "string") { response = JSON.parse(response); }
    var geojson = prepareGeoJSON(response);
    var filename = generateFilename(geojson.properties.OBJECTID);

    fs.writeFile(
      filename,
      JSON.stringify(geojson),
      function(err) { console.log(err ? ("Error saving feature " + JSON.stringify(json) + ": " + err) : ("Saved to " + filename)); }
    );
  }

  function processCoordinatesArray(coordinatesArray) {
    coordinatesArray.forEach(function(coordinatePair) {
      coordinatePair.reverse();
    });

    return coordinatesArray;
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

