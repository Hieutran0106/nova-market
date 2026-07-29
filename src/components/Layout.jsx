import React,{useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import {Menu,Search,Phone,User,ShoppingCart,Heart,Scale,X} from 'lucide-react';
import {categories,products} from '../data/store';
import {useStore} from '../context/StoreContext';
import NovaAssistant from './NovaAssistant';

export default function Layout({children}){
  const nav=useNavigate(), {cartCount,wishlist,compare,user}=useStore();
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
        <button className="all-cat"><Menu size={18}/> DANH MỤC SẢN PHẨM</button>
        {categories.map(c=><Link key={c.slug} to={`/products?category=${encodeURIComponent(c.name)}`}>{c.icon} {c.name}</Link>)}
        <Link to="/promotions">◇ Khuyến mãi</Link>
      </div></nav>
    </header>
    {mobile&&<><div className="backdrop" onClick={()=>setMobile(false)}/><aside className="mobile-drawer"><div className="drawer-title"><b>Danh mục</b><button onClick={()=>setMobile(false)}><X/></button></div>{categories.map(c=><Link onClick={()=>setMobile(false)} key={c.slug} to={`/products?category=${encodeURIComponent(c.name)}`}>{c.icon} {c.name}</Link>)}</aside></>}
    <main>{children}</main>
    <Footer/>
    <NovaAssistant/>
  </>
}
function Footer(){return <footer className="footer"><div className="container footer-grid">
  <section><Link to="/" className="brand light"><span className="brand-n">N</span><span><b>Điện Máy Nova</b><small>Công nghệ hiện đại - Cuộc sống tiện nghi</small></span></Link><p>Hệ thống bán lẻ điện máy tích hợp trợ lý AI Nova Core, giúp chọn đúng sản phẩm theo nhu cầu và ngân sách.</p></section>
  <section><h4>Hỗ trợ khách hàng</h4><Link to="/policy">Chính sách bảo hành</Link><Link to="/policy">Chính sách đổi trả</Link><Link to="/orders">Tra cứu đơn hàng</Link><Link to="/contact">Liên hệ</Link></section>
  <section><h4>Về Nova</h4><Link to="/about">Giới thiệu</Link><Link to="/stores">Hệ thống cửa hàng</Link><Link to="/promotions">Khuyến mãi</Link><Link to="/account">Tài khoản thành viên</Link></section>
  <section><h4>Liên hệ</h4><p>Hotline: <b>1900 8888</b></p><p>Email: hotro@dienmaynova.vn</p><p>Thời gian: 8:00 - 22:00</p></section>
</div><div className="copyright">© 2026 Điện Máy Nova. Demo frontend thương mại điện tử.</div></footer>}
