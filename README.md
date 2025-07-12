# Profile App

A React Native mobile application built with Expo.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device (for testing)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd profileapp
```

2. Install dependencies:
```bash
npm install
```

## Available Commands

### Development

Start the development server:
```bash
npm start
# or
expo start
```

Start for specific platforms:
```bash
# Android
npm run android
# or
expo start --android

# iOS
npm run ios
# or
expo start --ios

# Web
npm run web
# or
expo start --web
```

### Building

Build for production:
```bash
# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios

# Build for both platforms
eas build --platform all
```

### Publishing

Publish updates to Expo:
```bash
expo publish
```

## Project Structure

```
profileapp/
├── app/                 # Expo Router app directory
│   ├── _layout.js      # Root layout component
│   └── index.jsx       # Home screen
├── assets/             # Static assets
│   ├── images/         # Image files
│   ├── icon.png        # App icon
│   └── splash-icon.png # Splash screen
├── app.json           # Expo configuration
├── package.json       # Dependencies and scripts
└── eas.json          # EAS Build configuration
```

## Technologies Used

- **Expo**: ~53.0.13
- **React**: 19.0.0
- **React Native**: 0.79.4
- **Expo Router**: ~5.1.1
- **React Native Screens**: ~4.11.1
- **React Native Safe Area Context**: 5.4.0

## Development

This project uses Expo Router for navigation. The app structure is defined in the `app/` directory following the file-based routing convention.

## Testing

1. Install Expo Go on your mobile device
2. Run `npm start` to start the development server
3. Scan the QR code with Expo Go (Android) or Camera app (iOS)
4. The app will load on your device

## Building for Production

This project is configured with EAS Build. To build for production:

1. Install EAS CLI: `npm install -g @expo/eas-cli`
2. Login to your Expo account: `eas login`
3. Configure your build: `eas build:configure`
4. Build your app: `eas build --platform android` or `eas build --platform ios`

## Configuration

The app configuration is in `app.json` and includes:
- App name: "profileapp"
- Version: 1.0.0
- Bundle identifiers for iOS and Android
- Splash screen and icon configurations
- Expo Router plugin

## License

[Add your license information here] 