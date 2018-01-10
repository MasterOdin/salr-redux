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
