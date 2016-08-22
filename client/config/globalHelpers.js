UI.registerHelper('getGlobal', function (varName) {
    return Globals[varName];
});

//Setting page name dynamically for every page
UI.registerHelper('setTitle', function (title) {
    if (!title) {
        title = Globals.appName;
    } else {
        title += " - " + Globals.appName;
    }

    document.title = title;
});

// Helper used for iron router to get current page name/link
Template.registerHelper('currentRouteIs', function (route) {
    return Router.current().route.getName() === route;
});

Template.registerHelper('formatDateTime', function(date) {
    return moment(date).format('HH:mm DD.MM.YY');
});