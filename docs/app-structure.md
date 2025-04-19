# Application Structure

This section outlines the core folder and file organization for the RideShare PWA.

```
RideShare/
├── public/            # Static files served as-is
│   ├── favicon.ico    # App icon (add your own)
│   ├── manifest.json  # Web app manifest for PWA
│   ├── sw.js          # Service worker for offline support
│   └── offline.html   # Offline fallback page
├── src/               # Application source code
│   ├── assets/        # Images, logos, icons
│   ├── firebase/      # Firebase initialization (firebase.js)
│   ├── components/    # Reusable React UI components
│   ├── pages/         # React page components (views)
│   ├── contexts/      # React Context providers (e.g., Auth)
│   ├── App.jsx        # Root component
│   ├── main.jsx       # Entry point (renders App, registers SW)
│   └── index.css      # Global styles
├── docs/              # Project documentation and guides
│   └── firebase-setup.md
│   └── app-structure.md
├── .env.example       # Example environment variables
├── package.json       # Project dependencies and scripts
├── vite.config.js     # Vite build configuration
└── README.md          # Project overview and setup instructions
```