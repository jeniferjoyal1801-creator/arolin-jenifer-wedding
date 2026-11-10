# Arolin & Jenifer wedding invitation

This is a mobile-first static website. Open `index.html` in a browser to preview it, or upload this complete `Arolin Jenifer marriage` folder to a static web host. Keep the `assets` folder beside the HTML, CSS, and JavaScript files.

## Edit the invitation

Open `script.js` and edit the `WEDDING` settings at the top:

- `groom` and `bride`: full names (the design displays the first names prominently)
- `date`: wedding date in `YYYY-MM-DD` format
- `startTime` and `endTime`: 24-hour times, such as `15:00` and `16:00`
- `venue`: ceremony venue and town
- `groomParents` and `brideParents`: parents' names
- `weddingMapUrl` and `receptionMapUrl`: separate directions links
- `timezoneOffset`: the local wedding-time offset (`+05:30` for India)

The invitation cover uses your supplied couple photo at `assets/couple.jpg`. The venue card uses your supplied CSI Church in Aralvaimozhi photo at `assets/aralvaimozhi-church.jpg`. The closing image uses the chair photo at `assets/church-seats.jpg`.

The countdown is anchored to the wedding's India time, so guests in other time zones see the same moment counted down. Replace files in `assets` and keep the same filenames, or update their paths in `index.html` or `style.css`. The site tries to start the background music on load and again when guests tap to open the invitation. Some Android and iPhone browsers block sound until a gesture; the music button remains available if that happens.

## WhatsApp preview

The page includes Open Graph title, description, and preview image metadata. After publishing, set `og:image` in `index.html` to the full public HTTPS URL of `assets/couple.jpg` so WhatsApp can fetch the preview image. The site itself must be publicly reachable over HTTPS for link previews to work.

