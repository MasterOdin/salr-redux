function PreviewParser(post_text, emote_list) {
    this.post_text = post_text;
    this.emote_list = emote_list;

    this.parseSmilies();
    this.parseBBCodes();
    this.parseQuotes();
    this.parseImages();
    this.parseFormatting();
    this.parseCodeblocks();
}

PreviewParser.prototype.fetchResult = function() {
    return this.post_text;
};

PreviewParser.prototype.parseSmilies = function() {
    for (var anEmote of this.emote_list) {
        var title = anEmote[0]; // emote text
        var img = anEmote[1]; // emote image
        var re;

        if (this.post_text.indexOf(title) != -1)
        {
            //faces have noses. come on.
            //if (title == ":)" || title == ":-)") { re = (title == ":-)") ? ":-)" : ":)"; }
            //else if (title == ":(" || title == ":-(") { re = (title == ":-(") ? ":-(" : ":("; }
            //else { re = new RegExp(title, 'g'); /* this is invalid if :( or :) is entered cause lol */ }
            title = title.replace(")", "\\)");
            title = title.replace("(", "\\(");
            title = title.replace("*", "\\*");
            title = title.replace("?", "\\?");
            re = new RegExp(title, 'g');
            this.post_text = this.post_text.replace(re, '<img src="' + img + '" title="' + title + '" border="0" alt="" />');
        }
    }
};

PreviewParser.prototype.parseBBCodes = function() {
    this.post_text = parseBBCode(this.post_text);
};

PreviewParser.prototype.parseQuotes = function() {
    var quote_re = /\[quote\="?(.*?)"(.*?)"?\](.*?)\[\/quote\]/g;
    var quote_format = '<div style="margin: 0px 6px;" class="bbc-block"><h4>$1 posted:</h4><blockquote>$3</blockquote></div>'

    this.post_text = this.post_text.replace(quote_re, quote_format);
};

PreviewParser.prototype.parseImages = function() {
    var image_re = /\[img\](.*?)\[\/img\]/g;
    var thumb_image_re = /\[timg\](.*?)\[\/timg\]/g;
    var attach_re = /src="attachment:(\d+)"/g;
    var image_format = '<img src="$1" />'
    var thumb_image_format = '<img class="timg loading" src="$1" />'
    var attach_format = 'src="https://forums.somethingawful.com/attachment.php?attachmentid=$1"';

    this.post_text = this.post_text.replace(image_re, image_format);
    this.post_text = this.post_text.replace(thumb_image_re, thumb_image_format);
    this.post_text = this.post_text.replace(attach_re, attach_format);
};

PreviewParser.prototype.parseFormatting = function() {
    var re = [
        /\[spoiler\](.*?)\[\/spoiler\]/g,
        /\[fixed\](.*?)\[\/fixed\]/g,
        /\[super\](.*?)\[\/super\]/g,
        /\[sub\](.*?)\[\/sub\]/g,
        /\[email\](.*?)\[\/email\]/g,
    ];

    var format = [
        '<span class="bbc-spoiler" onmouseover="this.style.color=\'#FFFFFF\';"' +
                                                 'onmouseout="this.style.color=this.style.backgroundColor=\'#000000\'"' +
                                                 'style="background-color: rgb(0, 0, 0); color: rgb(0, 0, 0);">$1</span>',
        '<tt class="bbc">$1</tt>',
        '<sup>$1</sup>',
        '<sub>$1</sub>',
        '<a href="mailto:$1">$1</a>',
    ];

    for (var index in re) {
        this.post_text = this.post_text.replace(re[index], format[index]);
    }
};

PreviewParser.prototype.parseCodeblocks = function() {
    var re = [
        /\[pre\](.*?)\[\/pre\]/g,
        /\[code\](.*?)\[\/code\]/g,
        /\[php\](.*?)\[\/php\]/g,
    ];

    var format = [
        '<div class="bbc-block pre"><h5>pre:</h5><pre>$1</pre></div>',
        '<div class="bbc-block code"><h5>code:</h5><code>$1</code></div>',
        '<div class="bbc-block php"><h5>php:</h5><code>$1</code></div>',
    ];

    for (var index in re) {
        this.post_text = this.post_text.replace(re[index], format[index]);
    }
};
