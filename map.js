var google = google || {};
var geocoder;
var map;
var startLat;
var startLong;
var endLat;
var endLong;

function initialize() {
	var mapOptions = {
		zoom: 8,
		center: new google.maps.LatLng(-34.397, 150.644),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  
	geocoder = new google.maps.Geocoder();
 
	console.log('geocoder: ', geocoder);
}

function loadScript() {
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&' +
      'callback=initialize';
	document.body.appendChild(script);
}

function getDirections(start, finish) {
	console.log('Get Directions from: ' + start + ' to: ' + finish);
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = 'http://maps.googleapis.com/maps/api/directions/json?origin=' + start + '&destination=' + finish + '&sensor=false&' + 
		'callback=blah';
	console.log(script.src);
	document.body.appendChild(script);
	console.log('end of Get Directions');
	    /*$.ajax({ 
        type: 'GET',
        url: 'http://maps.googleapis.com/maps/api/directions/json?origin=Toronto&destination=Montreal&sensor=false' ,
        dataType: 'json', 
        success: function(data) { 
            alert('success');
        }
    });*/
}

function blah() {
	console.log('blah');
};


	function plotAddress(mySearch) {
		var address = mySearch;
		geocoder.geocode( {'address': address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				map.setCenter(results[0].geometry.location);
				startLat = results[0].geometry.location.lb;
				startLong = results[0].geometry.location.mb;
				var marker = new google.maps.Marker({
					map: map,
					position: results[0].geometry.location
				});
				var hereToThere = getDirections('Dallas', address);
				console.log('Got back to plotAddress');
				console.log(hereToThere);
				/*var hereToThere = 'http://maps.googleapis.com/maps/api/directions/json?origin=Toronto&destination=Montreal&sensor=false&callback=blah'
				$.getJSON(hereToThere, function(data) {
					console.log(data);
				});*/
			} else {
				alert('Geocode was not successful for the following reason: ' + status);
			}
		});
	}
	
$(document).ready(function() {	
	/*when the button is clicked*/
	$("#btn").on("click", function() {
		var currentSearch = $('input[name="searchString"]').val();
		console.log("You want to search for " + currentSearch);
		plotAddress(currentSearch)
		return false;
	});

	/*this still needs to be updated for the map hack*/
	/*when Enter is pressed*/
	$('body').on("keypress", function(event) {
		if (event.which === 13) {
			var currentSearch = $('input[name="searchString"]').val();
			console.log("You want to search for " + currentSearch);
			plotAddress(currentSearch);
			return false;
		}
	});
});

window.onload = loadScript;