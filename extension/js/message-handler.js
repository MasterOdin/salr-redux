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

/**
 * External message event listener
 *
 */

if(chrome.runtime.onConnectExternal != undefined) {
    chrome.runtime.onConnectExternal.addListener(function(port) {
        port.onMessage.addListener(function(data) {
            switch (data.message) {
                case 'GetForumsJumpList':
                case 'GetSALRSettings':
                    port.postMessage(getPageSettings());
                    break;
                case 'ChangeSALRSetting':
                    localStorage.setItem(data.option, data.value);
                    break;
            }
        });
    });
}

/**
 * Message event listener so that we can talk to the content-script
 *
 */
chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(data) {
        switch (data.message) {
            case 'OpenSettings':
                chrome.runtime.openOptionsPage();
                break;
            case 'ChangeSetting':
                localStorage.setItem(data.option, data.value);
                break;
            case 'ChangeSyncSetting':
                if (data.option == 'userNotes') {
                    if (localStorage.getItem('enableUserNotesSync') != 'true') {
                        localStorage.setItem('userNotesLocal',data.value);
                    }
                    else {
                        chrome.storage.sync.set({'userNotes' : data.value});
                    }
                }
                else {
                    console.log("can't sync that particular setting");
                }
                break;
            case 'OpenTab':
                openNewTab(data.url);
                break;
            case 'OpenCloseTab':
                openCloseNewTab(data.url);
                break;
            case 'ReloadTab':
                reloadTab();
                break;
            case 'ShowPageAction':
                // efobaopfidfllhfnndjecciobldchcaf
                // mclknakcbbdhhebmdibhehimkoefdjaa
                // dodkgjokbnmiickhikhikpggfohagmfb - id of Redux Browser Button
                chrome.management.get("dodkgjokbnmiickhikhikpggfohagmfb",function(result) {
                    if (result == undefined || result.enabled == false) {
                        chrome.pageAction.show(port.sender.tab.id);
                    }
                });
                break;
            case 'GetPageSettings':
            case 'GetSALRSettings':
            case 'GetForumsJumpList':
                port.postMessage(getPageSettings());
                break;
            case 'ChangeSALRSetting':
                localStorage.setItem(data.option, data.value);
                //port.postMessage({"message":"setting changed"});
                break;
            case 'AppendUploadedImage':
                // Send to the tab that requested it
                if (typeof port.sender.tab === "object" && port.sender.tab.id) {
                    chrome.tabs.sendMessage(port.sender.tab.id, data);
                }
                break;
            case 'GetSALRButtonStatus':
                chrome.management.get("dodkgjokbnmiickhikhikpggfohagmfb",function(result) {
                    if (result == undefined || result.enabled == false) {
                        port.postMessage({'message':'salr-button','bool':'false'});
                    }
                    else {
                        port.postMessage({'message':'salr-button','bool':'true'});
                    }
                });
                break;
            case 'ConvertSettings':
                chrome.management.get("nlcklobeoigfjmcigmhbjkepmniladed", function(result) {
                    var salr = chrome.runtime.connect("nlcklobeoigfjmcigmhbjkepmniladed");
                    salr.onMessage.addListener(function(data) {
                        localStorage.setItem('userNotes',data.userNotes);
                        localStorage.setItem('threadNotes', data.threadNotes);
                    });
                    salr.postMessage({'message':'GetSALRSettings'});
                });
                break;
            case 'GetSALRStatus':
                chrome.management.get("nlcklobeoigfjmcigmhbjkepmniladed", function(result) {
                    if (result == undefined || result.installed == false) {
                        port.postMessage({'message':'convert','bool':'false'});
                    }
                    else {
                        port.postMessage({'message':'convert','bool':'true'});
                    }
                });
                break;
            case 'log':
            default:
                console.log(data);
        }
    });
});

// New assoc array for storing default settings.
var defaultSettings = [];
defaultSettings['highlightThread']              = 'false';
defaultSettings['darkRead']                     = '#6699cc';
defaultSettings['lightRead']                    = '#99ccff';
defaultSettings['darkNewReplies']               = '#99cc99';
defaultSettings['lightNewReplies']              = '#ccffcc';
defaultSettings['displayCustomButtons']         = 'true';
defaultSettings['inlinePostCounts']             = 'false';

// Post Highlighting
defaultSettings['highlightOP']                  = 'false';
defaultSettings['highlightOPColor']             = '#fff2aa';
defaultSettings['highlightSelf']                = 'false';
defaultSettings['highlightSelfColor']           = '#f2babb';
defaultSettings['highlightOwnQuotes']           = 'false';
defaultSettings['userQuote']                    = '#a2cd5a';
defaultSettings['highlightOwnUsername']         = 'false';
defaultSettings['usernameHighlight']            = '#9933ff';
defaultSettings['highlightFriends']             = 'false';
defaultSettings['highlightFriendsColor']        = '#f2babb';
defaultSettings['highlightModAdmin']            = 'false';
defaultSettings['highlightModAdminUsername']    = 'false';
defaultSettings['highlightModeratorColor']      = '#b4eeb4';
defaultSettings['highlightAdminColor']          = '#ff7256';

// Forum Display Options
defaultSettings['displayNewPostsFirst']         = 'false';
defaultSettings['hideAdvertisements']           = 'false';

// Header Link Display Options
//defaultSettings['hideHeaderLinks']              = 'true';
defaultSettings['showPurchases']                = 'true';
defaultSettings['topPurchaseAcc']               = 'true';
defaultSettings['topPurchasePlat']              = 'true';
defaultSettings['topPurchaseAva']               = 'true';
defaultSettings['topPurchaseArchives']          = 'true';
defaultSettings['topPurchaseNoAds']             = 'true';
defaultSettings['topPurchaseUsername']          = 'true';
defaultSettings['topPurchaseBannerAd']          = 'true';
defaultSettings['topPurchaseEmoticon']          = 'true';
defaultSettings['topPurchaseSticky']            = 'true';
defaultSettings['topPurchaseGiftCert']          = 'true';
defaultSettings['showNavigation']               = 'true';
defaultSettings['topNavBar']                    = 'true';
defaultSettings['bottomNavBar']                 = 'true';
defaultSettings['topSAForums']                  = 'true';
defaultSettings['topSALink']                    = 'true';
defaultSettings['topSearch']                    = 'true';
defaultSettings['displayConfigureSalr']         = 'true';
defaultSettings['topUserCP']                    = 'true';
defaultSettings['topPrivMsgs']                  = 'true';
defaultSettings['topForumRules']                = 'true';
defaultSettings['topSaclopedia']                = 'true';
defaultSettings['topGloryhole']                 = 'true';
defaultSettings['topLepersColony']              = 'true';
defaultSettings['topSupport']                   = 'true';
defaultSettings['topLogout']                    = 'true';
defaultSettings['expandBreadcrumbs']            = 'false';
defaultSettings['displayMods']                  = 'false';

// Thread Options
defaultSettings['showUserAvatarImage']          = 'true';
defaultSettings['showUserAvatar']               = 'true';
defaultSettings['hideUserGrenade']              = 'false';
defaultSettings['hideGarbageDick']              = 'false';
//defaultSettings['hideStupidNewbie']             = 'false';
defaultSettings['inlineVideo']                  = 'false';
//defaultSettings['embedVideo']                   = 'false';
defaultSettings['youtubeHighlight']             = '#ff00ff';
defaultSettings['inlineVine']                   = 'false';
defaultSettings['dontReplaceVineNWS']           = 'false';
defaultSettings['dontReplaceVineSpoiler']       = 'false';
defaultSettings['inlineWebm']                   = 'false';
defaultSettings['inlineWemAutoplay']            = 'true';
defaultSettings['dontReplaceWebmNWS']           = 'false';
defaultSettings['dontReplaceWebmSpoiler']       = 'false';
defaultSettings['threadCaching']                = 'false';
defaultSettings['boxQuotes']                    = 'false';
defaultSettings['salrLogoHide']                 = 'false';
defaultSettings['whoPostedHide']                = 'false';
defaultSettings['searchThreadHide']             = 'false';
defaultSettings['enableUserNotes']              = 'false';
defaultSettings['enableUserNotesSync']          = 'true';
defaultSettings['enableThreadNotes']            = 'false';
defaultSettings['fixCancer']                    = 'true';
defaultSettings['adjustAfterLoad']              = 'true';
defaultSettings['preventAdjust']                = 'false';
defaultSettings['enableSOAPLink']               = 'true';
defaultSettings['enableSinglePost']             = 'true';
defaultSettings['hidePostButtonInThread']       = 'false';
defaultSettings['removeOwnReport']              = 'true';
defaultSettings['collapseTldrQuotes']           = 'false';
defaultSettings['showLastThreePages']           = 'false';
defaultSettings['postsPerPage']                 = 'default';

// Control Options
defaultSettings['displayPageNavigator']         = 'true';
defaultSettings['displayOmnibarIcon']           = 'false';
defaultSettings['enableKeyboardShortcuts']      = 'false';
defaultSettings['enableMouseGestures']          = 'false';
defaultSettings['enableMouseMenu']              = 'true';
defaultSettings['enableMouseUpUCP']             = 'false';
defaultSettings['enableQuickReply']             = 'true';
defaultSettings['quickReplyBookmark']           = 'false';
defaultSettings['quickReplyFormat']             = 'true';
defaultSettings['quickReplyEmotes']             = 'true';
defaultSettings['quickReplyYoutube']            = 'true';

// Image Display Options
defaultSettings['replaceLinksWithImages']       = 'false';
defaultSettings['dontReplaceLinkNWS']           = 'false';
defaultSettings['dontReplaceLinkSpoiler']       = 'false';
defaultSettings['dontReplaceLinkRead']          = 'false';
defaultSettings['dontReplaceLinkImage']         = 'false';
defaultSettings['imageLinkHover']               = 'false';
defaultSettings['imageLinkHoverDelay']          = '0';
defaultSettings['imageLinkHoverShowURL']        = 'true';
defaultSettings['imageLinkHoverShowFilename']   = 'false';
defaultSettings['replaceImagesWithLinks']       = 'false';
defaultSettings['replaceImagesReadOnly']        = 'false';
defaultSettings['replaceImagesLink']            = 'false';
defaultSettings['restrictImageSize']            = 'false';
defaultSettings['restrictImagePxW']             = '800';
defaultSettings['restrictImagePxH']             = '800';
defaultSettings['fixImgurLinks']                = 'true';
//defaultSettings['fixTimg']                      = 'false';
//defaultSettings['forceTimg']                    = 'false';
defaultSettings['retinaImages']                 = 'false';
defaultSettings['setImageTooltip']              = 'false';
defaultSettings['setImageTooltipBlankOnly']     = 'true';
defaultSettings['setImageTooltipHideExtension'] = 'true';
defaultSettings['setImageTooltipSkipEmoticons'] = 'true';
defaultSettings['setImageTooltipHideSourceUrl'] = 'true';

// Other Options
defaultSettings['qneProtection']                = 'false';
defaultSettings['showEditBookmarks']            = 'false';
defaultSettings['openAllUnreadLink']            = 'true';
//defaultSettings['ignoreBookmarkStar']           = "";
defaultSettings['ignoreBookmarkStarGold']       = 'false';
defaultSettings['ignoreBookmarkStarRed']        = 'false';
defaultSettings['ignoreBookmarkStarYellow']     = 'false';
defaultSettings['openAllForumUnreadLink']       = 'true';
defaultSettings['ignoreForumStarNone']          = 'false';
defaultSettings['ignoreForumStarGold']          = 'false';
defaultSettings['ignoreForumStarRed']           = 'false';
defaultSettings['ignoreForumStarYellow']        = 'false';
defaultSettings['fixUserCPFont']                = 'false';

// Misc Options (don't show up on settings.html)
defaultSettings['MouseActiveContext']           = 'false';

/**
 * Opens a new tab with the specified URL
 */
function openNewTab(aUrl) {
    chrome.tabs.create({url: aUrl});
}

/**
 * Opens a new tab with the specified URL, then closes it
 */
function openCloseNewTab(aUrl) {
    var tabRemoved = false;
    chrome.tabs.create({url: aUrl}, function(tab) {
        while (!tabRemoved) {
            chrome.tabs.query({url:aUrl,status:'complete'},function(t) {
                console.log(t);
                chrome.tabs.remove(t[0].index);
                tabRemoved = true;
            });
            console.log(tabRemoved);
        }
    });
}

/**
 * Reload current tab
 */
function reloadTab() {
    chrome.tabs.reload();
}

/**
 * Sets up default preferences for highlighting and menus only
 */
function setupDefaultPreferences() {
    // New, more scalable method for setting default prefs.
    for ( var key in defaultSettings ) {
        if ( localStorage.getItem(key) == undefined ) {
            localStorage.setItem(key, defaultSettings[key]);
        }
    }
}

/**
 * Returns page settings to local and remote message requests
 *
 */
function getPageSettings() {
    // Don't wipe the settings made by previous versions
    if (localStorage.getItem('username')) {
        localStorage.setItem('salrInitialized', 'true');
    }

    // If we don't have stored settings, set defaults
    setupDefaultPreferences();

    fixSettings();

    var response = {};

    for ( var index in localStorage ) {
        if (localStorage.hasOwnProperty(index))
            response[index] = localStorage.getItem(index);
    }

    response['message'] = 'SettingsResult';

    return response;
}

/**
 * Update settings from old versions
 *
 */
function fixSettings() {
    if (localStorage.getItem('disableCustomButtons') == 'true') {
        localStorage.setItem('displayCustomButtons', 'false');
        localStorage.removeItem('disableCustomButtons');
    } else if (localStorage.getItem('disableCustomButtons') == 'false') {
        localStorage.setItem('displayCustomButtons', 'true');
        localStorage.removeItem('disableCustomButtons');
    }
    if (localStorage.getItem('ignore_bookmark_star')) {
        localStorage.setItem('ignoreBookmarkStar', localStorage.getItem('ignore_bookmark_star'));
        localStorage.removeItem('ignore_bookmark_star');
    }
    if (localStorage.getItem('highlightCancer')) {
        localStorage.setItem('fixCancer', localStorage.getItem('highlightCancer'));
        localStorage.removeItem('highlightCancer');
    }
    if (localStorage.getItem('saveUserNotes') != 'true') {
        localStorage.setItem('userNotesLocal',localStorage.getItem('userNotesOld'));
        localStorage.setItem('saveUserNotes','true');
    }

    if (localStorage.getItem('embedVideo')) {
        if (localStorage.getItem('enableQuickReply') != 'true') {
            chrome.permissions.remove({ origins: ['https://api.imgur.com/*'] });
        }
        if (localStorage.getItem('inlineTweet') != 'true') {
            chrome.permissions.remove({ origins: ['https://api.twitter.com/*'] });
        }
        localStorage.removeItem('embedVideo');
    }
}
