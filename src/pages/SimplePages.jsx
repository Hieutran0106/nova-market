import React,{useState} from 'react';import {Link} from 'react-router-dom';import {ChevronRight,Eye,EyeOff,Gift,Heart,LockKeyhole,LogOut,Mail,Package,Phone,ShieldCheck,Truck,UserRound} from 'lucide-react';import {products,promotions} from '../data/store';import ProductCard from '../components/ProductCard';import {useStore} from '../context/StoreContext';
export function Promotions(){const deals=[...products].sort((a,b)=>b.discount-a.discount).slice(0,8);return <><section className="promo-hero"><div className="container"><span>ĐẠI TIỆC KHUYẾN MẠI</span><h1>GIỜ VÀNG GIÁ SỐC</h1><p>Deal mới mỗi ngày · Số lượng có hạn · Hàng chính hãng</p><Link className="btn primary" to="/products">Săn deal ngay</Link></div></section><div className="container promo-page"><div className="promo-cards">{promotions.map((x,i)=><article key={i} className={x.className}><span>{x.icon}</span><div><h3>{x.title}</h3><p>{x.desc}</p></div></article>)}</div><section className="promo-products"><div className="promo-section-head"><div><span>FLASH SALE</span><h2>Giảm sâu hôm nay</h2></div><Link to="/products">Xem tất cả →</Link></div><div className="product-grid four">{deals.map(product=><ProductCard key={product.id} p={product}/>)}</div></section></div></>}
export function Wishlist(){const {wishlist}=useStore();const list=products.filter(p=>wishlist.includes(p.id));return <div className="container generic-page"><h1>Sản phẩm yêu thích</h1>{list.length?<div className="product-grid four">{list.map(p=><ProductCard key={p.id} p={p}/>)}</div>:<div className="empty">Bạn chưa có sản phẩm yêu thích.</div>}</div>}
export function Compare(){const {compare}=useStore();const list=products.filter(p=>compare.includes(p.id));return <div className="container generic-page"><h1>So sánh sản phẩm</h1>{list.length<2?<div className="empty">Hãy chọn ít nhất 2 sản phẩm để so sánh.</div>:<div className="compare-table"><div></div>{list.map(p=><b key={p.id}>{p.name}</b>)}{['price','rating','stock'].map(k=><React.Fragment key={k}><span>{k==='price'?'Giá bán':k==='rating'?'Đánh giá':'Tồn kho'}</span>{list.map(p=><div key={p.id}>{k==='price'?new Intl.NumberFormat('vi-VN').format(p.price)+'đ':k==='rating'?p.rating:p.stock+' sản phẩm'}</div>)}</React.Fragment>)}</div>}</div>}
export function Account(){
  const {user,setUser,notify,wishlist}=useStore();
  const [mode,setMode]=useState('login');
  const [showPassword,setShowPassword]=useState(false);
  const [error,setError]=useState('');
  const [form,setForm]=useState({name:'',identity:'',phone:'',email:'',password:'',confirm:'',remember:true,agree:false});
  const update=(key,value)=>{setForm(current=>({...current,[key]:value}));setError('')};

  if(user)return <div className="container account-page">
    <div className="account-dashboard">
      <aside className="account-profile">
        <div className="profile-avatar">{user.name?.charAt(0)?.toUpperCase()||'N'}</div>
        <span>THÀNH VIÊN NOVA</span>
        <h1>{user.name}</h1>
        <p>{user.email||user.phone}</p>
        <div className="member-rank"><b>Hạng Bạc</b><small>Tích thêm 2.000 điểm để lên hạng Vàng</small><i><em/></i></div>
        <button className="account-logout" onClick={()=>{setUser(null);notify('Đã đăng xuất')}}><LogOut size={16}/> Đăng xuất</button>
      </aside>
      <section className="account-overview">
        <div className="account-welcome"><div><span>Xin chào, {user.name}</span><h2>Quản lý tài khoản của bạn</h2><p>Theo dõi đơn hàng, sản phẩm yêu thích và ưu đãi thành viên tại một nơi.</p></div><ShieldCheck size={46}/></div>
        <div className="account-stats">
          <Link to="/orders"><Package/><div><b>Đơn hàng</b><span>Theo dõi và quản lý</span></div><ChevronRight/></Link>
          <Link to="/wishlist"><Heart/><div><b>{wishlist.length} yêu thích</b><span>Sản phẩm đã lưu</span></div><ChevronRight/></Link>
          <Link to="/promotions"><Gift/><div><b>Ưu đãi của tôi</b><span>Khám phá deal thành viên</span></div><ChevronRight/></Link>
        </div>
        <div className="account-info-card"><div><h3>Thông tin cá nhân</h3><button onClick={()=>notify('Tính năng chỉnh sửa đang được cập nhật')}>Chỉnh sửa</button></div><dl><div><dt>Họ và tên</dt><dd>{user.name}</dd></div><div><dt>Email</dt><dd>{user.email||'Chưa cập nhật'}</dd></div><div><dt>Số điện thoại</dt><dd>{user.phone||'Chưa cập nhật'}</dd></div></dl></div>
      </section>
    </div>
  </div>;

  const submit=event=>{
    event.preventDefault();
    if(mode==='login'){
      if(!form.identity.trim()||form.password.length<6){setError('Vui lòng nhập tài khoản và mật khẩu tối thiểu 6 ký tự.');return}
      const isEmail=form.identity.includes('@');
      setUser({name:isEmail?form.identity.split('@')[0]:'Khách hàng Nova',email:isEmail?form.identity:'',phone:isEmail?'':form.identity});
      notify('Đăng nhập thành công');
      return;
    }
    if(!form.name.trim()||!form.phone.trim()||!form.email.trim()){setError('Vui lòng điền đầy đủ thông tin bắt buộc.');return}
    if(form.password.length<6){setError('Mật khẩu cần có ít nhất 6 ký tự.');return}
    if(form.password!==form.confirm){setError('Mật khẩu xác nhận chưa trùng khớp.');return}
    if(!form.agree){setError('Bạn cần đồng ý với điều khoản sử dụng.');return}
    setUser({name:form.name,email:form.email,phone:form.phone});
    notify('Đăng ký thành công');
  };

  return <div className="container auth-page">
    <section className="auth-benefits">
      <span className="auth-kicker">NOVA MEMBER</span>
      <h1>Mua sắm tiện hơn,<br/><b>nhận nhiều quyền lợi hơn</b></h1>
      <p>Đăng nhập để quản lý đơn hàng và nhận ưu đãi dành riêng cho thành viên.</p>
      <div className="auth-benefit-list">
        <article><span><Gift/></span><div><b>Ưu đãi thành viên</b><small>Nhận voucher và deal độc quyền mỗi tháng</small></div></article>
        <article><span><Truck/></span><div><b>Giao hàng thuận tiện</b><small>Lưu địa chỉ và theo dõi đơn hàng nhanh chóng</small></div></article>
        <article><span><ShieldCheck/></span><div><b>Bảo hành dễ dàng</b><small>Quản lý sản phẩm và lịch sử bảo hành online</small></div></article>
      </div>
      <div className="auth-trust"><ShieldCheck size={17}/><span>Thông tin của bạn được mã hóa và bảo mật</span></div>
    </section>
    <section className="auth-card">
      <div className="auth-tabs">
        <button className={mode==='login'?'active':''} onClick={()=>{setMode('login');setError('')}}>Đăng nhập</button>
        <button className={mode==='register'?'active':''} onClick={()=>{setMode('register');setError('')}}>Đăng ký</button>
      </div>
      <div className="auth-heading"><h2>{mode==='login'?'Chào mừng bạn trở lại':'Tạo tài khoản Nova'}</h2><p>{mode==='login'?'Đăng nhập để tiếp tục mua sắm':'Chỉ mất một phút để trở thành thành viên'}</p></div>
      <form className="auth-form" onSubmit={submit} noValidate>
        {mode==='register'&&<div className="auth-field"><label htmlFor="auth-name">Họ và tên <i>*</i></label><div><UserRound/><input id="auth-name" value={form.name} onChange={event=>update('name',event.target.value)} placeholder="Nguyễn Văn An" autoComplete="name"/></div></div>}
        {mode==='login'?<div className="auth-field"><label htmlFor="auth-identity">Số điện thoại hoặc email</label><div><Mail/><input id="auth-identity" value={form.identity} onChange={event=>update('identity',event.target.value)} placeholder="0901 234 567 hoặc email@example.com" autoComplete="username"/></div></div>:<>
          <div className="auth-field-row">
            <div className="auth-field"><label htmlFor="auth-phone">Số điện thoại <i>*</i></label><div><Phone/><input id="auth-phone" value={form.phone} onChange={event=>update('phone',event.target.value)} placeholder="0901 234 567" inputMode="tel" autoComplete="tel"/></div></div>
            <div className="auth-field"><label htmlFor="auth-email">Email <i>*</i></label><div><Mail/><input id="auth-email" type="email" value={form.email} onChange={event=>update('email',event.target.value)} placeholder="email@example.com" autoComplete="email"/></div></div>
          </div>
        </>}
        <div className="auth-field"><label htmlFor="auth-password">Mật khẩu {mode==='register'&&<i>*</i>}</label><div><LockKeyhole/><input id="auth-password" type={showPassword?'text':'password'} value={form.password} onChange={event=>update('password',event.target.value)} placeholder="Tối thiểu 6 ký tự" autoComplete={mode==='login'?'current-password':'new-password'}/><button type="button" onClick={()=>setShowPassword(value=>!value)} aria-label={showPassword?'Ẩn mật khẩu':'Hiện mật khẩu'}>{showPassword?<EyeOff/>:<Eye/>}</button></div></div>
        {mode==='register'&&<div className="auth-field"><label htmlFor="auth-confirm">Xác nhận mật khẩu <i>*</i></label><div><LockKeyhole/><input id="auth-confirm" type={showPassword?'text':'password'} value={form.confirm} onChange={event=>update('confirm',event.target.value)} placeholder="Nhập lại mật khẩu" autoComplete="new-password"/></div></div>}
        {mode==='login'?<div className="auth-options"><label><input type="checkbox" checked={form.remember} onChange={event=>update('remember',event.target.checked)}/> Ghi nhớ đăng nhập</label><button type="button" onClick={()=>notify('Hướng dẫn đặt lại mật khẩu đã được gửi')}>Quên mật khẩu?</button></div>:<label className="auth-agree"><input type="checkbox" checked={form.agree} onChange={event=>update('agree',event.target.checked)}/><span>Tôi đồng ý với <Link to="/policy">Điều khoản sử dụng</Link> và <Link to="/policy">Chính sách bảo mật</Link>.</span></label>}
        {error&&<div className="auth-error">{error}</div>}
        <button className="auth-submit">{mode==='login'?'Đăng nhập':'Tạo tài khoản'} <ChevronRight size={17}/></button>
      </form>
      <div className="auth-divider"><span>hoặc tiếp tục với</span></div>
      <div className="social-login"><button onClick={()=>notify('Đăng nhập Google đang được cập nhật')}><b>G</b> Google</button><button onClick={()=>notify('Đăng nhập Facebook đang được cập nhật')}><b>f</b> Facebook</button></div>
    </section>
  </div>;
}
export function Orders(){const order=JSON.parse(localStorage.getItem('last_order')||'null');return <div className="container generic-page"><h1>Đơn hàng của tôi</h1>{order?<div className="order-box"><h2>{order.code}</h2><p>Trạng thái: <b>{order.status}</b></p><p>Tổng tiền: <b>{new Intl.NumberFormat('vi-VN').format(order.total)}đ</b></p></div>:<div className="empty">Chưa có đơn hàng nào.</div>}</div>}
export function OrderSuccess(){const order=JSON.parse(localStorage.getItem('last_order')||'null');return <div className="container success-page"><div>✓</div><h1>Đặt hàng thành công</h1><p>Mã đơn hàng: <b>{order?.code}</b></p><Link className="btn primary" to="/orders">Theo dõi đơn hàng</Link></div>}
export function Generic({title,children}){return <div className="container generic-page"><h1>{title}</h1><div className="content-box">{children||<p>Nội dung đang được cập nhật.</p>}</div></div>}
