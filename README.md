# Profile App

A React Native mobile app built with Expo Router, featuring Local Authentication (biometrics / device credentials) and basic auth flow.

## Prerequisites

- Node.js 18+ (แนะนำ LTS)
- Android device/emulator หรือ iOS device/simulator
- Expo Go (ต้องรองรับ SDK 54)
- แนะนำใช้ตัวจัดการแพ็กเกจตัวเดียว (npm หรือ yarn) เพื่อหลีกเลี่ยงปัญหา lockfile ซ้ำซ้อน

## Installation

1) Clone repo และติดตั้ง dependency

```powershell
git clone <repository-url>
cd profile-app
npm install
```

2) เริ่มต้นพัฒนา

```powershell
npx expo start
```

สแกน QR ด้วย Expo Go (Android) หรือกล้อง (iOS) เพื่อเปิดแอป

## Local Authentication (Biometrics / PIN)

แอปรองรับการยืนยันตัวตนด้วย Expo Local Authentication (Face ID, Touch ID, Android biometrics หรือ PIN/Pattern ของเครื่อง) โดยมี flow ดังนี้:

1) เปิดแอป: ระบบจะให้ “ยืนยันตัวตนก่อน” เสมอ หากอุปกรณ์รองรับและมีการลงทะเบียนชีวมิติไว้
2) ปลดล็อกสำเร็จ: ถ้ายังไม่เข้าสู่ระบบ จะพาไปหน้า Login ปกติ
3) Login สำเร็จ: เข้าสู่หน้าหลักของแอป

เพิ่มเติมในหน้า About:
- มีตัวเลือก “Local Authentication” สำหรับควบคุมการ “ล็อกเมื่อส่งแอปไปพื้นหลัง” และปุ่ม “ทดสอบยืนยันตัวตน”
- หมายเหตุ: การยืนยันก่อนเข้าแอปจะเกิดขึ้นแม้ไม่เปิดสวิตช์ใน About (หากเครื่องรองรับและลงทะเบียนแล้ว)

ข้อควรทราบ:
- ต้องใช้อุปกรณ์จริงหรือ emulator/simulator ที่ “ลงทะเบียนชีวมิติ” แล้ว (ไม่งั้นอาจ fallback เป็น PIN/Pattern หรือ bypass ตามแพลตฟอร์ม)
- Web ยังไม่รองรับ Local Authentication ของ Expo
- หากไม่รองรับหรือไม่ได้ลงทะเบียน ระบบจะ bypass เพื่อไม่บล็อกผู้ใช้ และไปต่อหน้า Login ได้

แพ็กเกจหลักที่ใช้:
- expo-local-authentication
- expo-secure-store

## Available Commands

เริ่ม dev server:

```powershell
npm start
# หรือ
npx expo start
```

เปิดแพลตฟอร์มเฉพาะ:

```powershell
# Android
npm run android

# iOS (macOS เท่านั้น)
npm run ios

# Web (สำหรับ debug frontend ทั่วไป)
npm run web
```

## Building

ใช้ EAS Build:

```powershell
# Android
eas build --platform android

# iOS
eas build --platform ios

# ทั้งสองแพลตฟอร์ม
eas build --platform all
```

## Project Structure (ส่วนสำคัญ)

```
profile-app/
├─ app/
│  ├─ _layout.js           # Root layout + navigation guard
│  ├─ index.jsx            # หน้าแรก
│  ├─ about.jsx            # ตั้งค่า theme + Local Auth (ทดสอบ/เปิดปิด background lock)
│  ├─ locked.jsx           # หน้าปลดล็อกด้วย biometrics ก่อนเข้า Login
│  ├─ auth/
│  │  ├─ _layout.jsx
│  │  ├─ login.jsx
│  │  └─ register.jsx
│  ├─ books/ ...
│  └─ context/
│     ├─ AuthContext.js
│     ├─ LocalAuthContext.js
│     ├─ BooksContext.js
│     └─ ThemeContext.js
├─ assets/ ...
├─ app.json
├─ package.json
└─ eas.json
```

## Technologies / Versions

- Expo: 54.0.x
- React: 19.1.0
- React Native: 0.81.4
- Expo Router: 6.0.x
- expo-local-authentication: 17.0.x
- expo-secure-store: 15.0.x

## Troubleshooting

- Expo Go SDK mismatch
	- ถ้าเห็นข้อความ “Project is incompatible with this version of Expo Go (SDK 54 vs 53)” ให้แน่ใจว่าโปรเจ็กต์และ Expo Go อยู่ SDK เดียวกัน (โค้ดนี้อัปเป็น 54 แล้ว)

- มีทั้ง `yarn.lock` และ `package-lock.json`
	- ให้เลือกใช้เพียงตัวเดียว (แนะนำ npm ⇒ ลบ `yarn.lock`; ถ้าอยากใช้ yarn ⇒ ลบ `package-lock.json`)

- ไม่เห็น prompt ยืนยันตัวตน
	- ตรวจสอบว่าเครื่องตั้งค่าชีวมิติแล้ว และให้สิทธิ์การใช้งานเรียบร้อย

## Configuration

รายละเอียด config อยู่ใน `app.json` (icon, splash, bundle identifier, plugin ต่างๆ เช่น `expo-router`, `expo-secure-store`)

## License

[Add your license information here]


