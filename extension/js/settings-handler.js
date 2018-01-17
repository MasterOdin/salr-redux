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

var port = chrome.runtime.connect({"name":"settings"});

jQuery(document).ready(function() {
    // Don't wipe the settings made by previous versions
    if (localStorage.getItem('username')) {
        localStorage.setItem('salrInitialized', 'true');
    }

    // Setting names.
    var defaultSettings = [];
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
    defaultSettings['enableSAARSLink']              = 'true';
    defaultSettings['enableSinglePost']             = 'true';
    defaultSettings['hidePostButtonInThread']       = 'false';
    defaultSettings['removeOwnReport']              = 'true';
    defaultSettings['collapseTldrQuotes']           = 'false';

    // Control Options
    defaultSettings['displayPageNavigator']         = 'true';
    defaultSettings['loadNewWithLastPost']          = 'false';
    defaultSettings['displayOmnibarIcon']           = 'false';
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
    var version = chrome.runtime.getManifest().version;
    var versionQuery = jQuery('#version-text');
    versionQuery.text(version);
    versionQuery.attr('href', versionQuery.attr('href')+version.replace(/\./g,""));

    // Check stored settings, if value not set, set to default value
    for ( var key in defaultSettings ) {
        if ( localStorage.getItem(key) == undefined ) {
            localStorage.setItem(key, defaultSettings[key]);
        }
    }

    jQuery('#d_username').text(localStorage.getItem('username'));

    // Initialize text entry fields
    jQuery('input.text-entry').each(function() {
        // Pre-populate settings field
        populateValues(jQuery(this));

        // Set focus handler for the entry fields
        jQuery(this).focus(function() {
            onInputSelect(jQuery(this));
        });

        // Set blur handler for the entry fields
        jQuery(this).blur(function() {
            onInputDeselect(jQuery(this));
        });

        jQuery(this).change(function() {
            if (jQuery(this).attr('id') == 'username') {
                if (jQuery(this).val() == "") {
                    jQuery(this).val(localStorage.getItem('username'));
                }
                jQuery("#d_username").text(jQuery(this).val());
            }
            localStorage.setItem(jQuery(this).attr('id'), jQuery(this).val());
            highlightExamples();
        });
    });

    // Initialize checkbox fields
    var obj = {'inlineTweet':'https://api.twitter.com/*','enableQuickReply':'https://api.imgur.com/*'};
    jQuery('div.display-preference input[type=checkbox]').each(function() {
        populateCheckboxes(jQuery(this));
        onParentOptionSelect(jQuery(this));
        jQuery(this).click(function() {
            var id = jQuery(this).attr('id');
            if (id == 'inlineTweet' || id == 'enableQuickReply') {
                if (jQuery(this).prop('checked') == true) {
                    chrome.permissions.request({origins: [obj[id]]}, function(granted) {
                        if (!granted) {
                            jQuery(this).prop('checked',false);
                        }
                    });
                }
                else {
                    chrome.permissions.remove({ origins: [obj[id]] });
                }
            }
            localStorage.setItem(jQuery(this).attr('id'), jQuery(this).prop('checked'));
            highlightExamples();
            onParentOptionSelect(jQuery(this));
        });
    });

    // Initialize drop down menus
    jQuery('div.display-preference select').each(function() {
        populateDropDownMenus(jQuery(this));

        jQuery(this).change(function() {
            localStorage.setItem(jQuery(this).attr('id'), jQuery(this).val());
        });
    });

    // Setup color picker handles on the text boxes
	jQuery('.color-select-text').ColorPicker({
            onSubmit: function(hsb, hex, rgb, el) {
				jQuery(el).val('#' + hex);
				jQuery(el).ColorPickerHide();
                var box = jQuery('#'+jQuery(el).attr('id')+'-box');
				box.css('background-color', '#' + hex);
                localStorage.setItem(jQuery(el).attr('id'), jQuery(el).val());
                highlightExamples();
			},
			onBeforeShow: function () {
				jQuery(this).ColorPickerSetColor(this.value);
			}
	})
	.bind('keyup', function() {
		jQuery(this).ColorPickerSetColor(this.value);
	});

    jQuery('div.color-select-box').each(function() {
        var backgroundColor = jQuery(this).parent().parent().find('input.color-select-text').val();

        jQuery(this).css('background-color', backgroundColor);
    });

    // Set click handler for the okay button
    jQuery('.submit-panel > input#submit').click(function() {
        onSubmitClicked();
    });

	// once to initialize and once to bind click



    highlightExamples();

    jQuery('#config').click(function() {
        configWindow();
    });

    jQuery("#logo").click(function() {
        configWindow();
    });

    jQuery('#settings-backup').click(function() {
        createSettingsBackup();
    });

    jQuery('#settings-restore').click(function() {
        restoreSettingsBackup();
    });

    jQuery('#settings').click(function() {
        transitionSettings();
    });

    jQuery('#user-notes-local').click(function() {
        userNotesLocal();
    });

    jQuery('#user-notes-sync').click(function() {
        userNotesSync();
    });

    jQuery('#user-notes-delete-sync').click(function() {
        userNotesClear(true);
    });

    jQuery('#user-notes-delete-local').click(function() {
        userNotesClear(false);
    });

    jQuery('.help').mouseover(function(e) {
        var helpBox = jQuery(this).parent().children(".help-box");
        helpBox.show(100);
        helpBox.offset({left:jQuery(this).position().left+20,top:jQuery(this).position().top-10});
    }).mouseout(function() {
        jQuery(this).parent().children(".help-box").hide(100);
    });

    jQuery('.preference-title').click(function() {
        if (jQuery(this).parent().next().css('display') == "none") {
            jQuery('.show').parent().next().hide(200);
            jQuery('.show').find('img').attr('src','images/plus.png');
            jQuery('.show').removeClass('show');

            jQuery(this).addClass('show');
            jQuery(this).parent().next().show(200);
            jQuery('img',this).attr('src','images/minus.png');
        }
        else {
            jQuery(this).removeClass('show');
            jQuery(this).parent().next().hide(200);
            jQuery('img',this).attr('src','images/plus.png');
        }
        return false;
    });
    jQuery('section').hide();

    // get install info from other SALR(R) extensions
    port.onMessage.addListener(function(data) {
        if (data.message == 'salr-button') {
            if (data.bool == 'true') {
                jQuery('#displayOmnibarIcon').attr('disabled', true);
                jQuery('#displayOmnibarIcon').parent().parent().addClass('disabled-options');
                jQuery('#displayOmnibarHelp2').remove();
            }
            else {
                jQuery('#displayOmnibarHelp1').remove();
            }
        }
        else if (data.message == 'convert') {
            if (data.bool == 'false') {
                jQuery('#settings').remove();
            }
        }
    });
    port.postMessage({'message':'GetSALRButtonStatus'});
    port.postMessage({'message':'GetSALRStatus'});
});

function highlightExamples() {
    // Thread highlighting samples

    jQuery('tr#thread-read').each(function() {
        if (localStorage.getItem('highlightThread')=='true') {
            jQuery(this).children('td.star, td.title, td.replies, td.rating').each(function() {
                jQuery(this).css({ "background-color" : localStorage.getItem('lightRead'),
                                   "background-image" : "url('images/gradient.png')",
                                   "background-repeat" : "repeat-x",
                                   "background-position" : "left"
                                 });
            });

            jQuery(this).children('td.icon, td.author, td.views, td.lastpost').each(function() {
                jQuery(this).css({ "background-color" : localStorage.getItem('darkRead'),
                                   "background-image" : "url('images/gradient.png')",
                                   "background-repeat" : "repeat-x",
                                   "background-position" : "left"
                                 });
            });
        } else {
            jQuery(this).children().each(function() {
                jQuery(this).css({ "background-color" : '',
                                   "background-image" : '',
                                   "background-repeat" : '',
                                   "background-position": ''
                                });
            });
        }
    });

    jQuery('tr#thread-unread').each(function() {
        if (localStorage.getItem('highlightThread')=='true') {
            jQuery(this).children('td.star, td.title, td.replies, td.rating').each(function() {
                jQuery(this).css({ "background-color" : localStorage.getItem('lightNewReplies'),
                                   "background-image" : "url('images/gradient.png')",
                                   "background-repeat" : "repeat-x",
                                   "background-position": "left"
                                 });
            });

            jQuery(this).children('td.icon, td.author, td.views, td.lastpost').each(function() {
                jQuery(this).css({ "background-color" : localStorage.getItem('darkNewReplies'),
                                   "background-image" : "url('images/gradient.png')",
                                   "background-repeat" : "repeat-x",
                                   "background-position": "left"
                                 });
            });
        } else {
            jQuery(this).children().each(function() {
                jQuery(this).css({ "background-color" : '',
                                   "background-image" : '',
                                   "background-repeat" : '',
                                   "background-position": ''
                                });
            });
        }
    });

    jQuery('div#lastseen-forum').each(function() {
        if (localStorage.getItem('displayCustomButtons')=='true') {
            jQuery(this).css('display','none');
        } else {
            jQuery(this).css('display','');
        }
    });

    jQuery('div#lastseen-custom').each(function() {
        if (localStorage.getItem('displayCustomButtons')=='true') {
            jQuery(this).css({
                'display' : '',
                'background' : 'none',
                'border' : 'none'
            });
            jQuery('div#lastseen-inline',this).each(function() {
                if (localStorage.getItem('inlinePostCounts') == 'true') {
                    jQuery(this).css('display','');
                } else {
                    jQuery(this).css('display','none');
                }
            });
            jQuery('a#lastseen-count',this).each(function () {
                jQuery(this).html('');

                jQuery(this).css({
                    'border-left' : 'none',
                    'width' : '7px',
                    'height' : '16px',
                    'padding-right' : '11px',
                    'background-image' : "url('images/lastpost.png')",
                    'min-width': "0px"
                });

                jQuery(this).addClass('no-after');
                jQuery(this).parent().css("box-shadow", "0 0 0px #fff");
            });

            jQuery('a#lastseen-x',this).each(function() {
                jQuery(this).css({
                    'background' : 'none',
                    'background-image' : "url('images/unvisit.png')",
                    'height' : '16px',
                    'width' : '14px'
                });
                jQuery(this).parent().css("box-shadow", "0 0 0px #fff");
                jQuery(this).addClass('no-after');

                jQuery(this).text('');
            });
        } else {
            jQuery(this).css('display','none');
        }
    });
    jQuery('div#lastseen-custom-count').each(function() {
        if (localStorage.getItem('displayCustomButtons') == 'true' && localStorage.getItem('inlinePostCounts') != 'true') {
            jQuery(this).css('display', 'inline');
        } else {
            jQuery(this).css('display', 'none');
        }
    });

    // Post highlighting samples
    jQuery('div#your-quote').each(function() {
        if (localStorage.getItem('highlightOwnQuotes')=='true') {
            jQuery(this).css('background-color', localStorage.getItem('userQuote'));
        } else {
            jQuery(this).css('background-color', '');
        }
    });

    jQuery('dt#own-name').each(function() {
        if (localStorage.getItem('username') != '') {
            jQuery(this).text(localStorage.getItem('username'));
        }
    });
    jQuery('span.your-name').each(function() {
        if (localStorage.getItem('username') != '') {
            jQuery(this).text(localStorage.getItem('username'));
        }
        if (localStorage.getItem('highlightOwnUsername') == 'true') {
            jQuery(this).css('color', localStorage.getItem('usernameHighlight'));
        } else {
            jQuery(this).css('color', '');
        }
    });
    jQuery('span.your-name-quote').each(function() {
        if (localStorage.getItem('username') != '') {
            jQuery(this).text(localStorage.getItem('username'));
        }
        // this isn't how it acts in the while so why do it here?
        if (/*localStorage.getItem('highlightOwnQuotes') !='true' &&*/ localStorage.getItem('highlightOwnUsername') =='true') {
            jQuery(this).css('color', localStorage.getItem('usernameHighlight'));
        } else {
            jQuery(this).css('color', '');
        }
    });
    jQuery('table#own-post td').each(function() {
        if (localStorage.getItem('highlightSelf')=='true') {
            jQuery(this).css('background-color', localStorage.getItem('highlightSelfColor'));
        } else {
            jQuery(this).css('background-color', '');
        }
    });
    jQuery('table#friend-post td').each(function() {
        if (localStorage.getItem('highlightFriends')=='true') {
            jQuery(this).css('background-color', localStorage.getItem('highlightFriendsColor'));
        } else {
            jQuery(this).css('background-color', '');
        }
    });
    jQuery('table#op-post td').each(function() {
        if (localStorage.getItem('highlightOP')=='true') {
            jQuery(this).css('background-color', localStorage.getItem('highlightOPColor'));
        } else {
            jQuery(this).css('background-color', '');
        }
    });
    jQuery('dt#mod-name').each(function() {
        if (localStorage.getItem('highlightModAdminUsername') == 'true' && localStorage.getItem('highlightModAdmin')=='true') {
            jQuery(this).css('color', localStorage.getItem('highlightModeratorColor'));
        } else {
            jQuery(this).css('color', '');
        }
    });
    jQuery('dt#admin-name').each(function() {
        if (localStorage.getItem('highlightModAdminUsername') == 'true' && localStorage.getItem('highlightModAdmin')=='true') {
            jQuery(this).css('color', localStorage.getItem('highlightAdminColor'));
        } else {
            jQuery(this).css('color', '');
        }
    });
    jQuery('table#mod-post td').each(function() {
        if (localStorage.getItem('highlightModAdminUsername') != 'true' && localStorage.getItem('highlightModAdmin')=='true') {
            jQuery(this).css('background-color', localStorage.getItem('highlightModeratorColor'));
        } else {
            jQuery(this).css('background-color', '');
        }
    });
    jQuery('table#admin-post td').each(function() {
        if (localStorage.getItem('highlightModAdminUsername') != 'true' && localStorage.getItem('highlightModAdmin')=='true') {
            jQuery(this).css('background-color', localStorage.getItem('highlightAdminColor'));
        } else {
            jQuery(this).css('background-color', '');
        }
    });
}

/**
 *
 * Event handler for sub-options
 *
 */
function onParentOptionSelect(element) {
    var nextDiv = element.parent().parent().next();
    if (nextDiv.is('.sub-options')) {
        if (element.is(':checked')) {
            nextDiv.removeClass('disabled-options');
            nextDiv.find('input').removeAttr('disabled');
        } else {
            nextDiv.addClass('disabled-options');
            nextDiv.find('input').attr('disabled', true);
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
    element.css('color', '#000000');
    //element.val('');
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
    if (element.val() == '') {
        var value = localStorage.getItem(element.attr('id'));

        element.val(value);
    }

    element.css('color', '#999999');
}

/**
 * Populates the stored settings value into the element
 *
 * @param element - Input element
 *
 */
function populateValues(element) {
    var value = localStorage.getItem(element.attr('id'));

    if (!value) {
        // If there is no stored setting, use the default
        // value stored within the DOM
		var defaultCol = element.attr('default');
        element.attr('value', defaultCol);
    } else {
        // Otherwise, write the stored preference
        element.attr('value',value);
    }
}

/**
 * Populates any checkboxes with their stored value
 *
 * @param element - Input (checkbox) element
 *
 */
function populateCheckboxes(element) {
    var value = localStorage.getItem(element.attr('id'));

    // Make sure we're getting passed a checkbox
    if (element.attr('type') != 'checkbox')
        return;

    // If there is a value in localStorage, then set it,
    // otherwise unchecked it
    if (value == 'true') {
        element.attr('checked', true);
    } else {
        element.attr('checked', false);
    }
}

/**
 * Populates any drop down menus with their stored value
 *
 * @param element - Input (select) element
 *
 */
function populateDropDownMenus(element) {
    var value = localStorage.getItem(element.attr('id'));

    // Make sure we're getting passed a checkbox
    if (element.attr('type') != 'select-one')
        return;
    if (value == null)
        value = '';

    // Set the selected value to the one from LocalStorage
    jQuery('option[value="' + value + '"]', element).first().attr('selected', 'selected');
}

/**
 * Event handler for clicking the submit button
 *
 *
 */
function onSubmitClicked() {

	// Store the preferences locally so that the page can
    // request it
    // We use window.opener to assign it to the toolstrip localStorage, since
    // the toolstrip handles all communication with the page
    jQuery('.user-preference').each(function() {
        var preferenceID = jQuery(this).attr('id');
        var value = null;

        if (jQuery(this).attr('type') == 'checkbox') {
            value = jQuery(this).attr('checked');
        } else {
            value = jQuery(this).val();
        }

        localStorage.setItem(preferenceID, value);
    });

	// Close the settings window

    window.close();
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
            win.document.writeln(i+":<br />&nbsp;&nbsp;&nbsp;&nbsp;Text: "+local[i]['text']+"<br />"+
                "&nbsp;&nbsp;&nbsp;&nbsp;Color: "+local[i]['color']+"<br />");
        }
        var sync = JSON.parse(settings['userNotes']);
        win.document.writeln('<br /><br />userNotesSync:<br />');
        for (i in sync) {
            win.document.writeln(i+":<br />&nbsp;&nbsp;&nbsp;&nbsp;Text: "+sync[i]['text']+"<br />"+
                "&nbsp;&nbsp;&nbsp;&nbsp;Color: "+sync[i]['color']+"<br />");
        }
        win.document.writeln('</body></html>');
        win.document.close();
    });

}

function transitionSettings() {
    port.postMessage({'message':'ConvertSettings'});
    alert("User Notes gotten from SALR!");
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
        if (!localStorage.hasOwnProperty(key))
            continue;
        if (key == 'friendsList'    ||
            key == 'friendsListId'  ||
            key == 'forumsList'     ||
            key == 'modList'        ||
            //key == 'saveUserNotes'  ||
            //key == 'userNotes'      ||
            //key == 'userNotesOld'   ||
            //key == 'userNotesLocal' ||
            //key == 'threadNotes'   ||
            key == 'forumPostKey' )
            continue;
        settings[key] = localStorage.getItem(key);
    }
    var jsonString = JSON.stringify(settings);
    if (jQuery('#settings-backup-text').length == 0) {
        var textarea = '<textarea id="settings-backup-text" cols="200" rows="20" readonly>'+jsonString+'</textarea>';
        jQuery('#settings-backup').parent().append('<br />Copy JSON Setting String Below:<br />'+textarea);
    }
    console.log(jsonString);
}

function restoreSettingsBackup() {
    if (jQuery('#settings-restore-text').length == 0) {
        var textarea = '<textarea id="settings-restore-text" cols="200" rows="20"></textarea>';
        var button = '<button style="margin-left:400px; width: 115px;" id="execute-restore">Restore Settings</button> (this will only overwrite settings in string)';
        jQuery('#settings-restore').parent().append('<br />Paste JSON Setting String below:<br />'+textarea+'<br />'+button);
        jQuery("#execute-restore").click(function() {
            performSettingsRestore();
        });
    }
}

function performSettingsRestore() {
    var restoresettings = JSON.parse(jQuery('#settings-restore-text').val());
    //localStorage.clear();
    for (var key in restoresettings) {
        localStorage.setItem(key,restoresettings[key]);
    }
    alert("Settings restored!");
    location.reload();
}