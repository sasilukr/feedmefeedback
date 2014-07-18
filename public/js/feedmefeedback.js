$( document ).ready(function() {
  Parse.initialize("GMS878qYQCgvB68FCzerFKq1TjcHZahOS2hphlRn", "RZcrn0SEBKcwJsvp3HAL7sNVKYPI2ZqMBAN43Jnp");
  $('#eventDate').datepicker();
  currentEventList();
});

function getEvents() {

}

function currentEventList() {
	var now = new Date();
	now.setHours(0,0,0,0);
	var endDay = new Date();
	endDay.setHours(23,59,59,59);
	var Event = Parse.Object.extend("Event");
    var currentEventQuery = new Parse.Query(Event);
    currentEventQuery.limit(1);
    // currentEventQuery.greaterThan("date", now);
    // currentEventQuery.lessThan("date", endDay);
    currentEventQuery.get(null,{
        success: function(result) {
           	console.log("Current event: " + JSON.stringify(result));
            console.log("Img URL: " + JSON.stringify(result.get("imagePath").url()));
            $("#current-event-name").text(result.get("name"));
            $("#current-event-date").text(formatDateLong(result.get("date")));
            $("#card-current-event-name").text(result.get("name"));
            $("#current-event-img").attr("src",result.get("imagePath").url());
            upcomingEventList();
        },
        error: function(error) {
           console.log("Failed to get current event. Error: " + error);
           $("#current-event").hide();
           $("#upcoming-event").addClass("main-container-top");
           upcomingEventList();

        }
    });
}

function upcomingEventList() {
	var now = new Date();
	now.setHours(0,0,0,0);
	now.setDate(now.getDate()+1);	// upcoming event starting tomorrow
    var Event = Parse.Object.extend("Event");
    var upcomingEventQuery = new Parse.Query(Event);
    upcomingEventQuery.limit(3);
    upcomingEventQuery.greaterThan("date", now);
    upcomingEventQuery.find({
        success: function(results) {
          console.log("Upcoming event: " + JSON.stringify(results));
          displayEvents(results, "upcoming");
          pastEventList();
        },
        error: function(error) {
           console.log("Failed to get upcoming event. Error: " + error);
           $("#upcoming-event").hide();
           $("#past-event").addClass("main-container-top");
            pastEventList();
        }
    });
}

function pastEventList() {
	var now = new Date();
	now.setHours(0,0,0,0);
	var Event = Parse.Object.extend("Event");
    var pastEventQuery = new Parse.Query(Event);
    pastEventQuery.limit(3);
    pastEventQuery.lessThan("date", now);
    pastEventQuery.find({
        success: function(results) {
          console.log("Past event: " + JSON.stringify(results));
          displayEvents(results, "past");
        },
        error: function(error) {
           console.log("Failed to get past event. Error: " + error);
        }
    });	
}

function displayEvents(events, eType) {
          // <div class="col-md-4 card-event card-upcoming-event">
          //   <img class="img-square" src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" alt="Generic placeholder image">
          //   <div class="card-footer">
          //     Hack Day
          //     <div class="card-footer-date">
          //       July 17, 2014
          //     </div>
          //   </div>
            
          // </div><!-- /.col-lg-3 -->
          var len = events.length;
          for ( var i = 0 ; i < len ; i++ ) {
            var imgUrl = "";
            if ( typeof events[i].get("imagePath").url() != 'undefined' ) {
              imgUrl = events[i].get("imagePath").url();
            }
            console.log("Image URL " + imgUrl);
            var colDiv = $("<div class='col-md-4 card-event card-" + eType + "-event'></div>");
            var imgDiv = $("<img class='img-square' src='"+ imgUrl +"' />");
            var footerDiv = $("<div class='card-footer'>"+ events[i].get("name") 
              +"<div class='card-footer-date'>"+ formatDate(events[i].get("date")) +"</div></div>");

            colDiv.append(imgDiv);
            colDiv.append(footerDiv);
            console.log(colDiv);
            $("#"+ eType +"-event-row").append(colDiv);  
          }




}

function saveEvent() {
  var Event = Parse.Object.extend("Event");
  var event = new Event();
  var eventDate = $("#eventDate").val();

  var fileUploadControl = $("#eventImage")[0];
  if (fileUploadControl.files.length > 0) {
    var file = fileUploadControl.files[0];
    var name = "photo.jpg";
   
    var parseFile = new Parse.File(name, file);

    parseFile.save().then(function() {
    }, function(error) {
      alert('Failed to upload image: ' + error.message);
    });
    event.set("image", parseFile);
  }

  event.set("name", $("#eventName").val());
  event.set("date", new Date(eventDate));
   
  event.save(null, {
    success: function(event) {
      $('#eventModal').modal('hide');
    },
    error: function(d, error) {
      // Execute any logic that should take place if the save fails.
      // error is a Parse.Error with an error code and description.
      alert('Failed to create new object, with error code: ' + error.message);
    }
  });
}

function saveFood() {
  var Food = Parse.Object.extend("Food");
  var food = new Food();

  var fileUploadControl = $("#foodImage")[0];
  if (fileUploadControl.files.length > 0) {
    var file = fileUploadControl.files[0];
    var name = "food.jpg";
   
    var parseFile = new Parse.File(name, file);

    parseFile.save().then(function() {
    }, function(error) {
      alert('Failed to upload image: ' + error.message);
    });
    food.set("image", parseFile);
  }

  food.set("name", $("foodName").val())
  food.set("description", $("#foodDescription").val());
  //TODO: add eventId
  food.set("eventId", "");
   
  food.save(null, {
    success: function(food) {
      $('#foodModal').modal('hide');
    },
    error: function(food, error) {
      // Execute any logic that should take place if the save fails.
      // error is a Parse.Error with an error code and description.
      alert('Failed to create new object, with error code: ' + error.message);
    }
  });
}

function formatParseDate(time, timezone) {
  try {
  	console.log("Convert Date WITH timezone" + time);  	
    return moment(time).tz(timezone).format('ddd MM/DD');
  } catch(e) {
  	console.log("Convert Date without timezone");
    return moment(time).format('ddd MM/DD');
  }
}

function formatDateLong(time, timezone) {
  try {
    console.log("Convert Date WITH timezone" + time);   
    return moment(time).tz(timezone).format('dddd MMMM DD, YYYY');
  } catch(e) {
    console.log("Convert Date without timezone");
    return moment(time).format('dddd MMMM DD, YYYY');
  }
}

function formatDate(time, timezone) {
  try {
  	console.log("Convert Date WITH timezone" + time);  	
    return moment(time).tz(timezone).format('ddd MMM DD, YYYY');
  } catch(e) {
  	console.log("Convert Date without timezone");
    return moment(time).format('ddd MMM DD, YYYY');
  }
}


function formatTime(time, timezone) {
  try {
  	console.log("Convert Time WITH timezone" + time);
    return moment(time).tz(timezone).format('h:mm A');
  } catch(e) {
  	console.log("Convert Time without timezone");
    return moment(time).format('h:mm A');
  }
}

