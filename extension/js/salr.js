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

function SALR(settings, base_image_uri) {
    this.settings = settings;
    this.base_image_uri = base_image_uri;

    this.pageNavigator = null;
    this.quickReply = null;
    this.mouseGesturesContoller = null;
    this.hotKeyManager = null;

    this.darkMode = false;

    this.pageInit();
}

SALR.prototype.pageInit = function() {
    var that = this;
    this.currentPage = findCurrentPage();
    this.pageCount = countPages();
    this.getCurrentPage = getCurrentPageNumber();
    this.urlSchema = findUrlSchema();

    this.darkMode = [...document.styleSheets].find(
        (stylesheet) => stylesheet.href && stylesheet.href.includes('dark.css')
    ) !== undefined;

    // Update the styles now that we have
    // the settings
    this.updateStyling();

    // we need to set this on any function call that would change the height of the page
    var anchorPage = false;

    if (this.settings.replaceLinksWithImages == 'true' || this.settings.replaceImagesWithLinks == 'true' ||
        this.settings.restrictImageSize == 'true' || this.settings.fixImgurLinks == 'true') {
        this.modifyImages();
        anchorPage = true;
    }

    jQuery.expr[":"].econtains = function(obj, index, meta, stack){
        return (obj.textContent || obj.innerText || $(obj).text() || "").toLowerCase() == meta[3].toLowerCase();
    };

    switch (this.currentPage) {
        case '':
        case 'index':
            if (this.settings.highlightModAdmin == 'true') {
                this.skimModerators();
            }

            break;
        case 'forumdisplay':
            if (this.settings.threadCaching == 'true') {
                this.queryVisibleThreads();
            }

            if (this.settings.displayPageNavigator == 'true') {
                this.pageNavigator = new PageNavigator(this.base_image_uri);
            }

            this.updateForumsList();

            if (this.settings.highlightModAdmin == 'true') {
                this.skimModerators();
                this.highlightModAdminPosts();
            }

            if (this.settings.showLastThreePages == 'true' && this.settings.showLastThreePagesForum == 'true') {
                this.showLastThreePages();
            }

            if (this.settings.expandBreadcrumbs == 'true') {
                this.expandBreadcrumbs();
            }

            if (this.settings.displayMods == 'true') {
                jQuery('#mp_bar').css({
                    "visibility":"visible",
                    "font-size":"11px",
                    "padding-left":"36px",
                    "padding-top":"5px"
                });
            }
            if (this.settings.openAllForumUnreadLink == 'true') {
                this.renderOpenUpdatedThreadsButton();
            }
            break;
        case 'showthread':
            // Someday, we'll only iterate through the posts table once
            this.handleShowThread();

            if (this.settings.inlineVideo == 'true') {
                this.inlineYoutubes();
            }

            if (this.settings.inlineVine == 'true') {
                this.inlineVines();
            }

            if (this.settings.displayPageNavigator == 'true') {
                this.pageNavigator = new PageNavigator(this.base_image_uri, this.settings);
            }

            this.updateForumsList();

            if (this.settings.enableUserNotes == 'true') {
                this.displayUserNotesHandler();
            }

            if (this.settings.boxQuotes == 'true') {
                this.boxQuotes();
            }

            if (this.settings.highlightOwnUsername == 'true') {
                this.highlightOwnUsername();
            }

            if (this.settings.highlightOwnQuotes == 'true') {
                this.highlightOwnQuotes();
            }

            if (this.settings.collapseTldrQuotes == 'true') {
                this.tldrQuotes();
                anchorPage = true;
            }
            if (this.settings.enableQuickReply == 'true') {
                //if (!this.settings.forumPostKey) {
                    //this.settings.forumPostKey = -1;
                //}
                // new QuickReplyBox(this.settings.forumPostKey,this.base_image_uri,this.settings);
                this.quickReply = new QuickReplyBox(this.base_image_uri, this.settings, this.urlSchema, this.darkMode);
                this.bindQuickReply();
            }

            if (this.settings.enableThreadNotes == 'true') {
                this.threadNotes();
            }

            //zephmod - hide/show avatar entirely
            if (this.settings.hideUserAvatar == 'true') {
                jQuery("#thread dl.userinfo dd.title").remove();
            }
            //zephmod - hide/show avatar image
            else if (this.settings.hideUserAvatarImage == 'true') {
                jQuery("#thread dl.userinfo dd.title img").remove();
            }



            if (this.settings.hideGarbageDick == 'true') {
                jQuery("img[src*='fi.somethingawful.com/images/newbie.gif']").css({'display':'none'});
                jQuery("img[src*='forumimages.somethingawful.com/images/newbie.gif']").css({'display':'none'});
                anchorPage = true;
            }

            // if (this.settings.hideStupidNewbie == 'true') {

            // }

            if (this.settings.fixCancer == 'true') {
                this.fixCancerPosts();
            }

            if (this.settings.whoPostedHide != 'true')
            {
                this.addSalrBar();
            }

            if (this.settings.whoPostedHide != 'true') {
                this.renderWhoPostedInThreadLink();
            }

            if (this.settings.retinaImages == 'true') {
                this.swapRetinaEmotes();
            }

            if (this.settings.setImageTooltip == 'true') {
                this.setImageTooltips();
            }

            if (this.settings.hidePostButtonInThread == 'true') {
                this.hidePostButtonInThread();
            }

            if (this.settings.showLastThreePages == 'true' && this.settings.showLastThreePagesThread == 'true') {
                this.showLastThreePages();
            }

            if (this.settings.expandBreadcrumbs == 'true') {
                this.expandBreadcrumbs();
            }

            if (this.settings.imageLinkHover == 'true') {
                this.hoverImages();
            }
            break;
        case 'newreply':
            //if (!this.settings.forumPostKey) {
            //this.findFormKey();
            //}

            if (this.settings.qneProtection == 'true') {
                this.quoteNotEditProtection();
            }
            /* falls through */
        case 'editpost':
            if (this.settings.threadCaching == 'true') {
                this.bindThreadCaching();
            }
            if (this.settings.hideUserGrenade == 'true') {
                jQuery("#thread dl.userinfo dt.author").removeClass("platinum");
            }
            break;
        case 'usercp':
            this.updateUsernameFromCP();
            this.updateFriendsList();
            if (this.settings.fixUserCPFont == 'true') {
                $("a.thread_title").css("font-size","13px");
            }
            /* falls through */
        case 'bookmarkthreads':
            if (this.settings.openAllUnreadLink == 'true') {
                this.renderOpenUpdatedThreadsButton();
            }

            if (this.settings.highlightModAdmin == 'true') {
                this.highlightModAdminPosts();
            }
            if (this.settings.showLastThreePages == 'true' && this.settings.showLastThreePagesUCP == 'true') {
                this.showLastThreePages();
            }
            if (this.settings.threadCaching == 'true') {
                this.queryVisibleThreads();
            }
            if (this.settings.displayPageNavigator == 'true' && this.pageCount > 1) {
                this.pageNavigator = new PageNavigator(this.base_image_uri);
            }
            break;
        case 'misc':
            if (window.location.href.indexOf('action=whoposted') >= 0) {
                this.highlightModAdminPosts();
            }

            break;
        case 'member':
            if (window.location.href.indexOf('action=getinfo') >= 0) {
                /* user profile skeleton */
            }

            break;
        case 'banlist':
            jQuery('a[target=new]').each(function() {
                jQuery(this).attr('target','_blank');
            });
            break;
    }

    if (this.pageNavigator) {
        this.pageNavigator.display();
    }

    if (this.settings.enableMouseGestures == 'true') {
        this.mouseGesturesController = new MouseGesturesController(this.base_image_uri, this.settings, this.getCurrentPage, this.pageCount);
    }

    if (this.settings.enableKeyboardShortcuts == 'true') {
        this.hotKeyManager = new HotKeyManager(this.quickReply, this.settings, this.getCurrentPage, this.pageCount);
    }

    var preventAdjust = false;
    $("body,html").bind("scroll mousedown DOMMouseScroll mousewheel keyup", function(e){
        if (!preventAdjust && (e.which > 0 || e.type === "mousedown" || e.type === "mousewheel")) {
             preventAdjust = true;
        }
    });

    if (this.settings.adjustAfterLoad == "true") {
        window.onload = function() {
            if (!(that.settings.preventAdjust == "true" && preventAdjust)) {
                var href = window.location.href;
                if (href.indexOf('#pti') >= 0 || href.indexOf('#post') >= 0 || href.indexOf('#lastpost') >= 0) {
                    var baseUrl = href.split('#')[0];
                    var hash = href.split('#')[1];

                    var getPost = (href.indexOf('#lastpost') >= 0) ? findLastPost() : findFirstUnreadPost();
                    var hashId = $('div#thread > table.post').eq(getPost).attr('id');
                    // wait a tiny bit just to really make sure DOM is done
                    setTimeout(function() {
                        // We have to change the hash to a new value that still points to the
                        // the same post as originally asked for so that the page resets itself
                        // to the right post, but then set it back to what it was originally
                        // so the url entered doesn't change (mainly for #lastpost)
                        if (href.indexOf('#pti') >= 0) {
                            window.location.replace(baseUrl + "#" + hashId);
                        }
                        else {
                            window.location.replace(baseUrl + "#pti" + (getPost + 1));
                        }
                        window.location.replace(baseUrl + "#" + hash);
                    }, 75);

                }
            }
        };
    }
};

SALR.prototype.openSettings = function() {
    postMessage({'message': 'OpenSettings'});
};

/**
 * Hides top/bottom navigation menu links based on user settings.
 * A false user setting implies something should be hidden.
 */
SALR.prototype.applyNavMenuStyling = function() {
    var settings = this.settings;

    if (settings.showPurchases === 'false') {
        document.getElementById('nav_purchase').style.setProperty('display', 'none', 'important');
    }
    else {
        let purchaseNav = document.getElementById('nav_purchase');
        if (settings['topPurchaseAva'] === 'false') {
            // Two links exist to purchase an avatar
            let avAnchs = purchaseNav.querySelectorAll('a[href="https://secure.somethingawful.com/products/titlechange.php"]');
            for (let avAnch of avAnchs) {
                avAnch.parentNode.style.display = 'none';
            }
        }

        const settingToPurchaseLinkMap = new Map([
            ['topPurchaseAcc', 'https://secure.somethingawful.com/products/register.php'],
            ['topPurchasePlat', 'https://secure.somethingawful.com/products/platinum.php'],
            ['topPurchaseArchives', 'https://secure.somethingawful.com/products/archives.php'],
            ['topPurchaseNoAds', 'https://secure.somethingawful.com/products/noads.php'],
            ['topPurchaseUsername', 'https://secure.somethingawful.com/products/namechange.php'],
            ['topPurchaseBannerAd', 'https://secure.somethingawful.com/products/ad-banner.php'],
            ['topPurchaseEmoticon', 'https://secure.somethingawful.com/products/smilie.php'],
            ['topPurchaseSticky', 'https://secure.somethingawful.com/products/sticky-thread.php'],
            ['topPurchaseGiftCert', 'https://secure.somethingawful.com/products/gift-certificate.php']
        ]);
        settingToPurchaseLinkMap.forEach((value, key) => {
            if (settings[key] === 'false') {
                // Everything else just has one
                purchaseNav.querySelector('a[href="' + value + '"]').parentNode.style.display = 'none';
            }
        });
    }

    var navLists = document.getElementsByClassName('navigation');
    if (settings.showNavigation === 'false') {
        for (let navList of navLists) {
            navList.style.setProperty('display', 'none', 'important');
        }
    }
    else {
        const settingToNavLinkMap = new Map([
            ['topSAForums', '/index.php'],
            ['topSALink', '//www.somethingawful.com/'],
            ['topSearch', '/query.php'],
            ['topUserCP', '/usercp.php'],
            ['topPrivMsgs', '/private.php'],
            ['topForumRules', 'https://www.somethingawful.com/d/forum-rules/forum-rules.php'],
            ['topSaclopedia', '/dictionary.php'],
            ['topGloryhole', '/stats.php'],
            ['topLepersColony', '/banlist.php'],
            ['topSupport', '/supportmail.php'],
        ]);

        for (let navList of navLists) {
            if ((settings.topNavBar === 'false' && navList === navLists[0]) ||
                (settings.bottomNavBar === 'false' && navList === navLists[1])) {
                    navList.style.setProperty('display', 'none', 'important');
            }
            else {
                settingToNavLinkMap.forEach((value, key) => {
                    if (settings[key] === 'false') {
                        navList.querySelector('a[href="' + value + '"]').parentNode.style.display = 'none';
                    }
                });
                if (settings.topLogout === 'false') {
                    navList.querySelector('a[href^="/account.php?action=logout"]').parentNode.style.display = 'none';
                }
            }
        }
    }
};

// Since we have to wait to receive the settings from the extension,
// stash the styling logic in it's own function that we can call
// once we're ready
SALR.prototype.updateStyling = function() {
    var that = this;
    var forumId = findRealForumID();

    // make it so highlighting number doesn't change space it takes up in forumdisplay or usercp
    jQuery('td.title div.title_pages a').css("border","1px solid transparent");

    if (this.settings.inlinePostCounts == 'true') {
        jQuery(".info").css("padding-right","20px");
    }
    jQuery('tr.thread').each(function() {
        var thread = jQuery(this);
        var newPosts = false;
        var seenThread = false;

        if (that.settings.displayCustomButtons == 'true' && forumId != YOSPOS_ID) {
            // Re-style the new post count link
            jQuery('a.count', thread).each(function() {

                var other = that;

                newPosts = true;
                var newPostCount = jQuery(this).html();

                // Remove the count from the element
                jQuery(this).html('');

                // Remove the left split border
                jQuery(this).css("border-left", "none");

                // Resize, shift, and add in the background image
                jQuery(this).css("width", "7px");
                jQuery(this).css("height", "16px");
                jQuery(this).css("padding-right", "11px");
                jQuery(this).css("background", "url('" + other.base_image_uri + "lastpost.png') no-repeat");
                jQuery(this).css("min-width", "0px");
                jQuery(this).addClass('no-after');

                jQuery(this).parent().css("box-shadow", "0 0 0px #fff");


                if (that.settings.inlinePostCounts == 'true') {
                    jQuery('div.lastseen', thread).each(function() {
                        // Strip HTML tags
                        newPostCount = parseInt(newPostCount.replace(/(<([^>]+)>)/ig, ""));

                        if (newPostCount) {
                            // Set the HTML value
                            jQuery(this).prepend("<div class='count' style='font-size: 12px; float: left; margin-top: 4px; padding-right: 4px;'>(" + newPostCount + ")</div>");
                        }
                    });
                } else {
                    // Display number of new replies for each thread
                    jQuery('td.replies', thread).each(function() {
                        // Strip HTML tags
                        newPostCount = parseInt(newPostCount.replace(/(<([^>]+)>)/ig, ""));

                        if (newPostCount) {
                            // Set the HTML value
                            jQuery(this).append("<br /><div class='count' style='font-size: 12px;'>(" + newPostCount + ")</div>");
                        }
                    });
                }
            });

            // Re-style the "mark unread" link
            jQuery('a.x', thread).each(function() {
                var other = that;

                seenThread = true;

                // Set the image styles
                jQuery(this).css("background", "none");
                jQuery(this).css("background-image", "url('" + other.base_image_uri + "unvisit.png')");
                jQuery(this).css("height", "16px");
                jQuery(this).css("width", "14px");

                jQuery(this).parent().css("box-shadow", "0 0 0px #fff");
                jQuery(this).addClass('no-after');

                // Remove the 'X' from the anchor tag
                jQuery(this).text('');

                // Remove styling if x is hit
                jQuery(this).click(function() {
                    thread.children().each(function() {
                        jQuery(this).css({  "background-color" : '',
                                            "background-image" : '',
                                            "background-repeat" : '',
                                            "background-position": ''
                                        });
                    });
                });
            });

            // Eliminate last-seen styling
            jQuery('.lastseen', thread).each(function() {
                jQuery(this).css("background", "none");
                jQuery(this).css("border", "none");
            });

        } else {
            if (jQuery('a.count', thread).length)
                newPosts = true;
            if (jQuery('a.x', thread).length)
                seenThread = true;
        }

        var noStars = (jQuery('td.star').css('display') == 'none');

        // Use custom highlighting if:
        //   highlightThread setting is enabled
        //   this thread has unread posts
        //   bookmark coloring forums option is disabled
        //      or stars is disabled
        if (that.settings.highlightThread=='true' && seenThread && (thread.attr('class') == 'thread seen' || thread.attr('class')=='thread' || noStars || thread.attr('class') == 'thread seen arch')) {
            // If the thread has new posts, display the green shade,
            // otherwise show the blue shade
            var darkShade = (newPosts) ? that.settings.darkNewReplies : that.settings.darkRead;
            var lightShade = (newPosts) ? that.settings.lightNewReplies : that.settings.lightRead;

            // Thread icon, author, view count, and last post
            jQuery(this).children('td.icon, td.author, td.views, td.lastpost').each(function() {
                var other = that;

                jQuery(this).css({ "background-color" : darkShade,
                                   "background-image" : "url('" + other.base_image_uri + "gradient.png')",
                                   "background-repeat" : "repeat-x",
                                   "background-position" : "left"
                                 });
            });

            // Thread title, replies, and rating
            jQuery(this).children('td.star, td.title, td.replies, td.rating').each(function() {
                var other = that;

                jQuery(this).css({ "background-color" : lightShade,
                                   "background-image" : "url('" + other.base_image_uri + "gradient.png')",
                                   "background-repeat" : "repeat-x",
                                   "background-position" : "left"
                                 });
            });
        }

        // Send threads without unread posts to the end of the list
        if (!newPosts && that.settings.displayNewPostsFirst == 'true') {
            if ((that.currentPage == 'forumdisplay' && that.settings.displayNewPostsFirstForum == 'true') ||
                ((that.currentPage == 'usercp' || that.currentPage == 'bookmarkthreads')
                    && that.settings.displayNewPostsFirstUCP == 'true')) {
                thread.parent().append(thread);
            }
        }
    });

    if(this.settings.displayConfigureSalr == 'true') {
        jQuery('.navigation li.first').each(function() {
            jQuery(this).next('li').next('li').after(" - <li><a class='salr-configure' href='#'>Configure SALR</a></li>");
        });
    }

    jQuery('.salr-configure').click(function() {
        that.openSettings();
        return false;
    });

    // Hide top/bottom menu links based on user settings
    this.applyNavMenuStyling();

    // Hide the advertisements
    if (this.settings.hideAdvertisements == 'true') {
        jQuery('div.oma_pal').each(function() {
            jQuery(this).remove();
        });

        jQuery('div#ad_banner_user').each(function() {
            jQuery(this).remove();
        });
    }
};

/**
 * This function will eventually be the only one iterating through the posts table.
 */
SALR.prototype.handleShowThread = function() {
    // Fetch hidden avatars from cache
    var hiddenAvatars = [];
    if (this.settings.enableToggleUserAvatars === 'true') {
        hiddenAvatars = this.getStoredHiddenAvatars();
    }

    // Fetch friend list info
    var friends_id = null;
    if (this.settings.highlightFriends === 'true') {
        friends_id = this.getStoredFriendNums();
    }

    // Set some flags for the whole thread
    const inSinglePostView = document.location.href.indexOf('action=showpost') !== -1;
    const addSinglePostLink = this.settings.enableSinglePost === "true" && !isThreadInArchives();

    let modList = null;
    let modListUpdate = false;

    // Initialize modList
    if (this.settings.highlightModAdmin === 'true') {
        modList = this.skimModerators();
    }

    var posts = document.querySelectorAll('table.post');
    for (let post of posts) {
        if (post.id === 'post') // adbot
            continue;
        let profileLink = post.querySelector('ul.profilelinks a[href*="userid="]');
        if (!profileLink)
            continue;

        let userid = profileLink.href.match(/userid=(\d+)/)[1];

        let modEntryChanged = this.highlightPost(post, userid, friends_id, modList);
        if (!modListUpdate)
            modListUpdate = modEntryChanged;

        if (addSinglePostLink) {
            this.insertSinglePostLink(post, inSinglePostView);
        }
        this.addUserLinksToPost(post, userid, profileLink, hiddenAvatars);
    }

    if (modListUpdate) {
        postMessage({ 'message': 'ChangeSetting',
                           'option' : 'modList',
                           'value'  : JSON.stringify(modList) });
    }
};

/**
 *
 * @param {Object} modList  Object containing list of mods.
 * @param {string} userid   string userid of mod to update.
 * @param {string} username username of mod to update.
 * @param {string} newRole  'A' or 'M', for now.
 * @returns {boolean} Whether the mod list entry changed.
 */
SALR.prototype.updateModList = function(modList, userid, username, newRole) {
    // There is no modlist! Abort! Abort!
    if (!modList)
        return false;

    let roleChanged = false;
    if (modList[userid] == null) {
        modList[userid] = {'username' : [username], 'mod' : newRole};
        return true;
    } else {
        // Existing entry, let's update it if we see an Admin:
        // Eventually, this should be tweaked so showthread can report downgrades
        if (modList[userid].mod !== newRole && newRole === 'A')  {
            roleChanged = true;
            modList[userid].mod = newRole;
        }
        if (modList[userid].username != username) {
            var namechange = true;
            for (var unum in modList[userid].username)
                if (username == modList[userid].username[unum])
                    namechange = false;
            if (namechange) {
                modList[userid].username.push(username);
            }
        }
        return (roleChanged || namechange);
    }
};

/**
 * Inserts the single post view (or back to thread) link into a post.
 * @param {HTMLElement} post             Post to add user links to.
 * @param {boolean}     inSinglePostView Whether we're already in single post view.
 */
SALR.prototype.insertSinglePostLink = function(post, inSinglePostView) {
    let postIdLink = post.querySelector('td.postdate a[href^="#post"');
    if (!postIdLink)
        return;

    let curPostId = post.id.match(/post(\d+)/)[1];
    let newLink = document.createElement('a');
    if (!inSinglePostView) {
        newLink.href = "/showthread.php?action=showpost&postid=" + curPostId;
        newLink.title = "View as single post";
        newLink.textContent = "1";
    }
    postIdLink.parentNode.insertBefore(newLink, postIdLink);
    postIdLink.parentNode.insertBefore(document.createTextNode(" "), postIdLink);
};

SALR.prototype.modifyImages = function() {
    // make sure we've loaded all images before executing this code
    var that = this;
    window.addEventListener("load", function() {
        // fix timg, because it's broken
        //if(this.settings.fixTimg == 'true') this.fixTimg(this.settings.forceTimg == 'true');
        var subset1 = jQuery('.postbody a');

        // Replace Links with Images
        if (that.settings.replaceLinksWithImages == 'true') {

            //NWS/NMS links
            if(that.settings.dontReplaceLinkNWS == 'true')
            {
                subset1 = subset1.not(".postbody:has(img[title=':nws:']) a").not(".postbody:has(img[title=':nms:']) a");
            }

            // spoiler'd links
            if(that.settings.dontReplaceLinkSpoiler == 'true') {
                subset1 = subset1.not('.bbc-spoiler a');
            }

            // seen posts
            if(that.settings.dontReplaceLinkRead == 'true') {
                subset1 = subset1.not('.seen1 a').not('.seen2 a');
            }

            subset1.each(function() {
                var match = jQuery(this).attr('href').match(/https?\:\/\/(?:[-_0-9a-zA-Z]+\.)+[a-z]{2,6}(?:\/[^/#?]+)+\.(?:jpe?g|gif|png|bmp)+(?!(\.html)|[a-zA-Z]|\.)/);
                if(match != null && !(that.settings.dontReplaceLinkImage == 'true' && jQuery(this).has('img').length > 0)) {
                    jQuery(this).after("<img src='" + match[0] + "' />");
                    jQuery(this).remove();
                }
            });
        }

        var subset = jQuery('.postbody img');

        //if(settings.dontReplaceEmoticons) {
        subset = subset.not('img[src*="fi.somethingawful.com/images/smilies/"]');
        subset = subset.not('img[src*="fi.somethingawful.com/safs/smilies/"]');
        subset = subset.not('img[src*="fi.somethingawful.com/customtitles/"]');
        subset = subset.not('img[src*="fi.somethingawful.com/smilies/"]');
        subset = subset.not('img[src*="i.somethingawful.com/forumsystem/emoticons/"]');
        subset = subset.not('img[src*="i.somethingawful.com/images/"]');
        subset = subset.not('img[src*="i.somethingawful.com/mjolnir/images/"]');
        subset = subset.not('img[src*="i.somethingawful.com/u/garbageday/"]');
        //}

        var subset_filtered;
        if(that.settings.replaceImagesReadOnly == 'true') {
            subset_filtered = subset.filter('.seen1 img, .seen2 img');
        }
        else {
            subset_filtered = subset;
        }

        // Replace inline Images with Links
        if (that.settings.replaceImagesWithLinks == 'true') {
            subset_filtered.each(function() {
                var source = jQuery(this).attr('src');
                var add = "";
                var change = jQuery(this);
                if (jQuery(this).parent().attr('href') != null) {
                    if (that.settings.replaceImagesLink == 'true') {
                        add = " (<a href='"+jQuery(this).parent().attr('href')+"' target=\"_blank\" rel=\"nofollow\">Original Link</a>)";
                    }
                    change = jQuery(this).parent();
                }
                add = "<a href='" + source + "' target=\"_blank\" rel=\"nofollow\">" + source + "</a>" + add;
                change.after(add);
                change.remove();
            });
        }

        // better if we don't just run through all images if we don't have to
        if (that.settings.restrictImageSize == 'false' && that.settings.fixImgurLinks == 'false') {
            return;
        }

        var restrictImagePxW = parseInt(that.settings.restrictImagePxW);
        var restrictImagePxH = parseInt(that.settings.restrictImagePxH);
        subset.each(function() {
            if (that.settings.restrictImageSize == 'true' && (restrictImagePxH > 0 || restrictImagePxW > 0)) {
                var img = jQuery(this)[0];
                var width = img.naturalWidth;
                var height = img.naturalHeight;

                var factor_width = restrictImagePxW/width;
                var factor_height = restrictImagePxH/height;

                var max_height = height;
                var max_width = width;

                if ((factor_width <= factor_height || restrictImagePxH == 0) && (factor_width > 0 && factor_width < 1)) {
                    max_width = restrictImagePxW;
                    max_height = height*factor_width;
                }
                else if ((factor_height <= factor_width || restrictImagePxW == 0) && (factor_height > 0 && factor_height < 1)) {
                    max_height = restrictImagePxH;
                    max_width = width*factor_height;
                }

                if (width != max_width || height != max_height) {
                    jQuery(this).css({
                        'max-width': max_width + 'px',
                        'max-height': max_height + 'px',
                        'border': '1px dashed gray'
                    });
                }
            }
            if (that.settings.fixImgurLinks == 'true') {
                if (jQuery(this).parent().is("a")) {
                    var format = true;
                    var link =  jQuery(this).parent().attr('href').match(/[http|https]*:\/\/(.*)imgur\.com\/(.*)\.(.*)/);
                    if (link == null) {
                        link = jQuery(this).parent().attr('href').match(/[http|https]*:\/\/(.*)imgur\.com\/(.*)/);
                        format = false;
                    }
                    if (link == null) {
                        return;
                    }
                    var o_link = link[0];
                    var c_link = link[2];
                    var image = jQuery(this).attr('src').match(/[http|https]*:\/\/(.*)imgur\.com\/(.*)\.(.*)/)[2];


                    if (image.substr(0,(image.length-1)) == c_link && jQuery.inArray(c_link.substr(c_link.length-1,c_link.length),['s','m','l']) == -1) {
                        var i = new Image();
                        i.src = o_link;
                        var im = this;
                        jQuery(i).error(function() {
                            jQuery(im).parent().attr('href',o_link.replace(c_link,image));
                        });
                    }
                }
            }
        });
/*
        jQuery.when(subset,subset1,subset_filtered).promise().done(function() {
            var href = window.location.href;
            if (href.indexOf('#pti') >= 0 || href.indexOf('#post') >= 0) {
                var first = findFirstUnreadPost();
                var post = jQuery('div#thread > table.post').eq(first);
                console.log(post.offset().top);
                jQuery(window).scrollTop(post.offset().top);
            }
        });
*/
    });
};

/**
 * Initialize/update moderator list.
 * @returns {Object} Moderator list.
 */
SALR.prototype.skimModerators = function() {
    var modList;
    var modupdate = false;
    if (this.settings.modList == null) {
        // Seed administrators. Is there a list for them?
        // Also old moderator name changes
        modList = { "12831"  : {'username' : ['elpintogrande'], 'mod' : 'A'},
                    "16393"  : {'username' : ['Fistgrrl'], 'mod' : 'A'},
                    "17553"  : {'username' : ['Livestock'], 'mod' : 'A'},
                    "22720"  : {'username' : ['Ozma','Ozmaugh','Y Kant Ozma Post'], 'mod' : 'A'},
                    "23684"  : {'username' : ['mons all madden','mons al-madeen'], 'mod' : 'A'},
                    "24587"  : {'username' : ['hoodrow trillson'], 'mod' : 'A'},
                    "27691"  : {'username' : ['Lowtax'], 'mod' : 'A'},
                    "51697"  : {'username' : ['angerbotSD','angerbot','angerbeet'], 'mod' : 'A'},
                    "62392"  : {'username' : ['Tiny Fistpump','T. Finn'], 'mod' : 'A'},
                    "114975" : {'username' : ['SA Support Robot'], 'mod' : 'A'},
                    "137488" : {'username' : ['Garbage Day'], 'mod' : 'A'},
                    "147983" : {'username' : ['Peatpot'], 'mod' : 'A'},
                    "158420" : {'username' : ['Badvertising'], 'mod' : 'A'},
                    "42786"  : {'username' : ['strwrsxprt'], 'mod' : 'M'},
                   };
        modupdate = true;
    } else {
        modList = JSON.parse(this.settings.modList);

        // If old style of modList is detected, force reset
        if (typeof(modList['23684'].username) == 'string') {
// This probably isn't behaving as expected - localstorage from
// content script = the domain of the content, not the extension
            localStorage.removeItem('modList');
            return;
        }
    }

    // Moderator list on forumdisplay.php
    var that = this;
    if (findRealForumID() != 26) {
        jQuery('div#mods > b > a').each(function() {
            var userid = jQuery(this).attr('href').split('userid=')[1];
            var username = jQuery(this).html();
            if (that.updateModList(modList, userid, username, 'M'))
                modupdate = true;
        });
    }

    // Moderator lists on index.php
    jQuery('td.moderators > a').each(function() {
        var userid = jQuery(this).attr('href').split('userid=')[1];
        var username = jQuery(this).html();
        if (that.updateModList(modList, userid, username, 'M'))
            modupdate = true;
});

    if (modupdate) {
        postMessage({ 'message': 'ChangeSetting',
                           'option' : 'modList',
                           'value'  : JSON.stringify(modList) });
    }

    return modList;
};

SALR.prototype.inlineYoutubes = function() {
    var that = this;

    //sort out youtube links
    jQuery('.postbody a[href*="youtube.com"]').each(function() {
            jQuery(this).css("background-color", that.settings.youtubeHighlight).addClass("salr-video");
    });

    jQuery('.postbody a[href*="youtu.be"]').each(function() {
            jQuery(this).css("background-color", that.settings.youtubeHighlight).addClass("salr-video");
    });

    jQuery(".salr-video").click(function() {
        if (jQuery(this).hasClass('show-player')) {
            jQuery(this).next().remove();
            jQuery(this).removeClass('show-player');
        }
        else {
            var match = jQuery(this).attr('href').match(/^http[s]*\:\/\/((?:www|[a-z]{2})\.)?(youtube\.com\/watch\?v=|youtu.be\/|m.youtube.com\/watch\?v=)([-_0-9a-zA-Z]+)/); //get youtube video id
            var videoId = match[3];

            jQuery(this).after('<div><iframe class="salr-player youtube-player"></iframe></div>');
            jQuery(this).next().children("iframe").attr("allow","fullscreen");
            jQuery(this).next().children("iframe").attr("src", "https://www.youtube.com/embed/" + videoId);
            jQuery(this).next().children("iframe").attr("width","640");
            jQuery(this).next().children("iframe").attr("height","385");
            jQuery(this).next().children("iframe").attr("type","text/html");
            jQuery(this).next().children("iframe").attr("frameborder","0");
            jQuery(this).next().children("iframe").attr("allowfullscreen","true");

            jQuery(this).addClass('show-player');
        }
        return false;
    });
};

SALR.prototype.inlineVines = function() {
    var that = this;
    var vines = jQuery('.postbody a[href*="://vine.co/v/"]');
    if(that.settings.dontReplaceVineNWS == 'true')
    {
        vines = vines.not(".postbody:has(img[title=':nws:']) a").not(".postbody:has(img[title=':nms:']) a");
    }
    // spoiler'd links
    if(that.settings.dontReplaceVineSpoiler == 'true') {
        vines = vines.not('.bbc-spoiler a');
    }
    vines.each(function() {
        jQuery(this).html('<iframe class="vine-embed" src="'+jQuery(this).attr('href')+'/embed/simple" width="600" height="600" frameborder="0"></iframe>'+
                          '<script async src="//platform.vine.co/static/scripts/embed.js" charset="utf-8"></script>');
    });
};

/**
 * Bar above a thread to contain SALR tools
 *
 */
SALR.prototype.addSalrBar = function() {
    var that = this;

    //  Only valid on thread pages
    if(findCurrentPage() != 'showthread')
        return;

    jQuery('div.threadbar.top').prepend('<div id="salrbar"></div>');

    if(that.settings.salrLogoHide != "true") {
        var salr_logo = this.base_image_uri+"logo16_trans.png";
        jQuery('#salrbar').append('<span id="salrlogo"><img src="'+salr_logo+'" /> SALR</span>');
    }
    else {
        jQuery('#salrbar').append('<span id="salrlogo"></span>');
    }
};


/**
 * Open the list of who posted in a thread
 *
 */
SALR.prototype.renderWhoPostedInThreadLink = function() {
    var salrbar = jQuery('#salrbar');
    if (!salrbar.length)
        return;

    var threadid = findThreadID();
    var href = this.urlSchema+'//forums.somethingawful.com/misc.php?action=whoposted&threadid='+threadid;
    var linkHTML = '<a href="'+href+'">Who Posted?</a>';
    salrbar.append(linkHTML);
};

/**
 * Open all of your tracked and updated threads in a new tab
 *
 */
SALR.prototype.renderOpenUpdatedThreadsButton = function() {
    var that = this;

    var stars = [];
    var openNoStar = true;
    if (this.currentPage == "forumdisplay") {
        if (this.settings.ignoreForumStarNone == 'true') {
            openNoStar = false;
        }
        if (this.settings.ignoreForumStarGold == 'true') {
            stars.push("bm0");
        }
        if (this.settings.ignoreForumStarRed == 'true') {
            stars.push("bm1");
        }
        if (this.settings.ignoreForumStarYellow == 'true') {
            stars.push("bm2");
        }
        if (this.settings.ignoreForumStarCyan == 'true') {
            stars.push("bm3");
        }
        if (this.settings.ignoreForumStarGreen == 'true') {
            stars.push("bm4");
        }
        if (this.settings.ignoreForumStarLavender == 'true') {
            stars.push("bm5");
        }
    }
    else {
        if (this.settings.ignoreBookmarkStarGold == 'true') {
            stars.push("bm0");
        }
        if (this.settings.ignoreBookmarkStarRed == 'true') {
            stars.push("bm1");
        }
        if (this.settings.ignoreBookmarkStarYellow == 'true') {
            stars.push("bm2");
        }
        if (this.settings.ignoreBookmarkStarCyan == 'true') {
            stars.push("bm3");
        }
        if (this.settings.ignoreBookmarkStarGreen == 'true') {
            stars.push("bm4");
        }
        if (this.settings.ignoreBookmarkStarLavender == 'true') {
            stars.push("bm5");
        }
    }

    if (!document.getElementById('salr-title-with-open-threads-link')) {
        var parent = document.querySelector('th.title');
        var wrapper = document.createElement('span');
        var title = document.createElement('span');
        var link = document.createElement('a');

        for (let child of parent.childNodes) {
            title.appendChild(child);
        }

        link.setAttribute('id', 'salr-open-threads-link');
        link.appendChild(document.createTextNode('Open updated threads'));

        wrapper.setAttribute('id', 'salr-title-with-open-threads-link');
        wrapper.appendChild(title);
        wrapper.appendChild(link);
        parent.appendChild(wrapper);
    }

    // Open all updated threads in tabs
    jQuery('#salr-open-threads-link').on('click', function() {
        jQuery('tr.thread').each( function() {
            var other = this;

            var open_thread = function() {
                if (jQuery('a[class*=count]', other).length > 0) {
                    var href = jQuery('a[class*=count]', other).attr('href');
                    postMessage({ 'message': 'OpenTab',
                        'url'  : that.urlSchema+'//forums.somethingawful.com'+href });
                }
            };

            if (stars.length == 0 && openNoStar == true) {
                open_thread();
                return;
            }

            var star_img = jQuery('td.star', this)[0].classList;

            if (star_img.length <= 1 && openNoStar == false)
                return;

            if (jQuery.inArray(star_img[1],stars) == -1) {
                open_thread();
            }
        });
    });
};

/**
 * Extract friends list from the User CP
 */
SALR.prototype.updateFriendsList = function() {
    var friends = [];
    var friends_id = {};

    jQuery('div#buddylist dd>a.user').each( function() {
        friends_id[this.href.match(/[0-9]+/gi)] = 1;
        friends.push(this.title);
    });

    postMessage({ 'message': 'ChangeSetting',
                  'option' : 'friendsList',
                  'value'  : JSON.stringify(friends) });
    postMessage({ 'message': 'ChangeSetting',
                  'option' : 'friendsListId',
                  'value'  : JSON.stringify(friends_id) });
};

/**
 * Get list of stored friend userids
 * @return {Object} null, or an object with userid numbers as keys
 */
SALR.prototype.getStoredFriendNums = function() {
    if (!this.settings.friendsListId)
        return null;

    var friends_id = JSON.parse(this.settings.friendsListId);
    if (!friends_id)
        return null;

    return friends_id;
};

/**
 * Perform color highlighting on a single post
 * @param {HTMLElement}   post       Post to check for color highlighting
 * @param {string}        userid     string userid of current poster
 * @param {(Object|null)} friends_id null, or an object containing our list of friends with number userids as keys
 * @param {(Object|null)} modList    Object containing list of mods, or null if highlighting is off.
 * @returns {boolean} Whether we will need to update the mod list.
 */
SALR.prototype.highlightPost = function(post, userid, friends_id, modList) {
    let userNameBox = post.querySelector('dt.author');
    if (!userNameBox) // Something has gone horribly wrong
        return;

    if (this.settings.hideUserGrenade === 'true') {
        if (userNameBox.className.trim() === 'author platinum' ||
            userNameBox.className.trim() === 'author platinum op')
                userNameBox.classList.remove("platinum");
    }

    let highlightColor = '';
    let modEntryChanged = false;

    // Highlight friend posts
    if (friends_id && this.isUserAFriend(userid, friends_id)) {
        highlightColor = this.settings.highlightFriendsColor;
    }

    // Highlight OP posts
    if (this.settings.highlightOP === 'true') {
        if (userNameBox.classList.contains('op')) {
            highlightColor = this.settings.highlightOPColor;
            let statusText = document.createElement('dd');
            statusText.textContent = 'Thread Poster';
            statusText.style.fontWeight = 'bold';
            statusText.style.color = '#07A';
            userNameBox.insertAdjacentElement('afterend', statusText);
        }
    }

    // Highlight mod/admin posts
    if (this.settings.highlightModAdmin === 'true') {
        let userName = userNameBox.textContent;
        if (userNameBox.classList.contains('role-admin')) {
            // Found an Admin; update the modList
            modEntryChanged = this.updateModList(modList, userid, userName, 'A');
            let statusText = document.createElement('dd');
            statusText.textContent = 'Forum Administrator';
            statusText.style.fontWeight = 'bold';
            if (this.settings.highlightModAdminUsername === 'true') {
                userNameBox.style.color = this.settings.highlightAdminColor;
                statusText.style.color = this.settings.highlightAdminColor;
            }
            else {
                highlightColor = this.settings.highlightAdminColor;
            }
            userNameBox.insertAdjacentElement('afterend', statusText);
        }
        else if (userNameBox.classList.contains('role-supermod')) {
            // Found a Mod; update the modList
            modEntryChanged = this.updateModList(modList, userid, userName, 'M');
            let statusText = document.createElement('dd');
            statusText.textContent = 'Super Moderator';
            statusText.style.fontWeight = 'bold';
            if (this.settings.highlightModAdminUsername === 'true') {
                userNameBox.style.color = this.settings.highlightModeratorColor;
                statusText.style.color = this.settings.highlightModeratorColor;
            }
            else {
                highlightColor = this.settings.highlightModeratorColor;
            }
            userNameBox.insertAdjacentElement('afterend', statusText);
        }
        else if (userNameBox.classList.contains('role-mod')) {
            // Found a Mod; update the modList
            modEntryChanged = this.updateModList(modList, userid, userName, 'M');
            let statusText = document.createElement('dd');
            statusText.textContent = 'Forum Moderator';
            statusText.style.fontWeight = 'bold';
            if (this.settings.highlightModAdminUsername === 'true') {
                userNameBox.style.color = this.settings.highlightModeratorColor;
                statusText.style.color = this.settings.highlightModeratorColor;
            }
            else {
                highlightColor = this.settings.highlightModeratorColor;
            }
            userNameBox.insertAdjacentElement('afterend', statusText);
        }
    }

    // Highlight own posts
    let userName = userNameBox.textContent.trim();
    if (this.settings.username !== "" && userName === this.settings.username) {
        if (this.settings.highlightSelf === 'true')
            highlightColor = this.settings.highlightSelfColor;

        if (this.settings.removeOwnReport === 'true') {
            let reportButton = post.querySelector('li.alertbutton');
            if (reportButton)
                reportButton.style.display = 'none';
        }
    }

    if (highlightColor !== '') {
        let tds = post.querySelectorAll('td');
        for (let sometd of tds) {
            sometd.style.backgroundColor = highlightColor;
            sometd.style.borderCollapse = 'collapse';
        }
    }
    return modEntryChanged;
};

/**
 * Checks if a number userid is a friend
 * @param {string} userid     string userid to test for friendship
 * @param {Object} friends_id null, or an object containing our list of friends with number userids as keys
 * @return {boolean} Whether the specified user is a friend
 */
SALR.prototype.isUserAFriend = function(userid, friends_id) {
    if (!friends_id)
        return false;
    let useridnum = parseInt(userid, 10);
    if (friends_id[useridnum] && friends_id[useridnum] === 1)
        return true;
    return false;
};

/**
 * Highlight the posts by moderators and admins
 */
SALR.prototype.highlightModAdminPosts = function() {
    switch (findCurrentPage()) {
        case 'forumdisplay':
        case 'usercp':
        case 'bookmarkthreads':
            this.highlightModAdminForumDisplay();
            break;
        case 'misc':
            this.highlightModAdminWhoPosted();
            break;
    }
};

/**
 * Highlight the posts by moderators and admins
 * on the forum display page
 */
SALR.prototype.highlightModAdminForumDisplay = function() {
    var that = this;

    if (this.settings.modList == null)
        return;

    var modList = JSON.parse(this.settings.modList);

    // Highlight mods and admin thread OPs on forumdisplay.php
    jQuery('td.author > a, a.author').each(function() {
        var userid = jQuery(this).attr('href').split('userid=')[1];
        if (modList[userid] != null) {
            var color;
            switch (modList[userid].mod) {
                case 'M':
                    color = that.settings.highlightModeratorColor;
                    break;
                case 'A':
                    color = that.settings.highlightAdminColor;
                    break;
            }
            jQuery(this).css('color', color);
            jQuery(this).css('font-weight', 'bold');
        }
    });

    // Highlight mod and admin last posters on forumdisplay.php
    jQuery('td.lastpost > a.author').each(function() {
        var username = jQuery(this).html();
        // No userid in this column so we have to loop
        for(var userid in modList) {
            if (modList.hasOwnProperty(userid)) {
                for (var unum in modList[userid].username) {
                    if (username != modList[userid].username[unum])
                        continue;
                    var color;
                    switch (modList[userid].mod) {
                        case 'M':
                            color = that.settings.highlightModeratorColor;
                            break;
                        case 'A':
                            color = that.settings.highlightAdminColor;
                            break;
                    }
                    jQuery(this).css('color', color);
                    jQuery(this).css('font-weight', 'bold');
                    break;
                }
            }
        }
    });
};

/**
 * Highlight the posts by moderators and admins
 * on the who posted page
 */
SALR.prototype.highlightModAdminWhoPosted = function() {
    var that = this;

    if (this.settings.modList == null)
        return;

    var modList = JSON.parse(this.settings.modList);

    jQuery('a[href*=member.php]').each(function() {
        var userid = jQuery(this).attr('href').split('userid=')[1];
        if (modList[userid] != null) {
            var color;
            switch (modList[userid].mod) {
                case 'M':
                    color = that.settings.highlightModeratorColor;
                    break;
                case 'A':
                    color = that.settings.highlightAdminColor;
                    break;
            }
            jQuery(this).css('color', color);
            jQuery(this).css('font-weight', 'bold');
        }
    });
};

/**
 * Update the list of forums from the index.
 * Use this in case dropdown at bottom breaks again
 */
SALR.prototype.updateForumsListIndex = function() {
    var forums = [];

    forums.push({ 'name'   : 'Private Messages',
                  'id'     : 'pm',
                  'level'  : 0,
                  'sticky' : false,
                });
    forums.push({ 'name'   : 'User Control Panel',
                  'id'     : 'cp',
                  'level'  : 0,
                  'sticky' : false,
                });
    forums.push({ 'name'   : 'Search Forums',
                  'id'     : 'search',
                  'level'  : 0,
                  'sticky' : false,
                });
    forums.push({ 'name'   : 'Forums Home',
                  'id'     : 'home',
                  'level'  : 0,
                  'sticky' : false,
                });
    forums.push({ 'name'   : 'Leper\'s Colony',
                  'id'     : 'lc',
                  'level'  : 0,
                  'sticky' : false,
                });
    forums.push({ 'name'   : '',
                  'id'     : '',
                  'level'  : -1,
                  'sticky' : false,
                });

    var stickyList = [];
    if (this.settings.forumsList != null) {
        var oldForums = JSON.parse(this.settings.forumsList);
        for(var someOldForum of oldForums) {
            stickyList[someOldForum.id] = someOldForum.sticky;
        }
    }

    jQuery('table#forums tr').each(function() {
        var row = this;

        // Categories
        jQuery('th.category a', this).each(function() {
            var match = jQuery(this).attr('href').match(/forumid=(\d+)/);
            var forumid = -1;
            var title = jQuery(this).text();
            if (match != null)
                forumid = match[1];

            forums.push({ 'name'   : title,
                          'id'     : forumid,
                          'level'  : 0,
                          'sticky' : (stickyList[forumid]==true),
                        });
        });

        // Forums
        jQuery('td.title > a', this).each(function() {
            var match = jQuery(this).attr('href').match(/forumid=(\d+)/);
            var forumid = -1;
            var title = jQuery(this).text();
            if (match != null)
                forumid = match[1];

            forums.push({ 'name'   : title,
                          'id'     : forumid,
                          'level'  : 1,
                          'sticky' : (stickyList[forumid]==true),
                        });

            // Subforums
            jQuery('div.subforums a', jQuery(this).parent()).each(function() {
                var match = jQuery(this).attr('href').match(/forumid=(\d+)/);
                var forumid = -1;
                var title = jQuery(this).text();
                if (match != null)
                    forumid = match[1];

                forums.push({ 'name'   : title,
                              'id'     : forumid,
                              'level'  : 2,
                              'sticky' : (stickyList[forumid]==true),
                            });

                if (forumid == '103') {
                    //This is now a regular subforum, but may go back
                    //forums.push({ 'name'   : 'Traditional Games Discussion',
                    //              'id'     : '234',
                    //              'level'  : 3,
                    //              'sticky' : (stickyList['234']==true),
                    //            });
                } else if (forumid == '234') {
                    forums.push({ 'name'   : 'Play by Post',
                                  'id'     : '103',
                                  'level'  : 3,
                                  'sticky' : (stickyList['103']==true),
                                });
                } else if (forumid == '145') {
                    forums.push({ 'name'   : 'Rift: Goon Squad HQ',
                                  'id'     : '254',
                                  'level'  : 3,
                                  'sticky' : (stickyList['254']==true),
                                });
                    forums.push({ 'name'   : 'WoW: Goon Squad',
                                  'id'     : '146',
                                  'level'  : 3,
                                  'sticky' : (stickyList['146']==true),
                                });
                    forums.push({ 'name'   : 'The StarCraft II Zealot Zone',
                                  'id'     : '250',
                                  'level'  : 3,
                                  'sticky' : (stickyList['250']==true),
                                });
                }
            });
        });
    });

    if (forums.length > 0) {
        postMessage({ 'message': 'ChangeSetting',
                           'option' : 'forumsList',
                           'value'  : JSON.stringify(forums) });
    }
};

/**
 * Update the list of forums.
 */
SALR.prototype.updateForumsList = function() {
    var forums = [];

    var stickyList = [];
    if (this.settings.forumsList != null) {
        var oldForums = JSON.parse(this.settings.forumsList);
        for (var someOldForum of oldForums) {
            stickyList[someOldForum.id] = someOldForum.sticky;
        }
    }

    var numSeps = 0;
    jQuery('select[name="forumid"]>option').each(function() {
        if (this.text == "Please select one:" || this.text == "Jump to another forum:")
            return;

        var splitUp = this.text.match(/^(-*)(.*)/);
        var indent = splitUp[1].length/2;
        if (indent >= 10) {
            numSeps++;
            // Ignore first separator
            if (numSeps == 1)
                return;
            indent=-1;
        }
        var title = splitUp[2];

        forums.push({ 'name'   : title,
                      'id'     : this.value,
                      'level'  : indent,
                      'sticky' : (stickyList[this.value]==true),
                    });
    });

    // Make sure drop down contains full list of forums
    if (forums.length > 15) {
        postMessage({ 'message': 'ChangeSetting',
                           'option' : 'forumsList',
                           'value'  : JSON.stringify(forums) });
    }
};

/**
 * Fetches the username of the current user from the user CP
 */
SALR.prototype.updateUsernameFromCP = function() {
    var username = jQuery('#loggedinusername').text();
    if (this.settings.username != username) {
        postMessage({ 'message' : 'ChangeSetting',
                           'option'  : 'username',
                           'value'   : username });
    }
};

/**
 * Determine method of opening displayUserNotes
 */
SALR.prototype.displayUserNotesHandler = function() {
    if (this.settings.enableUserNotesSync == 'true') {
        this.displayUserNotesSync();
    }
    else {
        this.displayUserNotesLocal();
    }
};

SALR.prototype.displayUserNotesSync = function() {
    var that = this;
    chrome.storage.sync.get(function(settings) {
       if (that.settings.userNotes != "undefined" && that.settings.userNotes != undefined) {
            if (settings['userNotes'] == undefined) {
                settings['userNotes'] = that.settings.userNotes;
                postMessage({'message' : 'ChangeSyncSetting',
                             'option'  : 'userNotes',
                             'value'   : that.settings.userNotes
                });

            }
            else {
                var sync = JSON.parse(settings['userNotes']);
                var old = JSON.parse(that.settings.userNotes);

                for (var x in old) {
                    if (old[x] != null && sync[x] != null) {
                        if (old[x]['text'] != sync[x]['text']) {
                            sync[x]['text'] = sync[x]['text'] + " / " + old[x]['text'];
                        }
                    }
                    else if (old[x] != null) {
                        sync[x] = old[x];
                    }
                    else {
                        // sync has something, but old doesn't so do nothing
                    }
                }

                settings['userNotes'] = JSON.stringify(sync);
                postMessage({   'message' : 'ChangeSetting',
                                'option'  : 'userNotes',
                                'value'   : undefined
                });
                // in case everything blows up and everyone is angry, I can just restore these
                postMessage({   'message' : 'ChangeSetting',
                                'option'  : 'userNotesOld',
                                'value'   : settings['userNotes']
                });
            }
        }

        that.displayUserNotes(settings['userNotes'],that,'ChangeSyncSetting');

    });
};

SALR.prototype.displayUserNotesLocal = function() {
    this.displayUserNotes(this.settings.userNotesLocal,this,'ChangeSyncSetting');
};

/**
 * Displays notes under usernames.
 */
SALR.prototype.displayUserNotes = function(userNotes,that,message) {
    var notes = userNotes;

    if (notes == null || notes == "undefined" || notes == undefined || notes == "null") {
        notes = { "50339"   : {'text' : 'SALR Developer', 'color' : '#9933FF'}, // Sebbe
                  "3882420" : {'text' : 'SALR Developer', 'color' : '#9933FF'}, // Onoj
                  "143511"  : {'text' : 'SALR Developer', 'color' : '#9933FF'}, // Sneaking Mission
                  "156041"  : {'text' : 'SALR Developer', 'color' : '#9933FF'}, // wmbest2
                  "115838"  : {'text' : 'SALR Developer', 'color' : '#9933FF'}, // Ferg
                  "101547"  : {'text' : 'SALR Developer', 'color' : '#9933FF'}, // Rohaq
                  "163390"  : {'text' : 'SALR Developer', 'color' : '#9933FF'}, // Master_Odin
                  "53580"   : {'text' : 'SALR Developer', 'color' : '#003366'}  // astral
                };
        postMessage({ 'message': message,
                           'option' : 'userNotes',
                           'value'  : JSON.stringify(notes)
        });
    } else if (notes === '') {
        // They've been cleared in the preferences, so let's not readd the defaults
        notes = {};
    } else {
        notes = JSON.parse(notes);
    }
    jQuery('body').append("<div id='salr-usernotes-config' title='Set note' style='display: none'>"+
        "<fieldset>"+
            "<p><label for='salr-usernotes-text'><strong>Note:</strong></label><br/><input type='text' id='salr-usernotes-text'/></p>"+
            "<p><label for='salr-usernotes-color'><strong>Color:</strong></label><br/><input type='text' id='salr-usernotes-color'/> <a href='http://www.colorpicker.com/' target='_blank'>Hex Codes</a></p>"+
            "<p><label for='salr-usernotes-bgcolor'><strong>BG Color:</strong></label><br/><input type='text' id='salr-usernotes-bgcolor'/><br />(leave blank for default)</p>"+
        "</fieldset>"+
    "</div>");

    jQuery('table.post').each(function () {
        if (this.id === 'post') // adbot
            return;
        var profile = jQuery(this).find('ul.profilelinks a[href*=userid]')[0];
        if (profile == undefined)
            return;
        var userid = profile.href.match(/userid=(\d+)/)[1];
        var hasNote = notes[userid] != null;

        if (hasNote) {
            // Only set user text/color if one is specified
            if (typeof notes[userid].text === 'string' && notes[userid].text !== '') {
                var colorstring = '';
                if (typeof notes[userid].color === 'string' && notes[userid].color !== '')
                    colorstring = 'color: ' + notes[userid].color + ';';
                jQuery('dl.userinfo > dt.author', this).after(
                    '<dd style="font-weight: bold;' + colorstring + '">' + notes[userid].text + '</dd>'
                );
            }
            // Important property could be removed once we only iterate through posts table once
            if (typeof notes[userid].bgcolor === 'string' && notes[userid].bgcolor !== '') {
                jQuery('td', this).each(function() {
                    this.style.setProperty('background-color', notes[userid].bgcolor, 'important');
                });
            }
        }

        var editLink = jQuery('<li><a href="javascript:;">Edit Note</a></li>');
        jQuery('a', editLink).click(function() {
            jQuery('#salr-usernotes-config').dialog({
                open: function(event, ui) {
                    jQuery(document).trigger('disableSALRHotkeys');
                    jQuery('#salr-usernotes-text').val(hasNote ? notes[userid].text : '');
                    jQuery('#salr-usernotes-color').val(hasNote ? notes[userid].color : '#FF0000');
                    jQuery('#salr-usernotes-bgcolor').val(hasNote ? notes[userid].bgcolor : '');
                },
                buttons: {
                    "OK" : function () {
                        notes[userid] = {'text' : jQuery('#salr-usernotes-text').val(),
                                         'color' : jQuery('#salr-usernotes-color').val(),
                                         'bgcolor' : jQuery('#salr-usernotes-bgcolor').val()
                                        };
                        // TODO: Fix this
                        postMessage({ 'message': message,
                                            'option' : 'userNotes',
                                            'value'  : JSON.stringify(notes) });
                        jQuery(this).dialog('destroy');
                        jQuery(document).trigger('enableSALRHotkeys');
                    },
                    "Delete" : function () {
                        delete notes[userid];
                        // TODO: Fix this
                        postMessage({ 'message': message,
                                            'option' : 'userNotes',
                                            'value'  : JSON.stringify(notes) });
                        jQuery(this).dialog('destroy');
                        jQuery(document).trigger('enableSALRHotkeys');
                    },
                    "Cancel" : function () {
                        jQuery(this).dialog('destroy');
                        jQuery(document).trigger('enableSALRHotkeys');
                    }
                }
            });
        });
        // append a space to create a new text node which fixes spacing problems you'll get otherwise
        jQuery('ul.profilelinks', this).append(' ').append(editLink).append(' ');
    });

};

/**
 * Fetch stored list of hidden avatars
 * @return {Array.<number>} Array of number user IDs with hidden avatars
 */
SALR.prototype.getStoredHiddenAvatars = function() {
    var rawAvatars = this.settings.hiddenAvatarsLocal;
    if (!rawAvatars || rawAvatars === '')
        return [];
    var hiddenAvatars = JSON.parse(rawAvatars);
    return hiddenAvatars;
};

/**
 * Check hidden avatar array to see if a user's avatar is hidden
 * @param {number}         useridnum     User ID to check
 * @param {Array.<number>} hiddenAvatars Array of number user IDs with hidden avatars
 * @return {boolean} Whether an avatar is hidden on the current page.
 */
SALR.prototype.isUserAvatarHidden = function(useridnum, hiddenAvatars) {
    return hiddenAvatars.includes(useridnum);
};

/**
 * Adds SAARS and Avatar-toggling links to post if the relevant options are enabled.
 * Hides current post's avatar if the avatar-toggling setting is enabled + user's avatars are hidden.
 * @param {HTMLElement}    post          Post to add user links to
 * @param {string}         userid        User ID of the current poster poster
 * @param {HTMLElement}    profileLink   Link to the profile of the current poster
 * @param {Array.<number>} hiddenAvatars Array of number user IDs with hidden avatars
 */
SALR.prototype.addUserLinksToPost = function(post, userid, profileLink, hiddenAvatars) {
    let userLinks = profileLink.parentNode.parentNode;

    // Add a link to the user's SAARS page to view previous avatars
    if (this.settings.enableSAARSLink === 'true') {
        let username = post.querySelector('dt.author').textContent;
        let avHistoryButton = document.createElement("li");
        let avHistoryAnch = document.createElement("a");
        avHistoryAnch.title = "View this poster's previous avatars";
        avHistoryAnch.textContent = "SAARS";
        avHistoryAnch.href = 'https://www.muddledmuse.com/saars/?goon='+encodeURIComponent(username);
        avHistoryAnch.target = "_blank";
        avHistoryButton.appendChild(avHistoryAnch);
        userLinks.appendChild(document.createTextNode(" "));
        userLinks.appendChild(avHistoryButton);
    }

    if (this.settings.enableToggleUserAvatars === 'true') {
        // Build hide avatar link
        let avButton = document.createElement("li");
        let avAnch = document.createElement("a");
        avAnch.title = "Toggle displaying this poster's avatar";
        avAnch.classList.add('salr-toggleavlink');

        // Is their avatar already hidden?
        if (this.isUserAvatarHidden(parseInt(userid, 10), hiddenAvatars)) {
            avAnch.textContent = "Show Avatar";
            // Hide it!
            let userAvatar = post.querySelector('dl.userinfo > dd.title');
            if (userAvatar)
                userAvatar.style.display = "none";
        }
        else {
            avAnch.textContent = "Hide Avatar";
        }

        avAnch.addEventListener("click", (event) => {
            this.clickToggleAvatar(userid, hiddenAvatars, event);
        }, false);

        avButton.appendChild(avAnch);
        userLinks.appendChild(document.createTextNode(" "));
        userLinks.appendChild(avButton);
    }
};

/**
 * Event handler for clicking the "Hide Avatar" or "Show Avatar" links
 * @param {string}         idToToggle    User ID of poster to toggle avatar for.
 * @param {Array.<number>} hiddenAvatars Array of Number user IDs with hidden avatars
 * @param {Event}          event         The click event to handle.
 */
SALR.prototype.clickToggleAvatar = function(idToToggle, hiddenAvatars, event) {
    event.stopPropagation();
    event.preventDefault();
    var clickedLink = event.target;

    var alreadyHiddenIndex = hiddenAvatars.indexOf(parseInt(idToToggle, 10));
    var newHideAvatarStatus = (alreadyHiddenIndex === -1);

    var posts = document.querySelectorAll('table.post');
    var reachedSelf = false;

    for (let post of posts) {
        let profileLink = post.querySelector('ul.profilelinks a[href*="userid="]');
        if (!profileLink)
            continue;
        let posterId = profileLink.href.match(/userid=(\d+)/i)[1];
        if (posterId !== idToToggle)
            continue;
        // Standard template
        let titleBox = post.querySelector('dl.userinfo > dd.title');
        // If that doesn't work, try old FYAD template
        if (titleBox === null)
            titleBox = post.querySelector('td.postbody div.title');

        let toggleLink = post.querySelector('a.salr-toggleavlink');
        if (toggleLink === clickedLink)
            reachedSelf = true;

        if (newHideAvatarStatus === true) { // need to hide
            // We use hidden for anything above the link we clicked to prevent scrolling
            if (reachedSelf) // we've reached the link we clicked
                titleBox.style.display = "none";
            else
                titleBox.style.visibility = "hidden";
            toggleLink.textContent = "Show Avatar";
        }
        else { // need to show
            if (titleBox.style.visibility === "hidden")
                titleBox.style.visibility = "visible";
            else
                titleBox.style.display = "block";
            toggleLink.textContent = "Hide Avatar";
        }
    }

    // Update the cached avatar list on this page
    if (newHideAvatarStatus === true) {
        // Avatar wasn't on the hidden list; add to the cached list
        hiddenAvatars.push(parseInt(idToToggle, 10));
    }
    else {
        // Avatar was already hidden; remove from the cached list to show them
        hiddenAvatars.splice(alreadyHiddenIndex, 1);
    }

    // Notify background page we might need to update the stored list
    postMessage({
        'message': 'SetHideAvatarStatus',
        'idToToggle': idToToggle,
        'newHideAvatarStatus': newHideAvatarStatus
    });
};

/**
 * Add boxes around blockquotes
 */
SALR.prototype.boxQuotes = function() {
    // CSS taken from http://forums.somethingawful.com/showthread.php?threadid=3208437&userid=0&perpage=40&pagenumber=3#post371892272
    jQuery('.bbc-block').css({
        'background-color': 'white',
        'border': '1px solid black',
        'padding': '0px'
    });

    jQuery('.bbc-block h4').css({
        'border': 'none',
        'border-bottom': '1px solid black',
        'font-style': 'normal',
        'padding': '3px'
    });

    jQuery('.bbc-block blockquote').css({
        'padding': '7px 7px 7px 7px'
    });
};

/**
*   Automatically hide long quotes
*
 *  @author Scott Lyons (Captain Capacitor)
*/
SALR.prototype.tldrQuotes = function() {
    var that = this;

    function tldrHideQuote(obj) {
        if(obj.currentTarget != undefined)
            obj = this;
        var blockquote = jQuery("blockquote:last", obj);
        var hidden = jQuery(obj).data("tldrHidden");
        var clickText = jQuery("span.tldrclick", obj);

        if(hidden == true)
        {
            jQuery("span.tldr", obj).remove();
            blockquote.css({display:"block"});
            clickText.text("Double-Click quote to collapse");
        }
        else
        {
            var imageCount = jQuery("img", blockquote).length;
            var wordCount = blockquote.text().split(" ").length;

            var imageStr, wordStr;
            if(imageCount == 1)
                imageStr = "1 image";
            else if(imageCount > 1)
                imageStr = imageCount + " images";

            if(wordCount == 1)
                wordStr = "1 word";
            else if(wordCount > 1)
                wordStr = wordCount + " words";

            var tldrSpan = "<span class='tldr'><strong>TLDR:</strong> ";
            if(wordCount > 0)
                tldrSpan+= wordStr;
            if(wordCount > 0 && imageCount > 0)
                tldrSpan+= " and ";
            if(imageCount > 0)
                tldrSpan+= imageStr;
            tldrSpan+="</span>";

            blockquote.before(tldrSpan);

            blockquote.css({display:"none"});
            clickText.text("Double-Click quote to expand");
        }

        window.getSelection().removeAllRanges();

        jQuery(obj).data("tldrHidden", !hidden);
    }

    jQuery("div.bbc-block").each(function(i, obj){
        jQuery(obj).data("tldrHidden", false);
        jQuery(obj).dblclick(tldrHideQuote);

        jQuery("h4", obj).before("<span class='tldrclick' style='font-size: 70%; text-transform: uppercase; float: right; margin: 2px; font-weight: bold;'>Double-Click quote to collapse</span>");

        if(that.settings.collapseTldrQuotes == 'true' && jQuery(obj).height() > 150){
            tldrHideQuote(obj);
            jQuery("span.tldrclick", obj).text("Double-Click quote to expand");
        }
    });
};

/**
 * Change pages display to show links to first three and (if applicable)
 * last three pages of thread
 *
 * @author Nathan Skillen (nuvan)
 */
SALR.prototype.showLastThreePages = function() {
    var that = this;
    var ppp = (that.settings.postsPerPage == 'default') ? 40 : parseInt(that.settings.postsPerPage);

    switch( findCurrentPage() ) {
        case 'forumdisplay':
        case 'bookmarkthreads':
        case 'usercp':
            jQuery('tr.thread').has('div.title_pages').each(function() {
                // how many posts in the thread
                var rawReplies = this.querySelector('td.replies').firstChild.textContent;
                var numPosts = parseInt(rawReplies, 10);
                // how many pages does that make?
                var pages = Math.ceil(numPosts / ppp);
                // get thread id
                var threadid = this.id.match(/thread(\d+)/);

                if( pages > 7 ) { // forum default is fine for <= 7 pages
                    jQuery('div.title_pages', jQuery(this)).each(function() {
                        jQuery(this).empty();
                        jQuery(this).append( 'Pages: ' )
                                    .append( jQuery('<a>')
                                        .attr({ href : 'showthread.php?threadid='+threadid[1]+'&pagenumber=1' })
                                        .addClass('pagenumber')
                                        .text('1'))
                                    .append( jQuery('<a>')
                                        .attr({ href : 'showthread.php?threadid='+threadid[1]+'&pagenumber=2' })
                                        .addClass('pagenumber')
                                        .text('2'))
                                    .append( jQuery('<a>')
                                        .attr({ href : 'showthread.php?threadid='+threadid[1]+'&pagenumber=3' })
                                        .addClass('pagenumber')
                                        .text('3'))
                                    .append( ' ... ' )
                                    .append( jQuery('<a>')
                                        .attr({ href : 'showthread.php?threadid='+threadid[1]+'&pagenumber='+(pages - 2) })
                                        .addClass('pagenumber')
                                        .text(pages - 2))
                                    .append( jQuery('<a>')
                                        .attr({ href : 'showthread.php?threadid='+threadid[1]+'&pagenumber='+(pages - 1) })
                                        .addClass('pagenumber')
                                        .text(pages - 1))
                                    .append( jQuery('<a>')
                                        .attr({ href : 'showthread.php?threadid='+threadid[1]+'&pagenumber='+pages })
                                        .addClass('pagenumber')
                                        .text(pages));
                    });
                }
            });
            break;
        case 'showthread':
            var pagesDiv = document.querySelector('div.pages');
            if (!pagesDiv || pagesDiv.children.length === 0) {
                break;
            }
            jQuery(pagesDiv).each(function() {
                // number of pages in thread
                var pages = parseInt( jQuery(this).text().match(/(\d+) /)[1] );

                // current page being viewed
                var curpage = (window.location.href.indexOf('pagenumber') >= 0) ?
                    parseInt( window.location.href.match(/pagenumber=(\d+)/)[1] ) : 1;

                // thread ID
                var threadid = parseInt( window.location.href.match(/threadid=(\d+)/)[1] );

                // only showing posts of userID
                var userid = (window.location.href.indexOf('userid') >= 0) ?
                    parseInt( window.location.href.match(/userid=(\d+)/)[1] ) : 0;

                // showing x posts per page
                var perpage = (window.location.href.indexOf('perpage') >= 0) ?
                    parseInt( window.location.href.match(/perpage=(\d+)/)[1] ) : ppp;

                // are we too close to the first or last page for ellipses?
                var nobeginellipses = curpage < 6;
                var noendellipses = curpage > pages - 5;

                // if there's fewer than 5 pages, let the forum handle it
                if( pages > 5 ) {
                    var links = {};
                    var i;
                    for (i = 0; i < 3; i++) {
                        switch(i) {
                        case 0: // pages 1,2,3
                            links['1'] = jQuery('<a>')
                                .attr({ href : 'showthread.php?threadid='+threadid+'&userid='+userid+'&perpage='+perpage+'&pagenumber=1' })
                                .addClass('pagenumber')
                                .text('1');
                            links['2'] = jQuery('<a>')
                                .attr({ href : 'showthread.php?threadid='+threadid+'&userid='+userid+'&perpage='+perpage+'&pagenumber=2' })
                                .addClass('pagenumber')
                                .text('2');
                            links['3'] = jQuery('<a>')
                                .attr({ href : 'showthread.php?threadid='+threadid+'&userid='+userid+'&perpage='+perpage+'&pagenumber=3' })
                                .addClass('pagenumber')
                                .text('3');
                            break;
                        case 1: // pages n-2,n-1,n
                            links[(pages - 2)+''] = jQuery('<a>')
                                .attr({ href : 'showthread.php?threadid='+threadid+'&userid='+userid+'&perpage='+perpage+'&pagenumber='+(pages - 2) })
                                .addClass('pagenumber')
                                .text(pages - 2);
                            links[(pages - 1)+''] = jQuery('<a>')
                                .attr({ href : 'showthread.php?threadid='+threadid+'&userid='+userid+'&perpage='+perpage+'&pagenumber='+(pages - 1) })
                                .addClass('pagenumber')
                                .text(pages - 1);
                            links[pages+''] = jQuery('<a>')
                                .attr({ href : 'showthread.php?threadid='+threadid+'&userid='+userid+'&perpage='+perpage+'&pagenumber='+pages })
                                .addClass('pagenumber')
                                .text(pages);
                            break;
                        case 2: // pages [cur-1,]cur[,cur+1]
                            if( curpage > 1 ) links[(curpage - 1)+''] = jQuery('<a>')
                                .attr({ href : 'showthread.php?threadid='+threadid+'&userid='+userid+'&perpage='+perpage+'&pagenumber='+(curpage - 1) })
                                .addClass('pagenumber')
                                .text(curpage - 1);
                            links[curpage+''] = jQuery('<span>')
                                .addClass('curpage')
                                .text(curpage);
                            if( curpage < pages ) links[(curpage + 1)+''] = jQuery('<a>')
                                .attr({ href : 'showthread.php?threadid='+threadid+'&userid='+userid+'&perpage='+perpage+'&pagenumber='+(curpage + 1) })
                                .addClass('pagenumber')
                                .text(curpage + 1);
                            break;
                        }
                    }
                    var pagelinks = Object.keys(links).length;

                    // rebuild top and bottom page links
                    jQuery(this).empty().append('Pages: ');
                    var b = jQuery('<b>');
                    if( curpage != 1 )
                        b.append( jQuery('<a>')
                            .attr({ href : 'showthread.php?threadid='+threadid+'&userid='+userid+'&perpage='+perpage+'&pagenumber='+(curpage - 1) })
                            .addClass('pagenumber')
                            .text('< Prev ') );

                    i = 0;
                    for (var someLink of Object.values(links)) {
                        ++i;
                        b.append(someLink);

                        if( i == 3 && !nobeginellipses )
                            b.append(' ... ');
                        else if( i == (pagelinks - 3) && !noendellipses )
                            b.append(' ... ');
                    }

                    if( curpage != pages )
                        b.append( jQuery('<a>')
                            .attr({ href : 'showthread.php?threadid='+threadid+'&userid='+userid+'&perpage='+perpage+'&pagenumber='+(curpage + 1) })
                            .addClass('pagenumber')
                            .text(' Next >') );

                    jQuery(this).append(b);
                }
            });
            break;
    }
};

/**
 * Fix thumbnailed images
 *
 * @author Nathan Skillen (nuvan)
 */
SALR.prototype.fixTimg = function(forceAll) {
    jQuery(window).load(function() {
        // STEP 1: reclass all timg images to timg-fix class, remove any other classes
        jQuery('.postbody '+(forceAll ? 'img' : 'img.timg'))
            .removeClass('timg peewee expanded loading complete')
            .removeAttr('width')
            .removeAttr('height')
            .removeAttr('border')
            .addClass('timg-fix squished');

        // STEP 2: add a DIV for each squashed image, showing full-size dimensions
        jQuery('img.timg-fix').each(function() {
            var that = this;
            var div = jQuery('<DIV>')
                        .addClass('timg-fix note')
                        .text(this.naturalWidth+'x'+this.naturalHeight)
                        .css('display', 'none')
                        .css('top', jQuery(this).offset().top)
                        .css('left', jQuery(this).offset().left)
                        .attr('title', 'Click to toggle size')
                        .click(function() { jQuery(that).toggleClass('squished expanded'); jQuery(this).toggleClass('expanded'); })
                        .hover(function() { div.css('display', 'block'); }, function() { div.css('display', 'none'); });
            jQuery(this)
                .before(div)
                .hover(function() { div.css('display', 'block'); }, function() { div.css('display', 'none'); });
        });

        // STEP 3: add event handler to each squashed image so that it expands to full-size on click
        //            replacing squashed class with expanded class, and setting an event handler to
        //            squash on subsequent click
        jQuery('img.squished').click(function(evt) {
            jQuery(this).toggleClass('squished expanded');
            jQuery(this).prev().toggleClass('expanded');
        });
    });
};

/**
 * Highlight the user's username in posts
 */
SALR.prototype.highlightOwnUsername = function() {
    if (this.settings.username == "") {
        return;
    }
    function getTextNodesIn(node) {
        var textNodes = [];

        function getTextNodes(node) {
            if (node.nodeType == 3) {
                textNodes.push(node);
            } else {
                for (var i = 0, len = node.childNodes.length; i < len; ++i) {
                    getTextNodes(node.childNodes[i]);
                }
            }
        }

        getTextNodes(node);
        return textNodes;
    }

    var that = this;

    var selector = "";
    var re;
    if(this.settings.usernameCase == 'true') {
        re = new RegExp(this.settings.username, 'gi');
        selector = 'td.postbody';
    }
    else {
        re = new RegExp(this.settings.username, 'g');
        selector = 'td.postbody:contains("'+this.settings.username+'")';
    }
    var styled = '<span class="usernameHighlight" style="font-weight: bold; color: ' + that.settings.usernameHighlight + ';">' + this.settings.username + '</span>';
    jQuery(selector).each(function() {
        getTextNodesIn(this).forEach(function(node) {
            var matches = node.wholeText.match(re);
            var wholeText = node.wholeText;
            var newNode = node.ownerDocument.createElement("span");
            if(matches != null) {
                if (that.settings.usernameCase == 'true') {
                    matches.forEach(function(match) {
                        newNode = node.ownerDocument.createElement("span");
                        styled = '<span class="usernameHighlight" style="font-weight: bold; color: ' + that.settings.usernameHighlight + ';">' + match + '</span>';
                        wholeText = wholeText.replace(new RegExp(match,''), styled);
                    });
                    jQuery(newNode).html(wholeText);
                    node.parentNode.replaceChild(newNode, node);
                }
                else {
                    jQuery(newNode).html(wholeText.replace(re,styled));
                    node.parentNode.replaceChild(newNode, node);
                }

            }
        });
    });
};

/**
 * Highlight the quotes of the user themselves.
 */
SALR.prototype.highlightOwnQuotes = function() {
    var that = this;

    $('html > head').append($('<style>.userquoted { background: '+this.settings.userQuote+ '!important; }</style>'));
    var usernameQuoteMatch = that.settings.username+' posted:';
    jQuery('.bbc-block h4:contains(' + usernameQuoteMatch + ')').each(function() {
        if (jQuery(this).text() != usernameQuoteMatch)
            return;
        //jQuery(this).parent().css("background-color", that.settings.userQuote);

        // Replace the styling from username highlighting
        var previous = jQuery(this);
        jQuery('.usernameHighlight', previous).each(function() {
            jQuery(this).css('color', '');
        });
    });
};

/**
 * Binds quick-reply box to reply/quote buttons
 *
 */
SALR.prototype.bindQuickReply = function() {
    var that = this;

    jQuery('a > img[alt="Quote"]').each(function() {
        jQuery(this).parent().attr('href', 'javascript:void(0);');

        var parentTable = jQuery(this).parents('table.post');
        var postid = parentTable.attr('id').substr(4);

        // Bind the quick reply box to the button
        jQuery(this).parent().click(function() {
            that.quickReply.appendQuote(postid);
            that.quickReply.show();

            /***********TODO: FIX THIS*********
            if (!this.quickReply.isExpanded()) {
                this.quickReply.toggleView();
            } else {
                this.quickReply.show();
            }
            **********************************/
        });
    });

    jQuery('a[href*="editpost.php"] > img[alt="Edit"]').each(function() {
        jQuery(this).parent().attr('href', 'javascript:void(0);');

        var parentTable = jQuery(this).parents('table.post');
        var postid = parentTable.attr('id').substr(4);

        // Bind the quick edit box to the button
        jQuery(this).parent().click(function() {
            var subscribe = jQuery('.subscribe > a').html();
            // On single post view, there's no bookmark star.
            if (subscribe)
                subscribe = subscribe.indexOf('Unbookmark') == 0 ? true : false;
            else
                subscribe = false;
            that.quickReply.editPost(postid, subscribe);
            that.quickReply.show();
        });
    });

    jQuery('a > img[alt="Reply"]').each(function() {
        jQuery(this).parent().attr('href', 'javascript:void(0);');

        jQuery(this).parent().click(function() {
            that.quickReply.show();
        });
    });
};

SALR.prototype.findFormKey = function() {
    var that = this;

    jQuery('input[name="formkey"]').each(function() {
        postMessage({ 'message': 'ChangeSetting',
                           'option' : 'forumPostKey',
                           'value'  : jQuery(this).attr('value') });
    });
};

/**
 * On the post or edit pages (where you see the textbox for your post),
 * we bind some custom code to when you hit that "Submit" button.
 *
 */
SALR.prototype.bindThreadCaching = function() {
    if (this.settings.enableQuickReply == 'false') {
        var button = jQuery('input[name="submit"]');
        if  (button.length > 0) {
            button.click(function() {
                var history = new PostHistory(function(result,id) {
                    if (result == false) {
                        history.addThread(id);
                    }
                });
                history.getThreadStatus(findThreadID());
            });

        }
    }
};

/**
 *  Displays a warning if the last poster in the thread was the current user, or
 *  the post contains a quote of the current user.
 **/
SALR.prototype.quoteNotEditProtection = function() {
    if(this.settings.username){
        if(jQuery("textarea[name='message']:contains('quote=\"" + this.settings.username + "\"')").length > 0 ||
            jQuery('table.post:first tr > td.userinfo > dl > dt.author:contains("' + this.settings.username + '")').length > 0)
        {
            jQuery("#main_full").after("<div class='qne_warn'><h4>Warning! Possible Quote/Edit mixup.</h4></div>");
        }
    }
};

/**
 *  Hide signatures
 **/
SALR.prototype.hideSignatures = function() {
    jQuery('p.signature').each(function() {
        jQuery(this).css('display','none');
    });
};

/**
 *
 *  Thread notes
 *
 *  Displys a widget for editing thread-specific notes.
 *
 *  @author Scott Lyons (Captain Capacitor)
 **/
SALR.prototype.threadNotes = function() {
    //  Only valid on thread pages
    if(findCurrentPage() == 'forumdisplay')
        return;

    if(jQuery("#container").data('showThreadNotes'))
        return true;
    jQuery('#container').data('showThreadNotes', true);

    var notes;
    if(this.settings.threadNotes == null)
    {
           notes = {};
           postMessage({
            'message': 'ChangeSetting',
            'option': 'threadNotes',
            'value': JSON.stringify(notes)
        });
    }
    else {
        notes = JSON.parse(this.settings.threadNotes);
    }
    var basePageID = findForumID();
    var hasNote = notes[String(basePageID)] != null;

    var notesHTML = '<nav id="threadnotes"> ' +
                    '   <div id="threadnotes-body">' +
                    '       <span><a id="threadnotes-show" style="color: #fff; text-shadow: #222 0px 1px 0px;">Show thread notes</a></span>' +
                    '   </div>' +
                    '</nav>';
    jQuery("#container").append(notesHTML);
    jQuery("#threadnotes").addClass('displayed');
    jQuery("#threadnotes-show").css({
        'background': 'url("' + chrome.extension.getURL('images/') + 'note.png") no-repeat left center'
    });

    jQuery('body').append("<div id='salr-threadnotes-config' title='Thread notes' style='display:none'>"+
        "<textarea id='salr-threadnotes-text' rows='5' cols='20' style='width: 274px;'></textarea>"+
    "</div>");

    jQuery("#threadnotes-show").click(function(){
        jQuery('#salr-threadnotes-config').dialog({
            open: function(event, ui){
                jQuery(document).trigger('disableSALRHotkeys');
                jQuery('#salr-threadnotes-text').val(hasNote ? notes[basePageID] : '');
            },
            buttons: {
                "Save" : function() {
                    notes[String(basePageID)] = jQuery('#salr-threadnotes-text').val();
                    postMessage({ 'message': 'ChangeSetting',
                                       'option' : 'threadNotes',
                                       'value'  : JSON.stringify(notes) });

                    jQuery(this).dialog('destroy');
                    jQuery(document).trigger('enableSALRHotkeys');
                    hasNote = true;
                 },
                "Delete": function() {
                    delete notes[String(basePageID)];
                    // TODO: Fix this
                    postMessage({ 'message': 'ChangeSetting',
                                       'option' : 'threadNotes',
                                       'value'  : JSON.stringify(notes) });
                    hasNote = false;
                    jQuery(document).trigger('enableSALRHotkeys');
                    jQuery(this).dialog('destroy');
                },
                "Cancel" : function() {
                    jQuery(this).dialog('destroy');
                    jQuery(document).trigger('enableSALRHotkeys');
                }
            }
        });
    });
};

/**
 * Highlight forums cancer posts with a light gray and set opacity to
 * 1.0
 *
 */
SALR.prototype.fixCancerPosts = function() {
    jQuery('.cancerous').each(function() {
        jQuery(this).css({
            'opacity': '1.0'
        });
    });
};

SALR.prototype.queryVisibleThreads = function() {
    //return false;
    var post_history = new PostHistory(this.tagPostedThreads);

    jQuery('tr.thread').each(function() {
        if (jQuery(this).attr('id') == undefined) return;
        var thread_id = jQuery(this).attr('id').substr(6);
        post_history.getThreadStatus(thread_id);
    });
};

/**
 * Asynchronous callback that updates thread postcount highlighting if the user
 * has posted in that thread before
 *
 */
SALR.prototype.tagPostedThreads = function(result, thread_id) {
    result = (result == true) || false;

    if (result == true) {
        jQuery('tr#thread' + thread_id + ' > td.replies').each(function() {
            jQuery(this).css('background-color', 'yellow');
        });
    }
};


SALR.prototype.swapRetinaEmotes = function() {
    $(function() {
        $.getJSON(chrome.extension.getURL('/images/emoticons/emoticons.json'), function(list) {

            jQuery('.postbody img').each(function() {

            var item = $(this);
              if (
                (item.attr('src').indexOf('i.somethingawful.com/forumsystem/emoticons/') > -1 ||
                item.attr('src').indexOf('fi.somethingawful.com/images/smilies/') > -1) &&
                item.attr('src').indexOf('@2x') == -1 ) {

                    var f = retinaFilename(item);

                    if (list.indexOf(f) > 0) {
                        //console.log('swapping in' + f);
                        var height = item.height();
                        var width = item.width();
                        item.attr('src',chrome.extension.getURL('/images/emoticons/'+f))
                            .width(width)
                            .height(height);
                    }

                }
            }); //each
        }); //getjson
    });//$
};

function retinaFilename(img) {
    //test if file exists
    var segments = img.attr('src').split('/');
    var filename = segments[segments.length - 1];

    var filenameSegments = filename.split('.');
    filenameSegments[filenameSegments.length - 2] = filenameSegments[filenameSegments.length-2] + '@2x';

    var f = filenameSegments.join('.');
    return f;
}

/*
 * shows tooltip when hovering over images that gives their filename
 * Author: nskillen
 */
SALR.prototype.setImageTooltips = function() {
    var salr = this;

    jQuery('td.postbody img').filter(function(index) {
        if(salr.settings.setImageTooltipBlankOnly === 'true') {
            if(jQuery(this).attr('title') !== undefined && jQuery(this).attr('title').length > 0) { return false; }
        }

        if(salr.settings.setImageTooltipSkipEmoticons === 'true') {
            var emoticon_paths = [
                '//fi.somethingawful.com/customtitles',
                '//fi.somethingawful.com/images/smilies',
                '//fi.somethingawful.com/safs/smilies',
                '//fi.somethingawful.com/smilies',
                '//i.somethingawful.com/forumsystem/emoticons',
                '//i.somethingawful.com/images',
                '//i.somethingawful.com/mjolnir/images',
                '//i.somethingawful.com/u/garbageday'
            ];

            var img_path = jQuery(this).attr('src');
            img_path = img_path.substr(img_path.indexOf('//'));

            for(var idx = 0; idx < emoticon_paths.length; ++idx) {
                var path = emoticon_paths[idx];
                if(path.toLowerCase() == img_path.substr(0,path.length).toLowerCase()) { return false; }
            }
        }

        return true;
    }).each(function(index,element) {
        var filename = jQuery(this).attr('src');
        if (salr.settings.setImageTooltipHideSourceUrl == 'true') {
            filename = filename.substr(filename.lastIndexOf('/')+1);
        }
        if(salr.settings.setImageTooltipHideExtension == 'true') {
            filename = filename.substring(0, filename.lastIndexOf('.'));
        }
        jQuery(this).attr('title',filename);
    });
};

SALR.prototype.hidePostButtonInThread = function() {
    jQuery('ul.postbuttons li a[href^="newthread.php"]').hide();
};

/**
 * Expand the breadcrumbs to individual links on showthread.php
 */
SALR.prototype.expandBreadcrumbs = function() {
    //var that = this;

    var count = 0;
    var children = jQuery('a.up span').first().children().length;
    jQuery('a.up span').first().children().each(function() {
        count++;
        var text = jQuery(this).text();
        var href = jQuery(this).attr('href');
        var selector;
        if (count == children) {
            selector = "<span><a href='" + href + "' >" + text + "</a></span>";
        }
        else {
            selector = "<span><a href='" + href + "' >" + text + "</a> &rsaquo; </span>";
        }
        jQuery(selector).insertBefore('a.up');
    });
    //jQuery('a.up span').remove();
    jQuery('a.up').remove();
    //jQuery('a.up').addClass('bclast').removeClass('up');
};

/**
 * Show a linked image in a div when hovering over an image link
 **/
SALR.prototype.hoverImages = function() {
    var salr = this;

    function HoverBox() {
        this.id = null;
        this.url = null;
        this.dom = jQuery('<div id="salr-image-hover-box"></div>');
        this.images = {};
        this.delay = 1000 * parseFloat(salr.settings.imageLinkHoverDelay);
        this.status = 'hidden';

        if (isNaN(this.delay) || this.delay < 0.05) {
            // enforce a minimum delay, just to be sure that the switch from
            // link-hover to image-hover has time to process
            this.delay = 0.05;
        }

        this.dom.appendTo('body');

        var that = this;
        this.dom.on('mouseover',function() { that.show(that.url); });
        this.dom.on('mouseout',function() { that.hide(); });
    }

    HoverBox.prototype.getImage = function(url) {
        if (!this.images.hasOwnProperty(url)) {
            this.images[url] = jQuery('<img>').attr('src',url);
        }
        return this.images[url].clone();
    };

    HoverBox.prototype.show = function(url,x,y) {
        if (url == this.url && (this.status == 'shown' || this.status == 'showing')) { return; }

        if (this.status == 'hiding' && this.id) {
            if (url == this.url && this.dom.css('display') == 'block') {
                clearTimeout(this.id);
                this.id = null;
                this.status = 'shown';
                return;
            } else {
                this.hide(true);
            }
        }

        var hb = this;
        this.status = 'showing';
        this.url = url;

        this.id = setTimeout(function() {
            hb.dom.empty();
            hb.dom.append(hb.getImage(url));

            if (salr.settings.imageLinkHoverShowURL == 'true') {
                hb.dom.append(jQuery('<div>').attr('id','salr-image-hover-box-filename'));
                var filename = hb.url;

                if (filename.lastIndexOf('?') >= 0) {
                    filename = filename.substring(0,filename.lastIndexOf('?'));
                }
                if (filename.lastIndexOf('#') >= 0) {
                    filename = filename.substring(0,filename.lastIndexOf('#'));
                }

                if (salr.settings.imageLinkHoverShowFilename == 'true') {
                    filename = filename.substr(filename.lastIndexOf('/')+1);
                }
                jQuery('#salr-image-hover-box-filename',hb.dom).text(filename);
            }

            jQuery('img',hb.dom).on('load',function() {
                var imgTop = y;
                if (y + this.height + 10 > window.pageYOffset + window.innerHeight) {
                    y -= (y + this.height + 10) - (window.pageYOffset + window.innerHeight);
                }
                hb.dom.css('top',y);
                hb.dom.css('left',x);
                hb.dom.css('display','block');
                hb.status = 'shown';
                hb.id = null;
            });
        }, this.delay);
    };

    HoverBox.prototype.hide = function(force) {
        force = force || false;
        if (!force) {
            if (this.status == 'hiding' || this.status == 'hidden') { return; }

            var hb = this;
            this.status = 'hiding';

            if (this.id) {
                clearTimeout(this.id);
                this.id = null;
            }

            this.id = setTimeout(function() {
                hb.url = null;
                hb.dom.css('display','none');
                hb.status = 'hidden';
                hb.id = null;
            }, this.delay);
        } else {
            this.status = 'hiding';
            if (this.id) { clearTimeout(this.id); }
            this.id = null;
            this.url = null;
            this.dom.css('display','none');
            this.status = 'hidden';
        }
    };

    var hoverBox = new HoverBox();

    var links = jQuery('.postbody a');

    //NWS/NMS links
    if(salr.settings.imageLinkHoverNWS == 'true') {
        links = links.not(".postbody:has(img[title=':nws:']) a").not(".postbody:has(img[title=':nms:']) a");
    }

    // spoiler'd links
    if(salr.settings.imageLinkHoverSpoiler == 'true') {
        links = links.not('.bbc-spoiler a');
    }

    links.filter(function() {
        // RX yoink'd from modifyImages() above
        return /https?\:\/\/(?:[\w-]+\.)+[a-z]{2,6}(?:\/[^\#?]+)+\.(?:jpe?g|gif|png|bmp)+(?!(\.html)|[a-zA-Z]|\.)/.test(jQuery(this).attr('href'));
    }).on('mouseover',function(e) {
        hoverBox.show(jQuery(this).attr('href'), e.pageX, e.pageY);
    }).on('mouseout',function(e) {
        hoverBox.hide();
    });
};
