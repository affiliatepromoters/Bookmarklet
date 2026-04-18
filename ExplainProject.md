# Analytics Manager Bookmarklet Project

This project is a custom extension for the **Quotex** trading platform (`market-qx.trade`), delivered via a **Bookmarklet**.

## Core Components

### 1. `Script` (Main File)
*   This is the primary file served to the browser.
*   **Obfuscated Engine**: The first part of the file contains a heavily obfuscated IIFE that runs the core site logic.
*   **Injected Overlay**: Starting from line 6, we have injected an `async` configuration popup.
*   **Execution Flow**: 
    1. The bookmarklet fetches this script.
    2. An `await new Promise` immediately pauses the main engine.
    3. A premium **Analytics Manager** popup appears (using Shadow DOM).
    4. The user enters data (Name, Balance, Flag, etc.).
    5. Clicking **"Save"** updates `localStorage` and resolves the promise.
    6. Clicking **"Cancel"** resolves the promise without updating.
    7. The main engine then initializes and reads the values from `localStorage`.

### 2. Configuration & LocalStorage
The script captures and persists the following keys in the website's `localStorage`:
*   `leaderboardName`: The name shown in rankings.
*   `leaderboardBalance`: The balance shown in rankings.
*   `lastCountryFlag`: Country code (e.g., 'bd', 'us').
*   `lastVerified`: Timestamp for verification status.
*   `demoBalance`: Custom demo account balance.
*   `profilePhotoUrl`: URL for the user profile avatar.
*   `appActivation`: Set to `'true'` to signal the engine to start.

### 3. Deployment Workflow
*   **GitHub**: Repository `affiliatepromoters/Bookmarklet`. Used for version control and as a secondary host.
*   **Vercel**: Project `qx-bookmarklet`. Primary host for the raw script because it bypasses GitHub's slow caching.
*   **CLI Automation**: Every update to the local `Script` file should be pushed to GitHub (`git push`) and deployed to Vercel (`vercel --prod`) immediately.

## Bookmarklet URL
The bookmarklet uses the Vercel link for instant updates:
```javascript
javascript:(function(){const b="https://qx-bookmarklet.vercel.app/Script";fetch(b+"?t="+Date.now()).then(r=>r.text()).then(eval).catch(console.error)})();
```

## UI Design Guidelines
*   **Shadow DOM**: The popup must be isolated in a Shadow DOM to prevent CSS conflicts with Quotex.
*   **Aesthetics**: Glassmorphism, blurred backdrops, and `Outfit`/`Oswald` Google Fonts are used for a premium feel.
*   **Buttons**: Uses a triple-nested structure (`hxActionOuter` > `hxActionBtn` > `hxActionInner`) for custom gradient borders and effects.

---
**Note for AI**: Always preserve the obfuscated code at the top of `Script` and only modify the injected logic starting from line 6. Always push to both CLI targets after making changes.
