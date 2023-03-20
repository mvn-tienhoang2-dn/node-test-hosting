/* eslint-disable */
export const displayMap = (locations) => {
  console.log(document.getElementById('map'));
  mapboxgl.accessToken =
    'pk.eyJ1IjoidGllbmhvYW5nMjAxMSIsImEiOiJjbGZjMWQwZ2oyZWo3M3pvNHcwY3VpYmlnIn0.BPrS5rZQ-07cL3TLYfi1IQ';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/tienhoang2011/clfc6lq2d000301mluqoptuke',
    scrollZoom: false,
    // center: [-74.5, 40],
    // zoom: 10,
  });
  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
