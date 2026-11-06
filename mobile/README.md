# HealthyLife Mobile

Aplikasi mobile HealthyLife (Expo SDK 58, expo-router).

```bash
cp .env.example .env    # isi EXPO_PUBLIC_API_URL dengan IP laptop, contoh http://192.168.1.10:5000/api/v1
npm install
npx expo start
```

HP dan laptop harus satu Wi-Fi. Untuk build APK: `npx eas-cli@latest build -p android --profile preview`
(ganti `EXPO_PUBLIC_API_URL` ke URL Railway dulu).
