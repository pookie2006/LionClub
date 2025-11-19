# LionClub: Columbia University's Hub for Student Organizations

LionClub is a web application that showcases student organizations at Columbia University, allowing users to browse clubs, view descriptions, and check out their most recent events/posts.

---

## Features

- Browse Columbia University student organizations in a grid layout.
- View club descriptions, profile pictures, and links to Linktree or social media.
- Click to open a modal for more details, including the latest Instagram post.
- Search bar to filter clubs by name dynamically.

---

LionClub/
│
├── backend/
│   ├── node_modules/          # Backend dependencies
│   ├── profileimgs/           # Club profile images
│   ├── package.json           # Backend package metadata
│   ├── package-lock.json
│   └── server.js              # Express backend server
│
└── frontend/
    ├── calendar.css
    ├── calendar.html
    ├── calendar.js
    ├── calevents.json         # Calendar event data
    │
    ├── clubs.html
    ├── clubs.js
    │
    ├── LionClub.css
    ├── LionClub.html          # Main landing page
    │
    ├── students.html
    ├── clubs.json             # Club data
    └── package-lock.json      # If frontend uses npm

