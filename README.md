# DevMastery Mobile (React Native + Expo)

DevMastery Android & iOS mobile application built with **React Native, TypeScript, and Expo**, configured for production release on the **Google Play Store**.

---

## 📱 Features

- **Google Authenticator 2FA Setup (`/register`):**
  - Generates TOTP base32 secret and dynamic SVG QR code using `react-native-qrcode-svg`.
  - Enables easy one-tap copy for manual entry.
  - Requires 6-digit TOTP verification to activate account.
- **Secure 2-Step Login (`/login`):**
  - Password verification followed by mandatory Google Authenticator TOTP prompt.
  - Stores JWT session token using `@react-native-async-storage/async-storage`.
- **Forgot Password Recovery (`/forgot-password`):**
  - Email/phone verification requiring 6-digit Authenticator code before sending reset email via AWS SES.
- **Multi-Tier Daily Streaks (`/home`):**
  - Easy Streak (Daily Chapter Reading)
  - Medium Streak (LeetCode & Algorithm Practice)
  - Advanced Streak (System Design & LLD)
  - Streak Freeze protection token.
- **46 Curated Developer Tracks:**
  - Searchable, category filtered (AI & LLM, Architecture, Backend, Algorithms, Distributed Systems).
  - Chapter & Topic reading with offline-first curriculum fallback.
- **Practice Coding Lab:**
  - Problem description, constraints, and algorithm templates with test runner.
- **Candidate Profile & Security Dashboard:**
  - Displays 2FA Google Authenticator active status and performance history.

---

## 🚀 Running the App Locally

### 1. Start Metro Bundler
```bash
cd mobile
npx expo start
```

### 2. Run on Physical Android Phone
1. Install **Expo Go** from Google Play Store on your phone.
2. Ensure your phone and PC are connected to the same Wi-Fi network.
3. Scan the QR code shown in your terminal with the Expo Go app.

### 3. Run on Android Emulator
```bash
npx expo run:android
# or press 'a' in the expo start terminal
```

---

## 📦 How to Build for Google Play Store (Production .AAB)

### Method 1: Using EAS Build (Recommended for Cloud Build - No Android Studio Needed)

1. Install EAS CLI globally:
```bash
npm install -g eas-cli
```

2. Login to your Expo account:
```bash
eas login
```

3. Build the Google Play Store App Bundle (`.aab`):
```bash
eas build --platform android --profile production
```
*This produces a Google Play Store-compliant `.aab` file ready to drag-and-drop into the Google Play Console.*

4. (Optional) Build standalone test `.apk` for instant testing on phone:
```bash
eas build --platform android --profile preview
```

---

### Method 2: Local Android Studio Build (`expo prebuild`)

If you have Android Studio & Android SDK installed locally:

```bash
# 1. Generate native android/ folder
npx expo prebuild --platform android

# 2. Build release AAB locally
cd android
./gradlew bundleRelease
```
The output `.aab` will be generated at:
`android/app/build/outputs/bundle/release/app-release.aab`

---

## 📋 Google Play Store Publishing Checklist

1. **Package Name**: Configured as `com.devmastery.learning` in `app.json`.
2. **Version Code**: Set to `1`, increment with every release.
3. **Permissions**: Minimum internet permissions (`INTERNET`, `ACCESS_NETWORK_STATE`).
4. **Icons & Splash**: Configured in `app.json` adaptive icon with `#ffffff` background.
5. **Google Play Console**: Create app in [Google Play Console](https://play.google.com/console), complete store listing, and upload your `.aab` file!
