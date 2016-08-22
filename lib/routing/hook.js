/////////////////
// BeforeHooks //
/////////////////

// We use an object that contains all before hooks
var IrBeforeHooks = {

    /**
     * Show login if a guest wants to access private areas
     * Use: {only: [privateAreas] }
     */
    isLoggedIn: function () {
        var currentUser = Meteor.userId();
        if (currentUser){
            this.next();
        } else {
            this.render("presentation");
            // this.pause();
        }
    },

    locationSubscribe: function () {
        Meteor.subscribe("Userlocation", function onReady () {
            Session.set('userlocLoaded', true);
        });
        if (true === Session.get('userlocLoaded')) {
            this.next();
        }
    }

};

// (Global) Before hooks for any route
Router.onBeforeAction(IrBeforeHooks.isLoggedIn);

Router.onBeforeAction(IrBeforeHooks.locationSubscribe, {
    only: [ 'map' ]
});
