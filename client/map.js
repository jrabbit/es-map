window.onload = function () {
  $('html').addClass('loaded')

  /* SIGNUP FORMS */

  $('form#signup select[name="country"]').change(function () {
    var country = $(this).val()
    $('form#signup select[name="country"]').each(function () {
      $(this).val(country)
    })
  })

  $('form#signup').submit(function () {
    $('#signup-overlay').addClass('shown')
    return false
  })

  $('form#signup-details input[name="privacy-policy"]').change(function () {
    console.log('check')
    $('form#signup-details input[type="submit"]').prop('disabled', !($(this).prop('checked')))
  })

  $('form#signup-details').submit(function () {
    var country = $('form#signup select[name="country"]').val() || $('#country-code-placeholder').text().trim()
    var email = $('form#signup-details input[name="email"]').val()
    var city = $('form#signup-details input[name="city"]').val()
    var postalCode = $('form#signup-details input[name="postal-code"]').val()
    var doSendNewsletter = $('form#signup-details input[name="do-send-newsletter"]').prop('checked')

    console.log(country, email)

    $.post('https://www.earth-strike.com/signup.php', {
      'country': country,
      'postal-code': postalCode,
      'city': city,
      'email': email,
      'send-newsletter': (doSendNewsletter ? 'send' : 'dont-send')
    }, function (res) {
      if (res == 'OK') {
        $('form#signup-details *').fadeOut(300)

        window.setTimeout(function () {
          $('form#signup-details').empty().append('<p style="opacity: 0; color: #387740; margin-top: 20px;">Thanks for signing up!</p>')
          $('#signup-overlay form#signup-details').append('<input type="button" value="OK" style="opacity: 0; margin-top: 20px;" />')

          $('form#signup-details *').animate({ opacity: 1 }, 300)
          $('#signup-overlay form#signup-details input[type="button"]').click(function () {
            $('#signup-overlay').removeClass('shown')
          })
        }, 350)
      } else if (res == 'EMAIL_IN_USE') {
        if (!($('form#signup-details p#email-in-use').length)) {
          $('form#signup-details').append('<p id="email-in-use" style="opacity: 0; color: #d69077; margin-top: 20px;">Email in use!</p>')
          $('form#signup-details p#email-in-use').animate({ opacity: 1 }, 300)
        }
      } else {
        console.log('error', res)
      }
    })

    return false
  })

  $('#signup-overlay form input[name="cancel"]').click(function () {
    $('#signup-overlay').removeClass('shown')
    return false
  })

  /* MATERIAL PAGES */

  $('#materials-buttons button#print').click(function () {
    // print the src of <img id="material-image">
  })

  $('#materials-buttons button#download').click(function () {
    // download the src of <img id="material-image">
  })
}

/* EVENT MAPS */

function initMaps () {
  // triggered by google maps callback!
  // olyfill for ie already loaded
  fetch('http://192.168.1.3:9999/api/events')
    .then(res => res.json())
    .catch(error => console.error('Error: ', error))
    .then(response => initEventsMap(response))
  fetch('http://192.168.1.3:9999/api/chapters')
    .then(res => res.json())
    .catch(error => console.error('Error: ', error))
    .then(response => initChaptersMap(response))
}

function initEventsMap (json) {
  // don't load map when in editor because js doesn't like it
  if ($('html.et-fb-root-ancestor').length) { return }

  $('#events-map').each(function () {
    // Creating a new map
    var map = new google.maps.Map(this, {
      streetViewControl: false,
      mapTypeControl: false,
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#70ad78' }] },
        { elementType: 'labels.text.stroke', stylers: [{ 'visibility': 'off' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#000000' }] },
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#000000' }]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{ 'visibility': 'off' }]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{ 'visibility': 'off' }]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{ 'visibility': 'off' }]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{ 'visibility': 'off' }]
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{ 'visibility': 'off' }]
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{ 'visibility': 'off' }]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{ 'visibility': 'off' }]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{ 'visibility': 'off' }]
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.fill',
          stylers: [{ 'visibility': 'off' }]
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [{ 'visibility': 'off' }]
        },
        {
          featureType: 'transit.station',
          elementType: 'labels.text.fill',
          stylers: [{ 'visibility': 'off' }]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#2d595d' }]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{ 'visibility': 'off' }]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [{ 'visibility': 'off' }]
        }
      ]
    })

    var geocoder = new google.maps.Geocoder()
    geocoder.geocode({ 'address': document.title }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location)
        map.fitBounds(results[0].geometry.viewport)
      }
    })

    // stock JSON data until we get it from the database
    var json = response

    // Creating a global infoWindow object that will be reused by all markers
    var infoWindow = new google.maps.InfoWindow({
      maxWidth: 320
    })

    // Looping through the JSON data
    for (var i = 0, length = json.length; i < length; i++) {
	  var data = json[i]

      var latLng = new google.maps.LatLng(data.latitude, data.longitude)

      // Creating a marker and putting it on the map
      var marker = new google.maps.Marker({
        position: latLng,
        map: map,
        title: data.name,
        icon: 'https://i.imgur.com/56wPFne.png'
      })

      // this can be polished up
      var contentString = ''
      contentString += '<span class="event-title">' + (data.name) + '</span>'
      contentString += (data.description) + (data.datetime) + '<br><br><a href="' + (data.page_url) + '">' + (data.page_url) + '</a>';

      // Creating a closure to retain the correct data
      (function (marker, data) {
        // Attaching a click event to the current marker
        google.maps.event.addListener(marker, 'click', function (e) {
          infoWindow.setContent(contentString)
          infoWindow.open(map, marker)
        })
      })(marker, data)
    }
  })
}

/* CHAPTERS MAP */

function initChaptersMap (response) {
  // don't load map when in editor because js doesn't like it
  if ($('html.et-fb-root-ancestor').length) { return }

  $('#chapters-map').each(function () {
    // Creating a new map
    var map = new google.maps.Map(this, {
      center: { lat: 20, lng: 0 },
      zoom: 2,
      streetViewControl: false,
      mapTypeControl: false,
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#70ad78' }] },
        { elementType: 'labels.text.stroke', stylers: [{ 'visibility': 'off' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#000000' }] },
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#000000' }]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{ 'visibility': 'off' }]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{ 'visibility': 'off' }]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{ 'visibility': 'off' }]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{ 'visibility': 'off' }]
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{ 'visibility': 'off' }]
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{ 'visibility': 'off' }]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{ 'visibility': 'off' }]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{ 'visibility': 'off' }]
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.fill',
          stylers: [{ 'visibility': 'off' }]
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [{ 'visibility': 'off' }]
        },
        {
          featureType: 'transit.station',
          elementType: 'labels.text.fill',
          stylers: [{ 'visibility': 'off' }]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#2d595d' }]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{ 'visibility': 'off' }]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [{ 'visibility': 'off' }]
        }
      ]
    })

    // stock JSON data until we get it from the database
    var json = response

    // Looping through the JSON data
    for (var i = 0, length = json.length; i < length; i++) {
	  var data = json[i]

      // callback for after we get lat and long
      var addIcon = function (data, latLng) {
        // Resize icons
        var icon = {
          url: data.logo_url,
          scaledSize: new google.maps.Size(40, 40),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(20, 20)
        }

        // Creating a marker and putting it on the map
        var marker = new google.maps.Marker({
          position: latLng,
          map: map,
          title: data.name,
          icon: icon
        });

        // Creating a closure to retain the correct data
        (function (marker, data) {
          // Attaching a click event to the current marker
          google.maps.event.addListener(marker, 'click', function (e) {
            window.location.href = data.url
          })
        })(marker, data)
      }

      if (data.latitude) {
        latLng = new google.maps.LatLng(data.latitude, data.longitude)
        addIcon(data, latLng)
      } else {
        (function (data) {
          var geocoder = new google.maps.Geocoder()
          geocoder.geocode({ 'address': data.name }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              addIcon(data, results[0].geometry.location)
            }
          })
        })(data)
      }
    }
  })
}
