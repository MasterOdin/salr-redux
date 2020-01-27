// Copyright (c) 2009-2013 Scott Ferguson
// Copyright (c) 2013-2016 Matthew Peveler
//
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
// - Redistributions of source code must retain the above copyright
//   notice, this list of conditions and the following disclaimer.
// - Redistributions in binary form must reproduce the above copyright
//   notice, this list of conditions and the following disclaimer in the
//   documentation and/or other materials provided with the distribution.
// - Neither the name of the software nor the
//   names of its contributors may be used to endorse or promote products
//   derived from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE AUTHORS ''AS IS'' AND ANY
// EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
// WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY
// DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
// (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
// ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
// SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

// Fetch extension settings
var settings = {};
var port = chrome.runtime.connect({"name":"popup"});

/**
 * Opens a link in a tab.
 */
function openTab(event) {
    var tabUrl = event.currentTarget.href;
    var button = event.button;
    if (button > 1)
        return;
    if (button == 0 && !event.ctrlKey) { // Left click
        event.preventDefault();
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
            chrome.tabs.update(tabs[0].id, {url: tabUrl});
            window.close();
        });
    }
}

/**
 * Changes the sticky status of a forum in the popup menu
 */
function toggleSticky(forumID) {
    var forums = JSON.parse(settings.forumsList);
    for (var someForum of forums) {
        if (someForum.id != forumID)
            continue;

        if (someForum.sticky == true) {
            someForum.sticky = false;
            jQuery('img#sticky-'+forumID).each( function() {
                jQuery(this).attr('src', '../images/sticky_off.gif');
            });
        } else {
            someForum.sticky = true;
            jQuery('img#sticky-'+forumID).each( function() {
                jQuery(this).attr('src', '../images/sticky_on.gif');
            });
        }
        settings.forumsList = JSON.stringify(forums);
        port.postMessage({ 'message': 'ChangeSALRSetting',
                           'option' : 'forumsList',
                           'value'  : JSON.stringify(forums) });
        return;
    }
}

/**
 * Populate the menu with forums.
 */
function populateMenu() {
    var forums = JSON.parse(settings.forumsList);
    var newHTML = '';
    var color = '#ffffff';

    jQuery(forums).each( function() {
        var indent = this.level;
        var title = this.name;

        if (indent == -1) { // Separator
            // Loop through forum list and add stickied forums
            for (var someForum of forums) {
                if (someForum.sticky == true)  {
                    newHTML += populateMenuHelper(someForum, color, true);
                    if (color == '#ffffff') {
                        color = '#eeeeee';
                    } else {
                        color = '#ffffff';
                    }
                }
            }

            newHTML += '<hr/>';
        } else if (indent == 0) {
            newHTML += '<div class="header-link">';
            newHTML += '<a href="http://forums.somethingawful.com/forumdisplay.php?forumid=' + this.id + '" class="link link'+ indent +'">' + title + '</a><br/>';
            newHTML += '</div>';

        } else {
            newHTML += populateMenuHelper(this, color, false);
        }

        if (color == '#ffffff') {
            color = '#eeeeee';
        } else {
            color = '#ffffff';
        }
    });

    jQuery('div#forums-list').html(newHTML);
}

function populateMenuHelper(forum, color, stuck) {
    var subHTML = '';

    var indent = 2*forum.level;
    if (stuck == true)
        indent=2;
    var title = forum.name;

    // Add sticky controls to popup window
    if (forum.sticky == true)
        subHTML += '<div style="float:left;cursor:pointer;overflow-x: hidden;"><img src="../images/sticky_on.gif" class="' + forum.id + '" id="sticky-'+forum.id + '" /></div>';
    else
        subHTML += '<div style="float:left;cursor:pointer;overflow-x: hidden;"><img src="../images/sticky_off.gif" class="' + forum.id + '" id="sticky-'+forum.id + '" /></div>';

    // Dynamically set the 10's digit for padding here, since we can have any number
    // of indentations
    subHTML += '<div class="forum-link" style="padding-left: ' + indent + '0px; background: ' + color + ';">';
    subHTML += '<a href="http://forums.somethingawful.com/forumdisplay.php?forumid=' + forum.id + '">' + title + '</a><br/>';
    subHTML += '</div>';
    return subHTML;
}

port.onMessage.addListener(function(data) {
    settings = data;
    populateMenu();

    jQuery('a').on("click", function(event) {
        openTab(event);
    });
    jQuery('img').on("click", function(event) {
        toggleSticky(event.currentTarget.id.match(/[0-9].*/)[0]);
    });


});

port.postMessage({
    'message': 'GetForumsJumpList'
});