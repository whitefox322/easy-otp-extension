# Easy OTP Extension

Chrome extension for generating TOTP 2FA codes from a stored secret token. Auto-copies generated code to clipboard.

## Features

- Store your 2FA secret token locally in Chrome storage
- Generate TOTP codes on demand
- Auto-copy generated code to clipboard
- Update or remove stored token any time

## Install

1. Requires [Node.js](https://nodejs.org/) >= 14
2. Clone repo
3. `npm install`

## Build

Development (with hot reload):
```
npm start
```

Production build:
```
NODE_ENV=production npm run build
```

Then load the `build/` folder as unpacked extension in Chrome:
1. Go to `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `build/` folder

## Usage

1. Open extension popup
2. Paste your 2FA secret token (base32) into input field
3. Click **Insert** to save it
4. Click **Generate** to get TOTP code — copies to clipboard automatically
5. Use **Update** to replace token or **Remove** to clear it

## Tech

- React 17
- Webpack 5
- [@levminer/speakeasy](https://github.com/levminer/speakeasy) for TOTP generation
- Chrome Storage API for token persistence

## License

MIT
