Template.map.rendered = function () {

    var instance = Template.instance();

    /*-----------------------------------------------------------------
     Full size map leaflet instance creation
     ----------------------------------------------------------------*/


    $(window).on("resize", resizeMap); //get new window size on resize
    resizeMap();
    //Resize map container dynamically on window size. Full screen - defined margin


    // Leaflet : initiate map container and map creation
    map = instance.map = L.map('map', {
        doubleClickZoom: false,
        zoomControl: false,
        // contextmenu: true,
        // contextmenuWidth: 140,
        // contextmenuItems: [{
        //     text: 'Center map here',
        //     callback: centerMap
        // }, '-', {
        //     text: 'Zoom in',
        //     iconCls: 'glyphicon glyphicon-zoom-in',
        //     callback: zoomIn
        // }, {
        //     text: 'Zoom out',
        //     iconCls: 'glyphicon glyphicon-zoom-out',
        //     callback: zoomOut
        // }]
    }).setView([48.85047600000001, 2.362444200000027], 18); //TODO: set view on Farm epicenter or action epicenter
                                   //if action in progress. Let farmer decide a fixed location ?
    new L.Control.Zoom({position: 'topleft'}).addTo(map);
    // Background layer, currently from openmaps ESRI.
    // TODO: find best map layer that we want to use. Add ability to change map layers (satellite and street)
    var Thunderforest_TransportDark = L.tileLayer('http://{s}.tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
    });
   Thunderforest_TransportDark.addTo(map);

    /*-----------------------------------------------------------------------------------
     - Functions for Context Menu (rightclick) -
     -----------------------------------------------------------------------------------*/

    //Global map menu

    // function centerMap (e) {
    //     map.panTo(e.latlng);
    // }
    //
    // function zoomIn (e) {
    //     map.zoomIn();
    // }
    //
    // function zoomOut (e) {
    //     map.zoomOut();
    // }



    function savelocation(latlng) {
        Meteor.call('savelocation', latlng,
            function (error, result) {
                if (error) {
                    alert(error);
                }
            });
    }

    /*-----------------------------------------------------------------------------------
     AUTOMATIC LOCATION on map
     Deactivated on purpose - no fields in Paris :)
     -----------------------------------------------------------------------------------*/

     map.locate({maxZoom: 20, watch:true}); // setting  "watch:true" allows non stop accurate location
    var locationMarkers = new L.FeatureGroup();

    var Icon = L.icon({
        iconUrl: 'img/white-icon.png',

        iconSize:     [30, 30], // size of the icon
        iconAnchor:   [15, 30] // point of the icon which will correspond to marker's location
    });

     function onLocationFound(e) {
         var radius = e.accuracy / 2;

         locationMarkers.clearLayers();

        L.popup({closeButton:false, offset: [0, -30]})
             .setLatLng(e.latlng)
             .setContent(Meteor.user().emails[0].address)
             .addTo(locationMarkers)
             .openOn(map);


         L.marker(e.latlng, {icon: Icon}).addTo(locationMarkers);

         L.circle(e.latlng, radius).addTo(locationMarkers);

         locationMarkers.addTo(map);
         
         savelocation(e.latlng);
     }
     map.on('locationfound', onLocationFound);


     function onLocationError(e) {
     //alert(e.message);
     }
     map.on('locationerror', onLocationError);

    /*-----------------------------------------------------------------------------------
                            Show other users location
     -----------------------------------------------------------------------------------*/


};