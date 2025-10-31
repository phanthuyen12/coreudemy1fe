import React from 'react';

const CourseProfile = () => {
  // Mock data for course progress
  const courseProgress = {
    totalVideos: 37,
    completedVideos: 1,
    totalTime: "35 giờ",
    studiedTime: "10 phút",
    progressPercentage: 2.7
  };

  const courseStats = [
    {
      title: "Tiến độ học",
      value: `${courseProgress.completedVideos}/${courseProgress.totalVideos}`,
      icon: "📚",
      color: "blue",
      percentage: courseProgress.progressPercentage
    },
    {
      title: "Tổng thời gian học",
      value: courseProgress.studiedTime,
      icon: "⏰",
      color: "green"
    },
    {
      title: "Điểm số trung bình",
      value: "8.5/10",
      icon: "⭐",
      color: "yellow"
    },
    {
      title: "Chứng chỉ hoàn thành",
      value: "0/3",
      icon: "🏆",
      color: "purple"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      title: "Hoàn thành bài học: Sự Khác Biệt Của Phương Pháp 3 Hộp",
      time: "2 giờ trước",
      type: "completion"
    },
    {
      id: 2,
      title: "Bắt đầu khóa học: GỐC TƯ DUY",
      time: "1 ngày trước",
      type: "start"
    },
    {
      id: 3,
      title: "Đăng ký khóa học thành công",
      time: "3 ngày trước",
      type: "enrollment"
    }
  ];

  const upcomingLessons = [
    {
      id: 1,
      title: "Tam Giác Kim Cương Trong Giao Dịch",
      duration: "08:11",
      status: "upcoming",
      section: "GỐC TƯ DUY"
    },
    {
      id: 2,
      title: "[Tradingview] Thực chứng sự kỳ diệu của phương pháp",
      duration: "06:16",
      status: "upcoming",
      section: "PHƯƠNG PHÁP VÀ BÍ MẬT ĐẰNG SAU"
    },
    {
      id: 3,
      title: "Bí Mật 1. Chiêu Trò Nhà Cái",
      duration: "02:40",
      status: "upcoming",
      section: "PHƯƠNG PHÁP VÀ BÍ MẬT ĐẰNG SAU"
    }
  ];

  const achievements = [
    {
      id: 1,
      title: "Người mới bắt đầu",
      description: "Hoàn thành bài học đầu tiên",
      icon: "🌱",
      earned: true,
      date: "2 giờ trước"
    },
    {
      id: 2,
      title: "Học viên chăm chỉ",
      description: "Học liên tục 3 ngày",
      icon: "🔥",
      earned: false
    },
    {
      id: 3,
      title: "Chuyên gia giao dịch",
      description: "Hoàn thành toàn bộ khóa học",
      icon: "👑",
      earned: false
    }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">PROFILE KHÓA HỌC</h1>
        <p className="text-gray-400">Theo dõi tiến độ học tập và thành tích của bạn</p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {courseStats.map((stat, index) => (
          <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 bg-${stat.color}-500 rounded-lg flex items-center justify-center`}>
                <span className="text-white text-xl">{stat.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{stat.title}</h3>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                {stat.percentage && (
                  <div className="mt-2">
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>Tiến độ</span>
                      <span>{stat.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className={`bg-${stat.color}-500 h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${stat.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">Hoạt động gần đây</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-700 rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'completion' ? 'bg-green-500' :
                  activity.type === 'start' ? 'bg-blue-500' : 'bg-yellow-500'
                }`}>
                  <span className="text-white text-sm">
                    {activity.type === 'completion' ? '✓' :
                     activity.type === 'start' ? '▶' : '📝'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{activity.title}</p>
                  <p className="text-gray-400 text-sm">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Lessons */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">Bài học sắp tới</h2>
          <div className="space-y-3">
            {upcomingLessons.map((lesson) => (
              <div key={lesson.id} className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer transition-colors">
                <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center text-gray-900 font-bold">
                  {lesson.id}
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium">{lesson.title}</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <span>{lesson.duration}</span>
                    <span>•</span>
                    <span>{lesson.section}</span>
                  </div>
                </div>
                <div className="text-yellow-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6">Thành tích</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                achievement.earned 
                  ? 'bg-green-900 border-green-500' 
                  : 'bg-gray-700 border-gray-600'
              }`}
            >
              <div className="text-center">
                <div className="text-4xl mb-3">{achievement.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{achievement.title}</h3>
                <p className="text-sm text-gray-400 mb-3">{achievement.description}</p>
                {achievement.earned ? (
                  <div className="text-green-400 text-sm font-medium">
                    ✓ Đã đạt được - {achievement.date}
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm">
                    🔒 Chưa đạt được
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Path */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6">Lộ trình học tập</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">✓</span>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium">GỐC TƯ DUY</h3>
              <p className="text-gray-400 text-sm">1/3 bài học hoàn thành</p>
            </div>
            <div className="w-16 bg-gray-600 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full w-1/3"></div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-gray-400 text-sm">2</span>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium">PHƯƠNG PHÁP VÀ BÍ MẬT ĐẰNG SAU</h3>
              <p className="text-gray-400 text-sm">0/8 bài học hoàn thành</p>
            </div>
            <div className="w-16 bg-gray-600 rounded-full h-2">
              <div className="bg-gray-500 h-2 rounded-full w-0"></div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-gray-400 text-sm">3</span>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium">THỰC HÀNH VÀ ỨNG DỤNG</h3>
              <p className="text-gray-400 text-sm">0/15 bài học hoàn thành</p>
            </div>
            <div className="w-16 bg-gray-600 rounded-full h-2">
              <div className="bg-gray-500 h-2 rounded-full w-0"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProfile;