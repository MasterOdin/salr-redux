function MouseGesturesController(base_image_uri, settings, currentPage, countPages) {
    var that = this;

    this.settings = settings;
    this.base_image_uri = base_image_uri;

    this.gesture_overlay_html = this.buildOverlay();
    this.disabled_gestures = [];

    this.pageCount = countPages;
    this.currentPage = currentPage;

    this.rootPageType = null;
    this.basePageID = null;
    this.currentPageName = findCurrentPage();

    // Page navigation functions are provided globally
    // in page-navigator.js
    switch(this.currentPageName) {
        case 'forumdisplay':
        case 'showthread':
            this.rootPageType = (this.currentPageName == 'forumdisplay') ? 'forumid' : 'threadid';
            this.basePageID = findForumID();
            break;
        case 'usercp.php':
            break;
        default:
            break;
    }

    if (localStorage.getItem("MouseActiveContext") == undefined || localStorage.getItem("MouseActiveContext") == null) {
        localStorage.setItem("MouseActiveContext", false);
    }

    document.addEventListener("contextmenu", (event) => {
        if (that.settings.enableMouseMenu == "true" && localStorage.getItem("MouseActiveContext") == 'false') {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
    });

    jQuery(document).keydown(function(event) {
        if (event.keyCode == 18) {
            if (that.settings.enableMouseMenu == "true") {
                var not_context = localStorage.getItem("MouseActiveContext") != 'true' ? 'true' : 'false';
                localStorage.setItem("MouseActiveContext", not_context);
            }
        }
    });

    jQuery('div#container').each(function() {
        var removeOverlay = function(x, y) {
            var handler = that.findFunction(x, y);

            jQuery('div#gesture-overlay').each(function() {
                jQuery(this).remove();
            });

            // Successful gesture
            if (handler) {
                // if the alt-toggle setting is disabled
                if (that.settings.enableMouseMenu == 'false') {
                    document.addEventListener("contextmenu", (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        return false;
                    }, {once: true});
                }
                handler.call(that);
            }
        };

        var drawIndicator = function(event) {
            var canvas = document.getElementById('gesture-indicator');

            var overlay_left = jQuery('div#gesture-overlay').offset().left;
            var overlay_top = jQuery('div#gesture-overlay').offset().top;

            var x_coord = event.pageX - (overlay_left + 77);
            var y_coord = event.pageY - (overlay_top + 77);

            // If we are out of bounds of the overlay then we need
            // to adjust accordingly
            if (x_coord < 0) {
                x_coord = 0;
            }
            else if (x_coord > 77) {
                x_coord = 77;
            }

            if (y_coord < 0) {
                y_coord = 0;
            }
            else if (y_coord > 77) {
                y_coord = 77;
            }

            var context = canvas.getContext('2d');

            // Clear the rectangle and draw the stroke
            context.clearRect(0, 0, 77, 77);
            context.lineWidth = '6';

            context.strokeStyle = "rgba(0, 0, 0, .5)";
            context.beginPath();
            context.moveTo(38, 38);
            context.lineTo(x_coord, y_coord);
            context.stroke();
            context.closePath();

            that.updateButtonStyles(event.pageX, event.pageY);
        };

        jQuery(this).rightMouseDown(function(event) {
            // Bail if the alt-toggle setting is enabled and it's context menu time
            if (that.settings.enableMouseMenu == "true" && localStorage.getItem("MouseActiveContext") == 'true')
                return;
            jQuery('body').append(that.gesture_overlay_html);
            jQuery('div#gesture-overlay').css({'left': event.pageX - 115,
                                    'top': event.pageY - 115});

            that.setPageSpecificCSS();

            jQuery('div#gesture-overlay').rightMouseUp(function(event) {
                removeOverlay(event.pageX, event.pageY);
            });

            jQuery('div#gesture-overlay').mousemove(drawIndicator);
        });

        jQuery(this).rightMouseUp(function(event) {
            if (localStorage.getItem("MouseActiveContext") == 'false') {
                removeOverlay(event.pageX, event.pageY);
            }
        });
    });
}

MouseGesturesController.prototype.buildOverlay = function() {
    var html = '<div id="gesture-overlay">' +
           '    <div id="gesture-top">' +
           '        <img id="top-image" src="' + this.base_image_uri + 'gesturenav-top.png">' +
           '    </div>' +
           '    <div id="gesture-left">' +
           '        <img id="left-image" src="' + this.base_image_uri + 'gesturenav-left.png">' +
           '    </div>' +
           '    <canvas id="gesture-indicator" width="77" height="77">' +
           '    </canvas>' +
           '    <div id="gesture-right">' +
           '        <img id="right-image" src="' + this.base_image_uri + 'gesturenav-right.png">' +
           '    </div>' +
           '    <div id="gesture-bottom">' +
           '        <img id="bottom-image" src="' + this.base_image_uri + 'gesturenav-bottom.png">' +
           '    </div>' +
           '</div>';

    return html;
};

/* Not used
MouseGesturesController.prototype.bindCanvasEvent = function() {
    canvas.addEventListener('mousemove', gestureMouseMove, false);

    var gestureMouseMove = function(event) {
        var x, y;

        // Get the mouse position relative to the canvas element.
        if (event.layerX || event.layerX == 0) { // Firefox
          x = event.layerX;
          y = event.layerY;
        }

    };
};
*/

MouseGesturesController.prototype.setPageSpecificCSS = function() {
    if (window.location.href == 'https://forums.somethingawful.com/'
            || this.currentPageName == 'index') {
        this.disableGesture('up');
        this.disableGesture('left');
        this.disableGesture('right');
    }

    if (this.currentPageName == 'usercp'
            || this.currentPageName == 'bookmarkthreads') {
        //this.disableGesture('left');
        //this.disableGesture('right');
        if (this.settings.enableMouseUpUCP == 'true') {
            this.disableGesture('up');
        }
    }

    if (this.currentPage == 1) {
        this.disableGesture('left');
    }

    if (this.currentPage == this.pageCount) {
        this.disableGesture('right');
    }
};

MouseGesturesController.prototype.updateButtonStyles = function(x_coord, y_coord) {
    var gesture_top = jQuery('div#gesture-top');
    var gesture_bottom = jQuery('div#gesture-bottom');
    var gesture_left = jQuery('div#gesture-left');
    var gesture_right = jQuery('div#gesture-right');

    jQuery('img#top-image', gesture_top).first().attr('src', this.base_image_uri + 'gesturenav-top.png');
    jQuery('img#bottom-image', gesture_bottom).first().attr('src', this.base_image_uri + 'gesturenav-bottom.png');
    jQuery('img#left-image', gesture_left).first().attr('src', this.base_image_uri + 'gesturenav-left.png');
    jQuery('img#right-image', gesture_right).first().attr('src', this.base_image_uri + 'gesturenav-right.png');

    switch (this.determineLocation(x_coord, y_coord)) {
        case 'top':
            jQuery('img#top-image', gesture_top).first().attr('src', this.base_image_uri + 'gesturenav-top-press.png');
            break;
        case 'bottom':
            jQuery('img#bottom-image', gesture_bottom).first().attr('src', this.base_image_uri + 'gesturenav-bottom-press.png');
            break;
        case 'left':
            jQuery('img#left-image', gesture_left).first().attr('src', this.base_image_uri + 'gesturenav-left-press.png');
            break;
        case 'right':
            jQuery('img#right-image', gesture_right).first().attr('src', this.base_image_uri + 'gesturenav-right-press.png');
            break;
        default:
            break;
    }
};

MouseGesturesController.prototype.findFunction = function(x_coord, y_coord) {
    switch (this.determineLocation(x_coord, y_coord)) {
        case 'top':
            return this.topAction;
        case 'bottom':
            return this.bottomAction;
        case 'left':
            return this.leftAction;
        case 'right':
            return this.rightAction;
    }
};

MouseGesturesController.prototype.determineLocation = function(x_coord, y_coord) {
    var top_button = jQuery('div#gesture-top');
    var left_button = jQuery('div#gesture-left');
    var right_button = jQuery('div#gesture-right');
    var bottom_button = jQuery('div#gesture-bottom');

    // First find if it is in a valid X coordinate, then determine if
    // it is also in a valid Y coordinate

    if (y_coord > top_button.offset().top && y_coord < top_button.offset().top + 77) {
        if (x_coord > top_button.offset().left && x_coord < top_button.offset().left + 77) {
            return 'top';
        }
    } else if (x_coord > left_button.offset().left && x_coord < left_button.offset().left + 77) {
        if (y_coord > left_button.offset().top && y_coord < left_button.offset().top + 77) {
            return 'left';
        }
    } else if (x_coord > right_button.offset().left && x_coord < right_button.offset().left + 77) {
        if (y_coord > right_button.offset().top && y_coord < right_button.offset().top + 77) {
            return 'right';
        }
    } else if (y_coord > bottom_button.offset().top && y_coord < bottom_button.offset().top + 77) {
        if (x_coord > bottom_button.offset().left && x_coord < bottom_button.offset().left + 77) {
            return 'bottom';
        }
    }
};

MouseGesturesController.prototype.is_enabled = function(a_function) {
    for (var i = 0; i < this.disabled_gestures.length; i++) {
        if (this.disabled_gestures[i] == a_function) {
            return false;
        }
    }
    return true;
};

MouseGesturesController.prototype.topAction = function() {
    // If page is showthread.php, goto forumdisplay.php
    // If page is forumdisplay.php, goto forums.somethingawful.com
    // If page is forums.somethingawful.com, do nothing
    // If page is something else, just go to forum root
    // All if UCP option isn't enabled, else just go there
    if (this.is_enabled(this.topAction)) {
        if (this.settings.enableMouseUpUCP == 'true') {
            location.href ='https://forums.somethingawful.com/usercp.php';
        }
        else if (this.currentPageName == 'showthread'
            || this.currentPageName == 'usercp'
            || this.currentPageName == 'forumdisplay'
            || this.currentPageName =='bookmarkthreads')
        {
            var href = jQuery('span.mainbodytextlarge a').slice(-2, -1).attr('href');

            if (href == '/' || href === undefined) {
                href = '';
            }

            location.href = 'https://forums.somethingawful.com/' + href;
        }
        else {
            location.href = 'https://forums.somethingawful.com';
        }
    }
};

MouseGesturesController.prototype.rightAction = function() {
    if (this.is_enabled(this.rightAction)) {
        jumpToPage(nextPageUrl());
    }
};

MouseGesturesController.prototype.leftAction = function() {
    if (this.is_enabled(this.leftAction)) {
        jumpToPage(prevPageUrl());
    }
};

MouseGesturesController.prototype.bottomAction = function() {
    if (this.is_enabled(this.bottomAction)) {
        postMessage({'message': 'ReloadTab'});
    }
};

MouseGesturesController.prototype.disableGesture = function(gesture) {
    var button = false;

    switch(gesture) {
        case 'up':
            if (this.settings.enableMouseUpUCP == 'true' &&
                    (this.currentPageName != 'usercp' &&
                     this.currentPageName != 'bookmarkthreads')) {
                return;
            }
            button = jQuery('div#gesture-top');
            this.disabled_gestures.push(this.topAction);
            break;
        case 'left':
            button = jQuery('div#gesture-left');
            this.disabled_gestures.push(this.leftAction);
            break;
        case 'right':
            button = jQuery('div#gesture-right');
            this.disabled_gestures.push(this.rightAction);
            break;
        case 'bottom':
            button = jQuery('div#gesture-bottom');
            this.disabled_gestures.push(this.bottomAction);
            break;
    }

    button.css('opacity', '0.5');
};
