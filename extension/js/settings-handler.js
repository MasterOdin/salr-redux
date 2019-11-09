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
 * Initialize event callbacks for the page
 *
 */

let port = chrome.runtime.connect({"name":"settings"});

document.addEventListener('DOMContentLoaded', () => {
    // Don't wipe the settings made by previous versions
    if (localStorage.getItem('username')) {
        localStorage.setItem('salrInitialized', 'true');
    }

    // Setting names.
    let defaultSettings = [];
    defaultSettings['salrInitialized']              = 'true';

    defaultSettings['username']                     = '';
    defaultSettings['usernameCase']                 = 'false';

    // Thread Highlighting
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
    defaultSettings['hideAdvertisements']           = 'false';
    defaultSettings['displayNewPostsFirst']         = 'false';
    defaultSettings['displayNewPostsFirstForum']    = 'true';
    defaultSettings['displayNewPostsFirstUCP']      = 'true';
    defaultSettings['showLastThreePages']           = 'false';
    defaultSettings['postsPerPage']                 = 'default';
    defaultSettings['showLastThreePagesForum']      = 'true';
    defaultSettings['showLastThreePagesUCP']        = 'true';
    defaultSettings['showLastThreePagesThread']     = 'true';

    // Header Link Display Options
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

    // Control Options
    defaultSettings['displayPageNavigator']         = 'true';
    defaultSettings['loadNewWithLastPost']          = 'false';
    defaultSettings['enableKeyboardShortcuts']      = 'false';
    defaultSettings['enableMouseGestures']          = 'false';
    defaultSettings['enableMouseMenu']              = 'true';
    defaultSettings['enableMouseUpUCP']             = 'false';
    defaultSettings['enableQuickReply']             = 'true';
    defaultSettings['quickReplyParseUrls']          = 'true';
    defaultSettings['quickReplyBookmark']           = 'false';
    defaultSettings['quickReplyDisableSmilies']     = 'false';
    defaultSettings['quickReplySignature']          = 'false';
    defaultSettings['quickReplyLivePreview']        = 'false';
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
    defaultSettings['imageLinkHoverDelay']          = '0.5';
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
    defaultSettings['openAllForumUnreadLink']       = 'true';
    defaultSettings['ignoreForumStarNone']          = 'false';
    defaultSettings['ignoreForumStarGold']          = 'false';
    defaultSettings['ignoreForumStarRed']           = 'false';
    defaultSettings['ignoreForumStarYellow']        = 'false';
    defaultSettings['fixUserCPFont']                = 'false';

    // Misc Options (don't show up on settings.html)
    defaultSettings['MouseActiveContext']           = 'false';

    // Set the version text on the settings page
    let version = chrome.runtime.getManifest().version;
    let versionQuery = document.getElementById('version-text');
    versionQuery.textContent = version;
    versionQuery.href = versionQuery.href + version.replace(/\./g, '');

    // Check stored settings, if value not set, set to default value
    for (let key in defaultSettings) {
        if (localStorage.getItem(key) == undefined) {
            localStorage.setItem(key, defaultSettings[key]);
        }
    }

    document.getElementById('d_username').textContent = localStorage.getItem('username');

    // Initialize text entry fields
    let textEntries = document.querySelectorAll('input.text-entry');
    for (let textEntry of textEntries) {
        // Pre-populate settings field
        populateValues(textEntry);

        // Set focus handler for the entry fields
        textEntry.addEventListener('focus', () => {
            onInputSelect(textEntry);
        });

        // Set blur handler for the entry fields
        textEntry.addEventListener('blur', () => {
            onInputDeselect(textEntry);
        });

        textEntry.addEventListener('input', () => {
            if (textEntry.id === 'username') {
                if (textEntry.value === '') {
                    textEntry.value = localStorage.getItem('username');
                }
                document.getElementById('d_username').textContent = textEntry.value;
            }
            localStorage.setItem(textEntry.id, textEntry.value);
            highlightExamples();
        });
    }

    // Initialize checkbox fields
    var obj = {'inlineTweet':'https://api.twitter.com/*','enableQuickReply':'https://api.imgur.com/*'};
    let checkboxPreferences = document.querySelectorAll('div.display-preference input[type=checkbox]');
    for (let preference of checkboxPreferences) {
        populateCheckboxes(preference);
        preference.addEventListener('click', () => {
            var id = preference.id;
            if (id === 'inlineTweet' || id === 'enableQuickReply') {
                if (preference.checked === true) {
                    chrome.permissions.request({origins: [obj[id]]}, function(granted) {
                        if (!granted) {
                            preference.checked = false;
                        }
                    });
                }
                else {
                    chrome.permissions.remove({origins: [obj[id]]});
                }
            }
            localStorage.setItem(preference.id, preference.checked);
            highlightExamples();
        });
    }

    // Rig up listeners for fieldset (suboptions) enabling/disabling
    var fieldSets = document.querySelectorAll('fieldset');
    for (let fieldSet of fieldSets) {
        let controlInput = fieldSet.querySelector('legend input[type=checkbox]');
        if (!controlInput) {
            continue;
        }
        fieldSet.disabled = !controlInput.checked;
        controlInput.addEventListener('change', () => {
            fieldSet.disabled = !controlInput.checked;
        });
    }

    // Initialize drop down menus
    let selectPreferences = document.querySelectorAll('div.display-preference select');
    for (let preference of selectPreferences) {
        populateDropDownMenus(preference);

        preference.addEventListener('change', () => {
            localStorage.setItem(preference.id, preference.value);
        });
    }

    let colorSelectors = document.querySelectorAll('input[type=color]');
    let colorTimers = {};
    for (let colorSelector of colorSelectors) {
        let val = localStorage.getItem(colorSelector.id);
        colorSelector.value = (val) ? val : colorSelector.default;
        let textSelector = document.getElementById(colorSelector.id + '-text');
        textSelector.value = colorSelector.value;
        textSelector.addEventListener('change', () => {
            let oldValue = colorSelector.value;
            colorSelector.value = textSelector.value;
            if (colorSelector.value !== textSelector.value) {
                colorSelector.value = oldValue;
                textSelector.value = oldValue;
            }
            else {
                localStorage.setItem(colorSelector.id, textSelector.value);
                highlightExamples();
            }
        });
        colorSelector.addEventListener('input', () => {
            textSelector.value = colorSelector.value;
            clearTimeout(colorTimers[colorSelector.id]);
            colorTimers[colorSelector.id] = setTimeout(() => {
                localStorage.setItem(colorSelector.id, colorSelector.value);
                highlightExamples();
            }, 500);
        });
    }

    highlightExamples();

    // this doesn't actually exist?
    //document.getElementById('config').addEventListener('click', configWindow);

    document.getElementById('logo').addEventListener('click', configWindow);
    document.getElementById('settings-backup').addEventListener('click', createSettingsBackup);
    document.getElementById('settings-restore').addEventListener('click', restoreSettingsBackup);
    document.getElementById('user-notes-local').addEventListener('click', userNotesLocal);
    document.getElementById('user-notes-sync').addEventListener('click', userNotesSync);
    document.getElementById('user-notes-delete-sync').addEventListener('click', userNotesSyncClear);
    document.getElementById('user-notes-delete-local').addEventListener('click', userNotesLocalClear);

    // Hook up the help boxes
    let allHelpMarks = document.getElementsByClassName('help');
    for (let someHelpMark of allHelpMarks) {
        let currentHelpBoxes = someHelpMark.parentNode.getElementsByClassName('help-box');
        someHelpMark.addEventListener('mouseover', (event) => {
            for (let someHelpBox of currentHelpBoxes) {
                someHelpBox.style.left = (event.pageX + 20).toString() + 'px';
                someHelpBox.style.top = (event.pageY - 10).toString() + 'px';
                someHelpBox.classList.add('show-help');
                someHelpBox.classList.remove('hide-help');
                window.setTimeout(() => {
                    someHelpBox.classList.add('fadein-help');
                }, 10);
            }
        });
        someHelpMark.addEventListener('mouseout', (event) => {
            for (let someHelpBox of currentHelpBoxes) {
                someHelpBox.classList.add('hide-help');
                someHelpBox.classList.remove('show-help');
                someHelpBox.classList.remove('fadein-help');
            }
        });
    }

    let sectionHeaders = document.getElementsByClassName('preference-title');
    for (let sectionHeader of sectionHeaders) {
        sectionHeader.addEventListener('click', () => {
            let settingsPanel = sectionHeader.parentElement.nextElementSibling;
            if (settingsPanel.style.display === 'none' || settingsPanel.style.display === '') {
                let shownElements = document.getElementsByClassName('show');
                for (let shown of shownElements) {
                    shown.parentElement.nextElementSibling.style.display = 'none';
                    shown.getElementsByTagName('img')[0].src = 'images/plus.png';
                    shown.classList.remove('show');
                }
                sectionHeader.classList.add('show');
                sectionHeader.getElementsByTagName('img')[0].src = 'images/minus.png';
                settingsPanel.style.display = 'block';
            }
            else {
                sectionHeader.classList.remove('show');
                sectionHeader.getElementsByTagName('img')[0].src = 'images/plus.png';
                settingsPanel.style.display = 'none';
            }
            return false;
        });
    }
});

function highlightExamples() {
    // Thread highlighting samples

    let threadReads = document.querySelectorAll('tr#thread-read');
    for (let threadRead of threadReads) {
        if (localStorage.getItem('highlightThread') == 'true') {
            let elements = threadRead.querySelectorAll('td.star, td.title, td.replies, td.rating');
            for (let element of elements) {
                Object.assign(element.style, {
                    backgroundColor: localStorage.getItem('lightRead'),
                    backgroundImage: "url('images/gradient.png')",
                    backgroundRepeat: 'repeat-x',
                    backgroundPosition: 'left'
                });
            }

            elements = threadRead.querySelectorAll('td.icon, td.author, td.views, td.lastpost');
            for (let element of elements) {
                Object.assign(element.style, {
                    backgroundColor: localStorage.getItem('darkRead'),
                    backgroundImage: "url('images/gradient.png')",
                    backgroundRepeat: 'repeat-x',
                    backgroundPosition: 'left'
                });
            }
        } else {
            for (let child of threadRead.children) {
                Object.assign(child.style, {
                    backgroundColor: '',
                    backgroundImage: '',
                    backgroundRepeat: '',
                    backgroundPosition: ''
                });
            }
        }
    }

    let unreadThreads = document.querySelectorAll('tr#thread-unread');
    for (let unreadThread of unreadThreads) {
        if (localStorage.getItem('highlightThread') == 'true') {
            let children = unreadThread.querySelectorAll('td.star, td.title, td.replies, td.rating');
            for (let child of children) {
                Object.assign(child.style, {
                    backgroundColor: localStorage.getItem('lightNewReplies'),
                    backgroundImage: "url('images/gradient.png')",
                    backgroundRepeat: "repeat-x",
                    backgroundPosition: "left"
              });
            }

            children = unreadThread.querySelectorAll('td.icon, td.author, td.views, td.lastpost');
            for (let child of children) {
                Object.assign(child.style, {
                    backgroundColor: localStorage.getItem('darkNewReplies'),
                    backgroundImage: "url('images/gradient.png')",
                    backgroundRepeat: "repeat-x",
                    backgroundPosition: "left"
                });
            }
        }
        else {
            for (let child of unreadThread.children) {
                Object.assign(child.style, {
                    backgroundColor: '',
                    backgroundImage: '',
                    backgroundRepeat: '',
                    backgroundPosition: ''
                });
            }
        }
    }

    let lastSeenForums = document.querySelectorAll('div#lastseen-forum');
    for (let lastSeenForum of lastSeenForums) {
        lastSeenForum.style.display = (localStorage.getItem('displayCustomButtons') == 'true') ? 'none' : '';
    }

    let lastSeenCustoms = document.querySelectorAll('div#lastseen-custom');
    for (let lastSeenCustom of lastSeenCustoms) {
        if (localStorage.getItem('displayCustomButtons') == 'true') {
            Object.assign(lastSeenCustom.style, {
                display: '',
                background: 'none',
                border: 'none'
            });

            document.getElementById('lastseen-inline').style.display = (localStorage.getItem('inlinePostCounts') == 'true') ? 'block' : 'none'

            const element = document.getElementById('lastseen-count');
            element.innerHTML = '';

            Object.assign(element.style, {
                borderLeft: 'none',
                width: '7px',
                height: '16px',
                paddingRight: '11px',
                backgroundImage: "url('images/lastpost.png')",
                minWidth: '0px'
            });
            element.classList.add('no-after');
            element.parentElement.style.boxShadow = '0 0 0px #fff';

            for (let element of lastSeenCustom.querySelectorAll('a#lastseen-x')) {
                Object.assign(element.style, {
                    background: 'none',
                    backgroundImage: "url('images/unvisit.png')",
                    height: '16px',
                    width: '14px'
                });
                element.parentElement.style.boxShadow = '0 0 0px #fff';
                element.classList.add('no-after');
                element.textContent = '';
            }
        }
        else {
            lastSeenCustom.style.display = 'none';
        }
    }

    let elements = document.querySelectorAll('div#lastseen-custom-count');
    for (let element of elements) {
        if (localStorage.getItem('displayCustomButtons') == 'true' && localStorage.getItem('inlinePostCounts') != 'true') {
            element.style.display = 'inline';
        }
        else {
            element.style.display = 'none';
        }
    }

    // Post highlighting samples
    document.getElementById('your-quote').style.backgroundColor = (localStorage.getItem('highlightOwnQuotes') == 'true') ? localStorage.getItem('userQuote') : '';

    let ownNameElement = document.getElementById('own-name');
    if (localStorage.getItem('username') != '') {
        ownNameElement.textContent = localStorage.getItem('username');
    }

    elements = document.querySelectorAll('span.your-name');
    for (let element of elements) {
        if (localStorage.getItem('username') != '') {
            element.textContent = localStorage.getItem('username');
        }
        element.style.color = (localStorage.getItem('highlightOwnUsername') == 'true') ? localStorage.getItem('usernameHighlight') : '';
    }
    elements = document.querySelectorAll('span.your-name-quote');
    for (let element of elements) {
        if (localStorage.getItem('username') != '') {
            element.textContent = localStorage.getItem('username');
        }
        // this isn't how it acts in the while so why do it here?
        if (/*localStorage.getItem('highlightOwnQuotes') != 'true' &&*/ localStorage.getItem('highlightOwnUsername') == 'true') {
            element.style.color = localStorage.getItem('usernameHighlight');
        }
        else {
            element.style.color = '';
        }
    }
    elements = document.querySelectorAll('table#own-post td');
    for (let element of elements) {
        element.style.backgroundColor = (localStorage.getItem('highlightSelf') == 'true') ? localStorage.getItem('highlightSelfColor') : '';
    }
    elements = document.querySelectorAll('table#friend-post td');
    for (let element of elements) {
        element.style.backgroundColor = (localStorage.getItem('highlightFriends') == 'true') ? localStorage.getItem('highlightFriendsColor') : '';
    }
    elements = document.querySelectorAll('table#op-post td');
    for (let element of elements) {
        element.style.backgroundColor = (localStorage.getItem('highlightOP') == 'true') ? localStorage.getItem('highlightOPColor') : '';
    }

    let modNameElement = document.getElementById('mod-name');
    if (localStorage.getItem('highlightModAdminUsername') == 'true' && localStorage.getItem('highlightModAdmin') == 'true') {
        modNameElement.style.color = localStorage.getItem('highlightModeratorColor');
    }
    else {
        modNameElement.style.color = '';
    }

    let adminNameElement = document.getElementById('admin-name');
    if (localStorage.getItem('highlightModAdminUsername') == 'true' && localStorage.getItem('highlightModAdmin') == 'true') {
        adminNameElement.style.color = localStorage.getItem('highlightAdminColor');
    }
    else {
        adminNameElement.style.color = '';
    }

    elements = document.querySelectorAll('table#mod-post td');
    for (let element of elements) {
        if (localStorage.getItem('highlightModAdminUsername') != 'true' && localStorage.getItem('highlightModAdmin') == 'true') {
            element.style.backgroundColor = localStorage.getItem('highlightModeratorColor');
        }
        else {
            element.style.backgroundColor = '';
        }
    }
    elements = document.querySelectorAll('table#admin-post td');
    for (let element of elements) {
        if (localStorage.getItem('highlightModAdminUsername') != 'true' && localStorage.getItem('highlightModAdmin') == 'true') {
            element.style.backgroundColor = localStorage.getItem('highlightAdminColor');
        }
        else {
            element.style.backgroundColor = '';
        }
    }
}

/**
 * Event handler for focusing on the input
 *
 * @param element - Input element
 *
 */
function onInputSelect(element) {
    element.style.color = '#000000';
}

/**
 * Event handler for blurring the input
 *
 * @param element - Input element
 *
 */
function onInputDeselect(element) {
    // If the user didn't enter anything,
    // reset it to the saved value
    if (element.value === '') {
        element.value = localStorage.getItem(element.id);
    }
    element.style.color = '#999999';
}

/**
 * Populates the stored settings value into the element
 *
 * @param element - Input element
 *
 */
function populateValues(element) {
    var value = localStorage.getItem(element.id);
    if (!value) {
        // If there is no stored setting, use the default
        // value stored within the DOM
        var defaultCol = element.default;
        if (defaultCol !== undefined) {
            element.value = defaultCol;
        }
    }
    else {
        // Otherwise, write the stored preference
        element.value = value;
    }
}

/**
 * Populates a checkbox with its stored value
 * @param {HTMLInputElement} element Input (checkbox) element
 */
function populateCheckboxes(element) {
    // Make sure we're being passed a checkbox
    if (element.getAttribute('type') !== 'checkbox') {
        return;
    }

    let value = localStorage.getItem(element.id);

    // If there is a value in localStorage, then set it,
    // otherwise uncheck it
    element.checked = (value === 'true');
}

/**
 * Populates any drop down menus with their stored value
 *
 * @param element - Input (select) element
 *
 */
function populateDropDownMenus(element) {
    let value = localStorage.getItem(element.id);
    if (value == null) {
        value = '';
    }
    element.value = value;
}

/**
 * Dump the localStorage entries to a new window.
 *
 */
function configWindow() {
    chrome.storage.sync.get(function(settings) {
        var win = window.open('background.html','config');
        win.document.writeln('<html><body><h1>SALR Configuration</h1>');
        win.document.writeln('<table border="1">');
        win.document.writeln('<tr><th>Key</th><th>Value</th></tr>');
        win.document.writeln('</table>');
        for (var key in localStorage) {
            if (!localStorage.hasOwnProperty(key))
                continue;
            if (key == 'friendsList'    ||
                key == 'friendsListId'  ||
                key == 'forumsList'     ||
                key == 'modList'        ||
                //key == 'saveUserNotes'  ||
                key == 'userNotes'      ||
                key == 'userNotesOld'   ||
                key == 'userNotesLocal' ||
                key == 'hiddenAvatarsLocal' ||
                key == 'threadNotes'   ||
                key == 'forumPostKey' )
                continue;
            //win.document.write('<tr><td>'+key+'</td>');
            //win.document.writeln('<td>'+localStorage[key]+'</td></tr>');
            win.document.writeln('setting[\''+key+'\']    =    "'+localStorage[key]+'";<br />');
        }
        win.document.writeln('<br /><br />User Note values, number is user id: (don\'t post this in thread!)<br />');
        win.document.writeln("userNotesLocal:<br />");
        var local = JSON.parse(localStorage['userNotesLocal']);
        for (var i in local) {
            if (local.hasOwnProperty(i))
                win.document.writeln(i+":<br />&nbsp;&nbsp;&nbsp;&nbsp;Text: "+local[i]['text']+"<br />"+
                    "&nbsp;&nbsp;&nbsp;&nbsp;Color: "+local[i]['color']+"<br />");
        }
        var sync = JSON.parse(settings['userNotes']);
        win.document.writeln('<br /><br />userNotesSync:<br />');
        for (i in sync) {
            if (sync.hasOwnProperty(i))
                win.document.writeln(i+":<br />&nbsp;&nbsp;&nbsp;&nbsp;Text: "+sync[i]['text']+"<br />"+
                    "&nbsp;&nbsp;&nbsp;&nbsp;Color: "+sync[i]['color']+"<br />");
        }
        win.document.writeln('</body></html>');
        win.document.close();
    });

}

/**
 * Helper function to count local user notes
 * @return {Number} number of local user notes
 */
function countLocalUserNotes() {
    // userNotesLocal are initially set to 'null'; clearing them sets to ''
    var count = 0;
    var localNotes = localStorage.getItem('userNotesLocal');
    if (localNotes && localNotes !== '' && localNotes !== 'null') {
        var local = JSON.parse(localNotes);
        count = Object.keys(local).length;
    }
    return count;
}

/**
 * Backs up synced user notes locally
*/
function userNotesLocal() {
    chrome.storage.sync.get(function(settings) {
        if (!settings['userNotes']) {
            alert("There are no synced notes to store locally!");
            return;
        }
        var sync = JSON.parse(settings['userNotes']);
        var cnt = Object.keys(sync).length;
/* This bit wasn't used, so I fixed it up but I'll still comment it out.
*    ~astral
        var cnt2 = 0;
        var oldNotes = localStorage.getItem('userNotesOld');
        if (oldNotes && oldNotes !== '' && oldNotes !== 'null') {
            var old = JSON.parse(oldNotes);
            cnt2 = Object.keys(old).length;
        }
*/
        var cnt3 = countLocalUserNotes();
        var r = confirm("Backup "+cnt+" synced user notes locally? It will overwrite "+cnt3+" local notes.");
        if (r === true) {
            /* for now we just do a straight overwrite
            for (x in old) {
                if (old[x] != null && sync[x] == null) {
                    sync[x] = old[x]
                }
            }

            for (x in local) {
                if (local[x] != null && sync[x] == null) {
                    sync[x] = local[x];
                }
            }
            */
            localStorage.setItem('userNotesLocal',JSON.stringify(sync));
            alert("User notes stored locally!");
        }
    });
}

/**
 * Backs up local user notes to storage.sync
*/
function userNotesSync() {
    chrome.storage.sync.get(function(settings) {
        var cnt = countLocalUserNotes();
        if (cnt === 0) {
            alert("There are no local notes to save to sync storage!");
            return;
        }
        var cnt2 = 0;
        // Make sure it's not actually empty
        if (settings['userNotes']) {
            var sync = JSON.parse(settings['userNotes']);
            cnt2 = Object.keys(sync).length;
        }
        var r = confirm("Backup saved "+cnt+" local notes to Chrome Sync? It will overwrite "+cnt2+" synced notes.");
        if (r === true) {
            /* for now just do a straight overwrite
            for (x in sync) {
                if (sync[x] != null && local[x] == null) {
                    //local[x] = sync[x];
                }
            }
            */
            chrome.storage.sync.set({'userNotes' : localStorage.getItem('userNotesLocal')});
        }
    });
}

/**
 * Clears user notes from sync storage
 */
function userNotesSyncClear() {
    userNotesClear(true);
}

/**
 * Clears user notes from local storage
 */
function userNotesLocalClear() {
    userNotesClear(false);
}

/**
 * Clears user notes
 * @param {boolean} sync Whether to clear user notes from sync storage or local storage
 */
function userNotesClear(sync) {
    sync = typeof sync !== 'undefined' ? sync : false;
    if (sync == true) {
        chrome.storage.sync.get(function(settings) {
            var cnt = 0;
            // Handle the case where the notes are already empty
            if (settings['userNotes']) {
                var sync = JSON.parse(settings['userNotes']);
                cnt = Object.keys(sync).length;
            }
            var r = confirm("Clear all "+cnt+" synced user notes?");
            if (r === true) {
                chrome.storage.sync.set({'userNotes' : ''});
            }
        });
    }
    else {
        var cnt = countLocalUserNotes();
        var r = confirm("Clear all "+cnt+" local user notes?");
        if (r === true) {
            localStorage.setItem('userNotesLocal','');
        }
    }
}

function createSettingsBackup() {
    var settings = {};
    for (var key in localStorage) {
        if (!localStorage.hasOwnProperty(key)) {
            continue;
        }

        if (key === 'friendsList'    ||
            key === 'friendsListId'  ||
            key === 'forumsList'     ||
            key === 'modList'        ||
            //key === 'saveUserNotes'  ||
            //key === 'userNotes'      ||
            //key === 'userNotesOld'   ||
            //key === 'userNotesLocal' ||
            //key === 'threadNotes'   ||
            key === 'forumPostKey' ) {
            continue;
        }
        settings[key] = localStorage.getItem(key);
    }
    var jsonString = JSON.stringify(settings);
    let existingBackupText = document.getElementById('settings-backup-text');
    if (existingBackupText === null) {
        let textBox = document.createElement('textarea');
        textBox.id = 'settings-backup-text';
        textBox.cols = 200;
        textBox.rows = 20;
        textBox.readOnly = true;
        textBox.value = jsonString;

        let element = document.createElement('div');
        element.style.marginTop = '10px';
        element.innerText = 'Copy JSON Setting String Below:';
        element.appendChild(document.createElement('br'));
        element.appendChild(textBox);
        document.getElementById('settings-backup').parentNode.appendChild(element);
    }
    else {
        existingBackupText.value = jsonString;
    }
}

function restoreSettingsBackup() {
    if (document.getElementById('settings-restore-text') === null) {
        let textBox = document.createElement('textarea');
        textBox.id = 'settings-restore-text';
        textBox.cols = 200;
        textBox.rows = 20;

        let restoreButton = document.createElement('button');
        restoreButton.style = 'margin-left:400px; width: 115px;';
        restoreButton.id = 'execute-restore';
        restoreButton.innerText = 'Restore Settings';

        let element = document.createElement('div');
        element.style.marginTop = '10px';
        element.innerText = 'Paste JSON Setting String below:';
        element.appendChild(document.createElement('br'));
        element.appendChild(textBox);
        element.appendChild(document.createElement('br'));
        element.appendChild(restoreButton);
        element.insertAdjacentText('beforeend', ' (this will only overwrite the settings in the string)');

        document.getElementById('settings-restore').parentNode.appendChild(element);
        document.getElementById('execute-restore').addEventListener('click', () => {
            performSettingsRestore();
        });
    }
}

function performSettingsRestore() {
    var restoresettings = JSON.parse(document.getElementById('settings-restore-text').value);
    //localStorage.clear();
    for (var key in restoresettings) {
        if (restoresettings.hasOwnProperty(key))
            localStorage.setItem(key,restoresettings[key]);
    }
    alert("Settings restored!");
    location.reload();
}
