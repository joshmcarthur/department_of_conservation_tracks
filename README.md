Department of Conservation Tracks
=================================

This repository contains a collection of all active DOC Tracks in New Zealand (including Chatham Islands) in GeoJSON format. If you're viewing this on Github, all of the GeoJSON files in the [tracks directory](https://github.com/joshmcarthur/department_of_conservation_tracks/tree/master/tracks) can be viewed on a map directly from your web browser.

I have made these files available to make it easier to consume the data from open data aggregation and mapping tools such as Leaflet, Mapbox and Google Maps. 

This data is also available directly from [DOC's Geoportal](http://geoportal.doc.govt.nz), however the data is not directly indexable in a single listing, is in ESRI's own proprietary JSON format, and is in the NZGD2000 projection, which is not directly or easily web-mappable. 

Source data remains under crown copyright, and obviously any conclusions you may draw from consuming this data are your own and should reflect the fact that this source data may be out of date, or incorrect.

**If you use this data for your own purposes, please respect the [terms of use](http://geoportal.doc.govt.nz/geoportal/catalog/content/disclaimer.page) by including the following copyright notice within the metadata of your project:**

> Crown Copyright: Department of Conservation Te Papa Atawhai [year]

This project includes scripts to download and convert data from DOC's web services into GeoJSON, and to concatenate all track geospatial information into a single viewable file. **The source code of these scripts are MIT-licensed. You are welcome to modify or use these scripts for your own purposes without any _requirement_ for acknowledgement**.

## Updating track data

If you need the latest data to be accessible to you, you can run the included script to download the latest track information from DOC's web services:

1. Download this project to your computer. If you are a [Git](http://git-scm.com) user, you can simply clone this repository. Alternatively, you can [download a ZIP file](https://github.com/joshmcarthur/department_of_conservation_tracks/archive/master.zip) of the source code.
2. Ensure you have the required tools to run these scripts. The scripts are written in [Node.js](http://nodejs.org) and uses [NPM](https://npmjs.org/) to manage dependencies (of which there are three). Ensure you can run `node` and `npm` in a terminal to test that your dependencies are installed correctly.
3. Install the project's dependencies by running `npm install` within the project directory. This shouldn't take long.
4. If you wish to update the DOC Track data, remove the existing tracks: `rm tracks/*.geojson`
5. Run the export script to create new GeoJSON files: `node export.js`. There are around 3,500 tracks, so this will take around half an hour to complete. Results are logged as the script runs.
6. Once this script is complete, you will have an updated set of track data in the `tracks` directory. 
7. **If you are a git user, I would welcome a pull request at this point to update the track information in the original repository!**
8. If you wish to have a single GeoJSON file containing all of the track information, you can run `node concat.js` to create a file in the project root called `all_tracks.geojson`.

## License

1. Track data is Crown Copyright: Department of Conservation Te Papa Atawhai 2014. Use with this attribution.
2. Other files, including this README, project metadata and source code, is MIT-licensed. Use as you will, not attribution required.

----

Data export and processing scripts were created by Josh McArthur ([Github](https://github.com/joshmcarthur) | [Twitter](https://twitter.com/sudojosh)). 

**Pull requests correcting or updating data are very welcome!**

