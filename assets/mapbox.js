mapboxgl.accessToken = 'pk.eyJ1IjoiY3RoMTAxMSIsImEiOiJjam1zeGxieXcwanVtM3dwOGM2MDYycHpsIn0.YprKfMh8soeZo9N3ooomhQ';
var afterMap = new mapboxgl.Map({
    container: 'after',
    style: 'mapbox://styles/mapbox/dark-v9',
    center: [120.983811,14.55768],
    zoom: 14
});
afterMap.on('load', function() {

  afterMap.addSource('jams', {
      "type": "geojson",
      "data": "https://cdn.rawgit.com/cth1011/mapbox/41dba205/SM%20data/jams-2018-10-06.geojson"
  });
  afterMap.addSource('alerts', {
      "type": "geojson",
      "data": "https://cdn.rawgit.com/cth1011/mapbox/41dba205/SM%20data/alerts-2018-10-06.geojson"
  });

    afterMap.addLayer({
        "id": "jams-heat",
        "type": "heatmap",
        "source": "jams",
        "maxzoom": 16,
        "paint": {
          // increase weight as diameter breast height increases
            "heatmap-weight": {
                "property": "delay",
                "type": "exponential",
                "stops": [
                    [1, 0],
                    [500, 1],
                    [1000,2],
                    [1500,3]
                ]
            },
          // increase intensity as zoom level increases
            "heatmap-intensity": {
                "stops": [
                    [9, 0],
                    [10, 2],
                    [15, 3]
                ]
            },
          // use sequential color palette to use exponentially as the weight increases
            "heatmap-color": [
                "interpolate",
                ["linear"],
                ["heatmap-density"],
                0, "rgba(47,174,192,0)",
                0.25, "rgb(47,174,192)",
                0.5, "rgb(251, 212, 72)",
                1.0, "rgba(233, 74, 47, 0.8)"
            ],
            // increase radius as zoom increases
            "heatmap-radius": {
                "stops": [
                    [13, 5],
                    [15, 15]
                ]
            },
            // decrease opacity to transition into the circle layer
            "heatmap-opacity": {
                "default": 1,
                "stops": [
                    [19, 1],
                    [20, 1]
                ]
            },
        }
    }, 'waterway-label');


        filter: ['==',['number',['get', 'hour']],12]
});

var beforeMap = new mapboxgl.Map({
    container: 'before',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [120.983811,14.55768],
    zoom: 14
});
beforeMap.on('load', function() {

  beforeMap.addSource('jams-before', {
      "type": "geojson",
      "data": "https://cdn.rawgit.com/cth1011/mapbox/41dba205/SM%20data/jams-2018-09-29.geojson"
  });
  var geojson = beforeMap.addSource('alerts-before', {
      "type": "geojson",
      "data": "https://cdn.rawgit.com/cth1011/mapbox/41dba205/SM%20data/alerts-2018-09-29.geojson"
  });

    beforeMap.addLayer({
        "id": "jams-heat-before",
        "type": "heatmap",
        "source": "jams-before",
        "maxzoom": 16,
        "paint": {
          // increase weight as diameter breast height increases
            "heatmap-weight": {
                "property": "delay",
                "type": "exponential",
                "stops": [
                  [1, 0],
                  [500, 1],
                  [1000,2],
                  [1500,3]
                ]
            },
          // increase intensity as zoom level increases
            "heatmap-intensity": {
                "stops": [
                  [9, 0],
                  [10, 2],
                  [15, 3]
                ]
            },
          // use sequential color palette to use exponentially as the weight increases
            "heatmap-color": [
                "interpolate",
                ["linear"],
                ["heatmap-density"],
                0, "rgba(47,174,192,0)",
                0.25, "rgb(47,174,192)",
                0.5, "rgb(251, 212, 72)",
                1.0, "rgba(233, 74, 47, 0.8)"
            ],
            // increase radius as zoom increases
            "heatmap-radius": {
                "stops": [
                    [13, 5],
                    [15, 15]
                ]
            },
            // decrease opacity to transition into the circle layer
            "heatmap-opacity": {
                "default": 1,
                "stops": [
                    [19, 1],
                    [20, 1]
                ]
            },
        }
    }, 'waterway-label');

        filter: ['==',['number',['get', 'hour']],12]
});
var map = new mapboxgl.Compare(beforeMap, afterMap, {
    // Set this to enable comparing two maps by mouse movement:
    // mousemove: true

});

// TIME SLIDER
document.getElementById('slider').addEventListener('input', function(e) {
  var hour = parseInt(e.target.value);
  // update the map
  afterMap.setFilter('alerts-marker', ['==', ['number', ['get', 'MANILA_HOUR']], hour]);
  afterMap.setFilter('jams-heat', ['==', ['number', ['get', 'MANILA_HOUR']], hour]);
  beforeMap.setFilter('alerts-marker-before', ['==', ['number', ['get', 'MANILA_HOUR']], hour]);
  beforeMap.setFilter('jams-heat-before', ['==', ['number', ['get', 'MANILA_HOUR']], hour]);

  // converting 0-23 hour to AMPM format
  var ampm = hour >= 12 ? 'PM' : 'AM';
  var hour12 = hour % 12 ? hour % 12 : 12;

  // update text in the UI
  document.getElementById('active-hour').innerText = hour12 + ampm;
});

//click on tree to view dbh in a popup
afterMap.on('click', 'alerts-marker', function (e) {
  new mapboxgl.Popup()
    .setLngLat(e.features[0].geometry.coordinates)
    .setHTML('<b>Type:</b> '+ e.features[0].properties.type)
    .addTo(map);
});
