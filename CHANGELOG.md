SALR Redux Changelog
==============================================

Listed below are the various bugfixes and enhancements that go into a given version. No idea what got changed/fixed between v0.8 and v1.5.5 so don't ask.

General format before v2.0.0 and after 1.5.5 is that - is change/remove and + is addition.   
After 2.0.0 is that * is a change, - is a removal and + is an addition.  
  
Developer only seen features (such as internal functions) may or may not be recorded in the changelog.

Changelog List 
--------------
### <a name="2186"></a>v2.1.8.6 (01/20/2016)
```
* Fix: Get SALR working with https scheme
```
### <a name="2185"></a>v2.1.8.5 (12/30/2015)
```
* Fix: Do not trigger keyboard shortcuts in Quick Reply for AltGR
```
### <a name="2184"></a>v2.1.8.4 (06/03/2015)
```
* Fix: Improve pasting in quick reply functionality (ctrl+z works better and focuses on cursor if large posts)
* Add: Embed gifv and gyfcat formats (all tied to webm embedding setting)
* Fix: Mouse overlay was positioned wrong on versions of Chrome
```
### <a name="2183"></a>v2.1.8.3 (03/14/2015)
```
* Fix an embedded vines false positive
```
### <a name="2182"></a>v2.1.8.2 (02/16/2015)
```
* Fix: Some threads not getting custom highlighting
* Fix: Quick Thread Search endpoint
```
### <a name="2181"></a>v2.1.8.1 (01/24/2015)
```
* Fix: Quicksearch endpoint
```
### <a name="218"></a>v2.1.8 (01/16/2015)
```
+ Add: display-image-on-hover feature
+ Add: NWS/Spoiler settings to tweets/vines/webm/gfycat
* Fix: remove new search link
* Fix: Have search box in thread use new search page
```
### <a name="217"></a>v2.1.7 (01/01/2015)
```
+ Add title to the Single Post Link
+ Add ability to expand breadcrumbs on showthread and forumdisplay
+ Add setting to view Mod Bar (beneath top breadcrumbs) in forumdisplay
+ Add "Open unread Threads" button to forumdisplay view
+ Added ability to backup/restore SALR settings as a JSON string
+ Add 'Hide "Garbage Dick" Avatar' setting
* Fix CSS for two additional custom user icons when platinum grenade is turned off
* Fix CSS on numbers in forum/usercp view expanding/changing location of other numbers when you hover over them
* Fix username highlighting to preserve case on replaced text if search is case insensitive
* Modify setting string for Quote highlighting (SA does this by in yellow by default now)
* Fix SA quote highlighting overriding the user set option of SALR
- Remove SALR youtube fullscreen fix (SA finally did it)
```
### <a name="2166"></a>v2.1.6.6 (10/10/2014)
```
* Fix impzoneik icon from being messed up when removing platinum icon
* Fix #lastpost not actually going to the lastpost on a page
```
### <a name="2165"></a>v2.1.6.5 (10/05/2014)
```
* Fix "Adjust window position" setting not affecting anything
```
### <a name="2164"></a>v2.1.6.4 (09/09/2014)
```
* Limit the pages that u hotkey will work on (so not newreply.php for example)
```
### <a name="2163"></a>v2.1.6.3 (09/03/2014)
```
+ Add a hotkey to go to UserCP (u)
* Fix regression in Live Preview checkbox setting for Quick Reply not working properly
* Make SOAP link always appear before "Edit Note" button, regardless of Sync settings.
```
### v2.1.6.2 (09/01/2014)
```
* Fix regression in User Notes sync
```
### v2.1.6.1 (08/29/2014)
```
+ Add setting to fix UserCP font changes
```
### v2.1.6 (08/23/2014)
```
+ Added in option to hide SA Grenade on Platinum Users (thanks nskillen)
* AdjustAfterLoad now also works on #lastpost in URL as well as going to specific post
```
### v2.1.5 (07/16/2014)
```
+ Pasting of youtube links into Quick Reply auto-formats them into [video] tags
+ Bring back AdjustLoad setting with allowing for user scroll disable of it
* Add delay to AdjustLoad to better avoid user-scrolling
* Fix Quick Reply sometimes not working due to incorrect post key
```
### v2.1.4 (05/30/2014)
```
+ Allow imgur/twitter api permissions be optional (active only when related setting is on)
+ Add setting for autoplaying webm/gifycat links
* Fix SALR crashing if someone linked the twitter blog and embed tweets option is enabled
* Improved catching more types of twitter links (http in addition to https)
```
### v2.1.3 (05/11/2014)
```
+ Allow tweet links to show up inline
+ Allow vine links to show up inline
+ Allow webm (gfycat) links to show up inline
+ Allow ability to clear user notes
* Fix embed youtube videos not having fullscreen button
* Have all inline videos from links use HTML5 player (no more flash)
* Fix "Jump to another forum" appearing in Omnibar (and Chrome Button extension) jump list
* Improve first usage of "Quick Reply" if user had just installed SALR and hadn't visited "newreply.php" yet
```
### v2.1.2 (04/14/2014)
```
* Fix SALR crash when using Post Cout Highlighting on forum page with global announcement
* Fix logic on image resizing
```
### v2.1.1 (04/03/2014)
```
+ Add page navigator to usercp/bookmarkthreads.php if more than two pages of bookmarks (will only show if more than one page)
+ Add mouse gestures for usercp/bookmarkthreads if more than one page
* Fix for user notes breaking SALR when you ignore a user
* Re-anchor window when adjusting anything that changes window size (quotes, images, etc.)
* Fix bug with single post button setting
* Fix horrible slowdown associated with friends highlighting
```
### v2.1.0 (03/11/2014)
```
+ Allow for use of localStorage (instead of Chrome.storage.sync) for User Notes
+ Reintroduced indicator for threads posted in
+ Allowed users to specify maximum dimensions when restricting image size
+ Add setting to remove report button on own posts
+ Add image tooltip popup for filename (credit to nskillen)
* Fixed right "Top" button not being on any page, not just when page navigator was visible.
* Fix imgur links to larger sizes of imgur images posted on the forums being broken
* Force image settings to only start acting once entire window is loaded, instead of potentially only some of the window
```
### v2.0.10 (12/25/2013)
```
+ Added function to use for settings dump in settings-handler.js
+ Added support for youtube playlist links in inline player
* Change settings dump to be easier to paste into javascript code
* Fixed clicking on "Configure SALR" at the bottom of a page taking you to the top
* Fixed shortened youtube links (youtu.be) and https lead links not behaving correctly
* Added css element to page navigator to prevent it blinking while scrolling for some users
* Make removing the "top" button only truly disappear when the page navigator will be used on that page
```
### v2.0.9 (12/24/2013)
```
* Made username highlighting more robust to prevent empty username inputs
```
### v2.0.8 (12/24/2013)
```
+ Added option to change youtube videos from iframe to embeded to fix weird artifact issue
```
### v2.0.7 (11/19/2013)
```
* Fixed user note selector being confused if there was a "userid=###" link in a post
```
### v2.0.6 (10/07/2013)
```
* User Note Sync added (User Notes are now synced between computers using chrome sync)
* Increased speed of friend highlighting
* Modified how Case Insensitive handles usernames
```
### v2.0.5 (09/25/2013)
```
* (Mod) Fixed topic edit button not working
* Fixed hotkey-manager from printing out any non-hotkey keycode when it's active.
* Improved remembering the status of the "alt" key for mouse gestures better. It should remember the state properly across tabs.
```
### v2.0.4 (07/31/2013)
```
* Fixed some smilies being converted to links when ImageToLink was selected. All four smiley URLs should be parsed properly.
```
### v2.0.3 (07/27/2013)
```
* Fixed checkbox on Bookmark Threads being unchecked if editing a post and having the option being enabled.
```
### v2.0.2 (07/25/2013)
```
+ Add ability to by default check any/all checkboxes in quick reply window
+ Setting sections now minimize automatically if selecting a different area
* Update Quick Reply size logic to work better on various monitor resolutions
* Fix Mouse Gestures bottom button location. Should prevent random page refreshes from occuring (esp. on two-finger scroll on Macs)
* Fixed mouse gestures breaking when display first and last three pages option was selected
* Fixed some smilies being converted to links when ImageToLink was selected
```
### v2.0.1 (07/15/2013)
```
- Actually remove the thread yellow count highlight option
* Fix jQuery error on not parsing smilies when using ImageToLink option
```
### v2.0.0 (07/15/2013)
```
+ Alphabetized smiley list in Quick Reply window. Added setting to enable this.
+ Added little help question mark next to settings to explain what they do or if they require some option change
+ Add way to not show the link to single post view underneath every post
+ Add ability to minimize/maximize setting sections as needed. By default, all sections are minimized.
+ Using alt key on changing from mouse gestures to context menu holds setting between pages
+ Added Accidental Quote, Not Edit warning to the Quick Relpy box enabled by the existing option at bottom of settings.html 
+ Added ability to select several star colors to not open on the "Open all unread messages" option.
+ Added option to show a link to a user's SOAP underneath their post next to the button for Rap Sheet
+ Added ability for extension to know if SALR Redux Browser Button is installed, and disable Omnibar icon (and setting) is it is.
+ Added option to have username be highlighted regardless of case as it's currently always case-sensitive.
+ Added options to only enable the "Display threads with new posts first" and "Show Last Three Pages" options in certain parts of SA
+ Added slight padding to the thread titles when "Display new post counts inline" enabled to prevent thread title from overlaping
+ Add explanation to what the hotkeys are attached to "Enable keyboard navigation"
+ Add F/L hotkeys that take user to first and last post respectively
+ Added ability to change between going up a forum layer or going to UCP on mouse gesture "Up" button
* Updated jQuery to v1.10.1.
* Updated jQuery-ui to a custom v1.10.3 version. Adds 'ui-salr' to an instance of ui-icon to ignore forum css
* Updated js/settings-handler.js to use .prop() instead of .attr() as appropriate
* Updated quick-reply.js to use delegated on handler for emote/bbcode insertion instead of live()
* Renamed "Display quotes in boxes" to "Display quotes in simpler style"
* Renamed "Hide SALR Logo" to "Hide SALR Logo in top thread bar"
* Move color picker for inline youtube videos over next to the text input box
* Updated Page-Navigator selector for lastseen icon
* Reduced threshold to collapse long quote from 400 to 150. This is ~113 words words on a 1280x1024 monitor.
* Moved all settings over slightly on the options page (~10px)
* Made it so clicking on logo on settings page takes user to settings dump page (as this was default behavior at one point?)
* Moved "SALR Bar" up a few pixels in thread view
* Updated admin/mod stars in setting view
* Made pageCount util.js routine a bit more robust for parts of the forum that don't always show pages (ie. Privage Messages)
* Fixed Omnibar icon for quick forum jumping.
* Moved "Show Last Three Pages" option into the "Forums Display Options" section
* Update and simplify smiley emotion regex for live preview (taken from scottferg#45)
* Fix console error when hitting "reply" button in a thread when using quick reply
* Fix buttons (such as live preview and smiley) for showing top/side bar in quick reply being broken if closing quick reply with them still open
* Fix hotkeys being active in the thread while editing user notes
* Fix forward/back a page hotkeys being broken when using the "Show Three Pages" option
* Move Thread Notes button over ~30px so that the "Top" button doesn't overlap it
* Fixed all iFrames showing same youtube video when shown inline
* Fix quotes in "Live Preview" looking bad (having plaintext post id stuff)
* Fix smilies with symbols (ex: :?:) being broken in live preview. They should be parsed correctly now.
- Renamed a couple options (ex: User Avatar settings) to be clearer on their intent
- Removed "Hide top menu" setting as it didn't do anything
- Removed second "Automatically collapse long quotes" setting
- Removed Imgur sidebar till such a time as it works again
- Removed broken 'Highlight thread counts in yellow if you've posted there before' till it's fixed
- Removed "Adjust window position after threads load" as this is a forum option
- Removed "Fix thumbnailed images" as these got fixed on SA a while ago
```
### v1.5.18 (06/26/2013)
```
+ Add Thread Notes as something to port from original SALR to Redux
```
### v1.5.17 (06/26/2013)
```
+ Added ability to port over User Notes from original SALR to Redux.
```
### v1.5.16 (06/12/2013)
```
- Fixed custom thread coloring not being removed when "x" is hit on thread
- Removed friendList from settings dump page
+ Added new setting "Don't convert links containing images" for "Convert links into inline images"
+ Added new setting "If image was linked, put link after image link" for "Images-to-Links"
```
### v1.5.15 (06/11/2013)
```
- Changed "Convert links into inline images" to ignore when the link is of a picture (eg. [url=test.jpg][img]test.jpg[/img][/url])
- Removed ForumPostKey from settings dump page
- Fixed regression in "Use custom thread highlighting" checkbox toggle for thread examples above not leaving custom highlighting
```
### v1.5.14 (05/18/2013)
```
- Fixed "Convert links into inline images" to properly deal with links that have ".(jp?eg|png|gif|bmp).html" in them (they made broken images)
```
### v1.5.13 (05/02/2013)
```
+ Added defaults for all settings
- Fixed style being for old forum layout on settings.html (most noticable in the quote box)
- Fixed coloring on settings.html for thread highlighting
- Fixed star column not being colored appropriately when using thread highlighting
```
### v1.5.12 (05/01/2013)
```
- Fixed friend highlighting only working for first two friends in UserCP.php
- Fixed Post thread button disappearing on all pages if a missing setting got set in the past
- Separated out function calls between forumdisplay.php and showthread.php so aforementioned setting doesn't affect forum post button 
```
### v1.5.11 (04/22/2013) - "I really hate mouse gestures"
```
- Replaced right click option with alt key option
+ Alt key can be used to switch between mouse gestures or default 
context menu
+ Button button in Mouse Gestures now refreshes current page
- Mouse Gesture disables left/right on single page thread/forums properly
- Mouse Gesture overlay appears above images on forum
```
### v1.5.10 (04/15/2013)
```
- Fixed "Open Updated Threads" opening tabs twice
- Fixed right click menu being enabled even when the box wasn't ticked on initial installion of 1.5.9
- Moved "Pages per thread" to be a sub-setting of First/Last Three Pages
- Added ability to dump settings into a table of values for easy copy/paste.
```
### v1.5.9 (04/14/2013)
```
- Fixed Preview Reply pane being underneath images
+ Added option to allow default right click menu to appear when mouse gestures enabled
- Fixed Ignore Star option in settings pane (as well as prevent script breaking when it was set) 
- Fixed being able to change children settings when parent setting was disabled
```
### v1.5.8 (04/11/2013)
```
- Fixed Show First/Last three pages feature being broken (from forum update)
- Fixed friend post highlighting not working
+ Added setting to hide SALR Logo in thread view
- Fixed "Configure SALR" not appearing in bottom navigation bar
- Moved "Configure SALR" setting to Navigation Bar setting group
+ Added setting to show top/bottom navigation bar independently of the other bar
- Fixed "User CP" not disappearing in navigation bar if setting was false
```
### v1.5.7 (04/08/2013)
```
- Regression fixes (settings page and custom icons broke on change-over)
- Fix keyboard shortcut 'b' for Opening Updated Threads in Bookmark thread
```
### v1.5.6 - "Redux"
```
- Initial launch of Redux version, where MasterOdin takes over
- Pull Request [#50](https://github.com/scottferg/salr-chrome/issues/50 "#50"): Retina Image added
- Pull Request [#47](https://github.com/scottferg/salr-chrome/issues/47 "#47"): Single Page Blank for page-navigator fix
```
### v0.8.0 - "Home stretch"

- Add mouse gestures (Scott Ferguson)
- Add keyboard shortcuts (Scott Ferguson)
- Fix possible form value issue in quick reply (Scott Ferguson)
- Add drop shadows to quick reply text (Scott Ferguson)

### v0.7.1 - "Fix ahoy"

- Apply BBcodes to highlighted text (Scott Ferguson)
- Add more qote parsers (Scott Ferguson)

### v0.7.0.1 - "Hotfix"
- Fix alignment of quick reply sidebar when resizing window (Scott Ferguson)

### v0.7.0 - "Hardcore Quick Reply"
- Add sidebar options for quick reply (Scott Ferguson)
- Fix breaklines when quoting in quick reply (Scott Ferguson)

### v0.6.5 - "Features ahoy"
- Add animations to quick reply box (Richard Hodgson)
- Create custom window control buttons for quick reply box (Richard Hodgson)
- A little HTML5 love for the settings page (Scott Ferguson)
- Don't bookmark a thread by default in the quick reply box (Scott Ferguson)
- Track quick reply visibility state in a more sane manner (Scott Ferguson)
- Don't erase a message draft when adding additional quotes (Scott Ferguson)
- Bind 'R' key to quick reply box (Scott Ferguson)
- Clear the message draft if the box is closed (Scott Ferguson)

### v0.6.1 - "Program it bitches"
- Add experimental quick reply box

### v0.6 - "Now we're cooking with gas"
- Add option to highlight usernames within posts (Scott Ferguson)
- Tweak manifest for when to run the content script (Scott Ferguson)
- Upgrade to latest jQuery (Scott Ferguson)
- Allow for SALR Browser Button extension to query (Scott Ferguson)

### v0.5.2 - "Fatty"

- Fix typo in settings name for OP highlighting color (Scott Ferguson)

### v0.5.2 - "Hotty"

- Fix crash when friend highlighting is enabled for a user with no friends
(Scott Ferguson)

### v0.5.1 - "Quicky"

- Fix bug where mod username highlighting broke mod post highlighting (Scott
Ferguson)
- Fix bug where usernotes was referenced with the wrong name (Scott Ferguson)

### v0.5 - "<Insert name here>"

- Cleanup how the ban history link is shown (Sebastian Paaske Tørholm)
- Add user notes (Sebastian Paaske Tørholm)
- Add custom boxing of quotes (Sebastian Paaske Tørholm)
- Make personal quote highlighting optional (Sebastian Paaske Tørholm)
- Allow highlighting of mod/admin usernames (Scott Ferguson)
- Cleanup new settings API (Scott Ferguson)

### v0.4.8 - "I'm drunk"

- Allow enabling/disabling of page navigator (Scott Ferguson)
- Experimental fix for page navigator drop-shadow ghosting (Scott Ferguson)
- Add feature to open all updated threads (Scott Ferguson)

### v0.4.7 - "Cruise Control"

- Fix navigator bug when resizing window (Sebastian Paaske Tørholm)
- Code cleanup and optimizations (Sebastian Paaske Tørholm)
- Highlight posts by friends (Sebastian Paaske Tørholm)
- Highlight posts by moderators/administrators (Sebastian Paaske Tørholm)

### v0.4.6 - "Whoops, buggy"

- Enable OP post highlighting (Sebastian Paaske Tørholm)
- Use Chrome options API for settings menu (Bill Best)
- Fix missing option parameter for custom buttons (Scott Ferguson)

### v0.4.5 - "Fine, here's the jump list"

- Add forums jump list (Sebastian Paaske Tørholm, Scott Ferguson)
- Fix possible error when using inline post counts (Scott Ferguson)

### v0.4.1 - "CM mod"

- Fix default setting for custom jump buttons (Scott Ferguson)
- Fix highlighting bug for custom jump buttons (Scott Ferguson)

### v0.4 - "Holy shit an update"

- Add option to highlight friend's posts (Sebastian Paaske Tørholm)
- Add option to display new post counts inline (Scott Ferguson)
- Add option to disable custom jump buttons (Scott Ferguson)
- Fix bug to show navigator over scrollbar (Scott Ferguson)

### v0.3.3 - "Milestones are for little girls"

- Don't display navigator if thread has one page (Scott Ferguson)
- Show 'Configure SALR' link by default (Scott Ferguson)
- Add 'Ban History' link (Scott Ferguson)

### v0.3.2 - "Fat lady"

- Dramatically reduced CRX size (Scott Ferguson)

### v0.3.1 - "Whoops, forgot to fix that"

- Fix page navigator offset when resizing window (Scott Ferguson)
- Add drop shadows to page navigator (Scott Ferguson)
- Add rounded corners to page navigator (Scott Ferguson)

### v0.3 - "Page navigator motherfucker!"

- Add page navigator (Scott Ferguson)
- Add 'Configure SALR' link (Bill Best)
- Styling tweaks in settings UI (Scott Ferguson)
- Bugfixes

### v0.2 - "Where did all this code come from?"

- Add option for embedding inline Youtube videos (Jono Taberner)
- Fix the jQuery colorpicker widget (Jono Taberner)
- Display images as inline links (Bill Best)
- Display images from inline links (Bill Best)
- Hide NWS/NMS images (Bill Best)
- Set default highlighting preferences (Scott Ferguson)
- Added update manifest (Scott Ferguson)

### v0.1 - "Initial release"

- Basic username highlighting (Scott Ferguson)
- Basic thread highlighting (Scott Ferguson)
- Hide/display header and footer ads (Scott Ferguson)
- Settings panel (Scott Ferguson)
