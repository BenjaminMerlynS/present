/*-----------------------------------------------------------------------------------
                          Usefull functions and utilities
 -----------------------------------------------------------------------------------*/

Utils = {
    formatDate: function (date) {
        var date = new Date(date);

        var day = date.getDate().toString();
        var month = (date.getMonth() + 1).toString();
        var year = date.getFullYear();

        if (day.length === 1) {
            day = '0' + day;
        }

        if (month.length === 1) {
            month = '0' + month;
        }

        return day + '/' + month + '/' + year;
    },
    pathFor: function (routeName, params) {
        // Similaire au helper "pathFor", mais utilisable directement dans le code
        var route = Router.routes[routeName].path(params);
        return route;
    }
};

//Calculate area of polygon
getArea = function (layer) {
    return (parseFloat(L.GeometryUtil.geodesicArea(layer.getLatLngs())) / 10000).toFixed(2);
};

//Used to draw SVG lines on map
Belay = function (el1, el2, id){
    var settings = {
        strokeColor       : '#fff',
        strokeWidth       : 1,
        opacity           : 1,
        fill              : 'none',
        animate           : true,
        animationDirection: 'right',
        animationDuration : .2
    };

    var $el1 = $(el1);
    var $el2 = $(el2);
    if ($el1.length && $el2.length) {
        var svgheight
            ,p
            ,svgleft
            ,svgtop
            ,svgwidth;

        var el1pos = $(el1).offset();
        var el2pos = $(el2).offset();

        var el1H = $(el1).outerHeight();
        var el1W = $(el1).outerWidth();

        var el2H = $(el2).outerHeight();
        var el2W = $(el2).outerWidth();

        svgleft = Math.round(el1pos.left + el1W);
        svgwidth = Math.round(el2pos.left - svgleft);

        var curvinessFactor, cpt;

        ////Determine which is higher/lower
        if( (el2pos.top+(el2H/2)) <= ( el1pos.top+(el1H/2))){
            //console.log("low to high");
            svgheight = Math.round((el1pos.top+el1H/2) - (el2pos.top+el2H/2));
            svgtop = Math.round(el2pos.top + el2H/2) - settings.strokeWidth;
            cpt = Math.round(svgwidth*Math.min(svgheight/300, 1));
            p = "M0,"+ (svgheight+settings.strokeWidth) +" C"+cpt+","+(svgheight+settings.strokeWidth)+" "+(svgwidth-cpt)+"," + settings.strokeWidth + " "+svgwidth+"," + settings.strokeWidth;
        }else{
            //console.log("high to low");
            svgheight = Math.round((el2pos.top+el2H/2) - (el1pos.top+el1H/2));
            svgtop = Math.round(el1pos.top + el1H/2) - settings.strokeWidth;
            cpt = Math.round(svgwidth*Math.min(svgheight/300, 1));
            p = "M0," + settings.strokeWidth + " C"+ cpt +",0 "+ (svgwidth-cpt) +","+(svgheight+settings.strokeWidth)+" "+svgwidth+","+(svgheight+settings.strokeWidth);
        }

        //ugly one-liner :)
        $ropebag = $('#ropebag').length ? $('#ropebag') : $('body').append($( "<div id='ropebag' />" )).find('#ropebag');

        var svgnode = document.createElementNS('http://www.w3.org/2000/svg','svg');
        var newpath = document.createElementNS('http://www.w3.org/2000/svg',"path");
        newpath.setAttributeNS(null, "d", p);
        newpath.setAttributeNS(null, "stroke", settings.strokeColor);
        newpath.setAttributeNS(null, "stroke-width", settings.strokeWidth);
        newpath.setAttributeNS(null, "opacity", settings.opacity);
        newpath.setAttributeNS(null, "fill", settings.fill);
        newpath.setAttributeNS(null, "id", id);
        svgnode.appendChild(newpath);
        //for some reason, adding a min-height to the svg div makes the lines appear more correctly.
        $(svgnode).css({left: svgleft, top: svgtop, position: 'absolute', width: svgwidth, height: svgheight + settings.strokeWidth*2, minHeight: '20px' });
        $ropebag.append(svgnode);
        if (settings.animate) {
            // THANKS to http://jakearchibald.com/2013/animated-line-drawing-svg/
            var pl = newpath.getTotalLength();
            // Set up the starting positions
            newpath.style.strokeDasharray = pl + ' ' + pl;

            if (settings.animationDirection == 'right') {
                newpath.style.strokeDashoffset = pl;
            } else {
                newpath.style.strokeDashoffset = -pl;
            }

            // Trigger a layout so styles are calculated & the browser
            // picks up the starting position before animating
            // WON'T WORK IN IE. If you want that, use requestAnimationFrame to update instead of CSS animation
            newpath.getBoundingClientRect();
            newpath.style.transition = newpath.style.WebkitTransition ='stroke-dashoffset ' + settings.animationDuration + 's ease-in-out';
            // Go!
            newpath.style.strokeDashoffset = '0';
        }
    }
};
//Displays images that are in map bounds
viewportImages = function () {
    var bounds = map.getBounds();
    var mongoBounds = [ [ bounds.getWest(), bounds.getSouth() ], [ bounds.getEast(), bounds.getNorth() ] ];
    Meteor.subscribe("ImageslistMap", Session.get('selectedFarm'), mongoBounds, function onReady () {
        Session.set('imagesMapLoaded', true);
    });
   
    var convBounds = [ [ bounds.getNorth(), bounds.getEast() ], [ bounds.getSouth(), bounds.getWest() ] ];
    Session.set('mapBounds', convBounds);
};

//Used to resize the map in its different states
resizeMap = function () {
    var mapmargin = 0; //define map margin

    if ($(window).width() >= 980) {
        $('#map').css("height", ($(window).height() - mapmargin));
    } else {
        $('#map').css("height", ($(window).height() - (mapmargin)));
        $('#map').css("margin-top", '');
    }
    setTimeout(function (){
        map.invalidateSize();
    }, 400);
};

//Place labels on polygons in the right place
labelOffset = function (data) {
    return [10, 0];
};


//Count months between 2 dates 
monthCounter = function (d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
};

MMDDYYToDate = function(string) {
    var dateArray = string.split("-");
    return new Date(dateArray[2], dateArray[1] - 1, dateArray[0]);
};