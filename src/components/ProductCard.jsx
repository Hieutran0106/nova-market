import React from 'react';
import {Link} from 'react-router-dom';
import {Heart,Scale,ShoppingCart,Star} from 'lucide-react';
import {useStore} from '../context/StoreContext';
const money=n=>new Intl.NumberFormat('vi-VN').format(n)+'đ';
export default function ProductCard({p}){
  const {addToCart,toggleWishlist,toggleCompare,wishlist,compare}=useStore();
  return <article className={`product-card variant-${p.imageVariant??0}`}>
    {p.bestseller&&<span className="product-ribbon">BÁN CHẠY</span>}
    <div className="product-tools">
      <button aria-label="Thêm vào yêu thích" className={wishlist.includes(p.id)?'active':''} onClick={()=>toggleWishlist(p.id)}><Heart size={16}/></button>
      <button aria-label="Thêm vào so sánh" className={compare.includes(p.id)?'active':''} onClick={()=>toggleCompare(p.id)}><Scale size={16}/></button>
    </div>
    <Link to={`/product/${p.slug}`} className="product-img"><img src={p.image} alt={p.name}/></Link>
    <span className="discount">-{p.discount}%</span>
    <span className="product-brand">{p.brand}</span>
    <Link to={`/product/${p.slug}`} className="product-name">{p.name}</Link>
    <div className="product-tags">{p.tags?.slice(0,2).map(tag=><span key={tag}>{tag}</span>)}</div>
    <div className="rating"><Star size={13} fill="currentColor"/> {p.rating} <span>({p.reviews})</span></div>
    <div className="price">{money(p.price)}</div><div className="old-price">{money(p.oldPrice)}</div>
    <div className="stock">Còn hàng • Giao nhanh</div>
    <button aria-label="Thêm vào giỏ hàng" className="cart-add" onClick={()=>addToCart(p.id)}><ShoppingCart size={17}/></button>
  </article>
}
