# BÁO CÁO KỸ THUẬT NGẮN – MINI-PROJECT

**Môn học:** Phát triển ứng dụng di động đa nền tảng (Cross-Platform Mobile App Development – VKU)
**Tên Mini-Project:** Mini-Project 2 – Study Room Booking App
**Tên nhóm / Sinh viên:** Mai Thị Như Ý
**Ngày nộp:** [24/09/2026]

---

## 1. THÔNG TIN CHUNG & CÁC ĐƯỜNG DẪN SẢN PHẨM

### Thành viên nhóm

1. **Phạm Thị Như Ý** 
MSSV: **23IT326** 
Vai trò: **Phát triển giao diện, kiến trúc ứng dụng và tích hợp Firebase** 
Đóng góp: **100%**

### Các đường dẫn

* **🔗 Demo ứng dụng:** [Thêm link Expo / APK nếu có]
* **💻 GitHub Repository:** [Thêm link GitHub của dự án]
* **🎥 Video Demo:** [Thêm link YouTube nếu có]

### Mô tả dự án

**Study Room Booking App** là ứng dụng di động hỗ trợ sinh viên tìm kiếm và đặt phòng học hoặc phòng máy tính trong khuôn viên trường.

Ứng dụng được xây dựng bằng **React Native + Expo**, sử dụng **Firebase Authentication** để xác thực người dùng, **Cloud Firestore** để lưu trữ dữ liệu và **Zustand** để quản lý trạng thái ứng dụng.

---

## 2. BẢNG KIỂM TRA CÁC CHỨC NĂNG ĐÃ TRIỂN KHAI

|  #  | Chức năng yêu cầu            |    Trạng thái    | Chi tiết triển khai & mức độ đáp ứng                                                              |
| :-: | ---------------------------- | :--------------: | ------------------------------------------------------------------------------------------------- |
|  1  | Giao diện di động responsive |   ✅ Hoàn thành   | Xây dựng giao diện mobile-first bằng React Native và Expo, phù hợp với màn hình thiết bị Android. |
|  2  | Đăng ký tài khoản            |   ✅ Hoàn thành   | Sử dụng Firebase Authentication với phương thức Email/Password.                                   |
|  3  | Đăng nhập                    |   ✅ Hoàn thành   | Người dùng có thể đăng nhập bằng tài khoản đã đăng ký thông qua Firebase Authentication.          |
|  4  | Hiển thị danh sách phòng     |   ✅ Hoàn thành   | Danh sách phòng được lấy từ Cloud Firestore và hiển thị bằng FlatList.                            |
|  5  | Tìm kiếm phòng               |   ✅ Hoàn thành   | Cho phép tìm kiếm phòng theo tên và thông tin liên quan.                                          |
|  6  | Lọc phòng                    |   ✅ Hoàn thành   | Sử dụng các bộ lọc như loại phòng, sức chứa và trạng thái phòng.                                  |
|  7  | Xem chi tiết phòng           |   ✅ Hoàn thành   | Hiển thị tên phòng, vị trí, sức chứa, loại phòng và trạng thái.                                   |
|  8  | Chọn ngày đặt phòng          |   ✅ Hoàn thành   | Sử dụng thành phần CalendarPicker để lựa chọn ngày cần đặt.                                       |
|  9  | Chọn khung giờ               |   ✅ Hoàn thành   | Người dùng có thể lựa chọn các khung giờ đặt phòng.                                               |
|  10 | Kiểm tra xung đột lịch       |   ✅ Hoàn thành   | Kiểm tra các booking hiện có trong Firestore trước khi xác nhận đặt phòng.                        |
|  11 | Tạo booking                  |   ✅ Hoàn thành   | Booking được lưu vào Cloud Firestore sau khi kiểm tra tính khả dụng.                              |
|  12 | Xem lịch sử đặt phòng        |   ✅ Hoàn thành   | Màn hình My Bookings hiển thị các phòng mà người dùng đã đặt.                                     |
|  13 | Quản lý trạng thái           |   ✅ Hoàn thành   | Sử dụng Zustand để quản lý trạng thái booking và dữ liệu liên quan.                               |
|  14 | Google Authentication        | ⚙️ Đang cấu hình | Đã chuẩn bị cấu hình Firebase Google Authentication; cần hoàn thiện cấu hình native Android.      |
|  15 | Facebook Authentication      | ⚙️ Đang cấu hình | Đã chuẩn bị Firebase Facebook Provider và biến môi trường `EXPO_PUBLIC_FACEBOOK_APP_ID`.          |

---

## 3. KIẾN TRÚC KỸ THUẬT & CẤU TRÚC DỰ ÁN

### 3.1. Kiến trúc kỹ thuật

Ứng dụng được xây dựng theo mô hình ứng dụng di động kết hợp giữa **React Native/Expo ở phía client** và **Firebase ở phía backend**.

```text
┌───────────────────────────────┐
│       React Native + Expo     │
│           Mobile App          │
└───────────────┬───────────────┘
                │
       ┌────────┴─────────┐
       │                  │
       ▼                  ▼
┌──────────────┐   ┌───────────────┐
│    Zustand   │   │  Navigation   │
│ State Manage │   │    Screens    │
└───────┬──────┘   └───────────────┘
        │
        ▼
┌───────────────────────────────┐
│            Firebase           │
├───────────────────────────────┤
│ Firebase Authentication       │
│ Cloud Firestore               │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│         Firestore Database    │
│                               │
│  rooms / bookings / users     │
└───────────────────────────────┘
```

### 3.2. Luồng hoạt động

Luồng xử lý chính của ứng dụng:

```text
Người dùng
    │
    ▼
Màn hình ứng dụng
    │
    ▼
Zustand Store
    │
    ├──────────────► Firebase Authentication
    │
    └──────────────► Cloud Firestore
                          │
                          ▼
                       Dữ liệu
                          │
                          ▼
                    Cập nhật giao diện
```

Ví dụ đối với chức năng đặt phòng:

```text
Chọn phòng
    ↓
Chọn ngày
    ↓
Chọn khung giờ
    ↓
Kiểm tra booking hiện có
    ↓
Có xung đột?
   ↙     ↘
 Có       Không
 ↓          ↓
Từ chối   Xác nhận
đặt       booking
             ↓
       Lưu Firestore
```

### 3.3. Cấu trúc thư mục

Cấu trúc chính của dự án:

```text
Study-Room-Booking/
│
├── assets/
│
├── src/
│   ├── components/
│   │   ├── CalendarPicker
│   │   ├── InfoItem
│   │   ├── RoomCard
│   │   ├── RoomSkeleton
│   │   └── StatusPill
│   │
│   ├── constants/
│   │   └── app.ts
│   │
│   ├── navigation/
│   │   └── MainTabs.tsx
│   │
│   ├── screens/
│   │   ├── AuthScreen
│   │   ├── BookingScreen
│   │   ├── ExploreScreen
│   │   ├── MyBookingsScreen
│   │   ├── ProfileScreen
│   │   └── RoomDetailScreen
│   │
│   ├── services/
│   │   └── firebase.js
│   │
│   ├── store/
│   │   └── useBookingStore.ts
│   │
│   └── styles.ts
│
├── App.tsx
├── package.json
└── README.md
```

### 3.4. Quản lý trạng thái

**Zustand** được sử dụng để quản lý trạng thái dùng chung của ứng dụng.

Một số dữ liệu được quản lý gồm:

* Phòng đang được chọn.
* Ngày đặt phòng.
* Khung giờ đặt phòng.
* Thông tin booking.
* Trạng thái liên quan đến quá trình đặt phòng.

Việc sử dụng Zustand giúp giảm việc truyền dữ liệu qua nhiều component và tách phần quản lý trạng thái khỏi giao diện.

### 3.5. Xử lý lỗi và ngoại lệ

Ứng dụng thực hiện kiểm tra dữ liệu đầu vào trước khi gửi yêu cầu đến Firebase.

Ví dụ:

* Kiểm tra email khi đăng ký/đăng nhập.
* Kiểm tra mật khẩu tối thiểu 6 ký tự.
* Kiểm tra tên người dùng.
* Kiểm tra phòng có còn khả dụng hay không.
* Kiểm tra xung đột giữa khung giờ mới và booking hiện tại.
* Hiển thị trạng thái chờ khi đang thực hiện thao tác với Firebase.
* Xử lý lỗi khi đăng nhập, đăng ký hoặc truy cập dữ liệu Firestore thất bại.

---

## 4. BẰNG CHỨNG THỰC NGHIỆM & ẢNH CHỤP MÀN HÌNH

Ứng dụng được kiểm thử trên **Android Emulator** trong môi trường Expo/React Native.

Có thể chèn 3–4 ảnh chụp màn hình chính của ứng dụng vào báo cáo.

### Hình 1 – Màn hình đăng nhập / đăng ký

Ảnh minh họa giao diện:

* Đăng nhập.
* Đăng ký tài khoản.
* Nhập email.
* Nhập mật khẩu.
* Kiểm tra dữ liệu đầu vào.

**[Chèn Screenshot 1 tại đây]**

---

### Hình 2 – Màn hình Explore

Màn hình Explore hiển thị danh sách các phòng học/phòng máy.

Các chức năng được thể hiện:

* Thanh tìm kiếm.
* Bộ lọc phòng.
* Danh sách phòng.
* Trạng thái phòng.
* Sức chứa.
* Địa điểm.

**[Chèn Screenshot 2 tại đây]**

---

### Hình 3 – Màn hình đặt phòng

Màn hình Booking cho phép người dùng:

* Chọn phòng.
* Chọn ngày.
* Chọn khung giờ.
* Kiểm tra tình trạng phòng.
* Xác nhận đặt phòng.

**[Chèn Screenshot 3 tại đây]**

---

### Hình 4 – Màn hình My Bookings

Màn hình My Bookings hiển thị các booking mà người dùng đã tạo.

Thông tin bao gồm:

* Tên phòng.
* Ngày đặt.
* Khung giờ.
* Trạng thái booking.

**[Chèn Screenshot 4 tại đây]**

---

## 5. THÁCH THỨC KỸ THUẬT & GIẢI PHÁP

### Thách thức 1 – Tích hợp Firebase Authentication

Ban đầu, chức năng đăng nhập/đăng ký sử dụng dữ liệu phiên đăng nhập giả lập ở phía client. Điều này không phù hợp với ứng dụng có hệ thống tài khoản thực tế.

**Giải pháp:**

Chuyển sang sử dụng **Firebase Authentication** với Email/Password.

Luồng xử lý:

```text
Người dùng nhập thông tin
          ↓
Kiểm tra dữ liệu
          ↓
Firebase Authentication
          ↓
Tạo tài khoản / Đăng nhập
          ↓
Truy cập ứng dụng
```

Các hàm chính được sử dụng gồm:

```text
createUserWithEmailAndPassword()
signInWithEmailAndPassword()
```

Nhờ đó, thông tin xác thực được quản lý bởi Firebase thay vì chỉ lưu ở phía client.

---

### Thách thức 2 – Ngăn chặn xung đột khi đặt phòng

Một vấn đề quan trọng của ứng dụng là không cho phép hai booking sử dụng cùng một phòng trong cùng một khoảng thời gian.

**Giải pháp:**

Trước khi tạo booking mới, ứng dụng kiểm tra các booking hiện có trong Cloud Firestore dựa trên:

* `roomId`
* Ngày đặt
* `startTime`
* `endTime`

Nếu phát hiện khoảng thời gian bị trùng, thao tác đặt phòng sẽ bị từ chối.

Nếu không có xung đột, booking mới được tạo và lưu vào Firestore.

```text
Booking mới
     │
     ▼
Kiểm tra Firestore
     │
     ▼
So sánh thời gian
     │
 ┌───┴────┐
 │        │
Trùng    Không trùng
 │        │
 ▼        ▼
Từ chối  Tạo booking
            │
            ▼
       Firestore
```

### Thách thức 3 – Cấu hình môi trường Android

Trong quá trình chạy ứng dụng native Android, dự án yêu cầu cấu hình Android SDK, ADB, Java/JDK và Gradle.

**Giải pháp:**

Cấu hình Android Emulator và ADB để kiểm thử ứng dụng trên thiết bị ảo. Sau khi môi trường được cấu hình, dự án có thể được chạy bằng:

```bash
npx expo start
```

hoặc build native Android bằng:

```bash
npx expo run:android
```

---

## KẾT LUẬN

Mini-Project **Study Room Booking App** đã triển khai các chức năng chính của một hệ thống đặt phòng học trên thiết bị di động.

Các công nghệ chính được sử dụng gồm:

* **React Native**
* **Expo**
* **Firebase Authentication**
* **Cloud Firestore**
* **Zustand**
* **React Navigation**
* **Android Emulator**

Ứng dụng hỗ trợ người dùng tìm kiếm phòng, lọc phòng, xem thông tin chi tiết, chọn ngày và khung giờ, kiểm tra xung đột và tạo booking.

Kiến trúc dự án được phân chia thành các component giao diện, màn hình, navigation, state management và Firebase services, giúp mã nguồn dễ quản lý và mở rộng trong các phiên bản tiếp theo.
