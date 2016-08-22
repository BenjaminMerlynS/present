Meteor.publish("Userlocation", function () {
    // if no user then just send the ready message right away
    if (!this.userId) return this.ready();
       var userIds = Meteor.users.find({}, {fields: {'_id':1}}).fetch();
    var ids = [];
    for (var i = 0; i < userIds.length; i++) {
        ids.push(userIds[i]['_id']);
    }
    console.log(ids);
    return Location.find({ user_id: { $in : ids } });
});
