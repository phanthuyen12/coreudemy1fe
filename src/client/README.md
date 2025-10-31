# ROVA - Client Khóa Học

Ứng dụng web client cho nền tảng khóa học giao dịch ROVA với giao diện màu đen hiện đại.

## 🎯 Tính năng chính

### 📚 Trang Khóa Học
- **Danh sách khóa học** (`/courses`) - Hiển thị tất cả khóa học có sẵn
- **Chi tiết khóa học** (`/course`) - Video player và danh sách bài học
- **Profile khóa học** (`/course-profile`) - Theo dõi tiến độ học tập

### 🎨 Giao diện
- **Theme màu đen** với accent màu vàng cam
- **Responsive design** cho mobile và desktop
- **Sidebar navigation** với menu đầy đủ
- **Header** với thông tin user và nút action

## 🚀 Cấu trúc dự án

```
src/client/
├── components/
│   ├── Layout.jsx          # Layout chính với sidebar và header
│   ├── Sidebar.jsx         # Sidebar navigation
│   └── Header.jsx          # Header với user info
├── pages/
│   ├── Dashboard.jsx       # Trang dashboard chính
│   ├── Courses.jsx         # Danh sách khóa học
│   ├── CourseDetail.jsx    # Chi tiết khóa học với video player
│   └── CourseProfile.jsx  # Profile tiến độ học tập
├── router/
│   └── index.jsx          # Router configuration
├── assets/
│   └── css/
│       └── course-theme.css # Custom dark theme styles
├── main.jsx               # Entry point
└── index.html            # HTML template
```

## 🎮 Các trang chính

### 1. Dashboard (`/`)
- Thống kê tiến độ học tập
- Trung tâm ticket hỗ trợ
- Thông tin tổng quan

### 2. Danh sách khóa học (`/courses`)
- Grid layout hiển thị khóa học
- Filter theo danh mục
- Search và bộ lọc
- Thông tin chi tiết từng khóa học

### 3. Chi tiết khóa học (`/course`)
- Video player với controls
- Sidebar danh sách bài học
- Thông tin video hiện tại
- Navigation giữa các bài học

### 4. Profile khóa học (`/course-profile`)
- Thống kê tiến độ học tập
- Hoạt động gần đây
- Bài học sắp tới
- Thành tích và huy hiệu
- Lộ trình học tập

## 🎨 Theme và Styling

### Màu sắc chính
- **Background**: `#111827` (gray-900)
- **Cards**: `#1f2937` (gray-800)
- **Borders**: `#374151` (gray-700)
- **Accent**: `#fbbf24` (yellow-400)
- **Text**: `#ffffff` (white)

### Component styling
- Gradient buttons với hover effects
- Custom scrollbar cho dark theme
- Responsive grid layouts
- Smooth transitions và animations

## 🔧 Cài đặt và chạy

1. **Cài đặt dependencies**:
```bash
npm install
# hoặc
yarn install
```

2. **Chạy development server**:
```bash
npm run dev
# hoặc
yarn dev
```

3. **Build cho production**:
```bash
npm run build
# hoặc
yarn build
```

## 📱 Responsive Design

- **Mobile**: Sidebar collapse, single column layout
- **Tablet**: 2-column grid cho courses
- **Desktop**: Full sidebar, 3-column grid cho courses

## 🎯 Tính năng nổi bật

### Video Player
- Custom video controls
- Progress tracking
- Full-screen support
- Volume control

### Course Navigation
- Hierarchical course structure
- Active lesson highlighting
- Progress indicators
- Search và filter

### User Experience
- Dark theme tối ưu cho học tập
- Smooth animations
- Intuitive navigation
- Mobile-first design

## 🔗 Navigation Flow

```
Dashboard → Courses → Course Detail → Course Profile
    ↓           ↓           ↓              ↓
  Overview   Browse    Watch Video    Track Progress
```

## 📊 Data Structure

### Course Data
```javascript
{
  id: number,
  title: string,
  instructor: string,
  duration: string,
  videos: number,
  level: string,
  price: string,
  rating: number,
  students: number,
  thumbnail: string,
  description: string,
  features: string[]
}
```

### Progress Data
```javascript
{
  totalVideos: number,
  completedVideos: number,
  totalTime: string,
  studiedTime: string,
  progressPercentage: number
}
```

## 🚀 Deployment

Ứng dụng được thiết kế để deploy trên các platform:
- **Vercel**: Static hosting
- **Netlify**: JAMstack deployment
- **AWS S3**: Static website hosting

## 📝 Notes

- Tất cả components sử dụng Tailwind CSS
- Router sử dụng React Router v6
- State management có thể mở rộng với Redux/Zustand
- API integration sẵn sàng cho backend connection
