// ==UserScript==
// @name         People's Dashboard
// @namespace    http://www.digitalmethods.net
// @version      0.1
// @description  enter something useful
// @author       You
// @match        https://www.facebook.com/*
// @grant        none
// ==/UserScript==

if (window.top != window.self)  //don't run on frames or iframes
    return;

// define the colors

/*
- people data {H}: #ff7bfc - 50 % opacity
- platform data {P}: #7df3ff - 50 % opacity
- mixed data {M}: #7da5ff - 50 % opacity
- navigation data {N}: #d8d8d8 - 70% opacity
 */
var colors = [];
colors["people"] = "#ff7bfc"; // pink
colors["platform"] = "#7df3ff"; // light blue
colors["mixed"] = "#7da5ff"; // blue
colors["navigation"] = "#d8d8d8"; // light grey
var opacities = [];
opacities["people"] = "0.5";
opacities["platform"] = "0.5";
opacities["mixed"] = "0.5";
opacities["navigation"] = "0.7";


// define the various elements in this array
var elementLocations = []

/* 
 * newsfeed 
 */

// platform
elementLocations["//*[@class='_585- _4w96']"]="platform"; /*search toolbar*/
elementLocations["//*[@class='_5pcp']"]="platform"; /*timestamp*/
elementLocations["//*[@class='_52lb _3-7 lfloat _ohe']"]="platform"; /*post characteristics*/
elementLocations["//*[@class='ego_column']"]="platform"; /*sponsored on the side*/ /*people you may know*/
elementLocations["//*[@class='_4-u2 mbm _5jmm _5pat _5v3q _2l4l _x72']"]="platform"; /*sponsored in newsfeed*/
elementLocations["//*[@class='_1-1']"]="platform"; /*Pop up suggest friends in news feed */
// platform, added by erik
elementLocations["//*[@class='ego_section']"]="platform";
elementLocations["//*[@id='pagelet_canvas_nav_content']"]="platform";
elementLocations["//*[@id='developerNav']"]="platform";
elementLocations["//*[@id='interestsNav']"]="platform";

// people
elementLocations["//*[@id='pagesNav']"]="people";
elementLocations["//*[@id='listsNav']"]="people";
elementLocations["//*[@id='pagelet_composer']"]="people";
elementLocations["//*[@id='pinnedNav']"]="people";
elementLocations["//*[@id='pagelet_welcome_box']"]="people";
elementLocations["//*[@class='fbChatSidebarBody']"]="people";
elementLocations["//*[@class='userContentWrapper _5pcr _3ccb']"]="people";
elementLocations["//*[@class='_2dpe _1ayn']"]="people";
elementLocations["//*[@class='_2wnm']"]="people";

// mixed
elementLocations["//*[@id='eventsNav']"]="mixed"; /*events sidebar*/
elementLocations["//*[@id='appsNav']"]="mixed"; /*apps sidebar*/
elementLocations["//*[@id='groupsNav']"]="mixed"; /*groups*/
elementLocations["//*[@id='js_2p']"]="mixed";
elementLocations["//*[@class='UFIBlingBox uiBlingBox feedbackBling']"]="mixed";// {M} /*numbers of likes, shares, comments*/
elementLocations["//*[@class='tickerActivityStories']"]="mixed";
elementLocations["//*[@class='fbReminders']"]="mixed";

// navigation
elementLocations["//*[@class='_2pdh _3zm- _55bi _3zm- _55bh']"]="navigation";
elementLocations["//*[@class='_5861 textInput _586g _586p focus_target']"]="navigation";

function LocalMain ()
{
    // loop over all element locations
    for(var query in elementLocations) {    
        //var query = elementLocations[j];
        type = elementLocations[query]
        // locate element
        var els = document.evaluate(query, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    //    console.log(query,els.snapshotLength);
        // for each element found, add overlay with color
        for (var i = els.snapshotLength - 1; i >= 0; i--) {
    //      console.log(type,query);
            var elm = els.snapshotItem(i);
            elm.style.position="relative";
            var overlay = document.createElement("div");
            overlay.class='peoplesdashboard_overlay';
            overlay.style.position="absolute";
            overlay.style.top="0px";
            overlay.style.left="0px";
            overlay.style.right="0px";
            overlay.style.bottom="0px";
            overlay.style.zIndex="10000"; 
            overlay.style.background=colors[type];
            overlay.style.opacity=opacities[type];
            elm.appendChild(overlay);
        }
    }
    
    // find suggested posts etc (i.e. platform data)
    var elms = document.querySelectorAll("[data-ft]");
    for(var i = 0; i<elms.length; i++) {
        if(elms.item(i).getAttribute('data-ft').match(/"ei":"/)) {
    //        console.log("found suggested post");
            elms.item(i).style.position="relative";
            var overlay = document.createElement("div");
            overlay.class='peoplesdashboard_overlay';
            overlay.style.position="absolute";
            overlay.style.top="0px";
            overlay.style.left="0px";
            overlay.style.right="0px";
            overlay.style.bottom="0px";
            overlay.style.zIndex="100000"; 
            overlay.style.background=colors["platform"];
            overlay.style.opacity=opacities["platform"];
            elms.item(i).appendChild(overlay);
            
        }   
    }
    // add legend
    if(document.getElementById("peoplesdashboard_palette")==null) {
        var img = document.createElement('img');
        img.id='peoplesdashboard_palette';
        img.style.position="absolute";
        img.style.bottom="0px";
        img.style.left="0px";
        img.style.width="100px";
        img.src="https://raw.githubusercontent.com/digitalmethodsinitiative/peoplesdashboard/master/palette.png";
        document.getElementsByTagName('body').item(0).appendChild(img);
    }
}

LocalMain ();
//@todo, check for insertion of nodes and rerun local main when that happens
