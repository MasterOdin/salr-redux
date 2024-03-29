function PageNavigator(base_image_uri, settings) {
    this.base_image_uri = base_image_uri;

    if (settings) {
        this.settings = settings;
    }
    this.pageCount = countPages();

    // Determines if we are on a forum or a thread
    //this.rootPageType = (findCurrentPage() == 'forumdisplay.php') ? 'forumid' : 'threadid';
    // Either forum ID or thread ID, depending on which we are
    // currently viewing
    //this.basePageID = findForumID();
    // Current page
    this.currentPage = jQuery('option[selected="selected"]').val();
    if (this.currentPage == null) {
        this.currentPage = 1;
    } else {
        this.currentPage = Number(this.currentPage);
    }
    this.writeNavigatorHtml();
    this.selectPage(this.currentPage);
    this.bindButtonEvents();
}

PageNavigator.prototype.writeNavigatorHtml = function() {
    // store the fact we've shown it in #container, since it's the parent of the element I guess
    if (jQuery('#container').data('shownPageNav'))
        return true;
    jQuery('#container').data('shownPageNav', true);

    // If there is only a single page in the thread, or something
    // goes wrong, just quit out
    if (this.currentPage == 0) {
        return;
    }

    var html = '<nav id="page-nav"> ' +
                '   <div id="nav-body">' +
                '   <span id="first-page-buttons">' +
                '       <a class="nav-button" id="nav-first-page">' +
                '           <img src="' + this.base_image_uri + 'nav-firstpage.png" />' +
                '       </a>' +
                '       <a class="nav-button" id="nav-prev-page">' +
                '           <img src="' + this.base_image_uri + 'nav-prevpage.png" />' +
                '       </a>' +
                '   </span>' +
                '   <span id="page-drop-down">' +
                '       <select id="number-drop-down" name="page-number">';

    for (var i = 1; i < (this.pageCount + 1); i++) {
        html += '           <option value="' + i + '">' + i + '</option>';
    }

    html +=     '       </select>' +
                '   </span>' +
                '   <span id="last-page-buttons">' +
                '       <a class="nav-button" id="nav-next-page">' +
                '           <img src="' + this.base_image_uri + 'nav-nextpage.png" />' +
                '       </a>' +
                '       <a class="nav-button" id="nav-last-page">' +
                '           <img src="' + this.base_image_uri + 'nav-lastpage.png" />' +
                '       </a>';

    // Only add the last post button in threads
    if (findCurrentPage() === 'showthread') {
        html +=     '       <a class="nav-button" id="nav-last-post" >' +
                    '          <img src="' + this.base_image_uri + 'lastpost.png" />' +
                    '       </a>';
    }

    html +=     '   </span>' +
                '   </div>' +
               '</nav>';

    // Add the navigator to the DOM
    jQuery('#container').append(html);
};

PageNavigator.prototype.selectPage = function(page_number) {
    // Pre-select the current page
    jQuery('select#number-drop-down').val(page_number);
};

PageNavigator.prototype.bindButtonEvents = function() {
    var that = this;

    // Add event handlers for each button
    jQuery("select#number-drop-down").change(function () {
        jQuery("select option:selected").each(function () {
            jumpToPage(getPageUrl(jQuery(this).val()));
        });
    });

    // If we are on the first page, disable the first two buttons,
    // otherwise setup event handlers
    if (this.currentPage != 1) {
        jQuery('#nav-first-page').first().attr('href', getPageUrl(1));
        jQuery('#nav-prev-page').attr('href', prevPageUrl());
    } else {
        jQuery('#nav-first-page').css('opacity', '0.5');
        jQuery('#nav-prev-page').css('opacity', '0.5');
    }

    // If we are on the last page, disable the last two buttons,
    // otherwise setup event handlers
    if (this.currentPage != this.pageCount) {
        jQuery('#nav-last-page').first().attr('href', getPageUrl(that.pageCount));
        jQuery('#nav-next-page').first().attr('href', nextPageUrl());
    } else {
        jQuery('#nav-last-page').css('opacity', '0.5');
        jQuery('#nav-next-page').css('opacity', '0.5');
    }

    if (this.settings && this.settings.loadNewWithLastPost === "true") {
        // Load new posts with 'last post' button
        let newPostsButton = document.getElementById('nav-last-post');
        // Special handling for single post view
        if (window.location.href.indexOf('postid=') >= 0)
            newPostsButton.href = document.location.pathname + '?threadid=' + findThreadID() + '&goto=newpost';
        else
            newPostsButton.href = document.location.pathname + document.location.search + '&goto=newpost';
    } else {
        // Scroll to first unread post
        jQuery('#nav-last-post').click(function() {
            var post = jQuery('div#thread > table.post').eq(findFirstUnreadPost());

            jQuery(window).scrollTop(post.offset().top);
        });
    }
};

PageNavigator.prototype.display = function() {
    jQuery('nav#page-nav').addClass('displayed');
    $('html > head').append($('<style>div.jump_top.right { right: -100px; }</style>'));
};

PageNavigator.prototype.hide = function() {
    jQuery('nav#page-nav').removeClass('displayed');
};
