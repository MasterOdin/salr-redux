SALR Redux Changelog
==============================================

Listed below are the various bugfixes and enhancements that go into a given version. No idea what got changed/fixed between v0.8 and v1.5.5 so don't ask.

Changelog List
--------------
### v1.5.12 (5/1/2013)

- Fixed friend highlighting only working for first two friends in UserCP.php
- Fixed Post thread button disappearing on all pages if a missing setting got set in the past
- Separated out function calls between forumdisplay.php and showthread.php so aforementioned setting doesn't affect forum post button 

### v1.5.11 (4/22/2013) - "I really hate mouse gestures"

- Replaced right click option with alt key option
+ Alt key can be used to switch between mouse gestures or default 
context menu
+ Button button in Mouse Gestures now refreshes current page
- Mouse Gesture disables left/right on single page thread/forums properly
- Mouse Gesture overlay appears above images on forum

### v1.5.10 (4/15/2013)

- Fixed "Open Updated Threads" opening tabs twice
- Fixed right click menu being enabled even when the box wasn't ticked on initial installion of 1.5.9
- Moved "Pages per thread" to be a sub-setting of First/Last Three Pages
- Added ability to dump settings into a table of values for easy copy/paste.

### v1.5.9 (4/14/2013)

- Fixed Preview Reply pane being underneath images
+ Added option to allow default right click menu to appear when mouse gestures enabled
- Fixed Ignore Star option in settings pane (as well as prevent script breaking when it was set) 
- Fixed being able to change children settings when parent setting was disabled

### v1.5.8 (4/11/2013)

- Fixed Show First/Last three pages feature being broken (from forum update)
- Fixed friend post highlighting not working
+ Added setting to hide SALR Logo in thread view
- Fixed "Configure SALR" not appearing in bottom navigation bar
- Moved "Configure SALR" setting to Navigation Bar setting group
+ Added setting to show top/bottom navigation bar independently of the other bar
- Fixed "User CP" not disappearing in navigation bar if setting was false

### v1.5.7 (4/8/2013)

- Regression fixes (settings page and custom icons broke on change-over)
- Fix keyboard shortcut 'b' for Opening Updated Threads in Bookmark thread

### v1.5.6 - "Redux"

- Initial launch of Redux version, where MasterOdin takes over
- Pull Request [#50](https://github.com/scottferg/salr-chrome/issues/50 "#50"): Retina Image added
- Pull Request [#47](https://github.com/scottferg/salr-chrome/issues/47 "#47"): Single Page Blank for page-navigator fix

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
