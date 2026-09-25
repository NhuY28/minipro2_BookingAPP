# Study Room Booking

Ứng dụng mobile hỗ trợ sinh viên tìm kiếm và đặt phòng học/phòng máy trong khuôn viên trường theo thời gian thực.

## 1. Technology Stack

- **React Native + Expo**
- **TypeScript**
- **Firebase Authentication**
  - Email/Password
- **Firebase Realtime Database**
- **Cloudinary** – lưu trữ và quản lý hình ảnh
- **Zustand** – quản lý state
- **React Navigation** – điều hướng ứng dụng
- **AsyncStorage** – lưu trạng thái đăng nhập cục bộ
- **Android Emulator / Android Device**

---

# 2. Requirements

Trước khi chạy project, cần cài đặt:

### Node.js

Kiểm tra:

```powershell
node -v
npm -v
```

### Expo

Project sử dụng Expo.

Kiểm tra:

```powershell
npx expo --version
```

### Android Studio

Cần Android Studio để:

- Android SDK
- Android Emulator
- Android SDK Platform Tools

Kiểm tra ADB:

```powershell
adb devices
```

Nếu emulator đang chạy, kết quả có dạng:

```text
List of devices attached
emulator-5554    device
```

### Java JDK

Project Android sử dụng JDK.

Kiểm tra:

```powershell
java -version
```

Kiểm tra:

```powershell
echo $env:JAVA_HOME
```

Ví dụ:

```text
C:\Users\ADMIN\.jdks\jbr-21.0.11
```

---

# 3. Clone Project

Clone repository:

```powershell
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Di chuyển vào project:

```powershell
cd Study-Room-Booking
```

Kiểm tra:

```powershell
dir
```

Cần thấy các file/thư mục chính:

```text
assets
src
android
app.json
App.tsx
package.json
package-lock.json
tsconfig.json
```

---

# 4. Install Dependencies

Trong thư mục project:

```powershell
npm install
```

Sau khi cài đặt xong, kiểm tra:

```powershell
npm list --depth=0
```

Project sử dụng các package chính:

- `expo`
- `react`
- `react-native`
- `firebase`
- `zustand`
- `@react-navigation/native`
- `@react-navigation/native-stack`
- `@react-navigation/bottom-tabs`
- `@react-native-async-storage/async-storage`

---

# 5. Firebase Setup

Project sử dụng Firebase cho:

1. Authentication
2. Realtime Database

Firebase project:

```text
study-room-booking-a9fc9
```

---

## 5.1 Firebase Authentication

Mở:

**Firebase Console → Authentication → Sign-in method**

Bật:

```text
Email/Password
```

Ứng dụng sử dụng:

- Register bằng email/password
- Login bằng email/password
- Logout

Không sử dụng Google Authentication hoặc Facebook Authentication trong phiên bản này.

---

# 6. Firebase Realtime Database

Mở:

**Firebase Console → Realtime Database**

Database structure:

```text
/
├── rooms
│   ├── room_001
│   ├── room_002
│   ├── ...
│   └── room_100
│
├── users
│   ├── <firebase-user-uid>
│   └── ...
│
└── bookings
    ├── booking_001
    ├── booking_002
    └── ...
```

### Room structure

Ví dụ:

```json
{
  "room_001": {
    "roomName": "Room 101",
    "location": "Building A",
    "capacity": 4,
    "type": "study_room",
    "status": "available",
    "imageUrl": "https://..."
  }
}
```

### User structure

User được liên kết với Firebase Authentication UID:

```json
{
  "<firebase-user-uid>": {
    "name": "Student Name",
    "email": "student@example.com",
    "avatarUrl": "https://..."
  }
}
```

### Booking structure

```json
{
  "booking_001": {
    "userId": "<firebase-user-uid>",
    "roomId": "room_001",
    "date": "2026-09-25",
    "startTime": "09:00",
    "endTime": "10:00",
    "status": "confirmed"
  }
}
```

---

# 7. Firebase Configuration

File:

```text
src/services/firebase.js
```

Cấu hình Firebase:

```javascript
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";

import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "study-room-booking-a9fc9.firebaseapp.com",
  projectId: "study-room-booking-a9fc9",
  storageBucket: "study-room-booking-a9fc9.firebasestorage.app",
  messagingSenderId: "417051803462",
  appId: "YOUR_FIREBASE_APP_ID",
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
```

> Không commit secret/API configuration nhạy cảm vào repository nếu project được sử dụng trong môi trường production. Với Firebase client configuration, nên áp dụng Firebase Security Rules để bảo vệ dữ liệu.

---

# 8. Cloudinary Setup

Cloudinary được sử dụng để lưu trữ hình ảnh của:

- Study rooms
- User avatars

Thông tin Cloudinary được cấu hình trong project theo environment variables hoặc service configuration.

Ví dụ:

```text
Cloudinary
├── Room images
└── User avatar images
```

Khi upload ảnh thành công, ứng dụng lưu URL của ảnh vào Firebase Realtime Database.

Ví dụ:

```json
{
  "imageUrl": "https://res.cloudinary.com/..."
}
```

hoặc:

```json
{
  "avatarUrl": "https://res.cloudinary.com/..."
}
```

---

# 9. Android Configuration

Nếu project đã có thư mục Android:

```text
android/
```

có thể chạy native Android build.

Kiểm tra Android SDK:

```powershell
echo $env:ANDROID_HOME
```

Ví dụ:

```text
C:\Users\ADMIN\AppData\Local\Android\Sdk
```

Có thể thiết lập trong PowerShell:

```powershell
$env:ANDROID_HOME="C:\Users\ADMIN\AppData\Local\Android\Sdk"
$env:ANDROID_SDK_ROOT="C:\Users\ADMIN\AppData\Local\Android\Sdk"
$env:Path="$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator;$env:Path"
```

---

# 10. Run the Application

## Option 1 — Expo Development Server

Trong thư mục project:

```powershell
npx expo start
```

Sau đó chọn:

```text
a
```

để mở Android.

Hoặc:

```powershell
npx expo start --android
```

---

# 11. Run on Android Emulator

Khởi động Android Emulator trước.

Kiểm tra:

```powershell
adb devices
```

Kết quả cần có:

```text
emulator-5554    device
```

Sau đó:

```powershell
npx expo run:android
```

Lệnh này sẽ:

1. Build native Android project
2. Cài APK lên emulator
3. Khởi động ứng dụng

---

# 12. Development Build

Một số native functionality của project yêu cầu development build.

Sau khi thay đổi native configuration:

```powershell
npx expo prebuild
```

Nếu cần tạo lại native project:

```powershell
npx expo prebuild --clean
```

Sau đó:

```powershell
npx expo run:android
```

> Sau khi chạy `prebuild --clean`, cần kiểm tra lại các file native configuration như `google-services.json` nếu project Firebase Android yêu cầu file này.

---

# 13. Project Structure

```text
Study-Room-Booking/
│
├── assets/
│   └── ...
│
├── android/
│   └── ...
│
├── src/
│   ├── components/
│   │   ├── CalendarPicker.tsx
│   │   ├── InfoItem.tsx
│   │   ├── RoomCard.tsx
│   │   ├── RoomSkeleton.tsx
│   │   └── StatusPill.tsx
│   │
│   ├── constants/
│   │   └── app.ts
│   │
│   ├── navigation/
│   │   └── MainTabs.tsx
│   │
│   ├── screens/
│   │   ├── AuthScreen.tsx
│   │   ├── BookingScreen.tsx
│   │   ├── ExploreScreen.tsx
│   │   ├── MyBookingsScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── RoomDetailScreen.tsx
│   │
│   ├── services/
│   │   ├── firebase.js
│   │   ├── authService.ts
│   │   ├── userService.ts
│   │   ├── roomService.ts
│   │   ├── bookingService.ts
│   │   └── storageService.ts
│   │
│   ├── store/
│   │   └── useBookingStore.ts
│   │
│   ├── types/
│   │   └── ...
│   │
│   └── styles.ts
│
├── App.tsx
├── app.json
├── package.json
├── package-lock.json
└── tsconfig.json
```

---

# 14. Main Application Flow

## Authentication

```text
User
 │
 ▼
AuthScreen
 │
 ├── Register
 │      ↓
 │   Firebase Authentication
 │      ↓
 │   Realtime Database / users
 │
 └── Login
        ↓
   Firebase Authentication
        ↓
   Main Application
```

## Room Browsing

```text
Firebase Realtime Database
          │
          ▼
       rooms
          │
          ▼
    roomService.ts
          │
          ▼
  useBookingStore.ts
          │
          ▼
    ExploreScreen
          │
          ▼
       RoomCard
```

## Booking

```text
User selects room
        │
        ▼
BookingScreen
        │
        ▼
Check existing bookings
        │
        ▼
Check time conflict
        │
        ├── Conflict → Reject
        │
        └── Available
                ↓
          Create booking
                ↓
       Realtime Database
          /bookings
```

---

# 15. Important Data Mapping

The application uses the following room fields:

| Field | Description |
|---|---|
| `roomId` | Unique room identifier |
| `roomName` | Room name |
| `location` | Building/location |
| `capacity` | Maximum number of users |
| `type` | `study_room` or `computer_lab` |
| `status` | Current room status |
| `imageUrl` | Room image URL |

For example:

```text
room.roomId
room.roomName
room.location
room.capacity
room.type
room.status
room.imageUrl
```

Do not use the old Firestore-style fields:

```text
room.id
room.name
room.building
room.images
```

---

# 16. Booking Conflict Prevention

Before creating a booking, the application checks existing bookings for the selected room and date.

A conflict exists when:

```text
newStart < existingEnd
AND
newEnd > existingStart
```

If a conflict is detected, the booking is rejected.

Otherwise, the booking is stored in:

```text
bookings/{bookingId}
```

---

# 17. Troubleshooting

### Problem: `adb` is not recognized

Check:

```powershell
adb devices
```

If unavailable, add Android SDK Platform Tools to PATH.

---

### Problem: Java is not recognized

Check:

```powershell
java -version
```

Set:

```powershell
$env:JAVA_HOME="C:\Users\ADMIN\.jdks\jbr-21.0.11"
$env:Path="$env:JAVA_HOME\bin;$env:Path"
```

Then:

```powershell
java -version
```

---

### Problem: Android SDK location not found

Check:

```powershell
echo $env:ANDROID_HOME
```

Expected:

```text
C:\Users\ADMIN\AppData\Local\Android\Sdk
```

Also check:

```text
android/local.properties
```

Example:

```properties
sdk.dir=C:\\Users\\ADMIN\\AppData\\Local\\Android\\Sdk
```

---

### Problem: Rooms are not displayed

Check the Realtime Database:

```text
rooms
```

Make sure each room contains:

```text
roomName
location
capacity
type
status
imageUrl
```

Then check that `roomService.ts` uses:

```ts
ref(db, "rooms")
```

rather than Firestore:

```ts
collection(db, "rooms")
```

---

### Problem: Profile is empty

Make sure the user's Firebase Authentication UID matches the key under:

```text
users/{uid}
```

The application should not assume that:

```text
user_001
```

is the same as a Firebase Authentication UID.

---

### Problem: Images are not displayed

Check that the database contains a valid:

```text
imageUrl
```

and that the URL can be opened in a browser.

For user profiles, check:

```text
avatarUrl
```

---

# 18. Useful Commands

### Install dependencies

```powershell
npm install
```

### Start Expo

```powershell
npx expo start
```

### Start Expo for Android

```powershell
npx expo start --android
```

### Generate native project

```powershell
npx expo prebuild
```

### Clean and regenerate native project

```powershell
npx expo prebuild --clean
```

### Build and run Android

```powershell
npx expo run:android
```

### Check Android devices

```powershell
adb devices
```

### Check Java

```powershell
java -version
```

### Check Node.js

```powershell
node -v
```

### Check npm

```powershell
npm -v
```

---

# 19. Quick Setup

For a new development environment:

```powershell
git clone <YOUR_GITHUB_REPOSITORY_URL>

cd Study-Room-Booking

npm install

npx expo start
```

For Android native development:

```powershell
adb devices

npx expo prebuild

npx expo run:android
```

Before running the application, make sure:

- Node.js is installed.
- JDK is configured.
- Android SDK is configured.
- Android Emulator is running.
- Firebase Authentication Email/Password is enabled.
- Firebase Realtime Database is available.
- Room data exists under `/rooms`.
- Cloudinary configuration is available if image upload is required.