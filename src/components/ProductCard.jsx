import React from 'react';
import {Link} from 'react-router-dom';
import {Heart,Scale,ShoppingCart,Star} from 'lucide-react';
import {useStore} from '../context/StoreContext';
const money=n=>new Intl.NumberFormat('vi-VN').format(n)+'đ';
export default function ProductCard({p}){
  const {addToCart,toggleWishlist,toggleCompare,wishlist,compare}=useStore();
  return <article className="product-card">
    <div className="product-tools">
      <button className={wishlist.includes(p.id)?'active':''} onClick={()=>toggleWishlist(p.id)}><Heart size={16}/></button>
      <button className={compare.includes(p.id)?'active':''} onClick={()=>toggleCompare(p.id)}><Scale size={16}/></button>
    </div>
    <Link to={`/product/${p.slug}`} className="product-img"><img src={p.image} alt={p.name}/></Link>
    <span className="discount">-{p.discount}%</span>
    <Link to={`/product/${p.slug}`} className="product-name">{p.name}</Link>
    <div className="rating"><Star size={13} fill="currentColor"/> {p.rating} <span>({p.reviews})</span></div>
    <div className="price">{money(p.price)}</div><div className="old-price">{money(p.oldPrice)}</div>
    <div className="stock">Còn hàng • Giao nhanh</div>
    <button className="cart-add" onClick={()=>addToCart(p.id)}><ShoppingCart size={17}/></button>
  </article>
}
