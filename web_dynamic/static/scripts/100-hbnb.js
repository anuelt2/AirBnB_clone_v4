/* global $ */
$(document).ready(function () {
  /* Uncheck input checkboxes on page reload */

  $('INPUT.amenity, INPUT.state, INPUT.city').prop('checked', false);

  /* GET request to API to check status */

  $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
      $('DIV#api_status').addClass('available');
    } else {
      $('DIV#api_status').removeClass('available');
    }
  });

  /* POST request to API to fetch all places */

  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({}),
    success: function (allPlaces) {
      displayPlaces(allPlaces);
    }
  });

  /* Listen for changes on Amenities input checkbox tag */

  const selectedAmenities = {};

  $('INPUT.amenity').change(function () {
    const amenityId = $(this).attr('data-id');
    const amenityName = $(this).attr('data-name');

    if ($(this).is(':checked')) {
      selectedAmenities[amenityId] = amenityName;
    } else {
      delete selectedAmenities[amenityId];
    }

    $('DIV.amenities h4').text(Object.values(selectedAmenities).join(', '));
  });

  /* Listen for changes on locations States input checkbox tag */

  const selectedStates = {};

  $('INPUT.state').change(function () {
    const stateId = $(this).attr('data-id');
    const stateName = $(this).attr('data-name');

    if ($(this).is(':checked')) {
      selectedStates[stateId] = stateName;
    } else {
      delete selectedStates[stateId];
    }

    updateLocationsH4();
  });

  /* Listen for changes on locations Cities input checkbox tag */

  const selectedCities = {};

  $('INPUT.city').change(function () {
    const cityId = $(this).attr('data-id');
    const cityName = $(this).attr('data-name');

    if ($(this).is(':checked')) {
      selectedCities[cityId] = cityName;
    } else {
      delete selectedCities[cityId];
    }

    updateLocationsH4();
  });

  /* Function to merge selectedStates and selectedCities to update h4 tag */

  function updateLocationsH4 () {
    const locations = [
      ...Object.values(selectedStates),
      ...Object.values(selectedCities)
    ];
    $('DIV.locations h4').text(locations.join(', '));
  }

  /* Listen for click on button tag (search button)
   * POST request to API to fetch filtered Places
   */

  $('button').click(function () {
    const placesFiltered = {
      states: Object.keys(selectedStates),
      cities: Object.keys(selectedCities),
      amenities: Object.keys(selectedAmenities)
    };

    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(placesFiltered),
      success: function (places) {
        displayPlaces(places);
      }
    });
  });

  /* Function to display Places based on filters applied */

  function displayPlaces (places) {
    $('section.places').empty();

    places.forEach(place => {
      const placesSectionHTML = `
      <article>
        <div class="title_box">
          <h2>${place.name}</h2>
          <div class="price_by_night">$${place.price_by_night}</div>
        </div>
        <div class="information">
          <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
          <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
          <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
        </div>
        <div class="description">
          ${place.description}
        </div>
      </article>`;

      $('.places').append(placesSectionHTML);
    });
  }
});
