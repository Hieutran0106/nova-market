import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {products} from '../data/store';

const StoreContext=createContext(null);
export function StoreProvider({children}){
  const [cart,setCart]=useState(()=>JSON.parse(localStorage.getItem('nova_cart_v2')||'{}'));
  const [wishlist,setWishlist]=useState(()=>JSON.parse(localStorage.getItem('nova_wishlist')||'[]'));
  const [compare,setCompare]=useState([]);
  const [user,setUser]=useState(()=>JSON.parse(localStorage.getItem('nova_user')||'null'));
  const [toast,setToast]=useState('');

  useEffect(()=>localStorage.setItem('nova_cart_v2',JSON.stringify(cart)),[cart]);
  useEffect(()=>localStorage.setItem('nova_wishlist',JSON.stringify(wishlist)),[wishlist]);
  useEffect(()=>localStorage.setItem('nova_user',JSON.stringify(user)),[user]);

  const notify=(msg)=>{setToast(msg);setTimeout(()=>setToast(''),2200)};
  const addToCart=(id,qty=1)=>{setCart(c=>({...c,[id]:(c[id]||0)+qty}));notify('Đã thêm sản phẩm vào giỏ hàng')};
  const updateQty=(id,qty)=>setCart(c=>{const n={...c};if(qty<=0)delete n[id];else n[id]=qty;return n});
  const toggleWishlist=id=>{setWishlist(w=>w.includes(id)?w.filter(x=>x!==id):[...w,id]);notify(wishlist.includes(id)?'Đã bỏ khỏi yêu thích':'Đã thêm vào yêu thích')};
  const toggleCompare=id=>{setCompare(c=>c.includes(id)?c.filter(x=>x!==id):c.length>=3?(notify('Chỉ có thể so sánh tối đa 3 sản phẩm'),c):[...c,id])};
  const cartCount=Object.values(cart).reduce((a,b)=>a+b,0);
  const cartItems=Object.entries(cart).map(([id,qty])=>({product:products.find(p=>p.id===+id),qty})).filter(x=>x.product);
  const cartTotal=cartItems.reduce((s,x)=>s+x.product.price*x.qty,0);
  const value=useMemo(()=>({cart,wishlist,compare,user,setUser,toast,notify,addToCart,updateQty,toggleWishlist,toggleCompare,cartCount,cartItems,cartTotal}),[cart,wishlist,compare,user,toast]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
export const useStore=()=>useContext(StoreContext);
