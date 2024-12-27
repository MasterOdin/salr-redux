/**
 * Initialize event callbacks for the page
 *
 */

document.addEventListener('DOMContentLoaded', () => {
    (async () => {
        // Setting names.
        let defaultSettings = [];
        defaultSettings['salrInitialized']              = 'true';

        defaultSettings['username']                     = '';
        defaultSettings['usernameCase']                 = 'false';

        // Thread Highlighting
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

        // Set the version text on the settings page
        let version = chrome.runtime.getManifest().version;
        let versionQuery = document.getElementById('version-text');
        versionQuery.textContent = version;
        versionQuery.href = versionQuery.href + version.replace(/\./g, '');

        // Check stored settings, if value not set, set to default value
        const items = await chrome.storage.local.get();
        const toSet = {};
        // New, more scalable method for setting default prefs.
        for (const key in defaultSettings) {
            if (items[key] == undefined) {
                toSet[key] = defaultSettings[key];
            }
        }
        await chrome.storage.local.set(toSet);

        const { username } = await chrome.storage.local.get('username');
        document.getElementById('d_username').textContent = username;

        // Initialize text entry fields
        let textEntries = document.querySelectorAll('input.text-entry');
        for (let textEntry of textEntries) {
            // Pre-populate settings field
            await populateValues(textEntry);

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
                        textEntry.value = username;
                    }
                    document.getElementById('d_username').textContent = textEntry.value;
                }
                chrome.storage.local.set({[textEntry.id]: textEntry.value})
                    .then(() => {
                        highlightExamples();
                    }).catch((err) => {
                        console.error(err);
                    });
            });
        }

        // Initialize checkbox fields
        var obj = {'inlineTweet':'https://api.twitter.com/*','enableQuickReply':'https://api.imgur.com/*'};
        let checkboxPreferences = document.querySelectorAll('div.display-preference input[type=checkbox]');
        for (let preference of checkboxPreferences) {
            await populateCheckboxes(preference);
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
                chrome.storage.local.set({[preference.id]: `${preference.checked}`})
                    .then(() => {
                        highlightExamples();
                    })
                    .catch((err) => {
                        console.error(err);
                    });
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
            const { [preference.id]: val } = (await chrome.storage.local.get(preference.id)) ?? '';
            preference.value = val;
            preference.addEventListener('change', () => {
                chrome.storage.local.set({[preference.id]: preference.value}).catch((err) => {
                    console.error(err);
                });
            });
        }

        let colorSelectors = document.querySelectorAll('input[type=color]');
        let colorTimers = {};
        for (let colorSelector of colorSelectors) {
            const { [colorSelector.id]: val } = await chrome.storage.local.get(colorSelector.id);
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
                    chrome.storage.local.set({[colorSelector.id]: colorSelector.value})
                        .then(() => {
                            highlightExamples();
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                }
            });
            colorSelector.addEventListener('input', () => {
                textSelector.value = colorSelector.value;
                clearTimeout(colorTimers[colorSelector.id]);
                colorTimers[colorSelector.id] = setTimeout(() => {
                    chrome.storage.local.set({[colorSelector.id]: colorSelector.value})
                        .then(() => {
                            highlightExamples();
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                }, 500);
            });
        }

        await highlightExamples();

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

        // Dark mode toggle
        const stylesheets = document.head.getElementsByTagName('LINK');
        const darkIdx = [...stylesheets].findIndex((stylesheet) => stylesheet.href.includes('somethingawful_dark.css'));
        const elements = document.querySelectorAll('.dark-mode-toggle');
        for (const element of elements) {
            element.addEventListener('change', (e) => {
                for (const innerElem of elements) {
                    innerElem.checked = e.target.checked;
                }
                stylesheets[darkIdx].disabled = !e.target.checked;
            });
        }
    })().catch((err) => {
        console.error(err);
    });
});

async function highlightExamples() {
    // Thread highlighting samples

    let threadReads = document.querySelectorAll('tr#thread-read');
    const {
        darkNewReplies,
        darkRead,
        displayCustomButtons,
        highlightAdminColor,
        highlightFriends,
        highlightFriendsColor,
        highlightModAdmin,
        highlightModAdminUsername,
        highlightModeratorColor,
        highlightOP,
        highlightOPColor,
        highlightOwnQuotes,
        highlightOwnUsername,
        highlightSelf,
        highlightSelfColor,
        highlightThread,
        inlinePostCounts,
        lightNewReplies,
        lightRead,
        username,
        usernameHighlight,
        userQuote,
    } = await chrome.storage.local.get([
        'darkNewReplies',
        'darkRead',
        'displayCustomButtons',
        'highlightAdminColor',
        'highlightFriends',
        'highlightFriendsColor',
        'highlightModAdmin',
        'highlightModAdminUsername',
        'highlightModeratorColor',
        'highlightOP',
        'highlightOPColor',
        'highlightOwnQuotes',
        'highlightOwnUsername',
        'highlightSelf',
        'highlightSelfColor',
        'highlightThread',
        'inlinePostCounts',
        'lightNewReplies',
        'lightRead',
        'username',
        'usernameHighlight',
        'userQuote',
    ]);
    for (let threadRead of threadReads) {
        if (highlightThread == 'true') {
            let elements = threadRead.querySelectorAll('td.star, td.title, td.replies, td.rating');
            for (let element of elements) {
                Object.assign(element.style, {
                    backgroundColor: lightRead,
                    backgroundImage: "url('images/gradient.png')",
                    backgroundRepeat: 'repeat-x',
                    backgroundPosition: 'left'
                });
            }

            elements = threadRead.querySelectorAll('td.icon, td.author, td.views, td.lastpost');
            for (let element of elements) {
                Object.assign(element.style, {
                    backgroundColor: darkRead,
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
        if (highlightThread == 'true') {
            let children = unreadThread.querySelectorAll('td.star, td.title, td.replies, td.rating');
            for (let child of children) {
                Object.assign(child.style, {
                    backgroundColor: lightNewReplies,
                    backgroundImage: "url('images/gradient.png')",
                    backgroundRepeat: "repeat-x",
                    backgroundPosition: "left"
              });
            }

            children = unreadThread.querySelectorAll('td.icon, td.author, td.views, td.lastpost');
            for (let child of children) {
                Object.assign(child.style, {
                    backgroundColor: darkNewReplies,
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
        lastSeenForum.style.display = (displayCustomButtons == 'true') ? 'none' : '';
    }

    let lastSeenCustoms = document.querySelectorAll('div#lastseen-custom');
    for (let lastSeenCustom of lastSeenCustoms) {
        if (displayCustomButtons == 'true') {
            Object.assign(lastSeenCustom.style, {
                display: '',
                background: 'none',
                border: 'none'
            });

            document.getElementById('lastseen-inline').style.display = (inlinePostCounts == 'true') ? 'block' : 'none';

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
        if (displayCustomButtons == 'true' && inlinePostCounts != 'true') {
            element.style.display = 'inline';
        }
        else {
            element.style.display = 'none';
        }
    }

    // Post highlighting samples
    document.getElementById('your-quote').style.backgroundColor = (highlightOwnQuotes == 'true') ? userQuote : '';

    let ownNameElement = document.getElementById('own-name');
    if (username != '') {
        ownNameElement.textContent = username;
    }

    elements = document.querySelectorAll('span.your-name');
    for (let element of elements) {
        if (username != '') {
            element.textContent = username;
        }
        element.style.color = (highlightOwnUsername == 'true') ? usernameHighlight : '';
    }
    elements = document.querySelectorAll('span.your-name-quote');
    for (let element of elements) {
        if (username != '') {
            element.textContent = username;
        }
        // this isn't how it acts in the while so why do it here?
        if (/*localStorage.getItem('highlightOwnQuotes') != 'true' &&*/ highlightOwnUsername == 'true') {
            element.style.color = usernameHighlight;
        }
        else {
            element.style.color = '';
        }
    }
    elements = document.querySelectorAll('table#own-post td');
    for (let element of elements) {
        element.style.backgroundColor = (highlightSelf == 'true') ? highlightSelfColor : '';
    }
    elements = document.querySelectorAll('table#friend-post td');
    for (let element of elements) {
        element.style.backgroundColor = (highlightFriends == 'true') ? highlightFriendsColor : '';
    }
    elements = document.querySelectorAll('table#op-post td');
    for (let element of elements) {
        element.style.backgroundColor = (highlightOP == 'true') ? highlightOPColor : '';
    }

    let adminNameElement = document.getElementById('admin-name');
    let modNameElement = document.getElementById('mod-name');
    if (highlightModAdminUsername == 'true' && highlightModAdmin == 'true') {
        adminNameElement.style.color = highlightAdminColor;
        modNameElement.style.color = highlightModeratorColor;

    }
    else {
        adminNameElement.style.color = '';
        modNameElement.style.color = '';
    }

    elements = document.querySelectorAll('table#mod-post td');
    for (let element of elements) {
        if (highlightModAdminUsername != 'true' && highlightModAdmin == 'true') {
            element.style.backgroundColor = highlightModeratorColor;
        }
        else {
            element.style.backgroundColor = '';
        }
    }
    elements = document.querySelectorAll('table#admin-post td');
    for (let element of elements) {
        if (highlightModAdminUsername != 'true' && highlightModAdmin == 'true') {
            element.style.backgroundColor = highlightAdminColor;
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
        chrome.storage.local.get(element.id)
            .then((result) => {
                element.value = result[element.id];
            })
            .catch((err) => {
                console.error(err);
            });
    }
    element.style.color = '#999999';
}

/**
 * Populates the stored settings value into the element
 *
 * @param element - Input element
 *
 */
async function populateValues(element) {
    const { [element.id]: value } = await chrome.storage.local.get(element.id);
    if (!value) {
        // If there is no stored setting, use the default
        // value stored within the DOM
        const defaultCol = element.default;
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
async function populateCheckboxes(element) {
    // Make sure we're being passed a checkbox
    if (element.getAttribute('type') !== 'checkbox') {
        return;
    }

    const { [element.id]: value } = await chrome.storage.local.get(element.id);

    // If there is a value in localStorage, then set it,
    // otherwise uncheck it
    element.checked = (value === 'true');
}

/**
 * Dump the localStorage entries to a new window.
 *
 */
function configWindow() {
    (async () => {
        const localSettings = await chrome.storage.local.get();
        const syncSettings = await chrome.storage.sync.get();

        var win = window.open('background.html','config');
        win.document.writeln('<html><body><h1>SALR Configuration</h1>');
        win.document.writeln('<table border="1">');
        win.document.writeln('<tr><th>Key</th><th>Value</th></tr>');
        win.document.writeln('</table>');
        for (var key in localSettings) {
            if (!localSettings.hasOwnProperty(key))
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
            win.document.writeln('setting[\''+key+'\']    =    "'+localSettings[key]+'";<br />');
        }
        win.document.writeln('<br /><br />User Note values, number is user id: (don\'t post this in thread!)<br />');
        win.document.writeln("userNotesLocal:<br />");
        const local = JSON.parse(localSettings['userNotesLocal']);
        for (const i in local) {
            if (local.hasOwnProperty(i))
                win.document.writeln(i+":<br />&nbsp;&nbsp;&nbsp;&nbsp;Text: "+local[i]['text']+"<br />"+
                    "&nbsp;&nbsp;&nbsp;&nbsp;Color: "+local[i]['color']+"<br />");
        }
        const sync = JSON.parse(syncSettings['userNotes']);
        win.document.writeln('<br /><br />userNotesSync:<br />');
        for (const i in sync) {
            if (sync.hasOwnProperty(i))
                win.document.writeln(i+":<br />&nbsp;&nbsp;&nbsp;&nbsp;Text: "+sync[i]['text']+"<br />"+
                    "&nbsp;&nbsp;&nbsp;&nbsp;Color: "+sync[i]['color']+"<br />");
        }
        win.document.writeln('</body></html>');
        win.document.close();
    })().catch((err) => {
        console.error(err);
    });
}

/**
 * Helper function to count local user notes
 * @return {Number} number of local user notes
 */
async function countLocalUserNotes() {
    // userNotesLocal are initially set to 'null'; clearing them sets to ''
    var count = 0;
    var { userNotesLocal: localNotes } = await chrome.storage.local.get('userNotesLocal');
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
    (async () => {
        const settings = await chrome.storage.sync.get();
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
        var cnt3 = await countLocalUserNotes();
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
            try {
                await chrome.storage.sync.set({ 'userNotesLocal': JSON.stringify(sync) });
                alert("User notes stored locally!");
            }
            catch (err) {
                console.error(err);
            }
        }
    })().catch((err) => {
        console.error(err);
    });
}

/**
 * Backs up local user notes to storage.sync
*/
function userNotesSync() {
    (async () => {
        const settings = await chrome.storage.sync.get();
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
            const localNotes = await chrome.storage.local.get('userNotesLocal');
            await chrome.storage.sync.set({ 'userNotes': localNotes['userNotesLocal'] });
        }
    })().catch((err) => {
        console.error(err);
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
            chrome.storage.local.set({'userNotesLocal' : ''}).catch((err) => {
                console.error(err);
            });
        }
    }
}

function createSettingsBackup() {
    var settings = {};
    chrome.storage.local.get()
        .then((localSettings) => {
            for (var key in localSettings) {
                if (!localSettings.hasOwnProperty(key)) {
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
                settings[key] = localSettings[key];
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
        })
        .catch((err) => {
            console.error(err);
        });

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
    const restoreSettings = JSON.parse(document.getElementById('settings-restore-text').value);
    chrome.storage.local.set(restoreSettings)
        .then(() => {
            alert("Settings restored!");
            location.reload();
        })
        .catch((err) => {
            console.error(err);
        });
}
