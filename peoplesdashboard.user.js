// ==UserScript==
// @name         People's Dashboard
// @namespace    http://www.digitalmethods.net
// @version      0.1
// @description  enter something useful
// @author       Erik Borra <erik@digitalmethods.net>
// @match        https://www.facebook.com/*
// @grant        none
// @todo		 pages, dynamically loaded content
// ==/UserScript==

if (window.top != window.self)  //don't run on frames or iframes
    return;

/* 
 * Define the XPATH expression to the elements + their categorization
 */
var elementLocations = []

// platform
elementLocations["//*[@class='_585- _4w96']"]="platform"; /*search toolbar*/
elementLocations["//*[@class='_5pcp']"]="platform"; /*timestamp*/
elementLocations["//*[@class='_52lb _3-7 lfloat _ohe']"]="platform"; /*post characteristics*/
elementLocations["//*[@class='ego_column']"]="platform"; /*sponsored on the side*/ /*people you may know*/
elementLocations["//*[@class='_4-u2 mbm _5jmm _5pat _5v3q _2l4l _x72']"]="platform"; /*sponsored in newsfeed*/
elementLocations["//*[@class='_1-1']"]="platform"; /*Pop up suggest friends in news feed */
elementLocations["//*[@class='ego_section']"]="platform";
elementLocations["//*[@id='pagelet_canvas_nav_content']"]="platform";
elementLocations["//*[@id='timeline_info_review_unit']"]="platform";
elementLocations["//*[@class='megaphone_location_home']"]="platform";

// people
elementLocations["//*[@id='developerNav']"]="people";
elementLocations["//*[@id='interestsNav']"]="people";
elementLocations["//*[@id='u_ps_0_1_1']"]="people";
elementLocations["//*[@id='fbCoverImageContainer']"]="people";
elementLocations["//*[@id='u_0_1']"]="people";
elementLocations["//*[@class='_c51']"]="people";
elementLocations["//*[@class='pvm uiBoxWhite topborder']"]="people";
elementLocations["//*[@id='u_0_1b']"]="people";
elementLocations["//*[@id='pagesNav']"]="people";
elementLocations["//*[@id='listsNav']"]="people";
elementLocations["//*[@id='pagelet_composer']"]="people";
elementLocations["//*[@id='pinnedNav']"]="navigation";
elementLocations["//*[@id='pagelet_welcome_box']"]="people";
elementLocations["//*[@class='fbChatSidebarBody']"]="people";
elementLocations["//*[@id='timeline_tab_content']//*[@class='userContentWrapper _5pcr _3ccb']"]="people";
elementLocations["//*[@id='pagelet_group_mall']//*[@class='userContentWrapper _5pcr _3ccb']"]="people";
elementLocations["//*[@class='_2dpe _1ayn']"]="people";
elementLocations["//*[@class='timelineUnitContainer fbTimelineComposerUnit']"]="people";

// mixed
elementLocations["//*[@id='stream_pagelet']//*[@class='userContentWrapper _5pcr _3ccb']"]="mixed";
elementLocations["//*[@class='_2wnm']"]="mixed";
elementLocations["//*[@id='eventsNav']"]="mixed"; /*events sidebar*/
elementLocations["//*[@id='appsNav']"]="mixed"; /*apps sidebar*/
elementLocations["//*[@id='groupsNav']"]="mixed"; /*groups*/
elementLocations["//*[@id='js_2p']"]="mixed";
elementLocations["//*[@class='UFIBlingBox uiBlingBox feedbackBling']"]="mixed";// {M} /*numbers of likes, shares, comments*/
elementLocations["//*[@class='tickerActivityStories']"]="mixed";
elementLocations["//*[@class='fbReminders']"]="mixed";

// navigation
elementLocations["//*[@class='groupsJumpBarContainer']"]="navigation";
elementLocations["//*[@class='_2pdh _3zm- _55bi _3zm- _55bh']"]="navigation";
elementLocations["//*[@class='_5861 textInput _586g _586p focus_target']"]="navigation";
elementLocations["//*[@id='u_0_r']"]="navigation";

/*
 * Define colors and opacities
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

/*
 * add overlays for all defined elements
 */
function addLayer ()
{
    // loop over all element locations
    for(var query in elementLocations) {    
        type = elementLocations[query]
        // locate element
        var els = document.evaluate(query, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        // for each element found, add overlay with color
        for (var i = els.snapshotLength - 1; i >= 0; i--) {
            var elm = els.snapshotItem(i);
            elm.style.position="relative";
            var overlay = document.createElement("div");
            overlay.className='peoplesdashboard_overlay';
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
            elms.item(i).style.position="relative";
            var overlay = document.createElement("div");
            overlay.className='peoplesdashboard_overlay';
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
        img.className='peoplesdashboard_overlay';
        img.style.position="fixed";
        img.style.bottom="5px";
        img.style.left="5px";
        img.style.width="100px";
        img.src="https://raw.githubusercontent.com/digitalmethodsinitiative/peoplesdashboard/master/palette.png";
        document.getElementsByTagName('body').item(0).appendChild(img);
    }
}

// removes all added elements
function removeLayer() {
    var elements = document.getElementsByClassName("peoplesdashboard_overlay");
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}

// add switch to turn on/off the people's dashboard
function addButton() {
        var img = document.createElement('img');
        img.id='peoplesdashboard_button';
    	img.className='peoplesdashboard_off';
        img.style.marginTop="-43px";
    	img.style.float="right";
    	img.style.zIndex="1000";
    	img.style.height="45px";
    	img.style.cursor="pointer";
        img.src="https://raw.githubusercontent.com/digitalmethodsinitiative/peoplesdashboard/master/TOGGLE-02.png";
    	img.onclick = function() { toggleButton(this); };
        document.getElementById('blueBarNAXAnchor').appendChild(img);
}

// actual toggle functionality
function toggleButton(el) {
    if(el.className=='peoplesdashboard_off') {
        el.src="https://raw.githubusercontent.com/digitalmethodsinitiative/peoplesdashboard/master/TOGGLE-01.png";
        el.className='peoplesdashboard_on';
        addLayer();        
    } else {
		el.src="https://raw.githubusercontent.com/digitalmethodsinitiative/peoplesdashboard/master/TOGGLE-02.png";
        el.className='peoplesdashboard_off';
        removeLayer();        
    }
}

if(document.getElementById('peoplesdashboard_button')==null)
	addButton();