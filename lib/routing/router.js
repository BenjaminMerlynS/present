Router.configure({ //Set mainLayout as primary html structure file
    layoutTemplate: "mainLayout"
});

Router.route('/', {
    name: "home",
    template: "home"
});

Router.route('/map', {
    name: "map",
    template: "map"
});