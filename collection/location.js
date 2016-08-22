Location = new Mongo.Collection ("location");


if (Meteor.isServer) {

    Meteor.methods({
        savelocation: function (latlng) {

            return Location.insert({
                user_id: this.userId,
                location: latlng,
                time_date_creation: new Date()
            }, function (error, result) {
                if (error) console.log(error);
                //info about what went wrong
                if (result) {
                    return result;
                } //the _id of new object if successful
            });
        }
    });

}