# Mubeen Amir — Personal Portfolio (HTML, CSS & JavaScript)

## Run locally
1. Extract the ZIP.
2. Open `index.html` in a modern browser.
3. For a local development server, open the folder in VS Code and use Live Server, or run `python -m http.server 8000` in this folder and visit `http://localhost:8000`.

## Project structure
- `index.html` — page content and semantic structure
- `css/style.css` — layout, responsive styling, device mockups and visual design
- `js/main.js` — mobile navigation, scroll-linked device transforms, and email form
- `assets/images/profile.png` — Mubeen Amir profile image used in the hero section
- `assets/images/mobile-screen-1.png`, `mobile-screen-2.png`, `mobile-screen-3.png` — layered mobile screens that crossfade inside the animated phone before it expands into the website interface
- The expanded phone interface is a JavaScript-powered mini-site with interactive Home, Projects, and Contact views.
- On desktop, the phone unfolds into a proportioned landscape panel; on smaller screens it keeps the vertical phone presentation.
- `assets/images/design-reference.png` — generated visual direction reference
- `assets/images/desktop-screen.png` — desktop interface image used as a visual reference asset
- `assets/images/mobile-screen.png` — replaceable mobile PNG screen placeholder

## Important notes
- This project uses plain HTML, CSS and JavaScript. No React, frameworks, or animation libraries.
- The phone mockup is built with CSS and transforms into the interactive desktop interface while scrolling.
- The contact form currently opens the visitor's email application. It does not store or send messages to a server.
- Update GitHub and LinkedIn URLs before publishing.
- The desktop and mobile screen PNGs are self-contained portfolio preview screens shown inside the animated devices; replace them with final screenshots if the design changes.
- The generated `design-reference.png` is a visual reference, not the website itself.
