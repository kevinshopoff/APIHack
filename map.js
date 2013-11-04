function initialize() {
  var mapOptions = {
    zoom: 8,
    center: new google.maps.LatLng(-34.397, 150.644),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  var map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
}

function loadScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&' +
      'callback=initialize';
  document.body.appendChild(script);
}
$(document).ready(function() {
	/*when the button is clicked*/
	$("#btn").on("click", function() {
		var currentSearch = $('input[name="searchString"]').val();
		console.log("You want to search for " + currentSearch);
		return false;
	});

	
	var geocoder;
	var map;
	
	geocoder = new google.maps.Geocoder();
	
	function plotAddress(mySearch) {
		var address = mySearch;
		geocoder.geocodr( {'address': address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				map.setCenter(results[0].geometry.location);
				var marker = new google.maps.Marker({
					map: map,
					position: results[0].geometry.location
				});
			} else {
				alert('Geocode was not successful for the following reason: ' + status);
			}
		});
	}
	

	/*this still needs to be updated for the map hack*/
	/*when Enter is pressed*/
	$('body').on("keypress", function(event) {
		if (event.which === 13) {
			var currentSearch = $('input[name="searchString"]').val();
			console.log("You want to search for " + currentSearch);
			plotAddress(currentSearch)
			return false;
		}
	});
});

window.onload = loadScript;