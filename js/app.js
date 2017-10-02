

    //var locations = ko.observableArray([]);

    var map;

        var locations = [
            {title: 'House of Tai Pei', location: {lat: 35.4404048, lng: -80.8740417}, address: '', type: 'chinese'},
        /*    {title: 'Wan-Fu Quality Chinese Cuisine', location: {lat: 35.0886242, lng: -80.863675}, address: '', type: 'chinese'},
            {title: 'Soho Bistro', location: {lat: 35.2275837, lng: -80.9104183}, address: '', type: 'chinese'},
            {title: 'Shun Lee Palace', location: {lat: 35.1774188, lng: -80.8687371}, address: '', type: 'chinese'},
            {title: 'Baoding Restuarant', location: {lat: 35.1474744, lng: -80.9029179}, address: '', type: 'chinese'},

            {title: 'American Burger Company', location: {lat: 35.1521548, lng: -80.9117661}, address: '', type: 'burgers'},
            {title: 'The Cowfish Sushi Burger Bar', location: {lat: 35.152821, lng: -80.8279543}, address: '', type: 'burgers'},
            {title: 'Zacks Hamburgers', location: {lat: 35.1883115, lng: -80.8749783}, address: '', type: 'burgers'},
            {title: 'Burger 21', location: {lat: 35.0541815, lng: -80.9225526}, address: '', type: 'burgers'},*/
            {title: 'Bad Daddy\'s Burger Bar', location: {lat: 35.1989426, lng: -80.9109233}, address: '', type: 'burgers'}
        ];

    function AppViewModel() {
        //create google map element and pass in default settings
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 10,
            center: {lat: 35.2270869, lng: -80.8431267},
            mapTypeControl: false
        });
        var self = this;
        //default locations
        self.markers = ko.observableArray([]);

        this.selectMarker = function(marker, event) {
        event.target.classList.toggle('list-active');
        console.log(event.target.classList);
        if (marker.getAnimation() !== 1) {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        } else {
          marker.setAnimation(null);
        }
        console.log(marker.getAnimation())
      }

        //when filter is clicked change type of location displayed
        this.selectType = function(data, event) {

          //loop through markers by type and choose which are visible
            self.markers().forEach(function(object){
                if (event.currentTarget.id == "all") {
                    object.setVisible(true);
                    object.visibility(true);
                } else if (object.type == event.currentTarget.id) {
                      //console.log(event.currentTarget.id + " was clicked");
                      object.setVisible(true);
                      object.visibility(true);
                      //console.log("if! set object visibility to: " + object.visibility())
                } else {
                      object.setVisible(false);
                      object.visibility(false);
                      //console.log("else! set object visibility to: " + object.visibility())
                  }
            })
        }

        function getAddresses(){
            var promises = [];
            var infowindow = new google.maps.InfoWindow();
            var CLIENT_ID = "CEYUGBQFIGLCH40JGX3WCRRLQN54TYF2FRCW2KPBANYGECV0"
            var CLIENT_SECRET = "OX2LVD1ENKIZ0YX0QGFPVFYNZMCNI4G3E0UXNDOOYWEKKQOJ"
            //use Promises to make API asynchronously.
                return Promise.resolve(promises)
                .then(function(value){
                    //loop through default locations and get params to make API call to Foursquare
                    locations.forEach(function(object) {
                        var position = object.location;
                        var title = object.title;
                        var foursquareResults = "https://api.foursquare.com/v2/venues/search?ll="+position.lat+","+position.lng+"&client_id="+CLIENT_ID+"&client_secret="+CLIENT_SECRET+"&query="+title+"&v=20170801&m=foursquare&limit=1";
                        var getPromise = fetch(foursquareResults)
                        .then(function(response) { return response.json();})
                            //collect data from API and location array to build map Markers
                            .then(function(data) {
                                object.address = data.response.venues[0].location.formattedAddress[0];
                                var marker = new google.maps.Marker({
                                map: map,
                                position: object.location,
                                address: object.address,
                                title: object.title,
                                type: object.type,
                                animation: ko.observable(google.maps.Animation.DROP),
                                visibility: ko.observable(true)
                                })
                                    self.markers.push(marker);
                                    marker.addListener('click', function() {
                                        populateInfoWindow(this, infowindow);
                                        bounce(this);
                                        console.log(this.animation)
                                    });
                            })
                        .then(function() {
                            promises.push(getPromise);
                        })
                    });
                return Promise.all(promises);
            });
        }

        function bounce(marker){
            if (marker.getAnimation() !== null) {
                marker.setAnimation(null);
            } else {
                  marker.setAnimation(google.maps.Animation.BOUNCE);
              }
        }

        function populateInfoWindow(marker, infowindow) {
            if (infowindow.marker !=marker) {
                infowindow.marker = marker;
                infowindow.setContent('<div>'+marker.title+'</div>'+'<div>'+marker.address+'</div');
                infowindow.open(map, marker);
                infowindow.addListener('closeclick', function() {
                    infowindow.close();
                    //marker.setAnimation(google.maps.Animation.DROP);
              });
            }
          }
            getAddresses();
    }

// Activates knockout.js
function initMap() {
    ko.applyBindings(new AppViewModel());
}




