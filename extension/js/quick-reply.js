// Tracks the visibility state of the box

// http://forums.somethingawful.com/newreply.php?action=newreply&postid=379818033
// http://forums.somethingawful.com/newreply.php?s=&action=newreply&threadid=3208437
// function QuickReplyBox(forum_post_key, base_image_uri, settings) {
function QuickReplyBox(base_image_uri, settings, urlSchema, darkMode) {
    //this.forum_post_key = forum_post_key;
    this.base_image_uri = base_image_uri;
    this.settings = settings;
    this.urlSchema = urlSchema;
    this.darkMode = darkMode;

    this.reply_url = this.urlSchema + '//forums.somethingawful.com/newreply.php';
    this.edit_url = this.urlSchema + '//forums.somethingawful.com/editpost.php';

    this.previous_text = null;

    this.quickReplyState = {
        expanded: false,
        visible: false,
        sidebar_visible: false,
        topbar_visible: false,
        wait_for_quote: false,
        height: null
    };

    // TODO: Pull these from the extension, cache them there
    this.bbcodes = new Array();

    this.bbcodes['url'] = 'url';
    this.bbcodes['email'] = 'email';
    this.bbcodes['img'] = 'img';
    this.bbcodes['timg'] = 'timg';
    this.bbcodes['video'] = 'video';
    this.bbcodes['b'] = 'b';
    this.bbcodes['s'] = 's';
    this.bbcodes['u'] = 'u';
    this.bbcodes['i'] = 'i';
    this.bbcodes['spoiler'] = 'spoiler';
    this.bbcodes['fixed'] = 'fixed';
    this.bbcodes['super'] = 'super';
    this.bbcodes['sub'] = 'sub';
    this.bbcodes['size'] = 'size';
    this.bbcodes['color'] = 'color';
    this.bbcodes['quote'] = 'quote';
    this.bbcodes['pre'] = 'pre';
    this.bbcodes['code'] = 'code';
    this.bbcodes['php'] = 'php';
    this.bbcodes['list'] = 'list';

    this.create();
}

QuickReplyBox.prototype.create = function(username, quote) {

    var that = this;

    // Add listener for successful image uploads to append
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.original)
            that.appendImage(request.original, request.thumbnail, request.type);
    });

    // Begin fetching and parsing the emotes as soon as we create the quick-reply
    this.emote_parser = new EmoteParser(this);

    var html = `<div ${this.darkMode ? "class='salr-dark'" : ''} id="side-bar">` +
                '   <div id="sidebar-list">' +
                '   </div>' +
                '</div>' +
                `<div ${this.darkMode ? "class='salr-dark'" : ''} id="top-bar">` +
                '   <div id="topbar-preview">' +
                '      <div id="preview-content">' +
                '      </div>' +
                '   </div>' +
                '</div>' +
                `<div ${this.darkMode ? "class='salr-dark'" : ''} id="quick-reply"> ` +
                '   <form id="quick-reply-form" enctype="multipart/form-data" accept-charset="ISO-8859-1" action="newreply.php" name="vbform" method="POST" onsubmit="addThreadToCache(' + findThreadID() + '); return validate(this);">' +
                '       <input id="quick-reply-action" type="hidden" name="action" value="postreply">' +
                '       <input type="hidden" name="threadid" value="' + findThreadID() + '">' +
                '       <input id="quick-reply-postid" type="hidden" name="postid" value="">' +
                '       <input type="hidden" name="formkey" value="formkey">' +
                '       <input type="hidden" name="form_cookie" value="formcookie">' +
                '       <div id="title-bar">' +
                '           Quick Reply' +
                '       </div>' +
                '       <div id="view-buttons">' +
                '          <a id="toggle-view"><img id="quick-reply-rollbutton" class="quick-reply-image" src="' + this.base_image_uri + "quick-reply-rolldown.gif" + '"></a>' +
                '          <a id="dismiss-quick-reply"><img class="quick-reply-image" src="' + this.base_image_uri + "quick-reply-close.gif" + '"></a>' +
                '       </div>' +
                '       <div id="smiley-menu" class="sidebar-menu">' +
                '           <img src="' + this.base_image_uri + "quick-reply-smiley.gif" + '" />' +
                '       </div>' +
                '       <div id="tag-menu" class="sidebar-menu">' +
                '           <img src="' + this.base_image_uri + "quick-reply-tags.gif" + '" />' +
                '       </div>' +
                '       <div id="imgur-images-menu" class="sidebar-menu">' +
                '           <img src="' + this.base_image_uri + "quick-reply-imgur.png" + '" />' +
                '       </div>' +
                '       <div id="post-input-field">' +
                '           <textarea name="message" rows="18" size="10" id="post-message" tabindex="1">' +
                '           </textarea>' +
                '       </div>' +
                '       <div id="post-options">' +
                '           <label>' +
                '           <input type="checkbox" id="parseurl" name="parseurl" value="yes">' +
                '              <span class="post-options">Parse URLs</span>' +
                '           </input>' +
                '           </label>' +
                '           <label>' +
                '           <input type="checkbox" id="quickReplyBookmark" name="bookmark" value="yes">' +
                '              <span class="post-options">Bookmark thread</span>' +
                '           </input>' +
                '           </label>' +
                '           <label>' +
                '           <input type="checkbox" id="disablesmilies" name="disablesmilies" value="yes">' +
                '               <span class="post-options">Disable smilies</span>' +
                '           </input>' +
                '           </label>' +
                '           <label>' +
                '           <input type="checkbox" id="signature" name="signature" value="yes">' +
                '               <span class="post-options">Show signature</span>' +
                '          </input>' +
                '           </label>' +
                '           <label>' +
                '           <input type="checkbox" id="live-preview" value="yes">' +
                '               <span class="post-options">Show live preview</span>' +
                '          </input>' +
                '           </label>' +
                '       </div>' +
                '       <div id="submit-buttons">' +
                '           <input type="submit" class="bginput" name="preview" value="Preview Reply" tabindex="3">' +
                '           <input type="submit" class="bginput" name="submit" value="Submit Reply" tabindex="2">' +
                '       </div>' +
                '   </form>' +
               '</div>';

    // Only append it if we haven't already
    if (jQuery('#quick-reply').length == 0) {
        jQuery('body').append(html);
    }

    jQuery('textarea[name=message]').keydown(function(event) {
        that.formatText(event);
    });

    if (this.settings.quickReplyYoutube == "true") {
        jQuery("textarea[name=message]").on('paste', function(event) {
            that.pasteText(event);
        });
    }

    jQuery('#dismiss-quick-reply').click(function() {
        that.hide();
    });

    jQuery('div#quick-reply').addClass('modal');

    jQuery('#title-bar').click(function() {
        that.toggleView();
    });
    jQuery('#toggle-view').click(function() {
        that.toggleView();
    });

    jQuery(window).resize(function() {
        var quick_reply_position = jQuery('#quick-reply').offset().left;
        var offset = 350;

        if (that.quickReplyState.sidebar_visible) {
            offset += 200;
        }

        jQuery('#side-bar').css('left', (quick_reply_position + offset) + 'px');
    });

    var quick_reply_position = jQuery('#quick-reply').offset().left;

    jQuery('#side-bar').css('left', (quick_reply_position + 350) + 'px');

    jQuery('.sidebar-menu').each(function() {
        jQuery(this).click(function() {
            that.toggleSidebar(jQuery(this));
        });
    });

    jQuery('#live-preview').change(function() {
        that.toggleTopbar();
    });

    // Hook up delegated click event for sidebar menu items
    let sidebarList = document.getElementById('sidebar-list');
    sidebarList.addEventListener('click', (event) => {
        event.stopPropagation();
        for (let el = event.target; el && el !== event.currentTarget; el = el.parentNode) {
            if (!el.matches('div.sidebar-menu-item'))
                continue;

            let selected_item = el.getElementsByClassName('menu-item-code')[0].textContent;
            if (el.classList.contains('bbcode'))
                that.insertBBCode(selected_item);
            else // Smilies
                that.insertText(selected_item, false);

            break;
        }
    }, false);

    this.sidebar_html = '<img class="loading-spinner" src="' + this.base_image_uri + 'loading-spinner.gif" />';
    this.emotes = null;

    this.fetchFormCookie(findThreadID());
    jQuery('#side-bar').hide();
    jQuery('#quick-reply').hide();

    // this takes care of a weird case where hitting "reply" inserted a tab on first use
    jQuery('#post-message').val('');
    if (this.quickReplyState.height == null) {
        this.quickReplyState.height = jQuery('.modal').first().height();
        jQuery('#top-bar').css('height',(parseInt(jQuery('#top-bar').css('height'))-(390-this.quickReplyState.height)) + 'px');
        jQuery('#topbar-preview').css('height',(parseInt(jQuery('#topbar-preview').css('height'))-(390-this.quickReplyState.height)) + 'px');
        jQuery('#side-bar').css('bottom',(parseInt(jQuery('#side-bar').css('bottom'))-(390-this.quickReplyState.height)) + 'px');
    }

    if (this.settings.threadCaching == 'true') {
        var button = jQuery('input[name="submit"]');
        if  (button.length > 0) {
            button.click(function() {
                var history = new PostHistory();
                const id = findThreadID();
                if (!history.getThreadStatus(id)) {
                    history.addThread(id);
                }
            });

        }
    }
};

QuickReplyBox.prototype.show = function() {
    var that = this;

    if (!this.quickReplyState.expanded) {
        this.toggleView();
    }
    jQuery(document).trigger('disableSALRHotkeys');
    jQuery('#quick-reply').show("slow",function() {
        if (!that.quickReplyState.visible) {
            // change default checkbox values
            if (that.settings.quickReplyParseUrls == 'true') {
                jQuery('input#parseurl').prop('checked',true);
            }
            if (that.settings.quickReplyBookmark == 'true' && jQuery('input#quickReplyBookmark').prop('checked') != true) {
                jQuery('input#quickReplyBookmark').trigger('click');
            }
            if (that.settings.quickReplyDisableSmilies == 'true') {
                jQuery('input#disablesmilies').prop('checked',true);
            }
            if (that.settings.quickReplySignature == 'true') {
                jQuery('input#signature').prop('checked',true);
            }
            if (that.settings.quickReplyLivePreview == 'true') {
                jQuery('input#live-preview').trigger('click');
            }
        }
        that.quickReplyState.visible = true;
        jQuery('#post-message').focus().putCursorAtEnd();
    });

};

QuickReplyBox.prototype.hide = function() {
    // close side/top bars if they're open, then hide them. better that way.
    if (this.quickReplyState.topbar_visible != false) {
        this.toggleTopbar();
    }
    jQuery('#top-bar').first().hide();
    jQuery('#live-preview').prop('checked', '');
    if (this.quickReplyState.sidebar_visible != false) {
        this.toggleSidebar(jQuery("<input id='" + this.quickReplyState.sidebar_visible + "' type='hidden' />"));
    }
    jQuery('#side-bar').first().hide();
    if (salr_client.pageNavigator) {
        salr_client.pageNavigator.display();
    }
    jQuery(document).trigger('enableSALRHotkeys');
    jQuery('#quick-reply').hide("slow");
    jQuery('#post-message').val('');
    jQuery('#post-warning').remove();

    // Return to quick reply mode
    jQuery('div#title-bar').text('Quick Reply');
    jQuery('form#quick-reply-form').attr('action', 'newreply.php');
    jQuery('input#quick-reply-action').val('postreply');
    jQuery('input#quick-reply-postid').val('');
    jQuery('input[name="submit"]').attr('value', 'Submit Reply');

    this.quickReplyState = {
        expanded: this.quickReplyState.expanded,
        visible: false,
        sidebar_visible: false,
        topbar_visible: false,
        wait_for_quote: false,
        height: this.quickReplyState.height
    };

    jQuery('input#parseurl').prop('checked', '');
    jQuery('input#quickReplyBookmark').prop('checked', '');
    jQuery('input#disablesmilies').prop('checked', '');
    jQuery('input#signature').prop('checked', '');


};

QuickReplyBox.prototype.fetchFormCookie = function(threadid) {
    var that = this;

    var parseFormCookie = function(html) {
        return jQuery('input[name="form_cookie"]', html).val();
    };

    var parseFormKey = function(html) {
        return jQuery('input[name="formkey"]', html).val();
    };

    // Firefox will refuse to send credentials with requests to SA if third-
    //     party cookies are disabled unless we use content. (Firefox 58+)
    const contentXHR = ((typeof content === "object" && content.XMLHttpRequest) ? content.XMLHttpRequest : XMLHttpRequest);
    var xhr = new contentXHR;
    xhr.open("GET", this.reply_url + '?action=newreply&threadid=' + threadid);
    xhr.withCredentials = true;
    xhr.responseType = 'document';
    xhr.onload = function() {
        var doc = xhr.response;
        that.notifyFormKey(parseFormKey(doc));
        that.notifyReplyReady(parseFormCookie(doc));
    };
    xhr.send();
};

QuickReplyBox.prototype.updatePreview = function() {
    if(jQuery('#post-message').val().length > 0) {
        var parser = new PreviewParser(jQuery('#post-message').val(), this.sortedEmotes);
        jQuery('#preview-content').html(parser.fetchResult());

        var content = document.getElementById('topbar-preview');
        content.scrollTop = content.scrollHeight;
    }
};

/**
 * Inserts text into the quick reply message box at the text cursor.
 * @param {string}  text         Text to insert/replace.
 * @param {boolean} replace      Whether to replace selected text with new text.
 * @param {number}  [offset = 0] Optional number of characters to put the new text cursor
 *                               relative to initial location instead of after the new text.
 */
QuickReplyBox.prototype.insertText = function(text, replace, offset = 0) {
    let msg = document.getElementById('post-message');
    let insertingText = msg.selectionStart === msg.selectionEnd;
    let insertionPoint = replace ? msg.selectionStart : msg.selectionEnd;
    msg.value = msg.value.substr(0, insertionPoint) + text + msg.value.substr(msg.selectionEnd, msg.value.length);
    msg.focus();

    if (insertingText && offset > 0) {
        // No text was selected; use custom offset specified
        insertionPoint += offset;
    }
    else {
        // Put text cursor after end of new text
        insertionPoint += text.length;
    }
    msg.setSelectionRange(insertionPoint, insertionPoint);

    if (this.quickReplyState.topbar_visible)
        this.updatePreview();
};

/**
 * Inserts BBCode tags into the quick reply message box.
 * If text is selected, it will be surrounded by the tags.
 * Otherwise, the tags will be inserted at the text cursor.
 * @param {string} tag Name of BBCode tag to insert.
 */
QuickReplyBox.prototype.insertBBCode = function(tag) {
    let text_area = document.getElementById('post-message');
    let selection = text_area.value.substring(text_area.selectionStart, text_area.selectionEnd);
    let codeText = this.bbcodes[tag];
    let replacement_text = '[' + codeText + ']' + selection + '[/' + codeText + ']';

    this.insertText(replacement_text, true, codeText.length + 2);
};

/**
 * Appends text to the end of the quick reply message box.
 * @param {string} text Text to append.
 */
QuickReplyBox.prototype.appendText = function(text) {
    var current_message = document.getElementById('post-message').value;

    document.getElementById('post-message').value = current_message + text;
    if (this.quickReplyState.topbar_visible)
        this.updatePreview();
};

/**
 * Adds text to the beginning of the quick reply message box.
 * @param {string} text Text to prepend.
 */
QuickReplyBox.prototype.prependText = function(text) {
    var current_message = document.getElementById('post-message').value;

    document.getElementById('post-message').value = text + current_message;

    if (this.quickReplyState.topbar_visible)
        this.updatePreview();
};

QuickReplyBox.prototype.appendQuote = function(postid) {
    var that = this;

    if (!this.quickReplyState.expanded)
        this.quickReplyState.wait_for_quote = true;

    // Call up SA's quote page
    // Firefox will refuse to send credentials with requests to SA if third-
    //     party cookies are disabled unless we use content. (Firefox 58+)
    const contentXHR = ((typeof content === "object" && content.XMLHttpRequest) ? content.XMLHttpRequest : XMLHttpRequest);
    var xhr = new contentXHR;
    xhr.open("GET", this.reply_url + '?action=newreply&postid=' + postid);
    xhr.withCredentials = true;
    xhr.responseType = 'document';
    xhr.onload = function() {
        var doc = xhr.response;
        // Pull quoted text from reply box
        var textarea = doc.querySelector('textarea[name=message]');
        var quote = '';
        if (textarea.textLength)
            quote = textarea.value;

        // this is the first thing in the Quick Reply
        if (that.quickReplyState.wait_for_quote) {
            that.prependText(quote);
            that.showWarning();
            that.quickReplyState.wait_for_quote=false;
        } else {
            that.appendText(quote);
        }
    };
    xhr.send();
};

QuickReplyBox.prototype.appendImage = function(original, thumbnail, type) {
    var result = null;

    if (type == 'thumbnail') {
        result = '[timg]' + thumbnail + '[/timg]\n';
        // result += '[url=' + original + ']Click here to view the full image[/url]\n';
    } else {
        result = '[img]' + original + '[/img]\n';
    }

    this.appendText(result);
};

QuickReplyBox.prototype.editPost = function(postid, subscribe) {
    var that = this;

    // Call up SA's edit page
    // Firefox will refuse to send credentials with requests to SA if third-
    //     party cookies are disabled unless we use content. (Firefox 58+)
    const contentXHR = ((typeof content === "object" && content.XMLHttpRequest) ? content.XMLHttpRequest : XMLHttpRequest);
    var xhr = new contentXHR;
    xhr.open("GET", this.edit_url + '?action=editpost&postid=' + postid);
    xhr.withCredentials = true;
    xhr.responseType = 'document';
    xhr.onload = function() {
        var doc = xhr.response;
        // Pull quoted text from reply box
        var textarea = doc.querySelector('textarea[name=message]');
        var edit = '';
        if (textarea.textLength)
            edit = textarea.value;
        document.getElementById('post-message').value = edit;
        // Grab bookmark status (only way to get it for edits from single post)
        if (doc.querySelector('input[name=bookmark]').checked)
            document.getElementById('quickReplyBookmark').checked = true;
        if (that.quickReplyState.topbar_visible)
            that.updatePreview();
    };
    xhr.send();

    jQuery('#post-warning').remove();
    jQuery('div#title-bar').text('Quick Edit');
    jQuery('form#quick-reply-form').attr('action', 'editpost.php');
    jQuery('input#quick-reply-action').val('updatepost');
    jQuery('input#quick-reply-postid').val(postid);
    jQuery('input[name="submit"]').attr('value', 'Edit Post');

    if (subscribe) {
        jQuery('input#quickReplyBookmark').prop('checked', true);
    }

};

QuickReplyBox.prototype.toggleView = function() {

    var that = this;
    var quick_reply_box = jQuery(".modal").first();
    var min = '18px';
    var max = this.quickReplyState.height;
    var imgId = jQuery("img#quick-reply-rollbutton").first();

    if(this.quickReplyState.expanded) {
        var hideBox = function() {
            jQuery('#side-bar').first().hide();
            jQuery('#top-bar').first().hide();
            jQuery('#live-preview').prop('checked', '');
            quick_reply_box.animate( { height: min } );
            (imgId).attr("src", that.base_image_uri + "quick-reply-rollup.gif");
            that.quickReplyState.expanded = false;
        };

        // Keep trying to close the sidebar until we're ready
        if(this.quickReplyState.sidebar_visible) {
            jQuery('#side-bar').animate( { left: '-=200px' }, 500, function() {
                that.quickReplyState.sidebar_visible = false;
                if (salr_client.pageNavigator) {
                    salr_client.pageNavigator.display();
                }

                that.toggleView();
            });
        } else if (this.quickReplyState.topbar_visible) {
            jQuery('#top-bar').animate( { bottom: '-=' + (320-(390-this.quickReplyState.height)) + 'px' }, 500, function() {
                that.quickReplyState.topbar_visible = false;
                that.toggleView();
            });
        } else {
            hideBox();
        }
    } else {
        quick_reply_box.animate( { height: max }, 500, function() {
                // Only display the sidebar after the box is shown
                //jQuery('#side-bar').first().show();
        });
        (imgId).attr("src", this.base_image_uri + "quick-reply-rolldown.gif");
        jQuery('#post-message').focus().putCursorAtEnd();
        this.quickReplyState.expanded = true;
    }
};

QuickReplyBox.prototype.toggleSidebar = function(element) {
    // restore focus to the message box so we can still see what was selected
    document.getElementById('post-message').focus();

    var side_bar = jQuery("#side-bar").first();

    if(!side_bar.is(':visible')) {
        side_bar.css('display', 'block');
    }

    var min = '20px';
    var max = '525px';
    var populate_method = null;
    var that = this;

    switch (element.attr('id')) {
        case 'smiley-menu':
            populate_method = this.setEmoteSidebar;
            break;
        case 'tag-menu':
            populate_method = this.setBBCodeSidebar;
            break;
        case 'imgur-images-menu':
            populate_method = this.setImgurImagesSidebar;
            break;
    }

    // If there is a sidebar open, and the button clicked is the same
    // one that is open, then close it

    // If there is a sidebar open, and the button clicked is different,
    // close what is open, then reopen the correct one

    // If no sidebar is open, open it
    if ((this.quickReplyState.sidebar_visible) && (this.quickReplyState.sidebar_visible == element.attr('id'))) {
        side_bar.animate( { left: '-=200px' } );
        if (salr_client.pageNavigator) {
            salr_client.pageNavigator.display();
        }
        this.quickReplyState.sidebar_visible = false;
    } else if ((this.quickReplyState.sidebar_visible) && (this.quickReplyState.sidebar_visible != element.attr('id'))) {
        side_bar.animate( { left: '-=200px' }, 500, function() {
            populate_method.call(that);
            side_bar.animate( { left: '+=200px' } );
            that.quickReplyState.sidebar_visible = element.attr('id');
        });
    } else {
        populate_method.call(this);
        side_bar.animate( { left: '+=200px' } );
        if (salr_client.pageNavigator) {
            salr_client.pageNavigator.hide();
        }
        this.quickReplyState.sidebar_visible = element.attr('id');
    }

};

QuickReplyBox.prototype.toggleTopbar = function() {
    var top_bar = jQuery('#top-bar');

    if (!top_bar.is(':visible')) {
        top_bar.css('display', 'block');
    }

    if (this.quickReplyState.topbar_visible) {
        top_bar.animate( { bottom: '-=' + (320-(390-this.quickReplyState.height)) + 'px' } );
        this.quickReplyState.topbar_visible = false;
    } else {
        this.updatePreview();
        top_bar.animate( { bottom: '+=' + (320-(390-this.quickReplyState.height)) + 'px' } );
        this.quickReplyState.topbar_visible = true;
    }
};

QuickReplyBox.prototype.notify = function(emotes, sortedEmotes) {
    var that = this;
    this.emotes = emotes;
    this.sortedEmotes = sortedEmotes;

    jQuery(document).on('keyup', '#post-message', function() {
      if (that.quickReplyState.topbar_visible) {
        that.updatePreview();
      }
    });

    this.setEmoteSidebar();
};

QuickReplyBox.prototype.notifyReplyReady = function(form_cookie) {
    jQuery('input[name="form_cookie"]').attr('value', form_cookie);
};

QuickReplyBox.prototype.notifyFormKey = function(form_key) {
    jQuery('input[name="formkey"').attr('value', form_key);
    /*postMessage({   'message': 'ChangeSetting',
                    'option' : 'forumPostKey',
                    'value'  : form_key
    });*/
};

QuickReplyBox.prototype.setEmoteSidebar = function() {
    var html = '';

    if (this.settings.quickReplyEmotes == 'true') {
        for (var i = 0; i < this.sortedEmotes.length; i++) {
            html += '<div class="sidebar-menu-item emote">' +
                    '   <div><img src="' + this.sortedEmotes[i][1] + '" /></div>' +
                    '   <div class="menu-item-code">' + this.sortedEmotes[i][0] + '</div>' +
                    '</div>';
        }
    }
    else {
        for (var anEmote of Object.values(this.emotes)) {
            html += '<div class="sidebar-menu-item emote">' +
                    '   <div><img src="' + anEmote.image + '" /></div>' +
                    '   <div class="menu-item-code">' + anEmote.emote + '</div>' +
                    '</div>';
        }
    }

    jQuery('#sidebar-list').html(html);

    this.sidebar_html = html;
};

QuickReplyBox.prototype.setBBCodeSidebar = function() {
    var html = '';

    for (var code in this.bbcodes) {
        if (this.bbcodes.hasOwnProperty(code)) {
            html += '<div class="sidebar-menu-item bbcode">' +
                    '   <div class="menu-item-code">' + code + '</div>' +
                    '</div>';
        }
    }

    jQuery('#sidebar-list').html(html);

    this.sidebar_html = html;
};

QuickReplyBox.prototype.setImgurImagesSidebar = function() {
    var html = '<iframe src="' + chrome.runtime.getURL('/') + 'imgur-upload.html" width="162" height="245" frameborder="0"></iframe>';
    jQuery('#sidebar-list').html(html);

    this.sidebar_html = html;
};

QuickReplyBox.prototype.isExpanded = function() {
    return this.quickReplyState.expanded;
};

QuickReplyBox.prototype.isVisible = function() {
    return this.quickReplyState.visible;
};

QuickReplyBox.prototype.formatText = function(event) {
    // Both CtrlKey & AltKey means AltGr was hit
    if (!event.ctrlKey || (event.ctrlKey && event.altKey))
        return;

    // add undo for fancy paste handler
    if (event.ctrlKey && event.key.toLowerCase() === 'z') {
        if (this.previous_text != null) {
            event.target.value = this.previous_text;
            this.previous_text = null;
            event.preventDefault();
        }
    }

    if (this.settings.quickReplyFormat == 'true') {
        var key = event.key.toLowerCase();
        var src = event.target;
        var selStart = src.selectionStart;
        var selEnd = src.selectionEnd;

        var text = src.value;
        var pre = text.substring(0, selStart);
        var sel = text.substring(selStart, selEnd);
        var post = text.substring(selEnd);
        if (key === 'b') {
            // Bold
            src.value = pre+'[b]'+sel+'[/b]'+post;
            event.preventDefault();
            src.selectionStart = selStart+3;
            src.selectionEnd = selEnd+3;
        } else if (key === 'i') {
            // Italics
            src.value = pre+'[i]'+sel+'[/i]'+post;
            event.preventDefault();
            src.selectionStart = selStart+3;
            src.selectionEnd = selEnd+3;
        } else if (key === 'u') {
            // Underline
            src.value = pre+'[u]'+sel+'[/u]'+post;
            event.preventDefault();
            src.selectionStart = selStart+3;
            src.selectionEnd = selEnd+3;
        } else if (key === 's') {
            // Strikeout
            src.value = pre+'[s]'+sel+'[/s]'+post;
            event.preventDefault();
            src.selectionStart = selStart+3;
            src.selectionEnd = selEnd+3;
        } else if (key === 'f') {
            // Fixed
            src.value = pre+'[fixed]'+sel+'[/fixed]'+post;
            event.preventDefault();
            src.selectionStart = selStart+7;
            src.selectionEnd = selEnd+7;
        } else if (key === 'p') {
            // Spoiler
            src.value = pre+'[spoiler]'+sel+'[/spoiler]'+post;
            event.preventDefault();
            src.selectionStart = selStart+9;
            src.selectionEnd = selEnd+9;
        } else if (key === '8') {
            // List Item

            // Check if we need to add a list tag
            var list = text.indexOf('[list]');
            if (list == -1 || list > src.selectionStart) {
                pre = pre+"[list]\n";
                post = "\n[/list]"+post;
            }
            // Put a [*] on at the start of each line
            sel = sel.replace(/\n/g, "\n[*]");
            src.value = pre+'[*]'+sel+post;
            event.preventDefault();
        } else if (key === 'q') {
            // Quote
            src.value = pre+'[quote]'+sel+'[/quote]'+post;
            event.preventDefault();
            src.selectionStart = selStart+7;
            src.selectionEnd = selEnd+7;
        }
    }
};

/**
 * Parses a query string into an object.
 * @param {string} str a string
 * @return {Object} Object containing query string parts
 * @author SA Forums
 */
QuickReplyBox.prototype.parseQueryString = function(str)
{
    var query = str.split('&');
    var o = {};
    var i;
    for (var item of query) {
        i = item.indexOf('=');
        if (i != -1)
        {
            o[item.substr(0, i)] = item.substr(i + 1);
        }
        else
        {
            o[item] = true;
        }
    }

    return o;
};

/**
 * Parsed URL object.
 * @typedef {Object} ParsedURL
 * @property {string} scheme
 * @property {string} domain
 * @property {string} path
 * @property {string} filename
 * @property {string} query
 * @property {string} fragment
 */
/**
 * Parses a URL into manageable pieces.
 * @param {string} url URL to parse
 * @return {ParsedURL} Object with fragments of a URL, or null.
 * @author SA Forums
 */
QuickReplyBox.prototype.parseURL = function(url)
{
    var m = (/([^:]+):\/\/([^\/]+)(\/.*)?/).exec(decodeURI(url));
    if (m)
    {
        var tmp;
        var item;
        var i;
        var o = {
            'scheme': m[1],
            'domain': m[2],
            'path': m[3] || '',
            'filename': '',
            'query': {},
            'fragment': ''
        };

        i = o.path.lastIndexOf('#');
        if (i != -1)
        {
            o.fragment = o.path.substr(i + 1);
            o.path = o.path.substr(0, i);
        }

        i = o.path.lastIndexOf('?');
        if (i != -1)
        {
            o.query = this.parseQueryString(o.path.substr(i + 1));
            o.path = o.path.substr(0, i);
        }

        i = o.path.lastIndexOf('/');
        if (i != -1)
        {
            o.filename = o.path.substr(i + 1);
        }

        return o;
    }

    return null;
};

/**
 * Handles paste event in the quick reply box.
 * @param {Event} event The paste event
 * @author SA Forums
 */
QuickReplyBox.prototype.pasteText = function(event) {
    var elem = jQuery(event.target);
    var orig = elem.val();
    //var orig = elem[0].val();
    var start = elem[0].selectionStart;
    var end = elem[0].selectionEnd;

    //elem.val('');
    elem.focus();

    var that = this;
    setTimeout(function() {
        var new_elem = elem.val();
        var pasteData;
        if (start == end) {
            pasteData = new_elem.substr(start,new_elem.length-orig.length);
        }
        else {
            // start < end
            var temp = orig.substr(0,start) + orig.substr(end);
            pasteData = new_elem.substr(start,new_elem.length-temp.length);
        }
        elem.val(orig);
        elem[0].selectionStart = start;
        elem[0].selectionEnd = end;

        if ((/^https?:\/\//).test(pasteData) && pasteData.indexOf('\n') == -1 && pasteData.indexOf('\r') == -1) {
            // So far a URL.
            var urlinfo = that.parseURL(pasteData);
            var extension = '';
            var filename = '';
            var handled = false;
            var i = urlinfo.filename.lastIndexOf('.');
            if (i != -1) {
                extension = urlinfo.filename.substr(i + 1);
                filename = urlinfo.filename.substr(0, i);
                //console.log('!!!', filename);
            }

            // Detect youtube here!!
            // http://www.youtube.com/watch?v=rK1XnD9f8Bc&feature=g-vrec
            if ((/^([^\.]+\.)?youtube(-nocookie)?\.com$/.test(urlinfo.domain) ||
                /^([^\.]+\.)?youtu\.be$/.test(urlinfo.domain)) &&
                /^\/user|^\/channel|^\/playlist/.test(urlinfo.path) === false) {
                var getYTStart = function(timeStr) {
                    var timeSearch = timeStr.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?/);
                    // return time in seconds to work around BBCode parser bug with time conversion
                    return ((timeSearch[1] ? parseInt(timeSearch[1],10) * 3600 : 0) +
                        (timeSearch[2] ? parseInt(timeSearch[2],10) * 60 : 0) +
                        (timeSearch[3] ? parseInt(timeSearch[3],10) : 0));
                };
                var ytparms;
                if (urlinfo.query.v) {
                    //console.log('Clipboard is a Youtube video: ', pasteData);
                    pasteData = '[video type="youtube"';
                    if (urlinfo.query.hd) {
                        pasteData += ' res="hd"';
                    }

                    if (urlinfo.query.t)
                        pasteData += ' start="' + getYTStart(urlinfo.query.t) + '"';
                    else if (urlinfo.fragment) {
                        ytparms = that.parseQueryString(urlinfo.fragment);
                        if (ytparms.t)
                        {
                            pasteData += ' start="' + getYTStart(ytparms.t) + '"';
                        }
                    }

                    pasteData += ']' + urlinfo.query.v + '[/video]';
                    handled = true;
                }
                else if ((/^\/embed/).test(urlinfo.path)) {
                    //console.log('Clipboard is an embedded Youtube video: ', pasteData);
                    pasteData = '[video type="youtube"';
                    if (urlinfo.query.hd) {
                        pasteData += ' res="hd"';
                    }

                    if (urlinfo.query.start) {
                        pasteData += ' start="' + getYTStart(urlinfo.query.start) + '"';
                    }

                    pasteData += ']' + urlinfo.path.substr(urlinfo.path.lastIndexOf('/') + 1) + '[/video]';
                    handled = true;
                }
                else {
                    //console.log('Clipboard is a short-link Youtube video: ', pasteData);
                    pasteData = '[video type="youtube"';
                    if (urlinfo.query.hd) {
                        pasteData += ' res="hd"';
                    }

                    if (urlinfo.query.t)
                        pasteData += ' start="' + getYTStart(urlinfo.query.t) + '"';
                    else if (urlinfo.fragment) {
                        ytparms = that.parseQueryString(urlinfo.fragment);
                        if (ytparms.t) {
                            pasteData += ' start="' + getYTStart(ytparms.t) + '"';
                        }
                    }

                    pasteData += ']' + urlinfo.path.substr(1) + '[/video]';
                    handled = true;
                }
            }

            if (!handled) {
                switch(extension) {
                    case 'jpg':
                    case 'jpeg':
                    case 'gif':
                    case 'png':
                            //console.log('Clipboard is an image URL: ', pasteData);
                            pasteData = '[img]' + pasteData + '[/img]';
                        break;
                    default:
                        // console.log('Clipboard is a URL: ', pasteData);
                        // Make sure users want URLs parsed
                        var wantsParsing = $('input[name="parseurl"]').is(':checked');

                        // Only use this for wikipedia links (for now?)
                        if (wantsParsing && /^([^\.]+\.)?wikipedia\.org$/.test(urlinfo.domain)) {
                            pasteData = '[url]' + pasteData + '[/url]';
                        }
                        break;
                }
            }
        }

        that.previous_text = orig;
        elem.val(orig.substr(0,start)+pasteData+orig.substr(end));
        var set = orig.substr(0,start).length + pasteData.length;
        elem[0].selectionStart = set;
        elem[0].selectionEnd = set;
    }, 5);
};

QuickReplyBox.prototype.showWarning = function() {
    if (this.settings.qneProtection == 'true') {
        if (this.settings.username) {
            var regex = "quote=\"" + this.settings.username + "\"";
            var match = jQuery("#post-message").val().match(new RegExp(regex,"gi"));
            if (match != null) {
                jQuery("#post-options").after("<div id='post-warning'><h4>Warning! Possible Quote/Edit mixup.</h4></div>");
            }
        }
    }
};
