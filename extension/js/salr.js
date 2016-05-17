// Copyright (c) 2009-2013 Scott Ferguson
// Copyright (c) 2013-2016 Matthew Peveler
// All rights reserved.

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

    this.pageInit();
};

SALR.prototype.pageInit = function() {
    var that = this;
    this.currentPage = findCurrentPage();
    this.pageCount = countPages();
    this.getCurrentPage = getCurrentPageNumber();
    this.urlSchema = findUrlSchema();

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
    }

    if (this.settings.displayOmnibarIcon == 'true') {
        // Display the page action
        postMessage({
            'message': 'ShowPageAction'
        });
    }

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

            if (window.location.href.indexOf('postid=') >= 0) {
                // Single post view doesn't work for archived threads
                // Switch to a goto post link
                if (jQuery('td.postbody').length == 0) {
                    var m = window.location.href.match(/postid=(\d+)/);
                    jumpToPage(this.urlSchema+'//forums.somethingawful.com/showthread.php?goto=post&postid='+m[1]);
                    return;
                }
            }

            if (this.settings.inlineVideo == 'true') {
                this.inlineYoutubes();
            }

            if (this.settings.inlineWebm == 'true') {
                this.inlineWebm();
            }

            if (this.settings.inlineVine == 'true') {
                this.inlineVines();
            }

            if (this.settings.displayPageNavigator == 'true') {
                this.pageNavigator = new PageNavigator(this.base_image_uri);
            }

            this.updateForumsList();

            if (this.settings.highlightFriends == 'true') {
                this.highlightFriendPosts();
            }

            if (this.settings.highlightOP == 'true') {
                this.highlightOPPosts();
            }

            if (this.settings.highlightSelf == 'true' || this.settings.removeOwnReport == 'true') {
                this.highlightOwnPosts();
            }

            if (this.settings.enableSOAPLink == 'true') {
                this.addSOAPLink();
            }

            if (this.settings.enableUserNotes == 'true') {
                this.displayUserNotesHandler();
            }

            if (this.settings.highlightModAdmin == 'true') {
                this.skimModerators();
                this.highlightModAdminPosts();
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

            if (this.settings.enableSinglePost == "true") {
                this.displaySinglePostLink();
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
                this.quickReply = new QuickReplyBox(this.base_image_uri, this.settings, this.urlSchema);
                this.bindQuickReply();
            }

            if (this.settings.enableThreadNotes == 'true') {
                this.threadNotes();
            }

            //zephmod - hide/show avatar image
            if (this.settings.showUserAvatarImage != 'true') {
                jQuery("#thread dl.userinfo dd.title img").remove();
            }

            //zephmod - hide/show avatar entirely
            if (this.settings.showUserAvatar != 'true') {
                jQuery("#thread dl.userinfo dd.title").remove();
            }

            if (this.settings.hideUserGrenade == 'true') {
                jQuery("#thread dl.userinfo dt.author").removeClass("platinum");
                jQuery('.impzoneik, #thread .userid-180223 dt.author, #thread dl.userinfo dt.tflcspotter').css({
                                        "padding-left": "20px",
                                        "line-height": "16px",
                                        "background-position": "left center",
                                        "background-repeat": "no-repeat"
                });
            }

            if (this.settings.hideGarbageDick == 'true') {
                jQuery("img[src*='fi.somethingawful.com/images/newbie.gif']").css({'display':'none'});
                jQuery("img[src*='forumimages.somethingawful.com/images/newbie.gif']").css({'display':'none'});
                anchorPage = true;
            }

            if (this.settings.hideStupidNewbie == 'true') {

            }

            if (this.settings.fixCancer == 'true') {
                this.fixCancerPosts();
            }

            if (this.settings.whoPostedHide != 'true' ||
                this.settings.searchThreadHide != 'true')
            {
                this.addSalrBar();
            }

            if (this.settings.whoPostedHide != 'true') {
                this.renderWhoPostedInThreadLink();
            }

            if (this.settings.searchThreadHide != 'true') {
                this.addSearchThreadForm();
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
                this.addRapSheetToProfile();
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
                    var getPost = (href.indexOf('#lastpost') >= 0) ? findLastPost() : findFirstUnreadPost();
                    var hashId = $('div#thread > table.post').eq(getPost).attr('id');
                    // wait a tiny bit just to really make sure DOM is done
                    setTimeout(function() {
                        // We have to change the hash to a new value that still points to the
                        // the same post as originally asked for so that the page resets itself 
                        // to the right post, but then set it back to what it was originally 
                        // so the url entered doesn't change (mainly for #lastpost)
                        if (href.indexOf('#pti') >= 0) {
                            window.location.hash = '#' + hashId;
                        }
                        else {
                            window.location.hash = '#pti' + (getPost + 1);
                        }
                        window.location.hash = '#' + href.split("#")[1];
                    }, 75);

                }
            }
        };
    }
};

SALR.prototype.openSettings = function() {
    postMessage({'message': 'OpenSettings'});
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

    // Hide header/footer links
    if (this.settings.hideHeaderLinks == 'true') {
        jQuery('div#globalmenu').each(function() {
            jQuery(this).html('');
            jQuery(this).css('height', '0px');
        });
    }

    // Hide each top row of links
    if (this.settings.showPurchases == 'false') {
        jQuery('#nav_purchase').each(function() {
            jQuery(this).remove();
        });
    }

    if (this.settings.showNavigation == 'false') {
        jQuery('.navigation').each(function() {
            jQuery(this).remove();
        });
    }

    if (this.settings.topNavBar == 'false') {
        jQuery('#navigation').each(function() {
            jQuery(this).remove();
        });
    }

    if (this.settings.bottomNavBar == 'false') {
        count = 0;
        jQuery('.navigation').each(function() {
            if (that.settings.topNavBar == 'false') {
                jQuery(this).remove();
            }
            else {
                if ((count++) == 1) {
                    jQuery(this).remove();
                }
            }
        });
    }

    // Hide individual top menu items
    if (this.settings.topPurchaseAcc == 'false') {
        jQuery("#nav_purchase li:has(a[href='https://secure.somethingawful.com/products/register.php'])").each(function() {
            jQuery(this).remove();
        });
    }

    if (this.settings.topPurchasePlat == 'false') {
        jQuery("#nav_purchase li:has(a[href='https://secure.somethingawful.com/products/platinum.php'])").each(function() {
            jQuery(this).remove();
        });
    }

    if (this.settings.topPurchaseAva == 'false') {
        jQuery("#nav_purchase li:has(a[href='https://secure.somethingawful.com/products/titlechange.php'])").each(function() {
            jQuery(this).remove();
        });
    }

    if (this.settings.topPurchaseArchives == 'false') {
        jQuery("#nav_purchase li:has(a[href='https://secure.somethingawful.com/products/archives.php'])").each(function() {
            jQuery(this).remove();
        });
    }

        if (this.settings.topPurchaseNoAds == 'false') {
        jQuery("#nav_purchase li:has(a[href='https://secure.somethingawful.com/products/noads.php'])").each(function() {
            jQuery(this).remove();
        });
    }

    if (this.settings.topPurchaseUsername == 'false') {
        jQuery("#nav_purchase li:has(a[href='https://secure.somethingawful.com/products/namechange.php'])").each(function() {
            jQuery(this).remove();
        });
    }

    if (this.settings.topPurchaseBannerAd == 'false') {
        jQuery("#nav_purchase li:has(a[href='https://secure.somethingawful.com/products/ad-banner.php'])").each(function() {
            jQuery(this).remove();
        });
    }

    if (this.settings.topPurchaseEmoticon == 'false') {
        jQuery("#nav_purchase li:has(a[href='https://secure.somethingawful.com/products/smilie.php'])").each(function() {
            jQuery(this).remove();
        });
    }

    if (this.settings.topPurchaseSticky == 'false') {
        jQuery("#nav_purchase li:has(a[href='https://secure.somethingawful.com/products/sticky-thread.php'])").each(function() {
            jQuery(this).remove();
        });
    }

    if (this.settings.topPurchaseGiftCert == 'false') {
        jQuery("#nav_purchase li:has(a[href='https://secure.somethingawful.com/products/gift-certificate.php'])").each(function() {
            jQuery(this).remove();
        });
    }

    if (this.settings.topSAForums == 'false') {
        jQuery(".navigation li:has(a[href='/index.php'])").each(function() {
            jQuery(this).remove();
        });
    }

    if (this.settings.topSALink == 'false') {
        jQuery(".navigation li:has(a[href='http://www.somethingawful.com/'])").each(function() {
            jQuery(this).remove();
        });
    }

    if (this.settings.topSearch == 'false') {
        jQuery(".navigation li:has(a[href='/query.php'])").each(function() {
            jQuery(this).remove();
        });
    }

    if (this.settings.topUserCP == 'false') {
        jQuery(".navigation li:has(a[href='/usercp.php'])").each(function() {
            jQuery(this).remove();
        });
    }
    else {
        jQuery(".navigation a[href='/usercp.php']").each(function() {
            jQuery(this).attr("href","/usercp.php?"+jQuery.now());
        });
    }

    if (this.settings.topPrivMsgs == 'false') {
        jQuery(".navigation li:has(a[href='/private.php'])").each(function() {
            jQuery(this).remove();
        });
    }

    if (this.settings.topForumRules == 'false') {
        jQuery(".navigation li:has(a[href='http://www.somethingawful.com/d/forum-rules/forum-rules.php'])").each(function() {
            jQuery(this).remove();
        });
    }

    if (this.settings.topSaclopedia == 'false') {
        jQuery(".navigation li:has(a[href='/dictionary.php'])").each(function() {
            jQuery(this).remove();
        });
    }

    if (this.settings.topGloryhole == 'false') {
        jQuery(".navigation li:has(a[href='/stats.php'])").each(function() {
            jQuery(this).remove();
        });
    }

    if (this.settings.topLepersColony == 'false') {
        jQuery(".navigation li:has(a[href='/banlist.php'])").each(function() {
            jQuery(this).remove();
        });
    }

    if (this.settings.topSupport == 'false') {
        jQuery(".navigation li:has(a[href='/supportmail.php'])").each(function() {
            jQuery(this).remove();
        });
    }

    if (this.settings.topLogout == 'false') {
        jQuery(".navigation li:has(a[href*='account.php?action=logout'])").each(function() {
            jQuery(this).remove();
        });
    }

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

SALR.prototype.modifyImages = function() {
    // make sure we've loaded all images before executing this code
    var that = this;
    $(window).load(function() {

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
                width = img.naturalWidth;
                height = img.naturalHeight;

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
                    o_link = link[0];
                    c_link = link[2];
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
            localStorage.removeItem('modList');
            return;
        }
    }

    // TODO: How can you tell if a mod has been demodded?

    // Moderator list on forumdisplay.php
    if (findRealForumID() != 26) {
    jQuery('div#mods > b > a').each(function() {
        var userid = jQuery(this).attr('href').split('userid=')[1];
        var username = jQuery(this).html();
        if (modList[userid] == null) {
            modList[userid] = {'username' : [username], 'mod' : 'M'};
            modupdate = true;
        } else {
            var namechange=true;
            for (unum in modList[userid].username)
                if (username == modList[userid].username[unum])
                    namechange=false;
            if (namechange)
                modList[userid].username.push(username);
            modupdate = true;
        }
    });
    }

    // Moderator lists on index.php
    jQuery('td.moderators > a').each(function() {
        var userid = jQuery(this).attr('href').split('userid=')[1];
        var username = jQuery(this).html();
        if (modList[userid] == null) {
            modList[userid] = {'username' : [username], 'mod' : 'M'};
            modupdate = true;
        } else if (modList[userid].username != username) {
            var namechange=true;
            for (unum in modList[userid].username)
                if (username == modList[userid].username[unum])
                    namechange=false;
            if (namechange)
                modList[userid].username.push(username);
            modupdate = true;
        }
    });

    if (modupdate) {
        postMessage({ 'message': 'ChangeSetting',
                           'option' : 'modList',
                           'value'  : JSON.stringify(modList) });
    }
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
            var match = jQuery(this).attr('href').match(/^http[s]*\:\/\/((?:www|[a-z]{2})\.)?(youtube\.com\/watch\?v=|youtu.be\/)([-_0-9a-zA-Z]+)/); //get youtube video id
            var videoId = match[3];

            var list = jQuery(this).attr('href').match(/^http[s]*\:\/\/((?:www|[a-z]{2})\.)?(youtube\.com\/watch\?v=|youtu.be\/)([-_0-9a-zA-Z]+)&list=([-_0-9a-zA-Z]+)/);

            jQuery(this).after('<div><iframe class="salr-player youtube-player"></iframe></div>');
            jQuery(this).next().children("iframe").attr("src", "//www.youtube.com/embed/" + videoId);
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

SALR.prototype.inlineWebm = function() {
    var that = this;
    var webms = jQuery('.postbody a[href$="webm"],a[href$="gifv"],a[href*="gfycat.com"]');
    if(that.settings.dontReplaceWebmNWS == 'true')
    {
        webms = webms.not(".postbody:has(img[title=':nws:']) a").not(".postbody:has(img[title=':nms:']) a");
    }
    // spoiler'd links
    if(that.settings.dontReplaceWebmSpoiler == 'true') {
        webms = webms.not('.bbc-spoiler a');
    }
    webms.each(function() {

        if (jQuery(this).attr('href').substr(jQuery(this).attr('href').length-5).indexOf('webm') != -1) {
            var autoplay = (that.settings.inlineWemAutoplay == "true") ? "autoplay" : "";
            jQuery(this).html('<video '+autoplay+' loop width="450" muted="true" controls> <source src="'+jQuery(this).attr('href')+'" type="video/webm"> </video>');
        }
        else if (jQuery(this).attr('href').indexOf('gfycat.com') != -1) {
            jQuery(this).parent().append('\n'+
'                <script>\n' +
'(function(d, t) {\n' +
'    var g = d.createElement(t),\n' +
'       s = d.getElementsByTagName(t)[0];\n' +
'   g.src = \'http://assets.gfycat.com/js/gfyajax-0.517d.js\';\n' +
'    s.parentNode.insertBefore(g, s);\n' +
'}(document, \'script\'));\n' +
'</script>\n' +
'<img class="gfyitem" data-id="'+jQuery(this).attr('href')+'" />');
        }
        else {
            jQuery(this).html('<iframe autoplay="true" loop allowfullscreen="" frameborder="0" scrolling="no"  width="660" height="370" src="'+jQuery(this).attr('href')+'#embed"></iframe>');
        }
    });
};

/**
 * Display Single Post View link under a users post
 *
 *
 */
SALR.prototype.displaySinglePostLink = function() {
    var getPostID = function(element) {
        return jQuery('a[href^=#post]', element).attr('href').split('#post')[1];
    };

    var that = this;
    jQuery('td.postdate').each( function() {
        jQuery('a[href^=#post]', this).before('<a title="View as single post" href="'+that.urlSchema+'//forums.somethingawful.com/'+
                'showthread.php?action=showpost&postid='+getPostID(jQuery(this))+'">1</a> ');
    });
};

SALR.prototype.detectFancySA = function() {
    var fancyId = 'ohlohgldhcaajjhadleledokhlpgamjm';
    chrome.extension.sendMessage(fancyId, {message:"installcheck"}, function(response) {
        if (response === undefined)
            return;
        if (response.message != "yes")
            return;

        jQuery('div.threadbar.top').before($("#salrbar"));
        jQuery("#salrbar").css({'float':'none','padding':'3px 3px 0px 3px'});
        if (findRealForumID() != 219)
            jQuery("#salrbar").css({'background-color':'#dddddd'});
    });
}

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
    jQuery('.threadbar').css({'height':'25px'});

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
 *
 *  Add search bar to threads
 *
 **/
SALR.prototype.addSearchThreadForm = function() {
    //  Only valid on thread pages
    if(findCurrentPage() != 'showthread')
        return;

    var salrbar = jQuery('#salrbar');
    if (!salrbar.length)
        return;

    var forumid = findRealForumID();
    var threadid = findThreadID();
    searchHTML = '<span id="salrsearch">'+
           '<form id="salrSearchForm" '+
            'action="'+this.urlSchema+'//forums.somethingawful.com/query.php" '+
            'method="post" _lpchecked="1">'+
           '<input id="salrSearch" name="q" size="25" style="">'+
           '<input name="action" value="query" type="hidden">'+
           '<button type="submit">Search</button>'+
           '</form>'+
           '</span>';

    salrbar.append(searchHTML);

    jQuery('input#salrSearch').keypress( function(evt) {
        // Press Enter, Submit Form
        if (evt.keyCode == 13) {
            jQuery('form#salrSearchForm').submit();
            return false;
        }
        // Prevent hotkeys from receiving keypress
        evt.stopPropagation();
    });

    jQuery('form#salrSearchForm').submit( function() {
        var keywords = jQuery('input#salrSearch');
        // Don't submit a blank search
        if (keywords.val().trim() == '')
            return false;
        // Append threadid to search string
        keywords.val(keywords.val()+' threadid:'+threadid);
    });
};


/**
 * Open all of your tracked and updated threads in a new tab
 *
 */
SALR.prototype.renderOpenUpdatedThreadsButton = function() {
    var that = this;
    //var checkStars = (this.settings.ignoreBookmarkStarGold == 'true' ||
    //                    this.settings.ignoreBookmarkStarRed == 'true' ||
    //                    this.settings.ignoreBookmarkStarYellow == 'true') ? true : false;
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
    }

    jQuery('th.title:first').append('<div id="open-updated-threads"' +
                                    '     style="float:right; ' +
                                    '            cursor:pointer; ' +
                                    '            text-decoration: underline;">' +
                                    'Open updated threads</div>');

    // Open all updated threads in tabs
    jQuery('#open-updated-threads').click( function() {
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
//            console.log(jQuery('td.star', this));
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
    var friends = new Array();
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
 * Highlight the posts of friends
 */
SALR.prototype.highlightFriendPosts = function() {
    var that = this;
    if (!this.settings.friendsList)
        return;
    var friends = JSON.parse(this.settings.friendsList);
    var selector = '';

    if (friends == 0) {
        return;
    }

    var friends_id = this.settings.friendsListId;
    if (friends_id != undefined && friends_id != null && friends_id != "undefined") {
        friends_id = JSON.parse(friends_id);
        jQuery('table.post').each(function() {
            id = parseInt(jQuery(this).find('td.userinfo').attr('class').split(" ")[1].split("-")[1]);
            if (friends_id[id] != null && friends_id[id] == 1) {
                jQuery(this).find('td').each(function() {
                    jQuery(this).css({
                        'border-collapse' : 'collapse',
                        'background-color': that.settings.highlightFriendsColor
                    });
                });
            }
        });
    }
};

/**
 * Highlight the posts by the OP
 */
SALR.prototype.highlightOPPosts = function() {
    var that = this;

    jQuery('table.post:has(dt.author.op) td').each(function () {
        jQuery(this).css({
            'border-collapse' : 'collapse',
            'background-color' : that.settings.highlightOPColor
        });
    });
    jQuery('dt.author.op').each(function() {
        jQuery(this).after(
            '<dd style="color: #07A; font-weight: bold; ">Thread Poster</dd>'
        );
    });
};

/**
 * Highlight the posts by one self
 */
SALR.prototype.highlightOwnPosts = function() {
    var that = this;

    jQuery("table.post:has(dt.author:econtains('"+that.settings.username+"')) td").each(function () {
        if (that.settings.highlightSelf == 'true') {
            jQuery(this).css({
                'border-collapse' : 'collapse',
                'background-color' : that.settings.highlightSelfColor
            });
        }

        if (that.settings.removeOwnReport == 'true') {
            jQuery(this).children('ul.postbuttons').children('li.alertbutton').remove();
        }
    });
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
        case 'showthread':
            this.highlightModAdminShowThread();
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
        for(userid in modList) {
            for (unum in modList[userid].username) {
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
    });
};

/**
 * Highlight the posts by moderators and admins
 * on the thread display page
 */
SALR.prototype.highlightModAdminShowThread = function() {
    var that = this;

    if (this.settings.highlightModAdminUsername != 'true') {
        jQuery('table.post:has(dt.role-mod) td').each(function () {
            jQuery(this).css({
                'border-collapse' : 'collapse',
                'background-color' : that.settings.highlightModeratorColor
            });
            jQuery('dt.author', this).after(
                '<dd style="font-weight: bold; ">Forum Moderator</dd>'
            );
        });
        jQuery('table.post:has(dt.role-admin) td').each(function () {
            jQuery(this).css({
                'border-collapse' : 'collapse',
                'background-color' : that.settings.highlightAdminColor
            });
            jQuery('dt.author', this).after(
                '<dd style="font-weight: bold; ">Forum Moderator</dd>'
            );
        });
    } else {
        jQuery('dt.role-mod').each(function() {
            jQuery(this).css('color', that.settings.highlightModeratorColor);
            jQuery(this).after(
                '<dd style="font-weight: bold; color: ' + that.settings.highlightModeratorColor+ '">Forum Moderator</dd>'
            );
        });

        jQuery('dt.role-admin').each(function() {
            jQuery(this).css('color', that.settings.highlightAdminColor);
            jQuery(this).after(
                '<dd style="font-weight: bold; color: ' + that.settings.highlightAdminColor+ '">Forum Administrator</dd>'
            );
        });
    }
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
    var forums = new Array();

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

    var stickyList = new Array();
    if (this.settings.forumsList != null) {
        var oldForums = JSON.parse(this.settings.forumsList);
        for(i in oldForums) {
            stickyList[oldForums[i].id] = oldForums[i].sticky;
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
    var forums = new Array();

    var stickyList = new Array();
    if (this.settings.forumsList != null) {
        var oldForums = JSON.parse(this.settings.forumsList);
        for(i in oldForums) {
            stickyList[oldForums[i].id] = oldForums[i].sticky;
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
    var titleText = jQuery('title').text();
    var username = titleText.match(/- User Control Panel For (.+)/)[1];
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

                for (x in old) {
                    if (old[x] != null && sync[x] != null) {
                        if (old[x]['text'] != sync[x]['text']) {
                            sync[x]['text'] = sync[x]['text'] + " / " + old[x]['text'];
                        }
                    }
                    else if (old[x] != null) {
                        sync[x] = old[x]
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
                  "163390"  : {'text' : 'SALR Developer', 'color' : '#9933FF'}  // Master_Odin
                };
        postMessage({ 'message': message,
                           'option' : 'userNotes',
                           'value'  : JSON.stringify(notes)
        });
    } else {
        notes = JSON.parse(notes);
    }
    jQuery('body').append("<div id='salr-usernotes-config' title='Set note' style='display: none'>"+
        "<fieldset>"+
            "<p><label for='salr-usernotes-text'><strong>Note:</strong></label><br/><input type='text' id='salr-usernotes-text'/></p>"+
            "<p><label for='salr-usernotes-color'><strong>Color:</strong></label><br/><input type='text' id='salr-usernotes-color'/> <a href='http://www.colorpicker.com/' target='_blank'>Hex Codes</a></p>"+
        "</fieldset>"+
    "</div>");

    jQuery('table.post').each(function () {
        var profile = jQuery(this).find('ul.profilelinks a[href*=userid]')[0];
        if (profile == undefined)
            return;
        var userid = profile.href.match(/userid=(\d+)/)[1];
        var hasNote = notes[userid] != null;

        if (hasNote) {
            jQuery('dl.userinfo > dt.author', this).after(
                '<dd style="font-weight: bold; color: ' + notes[userid].color + '">' + notes[userid].text + '</dd>'
            );
        }

        var editLink = jQuery('<li><a href="javascript:;">Edit Note</a></li>');
        jQuery('a', editLink).click(function() {
            jQuery('#salr-usernotes-config').dialog({
                open: function(event, ui) {
                    jQuery(document).trigger('disableSALRHotkeys');
                    jQuery('#salr-usernotes-text').val(hasNote ? notes[userid].text : '');
                    jQuery('#salr-usernotes-color').val(hasNote ? notes[userid].color : '#FF0000');
                },
                buttons: {
                    "OK" : function () {
                        notes[userid] = {'text' : jQuery('#salr-usernotes-text').val(),
                                         'color' : jQuery('#salr-usernotes-color').val()};
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
        case 'usercp':
            jQuery('tr.thread').has('div.title_pages').each(function() {
                // how many posts in the thread
                var numPosts = parseInt(jQuery('td.replies > a', jQuery(this)).text());
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
            jQuery('div.pages').each(function() {
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

                // used to find out how many page links we'll be making
                Object.size = function(obj) {
                    var size = 0, key;
                    for(key in obj) {
                        if(obj.hasOwnProperty(key)) size++;
                    }
                    return size;
                };

                // if there's fewer than 5 pages, let the forum handle it
                if( pages > 5 ) {
                    var links = {};
                    for(var i = 0; i < 3; i++) {
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
                    var pagelinks = Object.size(links);

                    // rebuild top and bottom page links
                    jQuery(this).empty().append('Pages: ');
                    var b = jQuery('<b>');
                    if( curpage != 1 )
                        b.append( jQuery('<a>')
                            .attr({ href : 'showthread.php?threadid='+threadid+'&userid='+userid+'&perpage='+perpage+'&pagenumber='+(curpage - 1) })
                            .addClass('pagenumber')
                            .text('< Prev ') );

                    var i = 0;
                    for(key in links) {
                        ++i;
                        b.append(links[key]);

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
}

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
}

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
    if(this.settings.usernameCase == 'true') {
        var re = new RegExp(this.settings.username, 'gi');
        selector = 'td.postbody';
    }
    else {
        var re = new RegExp(this.settings.username, 'g');
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

    jQuery('.userquoted').attr("style", "background: "+this.settings.userQuote+"!important");
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

SALR.prototype.appendImage = function(original, thumbnail, type) {
    if (this.quickReply) {
        this.quickReply.appendImage(original, thumbnail, type);
    }
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
            var subscribe = jQuery('.subscribe > a').html().indexOf('Unbookmark') == 0 ? true : false;

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
           notes = new Object();
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
 *
 *  Add a rap sheet link to user's profiles
 *
 **/
SALR.prototype.addRapSheetToProfile = function() {
    var link = jQuery('table a[href*=userid]:first');
    var userid = link.attr('href').split('userid=')[1];
    var el = link.parent().clone();
    jQuery('a',el).attr('href', this.urlSchema+'//forums.somethingawful.com/banlist.php?userid='+userid);
    jQuery('a',el).text('Rap Sheet');
    link.parent().append(' ');
    link.parent().append(el);
}

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
}

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
}

function retinaFilename(img) {
    //test if file exists
    var segments = img.attr('src').split('/');
    var filename = segments[segments.length - 1];

    var filenameSegments = filename.split('.');
    filenameSegments[filenameSegments.length - 2] = filenameSegments[filenameSegments.length-2] + '@2x';

    var f = filenameSegments.join('.')
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
}

SALR.prototype.hidePostButtonInThread = function() {
    jQuery('ul.postbuttons li a[href^="newthread.php"]').hide();
}

/**
 * Add a link to the user's SOAP page to view previous avatars
 */
SALR.prototype.addSOAPLink = function() {
    var that = this;

    jQuery('table.post').each(function() {
        var username = jQuery(this).find('dt.author').html();
        jQuery(this).find('ul.profilelinks').append('<li><a href="http://esarahpalinonline.com/soap?username='+username+'" target="blank">SOAP</a></li>');
    });
}

/**
 * Expand the breadcrumbs to individual links on showthread.php
 */
SALR.prototype.expandBreadcrumbs = function() {
    var that = this;

    var count = 0;
    var children = jQuery('a.up span').first().children().length;
    jQuery('a.up span').first().children().each(function() {
        count++;
        var text = jQuery(this).text();
        var href = jQuery(this).attr('href');
        if (count == children) {
            var selector = "<span><a href='" + href + "' >" + text + "</a></span>";
        }
        else {
            var selector = "<span><a href='" + href + "' >" + text + "</a> &rsaquo; </span>";
        }
        jQuery(selector).insertBefore('a.up');
    });
    //jQuery('a.up span').remove();
    jQuery('a.up').remove();
    //jQuery('a.up').addClass('bclast').removeClass('up');
}

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
    }

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
