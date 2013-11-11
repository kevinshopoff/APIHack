var google = google || {};
var geocoder;
var map;
var startLat;
var startLong;
var endLat;
var endLong;
var result = null;

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

/*var json = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': my_url,
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
})(); */


function getDirections(start, finish) {
	var directionsService = new google.maps.DirectionsService();
	console.log('Get Directions from: ' + start + ' to: ' + finish);
	/*var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = 'http://maps.googleapis.com/maps/api/directions/json?origin=' + start + '&destination=' + finish + '&sensor=false&' + 
		'callback=blah';
	console.log(script.src);
	document.body.appendChild(script);*/
	/*$.ajax({
		'async': false,
		'global': false,
		'url' : 'http://maps.googleapis.com/maps/api/directions/json?origin=' + start + '&destination=' + finish + '&sensor=false&' + 
		'callback=blah',
		'dataType': "jsonp",
		'success': function(data) {
			json = data;
		},
		'error': function(data, status) {
			console.log('oops! an error.');
		}
	});
	
	console.log('json is: ' + json);*/
	
	var request = {
		origin:start,
		destination:finish,
		travelMode: google.maps.TravelMode.DRIVING
	};
	directionsService.route(request, function(result, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			console.log('result = ' + result.routes[0].legs[0].steps[3]./*html_instructions*//*duration.text*/instructions);
			console.log('num steps = ' + result.routes[0].legs[0].steps.length);
			for (i = 0; i<result.routes[0].legs[0].steps.length; i++) {
				$('#directions').append('<p>' + result.routes[0].legs[0].steps[i].instructions + '</p>');
				$('#directions').append('<p>' + result.routes[0].legs[0].steps[i].distance.text + '</p>');
				$('#directions').append('<p>' + result.routes[0].legs[0].steps[i].duration.text + '</p>');
				$('#directions').append('<p>' + result.routes[0].legs[0].steps[i].maneuver + '</p>');
				$('#directions').append('<p>' + result.routes[0].legs[0].steps[i].travel_mode + '</p><br>')
				console.log('i = ' + i + ": " + result.routes[0].legs[0].steps[i].distance.text);
			};
		}
	});
	
	console.log('end of Get Directions');
	
	
	
	/*there needs to be some kind of return value set*/
	return result;
	    /*$.ajax({ 
        type: 'GET',
        url: 'http://maps.googleapis.com/maps/api/directions/json?origin=Toronto&destination=Montreal&sensor=false' ,
        dataType: 'json', 
        success: function(data) { 
            alert('success');
        }
    });*/
}

function blah(data) {
	json = data;
	console.log(json);
};


	function plotAddress(startLoc, endLoc) {
		var startAddress = startLoc;
		var endAddress = endLoc;
		geocoder.geocode( {'address': endAddress}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				map.setCenter(results[0].geometry.location);
				startLat = results[0].geometry.location.lb;
				startLong = results[0].geometry.location.mb;
				var marker = new google.maps.Marker({
					map: map,
					position: results[0].geometry.location
				});
				var hereToThere = getDirections(startAddress, endAddress);
				console.log('Got back to plotAddress');
				console.log('hereToThere is: ' + hereToThere);
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
		var endPoint = $('input[name="searchTo"]').val();
		var startingPoint = $('input[name="searchFrom"]').val();
		console.log("You want to go from " + startingPoint + " to " + endPoint);
		plotAddress(startingPoint, endPoint);
		return false;
	});

	/*this still needs to be updated for the map hack*/
	/*when Enter is pressed*/
	$('body').on("keypress", function(event) {
		if (event.which === 13) {
			var endPoint = $('input[name="searchTo"]').val();
			var startingPoint = $('input[name="searchFrom"]').val();
			console.log("You want to go from " + startingPoint + " to " + endPoint);
			plotAddress(startingPoint, endPoint);
			return false;
		}
	});
});

window.onload = loadScript;