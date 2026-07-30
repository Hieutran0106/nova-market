import React,{useState} from 'react';
import {Link,useLocation,useNavigate} from 'react-router-dom';
import {Home,Menu,Search,Phone,User,ShoppingCart,Heart,Scale,X} from 'lucide-react';
import {categories,products} from '../data/store';
import {useStore} from '../context/StoreContext';
import NovaAssistant from './NovaAssistant';

export default function Layout({children}){
  const nav=useNavigate(), location=useLocation(), {cartCount,wishlist,compare,user}=useStore();
  const [q,setQ]=useState(''),[suggest,setSuggest]=useState(false),[mobile,setMobile]=useState(false);
  const matches=q?products.filter(p=>p.name.toLowerCase().includes(q.toLowerCase())).slice(0,5):[];
  const submit=e=>{e.preventDefault();nav(`/products?q=${encodeURIComponent(q)}`);setSuggest(false)};
  return <>
    <header className="header">
      <div className="top container">
        <button className="mobile-menu icon-btn" onClick={()=>setMobile(true)}><Menu/></button>
        <Link to="/" className="brand"><span className="brand-n">N</span><span><b>Điện Máy Nova</b><small>Công nghệ hiện đại - Cuộc sống tiện nghi</small></span></Link>
        <form className="search" onSubmit={submit}>
          <input value={q} onChange={e=>{setQ(e.target.value);setSuggest(true)}} placeholder="Bạn cần tìm sản phẩm gì hôm nay?"/>
          <button><Search size={20}/> <span>Tìm kiếm</span></button>
          {suggest&&q&&<div className="suggest-box">{matches.length?matches.map(p=><button type="button" key={p.id} onClick={()=>nav(`/product/${p.slug}`)}>{p.name}</button>):<div>Không tìm thấy gợi ý phù hợp</div>}</div>}
        </form>
        <div className="head-actions">
          <a href="tel:19008888"><Phone/><span><small>Hotline</small><b>1900 8888</b><em>8:00 - 22:00</em></span></a>
          <Link to="/account"><User/><span><small>{user?'Xin chào':'Tài khoản'}</small><b>{user?.name||'Đăng nhập / Đăng ký'}</b></span></Link>
          <Link to="/wishlist" className="action-icon"><Heart/><i>{wishlist.length}</i></Link>
          <Link to="/compare" className="action-icon"><Scale/><i>{compare.length}</i></Link>
          <Link to="/cart" className="action-icon"><ShoppingCart/><i>{cartCount}</i></Link>
        </div>
      </div>
      <nav className="nav"><div className="container nav-inner">
        <Link to="/" className="all-cat"><Home size={18}/> TRANG CHỦ</Link>
        {categories.map(c=><Link key={c.slug} to={`/products?category=${encodeURIComponent(c.name)}`}>{c.icon} {c.name}</Link>)}
        <Link to="/promotions">◇ Khuyến mãi</Link>
      </div></nav>
    </header>
    {mobile&&<><div className="backdrop" onClick={()=>setMobile(false)}/><aside className="mobile-drawer"><div className="drawer-title"><b>Danh mục</b><button onClick={()=>setMobile(false)}><X/></button></div><Link onClick={()=>setMobile(false)} to="/"><Home size={16}/> Trang chủ</Link>{categories.map(c=><Link onClick={()=>setMobile(false)} key={c.slug} to={`/products?category=${encodeURIComponent(c.name)}`}>{c.icon} {c.name}</Link>)}</aside></>}
    <main>
      {location.pathname!=='/'&&<Link to="/" className="back-home"><Home size={15}/> Về trang chủ</Link>}
      <RouteCampaign path={location.pathname}/>
      {children}
    </main>
    <Footer/>
    <NovaAssistant/>
  </>
}

const campaignRoutes=[
  {match:path=>path.startsWith('/product/'),kicker:'NOVA SELECT',title:'Sản phẩm chính hãng, ưu đãi tận tay',copy:'Tư vấn đúng nhu cầu · Trả góp 0% · Giao lắp tận nơi',image:'/assets/tv.png',tone:'blue'},
  {match:path=>path==='/cart',kicker:'GIỎ HÀNG CỦA BẠN',title:'Chốt đơn hôm nay, nhận ngay ưu đãi',copy:'Miễn phí vận chuyển theo điều kiện · Đổi trả trong 7 ngày',image:'/assets/home-appliance.png',tone:'orange'},
  {match:path=>path==='/checkout',kicker:'THANH TOÁN AN TOÀN',title:'Hoàn tất đơn hàng chỉ trong vài phút',copy:'Bảo mật thông tin · Xác nhận nhanh · Hỗ trợ tận tâm',image:'/assets/phone.png',tone:'cyan'},
  {match:path=>path==='/wishlist',kicker:'DANH SÁCH YÊU THÍCH',title:'Lưu lại sản phẩm bạn đang quan tâm',copy:'Theo dõi giá tốt và chọn mua khi phù hợp',image:'/assets/laptop.png',tone:'purple'},
  {match:path=>path==='/compare',kicker:'SO SÁNH THÔNG MINH',title:'Đặt thông số cạnh nhau, chọn lựa dễ hơn',copy:'So sánh giá · Tính năng · Đánh giá · Tồn kho',image:'/assets/phone.png',tone:'blue'},
  {match:path=>path==='/account',kicker:'NOVA MEMBER',title:'Một tài khoản, nhiều quyền lợi',copy:'Quản lý đơn hàng · Lưu sản phẩm · Nhận ưu đãi riêng',image:'/assets/earbuds.png',tone:'purple'},
  {match:path=>path==='/orders'||path==='/order-success',kicker:'THEO DÕI ĐƠN HÀNG',title:'Luôn biết đơn hàng đang ở đâu',copy:'Cập nhật trạng thái và hỗ trợ giao nhận nhanh chóng',image:'/assets/speaker.png',tone:'cyan'},
  {match:path=>['/about','/stores','/policy','/contact'].includes(path),kicker:'ĐIỆN MÁY NOVA',title:'Công nghệ hiện đại, dịch vụ tận tâm',copy:'Hàng chính hãng · Hệ thống giao lắp chuyên nghiệp',image:'/assets/fridge.png',tone:'blue'}
];

function RouteCampaign({path}){
  if(path==='/'||path==='/products'||path==='/promotions'||path==='/account')return null;
  const campaign=campaignRoutes.find(item=>item.match(path))||{kicker:'ĐIỆN MÁY NOVA',title:'Mua sắm tiện nghi, an tâm mỗi ngày',copy:'Hàng chính hãng · Giá tốt · Dịch vụ tận tâm',image:'/assets/home-appliance.png',tone:'blue'};
  return <section className={`route-campaign ${campaign.tone}`}><div className="container route-campaign-inner">
    <div><span>{campaign.kicker}</span><h2>{campaign.title}</h2><p>{campaign.copy}</p></div>
    <figure><i/><img src={campaign.image} alt="Ưu đãi Điện Máy Nova"/></figure>
  </div></section>
}
function Footer(){return <footer className="footer"><div className="container footer-grid">
  <section><Link to="/" className="brand light"><span className="brand-n">N</span><span><b>Điện Máy Nova</b><small>Công nghệ hiện đại - Cuộc sống tiện nghi</small></span></Link><p>Hệ thống bán lẻ điện máy tích hợp trợ lý AI Nova Core, giúp chọn đúng sản phẩm theo nhu cầu và ngân sách.</p></section>
  <section><h4>Hỗ trợ khách hàng</h4><Link to="/policy">Chính sách bảo hành</Link><Link to="/policy">Chính sách đổi trả</Link><Link to="/orders">Tra cứu đơn hàng</Link><Link to="/contact">Liên hệ</Link></section>
  <section><h4>Về Nova</h4><Link to="/about">Giới thiệu</Link><Link to="/stores">Hệ thống cửa hàng</Link><Link to="/promotions">Khuyến mãi</Link><Link to="/account">Tài khoản thành viên</Link></section>
  <section><h4>Liên hệ</h4><p>Hotline: <b>1900 8888</b></p><p>Email: hotro@dienmaynova.vn</p><p>Thời gian: 8:00 - 22:00</p></section>
</div><div className="copyright">© 2026 Điện Máy Nova. Demo frontend thương mại điện tử.</div></footer>}
