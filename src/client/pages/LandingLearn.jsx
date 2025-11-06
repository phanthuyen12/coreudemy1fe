import React, { useState } from 'react';
import { Icon as IconifyIcon } from '@iconify/react';
import { useAuth } from '../context/AuthContext';
import '../assets/css/LandingLearn.css'; // Giữ lại import CSS gốc
import bienkienthuc from '../../assets/images/3hstation/BIEN_KIEN_THUC_THANH_HE_THONG_KIEM_TIEN_THUC_TE.png';
import duan1 from '../../assets/images/3hstation/6.png';
import duan2 from '../../assets/images/3hstation/7.png';
import duan3 from '../../assets/images/3hstation/8.png';
import duan4 from '../../assets/images/3hstation/9.png';
import TANG1 from '../../assets/images/3hstation/TANG1.png';
import TANG2 from '../../assets/images/3hstation/TANG2.png';
import TANG3 from '../../assets/images/3hstation/TANG3.png';
import TANG4 from '../../assets/images/3hstation/TANG4.png';
import QUYENLOI from '../../assets/images/3hstation/quyenloi.png';
import DONGHANH from '../../assets/images/3hstation/donghanh.png';
// Extracted to avoid state reset when parent re-renders
const SignupForm = ({ onRegister, loading }) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState('');
    const [showPw1, setShowPw1] = useState(false);
    const [showPw2, setShowPw2] = useState(false);
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (password1 !== password2) { setError('Mật khẩu không khớp'); return; }
    try { await onRegister(email, username, password1); } catch (err) { setError(err.message); }
    };
    return (
      <form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
        {error && <div className="small" style={{color:'#ff6b6b'}}>{error}</div>}
        <input className="ldh-input" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="ldh-input" placeholder="Họ tên / Username" value={username} onChange={(e)=>setUsername(e.target.value)} />
        <div className="d-flex gap-2">
          <div className="field" style={{flex:1}}>
            <input className="ldh-input" placeholder="Mật khẩu" type={showPw1? 'text':'password'} value={password1} onChange={(e)=>setPassword1(e.target.value)} />
            <span className="toggle-eye" onClick={()=>setShowPw1(!showPw1)}>{showPw1? '🙈':'👁️'}</span>
          </div>
          <div className="field" style={{flex:1}}>
            <input className="ldh-input" placeholder="Xác nhận mật khẩu" type={showPw2? 'text':'password'} value={password2} onChange={(e)=>setPassword2(e.target.value)} />
            <span className="toggle-eye" onClick={()=>setShowPw2(!showPw2)}>{showPw2? '🙈':'👁️'}</span>
          </div>
        </div>
        <div className="position-relative">
          <button type="submit" disabled={loading} className="ldh-btn-primary w-100">{loading? 'ĐANG XỬ LÝ...':'ĐĂNG KÝ HỌC THỬ NGAY'}</button>
          <span className="ldh-pill-free">FREE</span>
        </div>
        <div className="small text-muted text-center">Hoàn toàn MIỄN PHÍ | Hiệu quả cao</div>
      </form>
    );
  };

const LoginForm = ({ onLogin, loading, onForgotPassword }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(true);
    const [error, setError] = useState('');
    const [showPw, setShowPw] = useState(false);
    const handleSubmit = async (e) => {
      e.preventDefault();
    try { await onLogin(email, password); } catch (err) { setError(err.message); }
    };
    return (
      <form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
        {error && <div className="small" style={{color:'#ff6b6b'}}>{error}</div>}
        <input className="ldh-input" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <div className="field">
        <input className="ldh-input" placeholder="Mật khẩu" type={showPw? 'text':'password'} value={password} onChange={(e)=>setPassword(e.target.value)} />
        <span className="toggle-eye" onClick={()=>setShowPw(!showPw)}>{showPw? '🙈':'👁️'}</span>
        </div>
        <div className="d-flex align-items-center justify-content-between small text-muted">
          <label className="d-flex align-items-center gap-2"><input type="checkbox" checked={remember} onChange={(e)=>setRemember(e.target.checked)} /> Ghi nhớ đăng nhập</label>
          <a href="#reset" onClick={(e) => { e.preventDefault(); onForgotPassword(); }} style={{color:'#ffbf00', textDecoration:'none', cursor:'pointer'}}>Quên mật khẩu?</a>
        </div>
        <button type="submit" disabled={loading} className="ldh-btn-primary w-100">{loading? 'ĐANG XỬ LÝ...':'ĐĂNG NHẬP'}</button>
      </form>
    );
  };

const ForgotPasswordForm = ({ onResetPassword, loading, onBack }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!email) { setError('Vui lòng nhập email'); return; }
      try { 
        await onResetPassword(email);
        setSuccess(true);
        setError('');
      } catch (err) { 
        setError(err.message); 
        setSuccess(false);
      }
    };
    if (success) {
      return (
        <div className="d-flex flex-column gap-2 text-center">
          <div style={{color:'#38d065', fontSize: 48, marginBottom: 8}}>✓</div>
          <div className="fw-bold" style={{color:'#fff'}}>Email đã được gửi!</div>
          <div className="small" style={{color:'#aaa'}}>Vui lòng kiểm tra hộp thư của bạn để nhận link đặt lại mật khẩu.</div>
          <button onClick={onBack} className="ldh-btn-primary w-100 mt-2">Quay lại đăng nhập</button>
        </div>
      );
    }
    return (
      <form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
        {error && <div className="small" style={{color:'#ff6b6b'}}>{error}</div>}
        <div className="small text-muted mb-2">Nhập email của bạn để nhận link đặt lại mật khẩu</div>
        <input 
          className="ldh-input" 
          type="email"
          placeholder="Email" 
          value={email} 
          onChange={(e)=>setEmail(e.target.value)} 
        />
        <button type="submit" disabled={loading} className="ldh-btn-primary w-100">
          {loading? 'ĐANG GỬI...':'GỬI EMAIL ĐẶT LẠI MẬT KHẨU'}
        </button>
        <button type="button" onClick={onBack} className="cta-btn outline w-100" style={{marginTop: 8}}>
          Quay lại đăng nhập
        </button>
      </form>
    );
  };

const LandingLearn = () => {
  const [heroTab, setHeroTab] = useState('signup'); // 'signup' | 'login' | 'forgot'
  const { login, register, resetPassword, loading } = useAuth();
  
  // Custom Bullet Component with hover effect
  const Bullet = ({ children }) => (
    <li className="ldh-bullet-fade-in d-flex align-items-start" style={{gap: 14, color: '#e8e8e8', marginBottom: 12}}>
      <IconifyIcon icon="ri:checkbox-circle-fill" className="tick-anim" style={{color:'#38d065', marginTop: 2,fontSize: 26}} />
      <span style={{lineHeight: 1.7, fontSize: 16}}>{children}</span>
    </li>
  );

  const Stat = ({ num, label }) => (
    <div className="text-center" style={{background:'#111', border:'1px solid #1f1f1f', borderRadius:12, padding:'14px 12px'}}>
      <div style={{fontSize: 24, fontWeight: 800, color:'#fff'}}>{num}</div>
      <div style={{fontSize: 12, color:'#aaa'}}>{label}</div>
    </div>
  );
  
  // Dữ liệu mới cho phần CTA
  const ctaBullets = [
      'Nắm vững Tư duy Tài chính & Kinh doanh hiện đại để phát triển bền vững.',
      'Sử dụng các Tool & Workflow Automation để tiết kiệm 90% thời gian tạo content, quản lý marketing, MMO.',
      'Công thức xây dựng Thương hiệu Cá nhân và Hệ thống bán hàng thông minh đã được kiểm chứng.',
      'Học hỏi Case Study thực chiến từ Ros & các mentor trong hệ sinh thái 3H.',
      'Cơ hội kết nối đội nhóm & cộng sự để tạo ra dự án, thu nhập thực tế.'
  ];

  // Dữ liệu mới cho phần Quyền lợi PRO
  const proBenefits = [
      'Truy cập toàn bộ kho học liệu & hướng dẫn thực chiến (Học)',
      'Tham gia các nhóm kín, cộng đồng mentor hỗ trợ trọn đời (Hỏi)',
      'Nhận bộ Tool & Workflow Automation độc quyền giúp tạo kết quả nhanh (Hành)',
      'Cơ hội trở thành Affiliate, Partner, Trainer trong hệ sinh thái 3H',
      'Workshop thực hành hàng tuần: hướng dẫn setup tool, xây hệ thống',
      'Ưu đãi độc quyền khi mua tool, plugin, và khóa học trong hệ sinh thái',
      'Hỗ trợ chiến lược Kinh doanh số toàn diện và tối ưu hiệu suất',
      'Bài giảng cập nhật liên tục, đảm bảo kiến thức luôn dẫn đầu kỷ nguyên AI'
  ];

  // Dữ liệu mới cho phần Đồng hành
  const accompanimentBullets = [
      'Lộ trình 3H rõ ràng: Học kiến thức - Hỏi kinh nghiệm - Hành động ra kết quả',
      'Tham gia cộng đồng mentor, có người hỗ trợ, đồng hành đến khi ra tiền',
      'Cung cấp Tool và Workflow giúp bạn tự động hóa quy trình kiếm tiền',
      'Mentor phân tích chiến lược Kinh doanh & áp dụng AI thực tế, chỉ rõ lỗi sai',
      'Cập nhật liên tục case study & công nghệ AI/Automation mới nhất',
  ];
  
  // Dữ liệu mới cho phần FAQ
  const faqList = [
      {q: 'Khóa học này phù hợp với ai?', a: "Phù hợp với những người muốn nắm vững Tư duy tài chính/Kinh doanh hiện đại, muốn áp dụng AI/Automation vào công việc để tăng hiệu suất và xây dựng hệ thống thu nhập thông minh."},
      {q: 'Tôi không rành công nghệ, có học và làm được không?', a: "Hoàn toàn có thể. Khóa học được thiết kế theo lộ trình 'cầm tay chỉ việc' từ cơ bản đến nâng cao. Các công cụ và workflow đều có hướng dẫn chi tiết."},
      {q: 'Khóa học có cập nhật nội dung mới không?', a: "Chúng tôi cam kết cập nhật nội dung liên tục (thường là hàng tháng) để bắt kịp tốc độ thay đổi của công nghệ AI và thị trường Kinh doanh số."},
      {q: 'Tôi học xong mà vẫn chưa ra kết quả thì sao?', a: "Bạn sẽ được hỗ trợ **trọn đời** trong cộng đồng 3H. Nếu chưa ra kết quả, mentor sẽ trực tiếp xem xét và hỗ trợ điều chỉnh chiến lược, hệ thống của bạn."},
      {q: 'Học xong có được hỗ trợ công cụ, workflow không?', a: "Chắc chắn. Bạn sẽ được cung cấp miễn phí hoặc với ưu đãi độc quyền các Tool và Workflow Automation do đội ngũ phát triển."},
      {q: 'Tôi bận không học đều được thì sao?', a: "Toàn bộ bài giảng đã được ghi hình, bạn có thể học bất cứ lúc nào. Các Workshop thực hành cũng được ghi lại để xem sau."},
      {q: 'Học phí bao nhiêu? Có học thử không?', a: "Vui lòng liên hệ Hotline 0911809909 hoặc xem chi tiết trên trang đăng ký. Các bài giảng **FREE** là nội dung học thử chất lượng cao dành cho bạn."},
      {q: 'Học xong tôi có thể tự triển khai công việc được không?', a: "Mục tiêu của chúng tôi là Học để làm - Làm để ra tiền. Sau khi hoàn thành, bạn có thể tự tin triển khai công việc hoặc dự án kinh doanh của riêng mình."},
  ];

  return (
  <div className="landing-bg" style={{ color:'#eee' }}>
      {/* KHỐI CSS TÙY CHỈNH & HIỆU ỨNG MỚI */}
      <style>{`
        /* ---------------------------------------------------- */
        /* CSS CHUNG (TẠO HIỆU ỨNG TẠI CHỖ) */
        /* ---------------------------------------------------- */
        
        /* Animation: Slight shake for the badge */
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-3px); }
            40%, 80% { transform: translateX(3px); }
        }
        .ldh-learn-badge:hover {
            animation: shake 0.5s ease-in-out infinite;
        }

        /* ---------------------------------------------------- */
        /* CSS RIÊNG CHO FAQ (Tăng cỡ chữ & Màu trắng & Hiệu ứng) */
        /* ---------------------------------------------------- */
        
        /* Container Item (details) */
        .ldh-card details {
            transition: background-color 0.3s ease;
        }

        /* Hover effect for FAQ item */
        .ldh-card details:hover {
            background-color: #0f0f0f; /* Nền tối hơn khi hover */
        }
        
        /* Nội dung câu hỏi (summary) */
        .ldh-section .ldh-card details summary {
            font-size: 18px; 
            color: #ffbf00; 
            font-weight: 600;
        }

        /* Nội dung câu trả lời (div.small) */
        .ldh-section .ldh-card details .small {
            font-size: 16px !important; 
            line-height: 1.6;
            color: #ffffff !important; /* ĐÃ CHUYỂN SANG MÀU TRẮNG */
            padding-bottom: 8px;
        }
        
        /* ---------------------------------------------------- */
        /* CSS RIÊNG CHO BULLET (Hiệu ứng Fade-in/Hover) */
        /* ---------------------------------------------------- */
        .ldh-bullet-fade-in {
            opacity: 0.9;
            transform: translateX(0);
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .ldh-bullet-fade-in:hover {
            opacity: 1;
            transform: translateX(4px);
        }
      `}</style>
      {/* KẾT THÚC KHỐI CSS TÙY CHỈNH */}

      <div className="ldh-learn-container">
        {/* HERO */}
        <section className="ldh-learn-hero">
          <div>
            <span className="ldh-learn-badge "><IconifyIcon icon="ri:robot-fill" /> Kỷ nguyên AI & Kinh doanh số</span>
            <h1 className="ldh-learn-title ">3H STATION: HỌC – HỎI – HÀNH VỚI AI & HỆ THỐNG KINH DOANH THÔNG MINH</h1>
            <p className="ldh-learn-sub">Học cách ứng dụng AI, Automation & Tư duy tài chính hiện đại để xây dựng hệ thống bán hàng tự động – tạo dòng tiền thực tế.</p>

            <div className="ldh-grid-4" style={{display:'grid', gridTemplateColumns:'repeat(4, minmax(0,1fr))', gap:12, marginTop: 16}}>
              <Stat num="200+" label="học viên PRO" />
              <Stat num="4" label="mentor thực chiến" />
              <Stat num="9.698+" label="giờ học thực tế" />
              <Stat num="90%" label="áp dụng được sau học" />
            </div>
          </div>

          {/* Signup/Login Panel (dark version of the white mock) */}
          <div className="hero-panel">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div className="d-flex align-items-center gap-2">
                <div style={{width:28, height:28, borderRadius:6, background:'#ffd700'}} />
                <div className="fw-bold">🚀 ĐĂNG KÝ HỌC THỬ NGAY – HOÀN TOÀN MIỄN PHÍ</div>
              </div>
              <span className="badge" style={{background:'#ffbf00', color:'#000'}}>FREE</span>
            </div>
            {/* <div className="ldh-grid-3 mb-3">
              <div className="ldh-card text-center">KHÔNG CẦN NẠP THẺ</div>
              <div className="ldh-card text-center">KHÔNG NHẬP FORM</div>
              <div className="ldh-card text-center">ĐĂNG NHẬP LÀ HỌC NGAY</div>
            </div> */}
            {/* Tabs: Đăng ký | Đăng nhập - CTA primary & outline (toggle color) */}
            {heroTab !== 'forgot' && (
              <div className="hero-tabbar">
                <button
                  onClick={()=>setHeroTab('signup')}
                  className={`cta-btn ${heroTab==='signup' ? 'primary' : 'outline'}`}
                >ĐĂNG KÝ NGAY</button>
                <button
                  onClick={()=>setHeroTab('login')}
                  className={`cta-btn ${heroTab==='login' ? 'primary' : 'outline'}`}
                >Đăng nhập</button>
              </div>
            )}
            {heroTab !== 'forgot' && (
              <div className="mb-2 small" style={{color:'#e9c860'}}>Không cần thẻ, không cần đăng nhập phức tạp. Chỉ 1 phút đăng ký – nhận ngay quyền truy cập học thử.</div>
            )}
            <div className="ldh-form">
              {heroTab==='signup' ? (
                <SignupForm onRegister={register} loading={loading} />
              ) : heroTab==='forgot' ? (
                <ForgotPasswordForm onResetPassword={resetPassword} loading={loading} onBack={()=>setHeroTab('login')} />
              ) : (
                <LoginForm onLogin={login} loading={loading} onForgotPassword={()=>setHeroTab('forgot')} />
              )}
            </div>
            <div className="small text-center mt-2" style={{color:'#aaa'}}>🆓 Học miễn phí | Hiệu quả cao | Không ràng buộc</div>
          </div>
        </section>
        
        {/* --- */}
        {/* CTA WITH IMAGE (ĐÃ CẬP NHẬT NỘI DUNG 3H) */}
        <section className="ldh-section">
          <div className="ldh-card cta-split" style={{padding:20, display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, alignItems:'center'}}>
            <div>
              <div className="ldh-subtitle-pill ldh-rotating" style={{display:'inline-block', marginBottom:10}}>KHỞI ĐỘNG HÀNH TRÌNH 3H</div>
              <div className="ldh-title-xl" style={{textAlign:'left'}}>🎓 BIẾN KIẾN THỨC THÀNH HỆ THỐNG KIẾM TIỀN THỰC TẾ</div>
              <ul className="list-unstyled m-0" style={{display:'flex', flexDirection:'column', gap:10, marginTop:10}}>
                {[
                  '✅ Làm chủ tư duy tài chính & kinh doanh hiện đại để phát triển bền vững.',
                  '✅ Ứng dụng công cụ AI & Workflow Automation giúp tiết kiệm 90% thời gian marketing và vận hành.',
                  '✅ Xây dựng thương hiệu cá nhân & hệ thống bán hàng tự động có kiểm chứng thực tế.',
                  '✅ Học qua case study từ Ros và các mentor có kinh nghiệm trong hệ sinh thái 3H.',
                  '✅ Cơ hội kết nối cộng đồng, tham gia dự án và tạo thu nhập thực tế.'
                ].map((text, idx) => <Bullet key={idx}>{text}</Bullet>)}
              </ul>
            </div>
            <div className="ldh-img-card">
              <img src={bienkienthuc} className="ldh-img" style={{aspectRatio:'16/9'}}  alt="Biến kiến thức thành hệ thống kiếm tiền thực tế" />

              </div>
          </div>
        </section>

        {/* --- */}
        {/* STUDENT RESULTS EXPANDED */}
        {/* <section className="ldh-section">
          <div className="ldh-title-wrap">
            <div className="ldh-subtitle-pill ldh-rotating">THÀNH QUẢ TỪ HỆ THỐNG 3H</div>
           <div className="ldh-title-xl" >CÁC DỰ ÁN KINH DOANH SỐ THÀNH CÔNG</div>
          </div>
          <div className="ldh-grid-4">
            {Array.from({length:8}).map((_,i)=> (
              <div key={i} className="ldh-img-card">
                <div className="ldh-img" />
              </div>
            ))}
          </div>
        </section> */}
        
        {/* --- */}
        {/* PROJECTS/BRANDS (CẬP NHẬT BRANDING) */}
        <section className="ldh-section faq-bg">
          <div className="ldh-title-wrap">
            <div className="ldh-title-xl" >CÁC DỰ ÁN & THƯƠNG HIỆU ĐƯỢC HỆ THỐNG 3H ĐỒNG HÀNH</div>
            <div className="ldh-subtitle-pill ldh-rotating">TỪ STARTUP ĐẾN SOLOPRENEUR AI</div>
          </div>
          <div className="ldh-grid-4">
            {[duan1, duan2, duan3, duan4].map((img, i)=> (
              <div key={i} className="ldh-img-card">
                <img src={img} className="ldh-img" alt={`Dự án ${i + 1}`} />
                <div className="mt-2 fw-semibold" style={{color:'#fff'}}>Dự án {i===2? 'Blockchain & Crypto': i===1? 'Thương mại điện tử (E-commerce)': i===3? 'Giải pháp AI Marketing':'Xây dựng cộng đồng Solopreneur'}</div>
              </div>
            ))}
          </div>
        </section>

        {/* --- */}
        {/* STUDENT RESULTS (GIỮ NGUYÊN) */}
        <section className="ldh-section">
          <div className="ldh-title-wrap">
            <div className="ldh-subtitle-pill ldh-rotating">THÀNH QUẢ CỦA HỌC VIÊN</div>
            <div className="ldh-title-xl" >TĂNG TRƯỞNG THU NHẬP VÀ HIỆU SUẤT</div>
          </div>
          <div className="ldh-grid-4">
            {[TANG1, TANG2, TANG3, TANG4].map((img, i)=> (
              <div key={i} className="ldh-img-card">
<img
  src={img}
  className="ldh-img"
  alt={`Thành quả học viên ${i + 1}`}
  style={{ height: '600px' }}
/>
              </div>
            ))}
          </div>
        </section>

        {/* --- */}
        {/* BENEFITS FOR PRO (CẬP NHẬT QUYỀN LỢI PRO) */}
        <section className="ldh-section">
          <div className="ldh-grid-2">
            <div>
              <div className="ldh-title-xl" style={{textAlign:'left'}}>QUYỀN LỢI KHI THAM GIA KHOÁ HỌC PREMIUM</div>
              <div className="ldh-subtitle-pill ldh-rotating" style={{display:'inline-block', marginBottom: 14}}>ĐỂ TRỞ THÀNH PHIÊN BẢN TỈNH THỨC & HIỆU QUẢ HƠN</div>
              <ul className="list-unstyled m-0" style={{display:'flex', flexDirection:'column', gap:10}}>
                {proBenefits.map((t,idx)=> (
                  <li key={idx} className="ldh-bullet-strong"><i>➜</i><span>{t}</span></li>
                ))}
              </ul>
            </div>
            <div className="ldh-img-card">
              <img src={QUYENLOI} className="ldh-img" style={{aspectRatio:'16/9'}} alt="Quyền lợi khi tham gia khóa học Premium" />
            </div>
          </div>
        </section>

        {/* --- */}
        {/* ACCOMPANIMENT (CẬP NHẬT NỘI DUNG ĐỒNG HÀNH) */}
        <section className="ldh-section">
          <div className="ldh-grid-2">
            <div className="ldh-img-card">
              <img src={DONGHANH} className="ldh-img" style={{aspectRatio:'16/9'}} alt="Học - Hỏi - Hành: Đồng hành tới khi ra kết quả" />
            </div>
            <div>
              <div className="ldh-title-xl" style={{textAlign:'left'}}>HỌC – HỎI – HÀNH: ĐỒNG HÀNH TỚI KHI RA KẾT QUẢ</div>
              <div className="ldh-subtitle-pill ldh-rotating" style={{display:'inline-block', marginBottom: 14}}>MỤC TIÊU CUỐI CÙNG LÀ TẠO RA THU NHẬP</div>
              <ul className="list-unstyled m-0" style={{display:'flex', flexDirection:'column', gap:10}}>
                {accompanimentBullets.map((t,idx)=> (
                  <li key={idx} className="d-flex align-items-start" style={{gap:12, color:'#ddd'}}>
                    <IconifyIcon icon="ri:checkbox-circle-fill" style={{color:'#38d065', marginTop: 2}} />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
        
        {/* --- */}
        {/* FAQ SECTION (ĐÃ CẬP NHẬT MÀU VÀ KÍCH CỠ CHỮ) */}
        <section className="ldh-section">
          <div className="ldh-title-wrap">
            <div className="ldh-subtitle-pill ldh-rotating">NHỮNG CÂU HỎI THƯỜNG GẶP</div>
            <div className="ldh-title-xl" >KHI THAM GIA HỆ SINH THÁI 3H STATION</div>
          </div>
          <div className="ldh-card" style={{padding:0}}>
            {faqList.map((item,idx)=> (
              <details key={idx} style={{borderTop: idx? '1px solid #242424':'none', padding:'12px 16px'}}>
                <summary className="d-flex align-items-center justify-content-between" style={{cursor:'pointer', color:'#ffbf00', fontWeight:700}}>
                  <span>{idx+1}. {item.q}</span>
                  <span style={{color:'#ffbf00'}}>+</span>
                </summary>
                {/* Phần tử này sẽ có chữ màu trắng và cỡ 16px nhờ CSS block bên trên */}
                <div className="small text-muted mt-2">{item.a}</div> 
              </details>
            ))}
          </div>
        </section>
      </div>
      {/* CONTACT */}
      {/* <section className="ldh-section" style={{paddingTop:0}}>
        <div className="ldh-card" style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12}}>
          <div className="fw-bold" style={{color:'#ffd700'}}>LIÊN HỆ</div>
          <div className="d-flex align-items-center gap-3" style={{color:'#eee'}}>
            <div>Hotline: <strong>0911 809 909</strong></div>
            <div>Email: <strong>Support.3HStation@gmail.com</strong></div>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default LandingLearn;