var google = google || {};
var map;
var startMarker;
var endMarker;
var startLat;
var startLong;
var endLat;
var endLong;
var result = null;
var myRouteCoordinates = []; /*added for routing*/
var myRoute;
var LatLngList = [];


function initialize() {
	var mapOptions = {
		zoom: 8,
		center: new google.maps.LatLng(37.7679, -119.4892),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  	
}

function loadScript() {
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&' +
      'callback=initialize';
	document.body.appendChild(script);
}

function getDirections(start, finish) {
	removeLine();  /*removes any existing polylines and markers*/
	
	var directionsService = new google.maps.DirectionsService();
	console.log('Get Directions from: ' + start + ' to: ' + finish);
	
	var request = {
		origin:start,
		destination:finish,
		travelMode: google.maps.TravelMode.DRIVING
	};
	directionsService.route(request, function(result, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			console.log('num_steps = ' + result.routes[0].legs[0].steps.length);
			$("#directions").empty();

			/*added for routing*/
			LatLngList = []; //holds the map boundaries
			myRouteCoordinates = []; //list of lat_lngs for the polyline
			
			var startLatLng = new google.maps.LatLng(result.routes[0].legs[0].start_location.ob, result.routes[0].legs[0].start_location.pb);
			var endLatLng = new google.maps.LatLng(result.routes[0].legs[0].end_location.ob, result.routes[0].legs[0].end_location.pb);
			
			LatLngList.push(startLatLng); //add the start point to the map boundaries
			LatLngList.push(endLatLng); //add the end point to the map boundaries
			
			var bounds = new google.maps.LatLngBounds();
			
			for (i = 0; i < LatLngList.length; i++) {
				bounds.extend (LatLngList[i]);
			};
			
			map.fitBounds(bounds);  //zoom and position the map so the end points are displayed
						
			myRouteCoordinates.push(startLatLng);  //add start point to the list of route coordinates for the polyline
						
			startMarker = new google.maps.Marker({ //add the marker for the starting point
				position: startLatLng,
				map: map,
				icon: "http://maps.google.com/mapfiles/ms/micons/green-dot.png"
			});
			
			endMarker = new google.maps.Marker({ //add the marker for the ending point
				map: map,
				position: endLatLng,
				icon: "http://maps.google.com/mapfiles/ms/micons/red-dot.png"
			});
			
			$('#directions').append('<ol id=\'steps\'>Directions <br> From: ' + result.routes[0].legs[0].start_address + '<br>To: ' + result.routes[0].legs[0].end_address);
			
			for (i = 0; i<result.routes[0].legs[0].steps.length; i++) {
				var litag = null;
				var stepNum = i + 1;
				var instr = result.routes[0].legs[0].steps[i].instructions;
				var dist = result.routes[0].legs[0].steps[i].distance.text;
				var dur = result.routes[0].legs[0].steps[i].duration.text;
				
				if (stepNum%2 == 0) {
					litag = '<li class = \'shade\'>';
				} else {
					litag = '<li>'
				};
				
				//add the turn by turn directions to the UI
				$('#steps').append(litag + instr + ' for ' + dist + ' (' + dur + ').</li>'); 
				
				console.log('result = ' + result.routes[0].legs[0].steps[i].instructions);
				
				//add all the lat_lngs to the polyline array
				for (j=0; j<result.routes[0].legs[0].steps[i].lat_lngs.length; j++) {
					myRouteCoordinates.push(new google.maps.LatLng(result.routes[0].legs[0].steps[i].lat_lngs[j].ob, result.routes[0].legs[0].steps[i].lat_lngs[j].pb));
				};
			};
			
			$('#directions').append('</ol>');
			
			//create the polyline
			myRoute = new google.maps.Polyline({
				path: myRouteCoordinates,
				geodesic: true,
				strokeColor: '#FF0000',
				strokeOpacity: 1.0,
				strokeWeight: 2
			});
			
			//add the polyline to the map
			myRoute.setMap(map);
			
		}
	});
	
	console.log('end of Get Directions');
	
	
	
	/*there needs to be some kind of return value set*/
	return status;
	    /*$.ajax({ 
        type: 'GET',
        url: 'http://maps.googleapis.com/maps/api/directions/json?origin=Toronto&destination=Montreal&sensor=false' ,
        dataType: 'json', 
        success: function(data) { 
            alert('success');
        }
    });*/
}
	
function removeLine() {
	if (myRoute) {
		myRoute.setMap(null);
		myRoute = null;
	};
	if (startMarker) {
		startMarker.setMap(null);
		startMarker = null;
	};
	if (endMarker) {
		console.log("endMarker exists");
		endMarker.setMap(null);
		endMarker = null;
	} else {
		console.log("endMarker does not exist");
	};
}
	
$(document).ready(function() {	
	/*when the button is clicked*/
	$("#btn").on("click", function() {
			var endPoint = $('input[name="searchTo"]').val();
			var startingPoint = $('input[name="searchFrom"]').val();
			console.log("You want to go from " + startingPoint + " to " + endPoint);
			getDirections(startingPoint, endPoint);
		return false;
	});

	/*when Enter is pressed*/
	$('body').on("keypress", function(event) {
		if (event.which === 13) {
			var endPoint = $('input[name="searchTo"]').val();
			var startingPoint = $('input[name="searchFrom"]').val();
			console.log("You want to go from " + startingPoint + " to " + endPoint);
			getDirections(startingPoint, endPoint);
			return false;
		}
	});
});

window.onload = loadScript;