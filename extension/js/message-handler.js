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
            case 'SetHideAvatarStatus':
                setHideAvatarStatus(data);
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
            case 'GetPageSettings':
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
            case 'log':
            default:
                console.log(data);
        }
    });
});

// New assoc array for storing default settings.
var defaultSettings = [];
defaultSettings['highlightThread']              = 'false';
defaultSettings['darkRead']                     = '#bbccdd';
defaultSettings['lightRead']                    = '#ddeeff';
defaultSettings['darkNewReplies']               = '#cfdfcf';
defaultSettings['lightNewReplies']              = '#e1f1e1';
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
defaultSettings['showPurchases']                = 'true';
defaultSettings['topPurchaseAcc']               = 'true';
defaultSettings['topPurchasePlat']              = 'true';
defaultSettings['topPurchaseAva']               = 'true';
defaultSettings['topPurchaseArchives']          = 'true';
defaultSettings['topPurchaseNoAds']             = 'true';
defaultSettings['topPurchaseUsername']          = 'true';
defaultSettings['topPurchaseDonatePatreon']     = 'true';
defaultSettings['topPurchaseBannerAd']          = 'true';
defaultSettings['topPurchaseEmoticon']          = 'true';
defaultSettings['topPurchaseSticky']            = 'true';
defaultSettings['topPurchaseGiftCert']          = 'true';
defaultSettings['topPurchaseDonations']         = 'true';
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
defaultSettings['hideUserAvatarImage']          = 'false';
defaultSettings['hideUserAvatar']               = 'false';
defaultSettings['hideUserGrenade']              = 'false';
defaultSettings['hideGarbageDick']              = 'false';
//defaultSettings['hideStupidNewbie']             = 'false';
defaultSettings['inlineVideo']                  = 'false';
//defaultSettings['embedVideo']                   = 'false';
defaultSettings['youtubeHighlight']             = '#ffcccc';
defaultSettings['inlineVine']                   = 'false';
defaultSettings['dontReplaceVineNWS']           = 'false';
defaultSettings['dontReplaceVineSpoiler']       = 'false';
defaultSettings['threadCaching']                = 'false';
defaultSettings['boxQuotes']                    = 'false';
defaultSettings['salrLogoHide']                 = 'false';
defaultSettings['whoPostedHide']                = 'false';
defaultSettings['searchThreadHide']             = 'false';
defaultSettings['enableUserNotes']              = 'true';
defaultSettings['enableUserNotesSync']          = 'true';
defaultSettings['enableToggleUserAvatars']      = 'true';
defaultSettings['enableThreadNotes']            = 'false';
defaultSettings['fixCancer']                    = 'true';
defaultSettings['adjustAfterLoad']              = 'true';
defaultSettings['preventAdjust']                = 'false';
defaultSettings['enableSAARSLink']              = 'true';
defaultSettings['enableSinglePost']             = 'true';
defaultSettings['hidePostButtonInThread']       = 'false';
defaultSettings['removeOwnReport']              = 'true';
defaultSettings['collapseTldrQuotes']           = 'false';
defaultSettings['showLastThreePages']           = 'false';
defaultSettings['postsPerPage']                 = 'default';

// Control Options
defaultSettings['displayPageNavigator']         = 'true';
defaultSettings['loadNewWithLastPost']          = 'false';
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
defaultSettings['imageLinkHoverNWS']            = 'true';
defaultSettings['imageLinkHoverSpoiler']        = 'true';
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
defaultSettings['ignoreBookmarkStarCyan']       = 'false';
defaultSettings['ignoreBookmarkStarGreen']      = 'false';
defaultSettings['ignoreBookmarkStarLavender']   = 'false';
defaultSettings['openAllForumUnreadLink']       = 'true';
defaultSettings['ignoreForumStarNone']          = 'false';
defaultSettings['ignoreForumStarGold']          = 'false';
defaultSettings['ignoreForumStarRed']           = 'false';
defaultSettings['ignoreForumStarYellow']        = 'false';
defaultSettings['ignoreForumStarCyan']          = 'false';
defaultSettings['ignoreForumStarGreen']         = 'false';
defaultSettings['ignoreForumStarLavender']      = 'false';
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
    if (localStorage.getItem('showUserAvatar') !== null) {
        localStorage.setItem('hideUserAvatar', (localStorage.getItem('showUserAvatar') == 'false').toString());
        localStorage.removeItem('showUserAvatar');
    }
    if (localStorage.getItem('showUserAvatarImage') !== null) {
        localStorage.setItem('hideUserAvatarImage', (localStorage.getItem('showUserAvatarImage') == 'false').toString());
        localStorage.removeItem('showUserAvatarImage');
    }
}

/**
 * Message handler for 'SetHideAvatarStatus' message from content script
 * Sets a specific user's hide avatar status without overriding any others
 * @param {Object}  messageData                     Raw message data from content script
 * @param {string}  messageData.idToToggle          The user ID for which we want to hide or show avatars
 * @param {boolean} messageData.newHideAvatarStatus Whether we want to hide or show avatars
 */
function setHideAvatarStatus(messageData) {
    var idToToggle = messageData.idToToggle;
    var newHideAvatarStatus = messageData.newHideAvatarStatus;
    var rawAvatars = localStorage.getItem('hiddenAvatarsLocal');
    var hiddenAvatars = rawAvatars ? JSON.parse(rawAvatars) : [];
    var alreadyHiddenIndex = hiddenAvatars.indexOf(parseInt(idToToggle, 10));

    // we want to remove them BUT make sure they were on the list first
    if (newHideAvatarStatus === false && alreadyHiddenIndex > -1) {
        hiddenAvatars.splice(alreadyHiddenIndex, 1);
        // Update the stored value
        localStorage.setItem('hiddenAvatarsLocal', JSON.stringify(hiddenAvatars));
    }
    // add them to the list BUT make sure they weren't already
    else if (newHideAvatarStatus === true && alreadyHiddenIndex === -1) {
        hiddenAvatars.push(parseInt(idToToggle, 10));
        // Update the stored value
        localStorage.setItem('hiddenAvatarsLocal', JSON.stringify(hiddenAvatars));
    }
}
