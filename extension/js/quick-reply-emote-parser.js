function EmoteParser(observer) {
    this.emote_url = "https://forums.somethingawful.com/misc.php?action=showsmilies";
    this.observer = observer;
    this.emotes = {};
    this.emotesArray = [];
    this.expireTimeout = 1000 * 60 * 60 * 24; // One day

    this.construct();
}

EmoteParser.prototype.construct = function() {
    var expireTime = localStorage.lastExpireTime;

    if (expireTime === undefined || (Date.now() - expireTime > this.expireTimeout)) {
        var that = this;

        var contentFetch = ((content && content.fetch) ? content.fetch : fetch);
        contentFetch(this.emote_url, {
            method: "get",
            credentials: 'include'
        }).then(function(response) {
            return response.text();
        }).then(function(responseText) {
            that.parseResponse(responseText);
            that.observer.notify(that.emotes, that.emotesArray);
        });
    } else {
        this.loadFromLocalStorage();
        this.observer.notify(this.emotes, this.emotesArray);
    }
};

EmoteParser.prototype.parseResponse = function(response) {
    var that = this,
		index = 0;

    jQuery('li.smilie', response).each(function() {
        var emote = jQuery('div.text', this).first().html(),
			image = jQuery('img', this).first().attr('src'),
			title;

        //that.sortedEmotes['emote-'+emote] = {'emote': emote, 'image': image};

		//additional entries that, frankly, just make sense.
		if (emote == ":)")
		{
			title = 'emote-' + index;
			that.emotes[title] = {'emote': ':-)', 'image': image};
			index++;
		}

		if (emote == ":(")
		{
			title = 'emote-' + index;
			that.emotes[title] = {'emote': ':-(', 'image': image};
			index++;
		}

		title = 'emote-' + index;
        that.emotes[title] = {'emote': emote, 'image': image};

        index++;

        that.emotesArray.push([emote,image]);
    });

    // Don't bother continuing/saving if we found nothing.
    if (that.emotesArray.length === 0) {
        console.log("SALR Error: Couldn't find any emotes.");
        return;
    }

    this.emotesArray.sort(function(a,b) {
        return a[0].toLowerCase() > b[0].toLowerCase() ? 1 : -1;
    });

    this.emotesArray.splice(2,0,this.emotesArray.pop(),this.emotesArray.pop());

    this.saveInLocalStorage();
};

EmoteParser.prototype.saveInLocalStorage = function() {
  localStorage.emotes = JSON.stringify(this.emotes);
  localStorage.emotesArray = JSON.stringify(this.emotesArray);
  localStorage.lastExpireTime = Date.now();
};

EmoteParser.prototype.loadFromLocalStorage = function() {
  this.emotes = JSON.parse(localStorage.emotes);
  this.emotesArray = JSON.parse(localStorage.emotesArray);
};

EmoteParser.prototype.getEmotes = function() {
    return this.emotes;
};

EmoteParser.prototype.getSortedEmotes = function() {
    return this.emotesArray;
};
