//////////////////////////////////////////////////////////
////////////////* Greedy Nav JS Components*///////////////
//Attribution: https://github.com/lukejacksonn/GreedyNav//
$(function() {

  var $nav = $('nav.greedy');
  var $btn = $('nav.greedy button');
  var $vlinks = $('nav.greedy .links');
  var $hlinks = $('nav.greedy .hidden-links');

  var numOfItems = 0;
  var totalSpace = 0;
  var breakWidths = [];

  // Get initial state
  $vlinks.children().outerWidth(function(i, w) {
    totalSpace += w;
    numOfItems += 1;
    breakWidths.push(totalSpace);
  });

  var availableSpace, numOfVisibleItems, requiredSpace;

  function check() {

    // Get instant state
    availableSpace = $vlinks.width() - 10;
    numOfVisibleItems = $vlinks.children().length;
    requiredSpace = breakWidths[numOfVisibleItems - 1];

    // There is not enought space
    if (requiredSpace > availableSpace) {
      $vlinks.children().last().prependTo($hlinks);
      numOfVisibleItems -= 1;
      check();
      // There is more than enough space
    } else if (availableSpace > breakWidths[numOfVisibleItems]) {
      $hlinks.children().first().appendTo($vlinks);
      numOfVisibleItems += 1;
    }
    // Update the button accordingly
    $btn.attr("count", numOfItems - numOfVisibleItems);
    if (numOfVisibleItems === numOfItems) {
      $btn.addClass('hidden');
    } else $btn.removeClass('hidden');
  }

  // Window listeners
  $(window).resize(function() {
    check();
  });

  $btn.on('click', function() {
    $hlinks.toggleClass('hidden');
  });

  check();

});
/*/////////////////////End/////////////////////////////*/

    //var locations = ko.observableArray([]);

    var map;

        var locations = [
            {title: 'House of Tai Pei', location: {lat: 35.4404048, lng: -80.8740417}, address: '', type: chinese},
        /*    {title: 'Wan-Fu Quality Chinese Cuisine', location: {lat: 35.0886242, lng: -80.863675}, address: '', type: chinese},
            {title: 'Soho Bistro', location: {lat: 35.2275837, lng: -80.9104183}, address: '', type: chinese},
            {title: 'Shun Lee Palace', location: {lat: 35.1774188, lng: -80.8687371}, address: '', type: chinese},
            {title: 'Baoding Restuarant', location: {lat: 35.1474744, lng: -80.9029179}, address: '', type: chinese},

            {title: 'American Burger Company', location: {lat: 35.1521548, lng: -80.9117661}, address: '', type: burger},
            {title: 'The Cowfish Sushi Burger Bar', location: {lat: 35.152821, lng: -80.8279543}, address: '', type: burger},
            {title: 'Zacks Hamburgers', location: {lat: 35.1883115, lng: -80.8749783}, address: '', type: burger},
            {title: 'Burger 21', location: {lat: 35.0541815, lng: -80.9225526}, address: '', type: burger},*/
            {title: 'Bad Daddy\'s Burger Bar', location: {lat: 35.1989426, lng: -80.9109233}, address: '', type: burgers}
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
        //when filter is clicked change type of location displayed
        this.selectType = function(data, event) {
            console.log(event.currentTarget.id + " was clicked");
        }

        function getAddresses(){
            var promises = [];
            var infowindow = new google.maps.InfoWindow();
            var CLIENT_ID = "CEYUGBQFIGLCH40JGX3WCRRLQN54TYF2FRCW2KPBANYGECV0"
            var CLIENT_SECRET = "OX2LVD1ENKIZ0YX0QGFPVFYNZMCNI4G3E0UXNDOOYWEKKQOJ"
                return Promise.resolve(promises)
                .then(function(value){
                    locations.forEach(function(object) {
                        var position = object.location;
                        var title = object.title;
                        var foursquareResults = "https://api.foursquare.com/v2/venues/search?ll="+position.lat+","+position.lng+"&client_id="+CLIENT_ID+"&client_secret="+CLIENT_SECRET+"&query="+title+"&v=20170801&m=foursquare&limit=1";
                        var getPromise = fetch(foursquareResults)
                        .then(function(response) { return response.json();})
                            .then(function(data) {
                                object.address = data.response.venues[0].location.formattedAddress[0];
                                var marker = new google.maps.Marker({
                                map: map,
                                position: object.location,
                                address: object.address,
                                title: object.title,
                                animation: google.maps.Animation.DROP,
                                })
                                    self.markers.push(marker);
                                    marker.addListener('click', function() {
                                        populateInfoWindow(this, infowindow);
                                    });
                            })
                        .then(function() {
                            promises.push(getPromise);
                        })
                    });
                return Promise.all(promises);
            });
        }

        function populateInfoWindow(marker, infowindow) {
            if (infowindow.marker !=marker) {
                infowindow.marker = marker;
                infowindow.setContent('<div>'+marker.title+'</div>'+'<div>'+marker.address+'</div');
                infowindow.open(map, marker);
                infowindow.addListener('closeclick', function() {
                    infowindow.setMarker = null;
              });
            }
          }
            getAddresses();
/*
            document.getElementById('burgers').addEventListener('click', showBurgers);
            document.getElementById('chinese').addEventListener('click', showChinese);
*/
    }

// Activates knockout.js
function initMap() {
    ko.applyBindings(new AppViewModel());
}




