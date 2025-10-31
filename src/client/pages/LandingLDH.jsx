import React from 'react';
import { Icon as IconifyIcon } from '@iconify/react';

// All classes are prefixed with ldh- to avoid conflicts
const LandingLDH = () => {
  const Section = ({ children, style }) => (
    <section className="ldh-section" style={style}>{children}</section>
  );

  return (
    <div className="ldh-root" style={{background:'#0a0a0a', color:'#eee'}}>
      <style>{`
        .ldh-root a { text-decoration: none; }
        .ldh-container { max-width: 1200px; margin: 0 auto; padding: 0 16px; }
        .ldh-hero { padding: 48px 0 24px; display:flex; flex-direction:column; gap:16px; }
        .ldh-badge { display:inline-flex; align-items:center; gap:8px; padding:6px 10px; border-radius:999px; background:#141414; color:#ffc107; font-weight:700; font-size:12px; border:1px solid #222; }
        .ldh-title { font-size: 32px; font-weight: 800; line-height: 1.3; color:#fff; margin: 0; }
        .ldh-sub { color:#bbb; max-width: 760px; }
        .ldh-cta { display:flex; gap:12px; margin-top: 16px; }
        .ldh-btn { border:none; border-radius:10px; padding:12px 18px; font-weight:700; cursor:pointer; }
        .ldh-btn-primary { background:#ffd700; color:#000; }
        .ldh-btn-primary:hover { filter: brightness(0.95); }
        .ldh-btn-secondary { background:#ffb300; color:#000; }
        .ldh-grid { display:grid; grid-template-columns: repeat(3, 1fr); gap:16px; margin-top: 24px; }
        .ldh-card { background:#111; border:1px solid #1f1f1f; border-radius:12px; padding:16px; }
        .ldh-card h3 { color:#fff; font-size:18px; margin: 0 0 8px; }
        .ldh-metrics { display:grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap:12px; margin-top: 16px; }
        .ldh-metric { background:#111; border:1px solid #1f1f1f; border-radius:10px; padding:12px; text-align:center; }
        .ldh-metric .num { font-size:20px; font-weight:800; color:#fff; }
        .ldh-metric .label { color:#aaa; font-size:12px; }
        @media (max-width: 1024px) { .ldh-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .ldh-grid { grid-template-columns: 1fr; } .ldh-hero { padding-top: 24px; } }
      `}</style>

      <div className="ldh-container">
        {/* Hero */}
        <div className="ldh-hero">
          <span className="ldh-badge"><IconifyIcon icon="ri:flashlight-fill"/> AI TikTok Mastery</span>
          <h1 className="ldh-title">Khoá học TikTok Ads hiệu quả & Ứng dụng AI làm video bán hàng</h1>
          <p className="ldh-sub">Từ chiến lược, công cụ đến cách thức triển khai kinh doanh, quảng cáo và xây dựng hệ thống trên TikTok. Chỉ cần một khoá học tập trung & hiệu quả để bắt đầu và tăng trưởng.</p>
          <div className="ldh-cta">
            <a href="/signup" className="ldh-btn ldh-btn-primary">Đăng ký học thử ngay</a>
            <a href="/signin" className="ldh-btn ldh-btn-secondary">Đăng nhập</a>
          </div>
        </div>

        {/* Cards: You will learn */}
        <Section>
          <div className="ldh-grid">
            {[
              {icon:'ri:shopping-bag-3-line', title:'Chọn sản phẩm & test thị trường', text:'Cách chọn sản phẩm dễ ra đơn & test TikTok Shop.'},
              {icon:'ri:film-line', title:'Làm video bán hàng bằng AI', text:'Tạo video nhanh gọn, không cần mẫu thật, tối ưu chuyển đổi.'},
              {icon:'ri:advertisement-line', title:'Cấu trúc content chuẩn Ads', text:'Tăng chuyển đổi 2–3 lần với công thức nội dung.'},
              {icon:'ri:focus-2-line', title:'Chạy Ads theo phễu', text:'Bám sát từng hành vi người dùng, tối ưu chi phí.'},
              {icon:'ri:line-chart-line', title:'Tối ưu chiến dịch', text:'Giảm lãng phí ngân sách, nâng ROAS.'},
              {icon:'ri:gift-line', title:'Bonus Facebook Ads', text:'Tặng khoá Facebook Ads trị giá 5.000.000đ.'},
            ].map((i, idx)=> (
              <div key={idx} className="ldh-card">
                <div style={{display:'flex', alignItems:'center', gap:10}}>
                  <IconifyIcon icon={i.icon} className="text-warning" />
                  <h3>{i.title}</h3>
                </div>
                <p style={{color:'#aaa', margin:0}}>{i.text}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Metrics */}
        <Section>
          <div className="ldh-metrics">
            <div className="ldh-metric"><div className="num">2896</div><div className="label">Học viên PRO</div></div>
            <div className="ldh-metric"><div className="num">4</div><div className="label">Khoá học đã ra mắt</div></div>
            <div className="ldh-metric"><div className="num">9698</div><div className="label">Học viên Free</div></div>
            <div className="ldh-metric"><div className="num">90%</div><div className="label">Tỉ lệ tăng trưởng</div></div>
          </div>
        </Section>
      </div>
    </div>
  );
};

export default LandingLDH;


