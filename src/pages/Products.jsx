import React,{useEffect,useMemo,useState} from 'react';
import {useNavigate,useSearchParams} from 'react-router-dom';
import {ChevronLeft,ChevronRight,SlidersHorizontal} from 'lucide-react';
import {products,categories} from '../data/store';
import ProductCard from '../components/ProductCard';

const PAGE_SIZE=24;
const money=value=>new Intl.NumberFormat('vi-VN').format(value)+'đ';
const categoryBanners={
  'Tivi':['/assets/banner-tivi.png','TUẦN LỄ SMART TV','Mãn nhãn từng khung hình','Giảm đến 35%'],
  'Laptop':['/assets/banner-laptop.png','LAPTOP CHO MỌI NHU CẦU','Học tốt · Làm nhanh · Chơi chất','Giảm đến 30%'],
  'Điện thoại':['/assets/banner-phone.png','SMARTPHONE THẾ HỆ MỚI','Nâng cấp ngay, ưu đãi lớn','Trợ giá 3 triệu'],
  'Máy lạnh':['/assets/banner-air-conditioner.png','MÙA HÈ MÁT LẠNH','Mát nhanh, tiết kiệm điện','Miễn phí lắp đặt'],
  'Tủ lạnh':['/assets/banner-fridge.png','TƯƠI NGON TRỌN VỊ','Không gian bếp tiện nghi','Giảm đến 28%'],
  'Máy giặt':['/assets/banner-washer.png','SẠCH SÂU, NHÀN TÊNH','Chăm sóc từng sợi vải','Giảm đến 32%'],
  'Gia dụng':['/assets/banner-home-appliance.png','BẾP XINH, NHÀ TIỆN NGHI','Nấu ngon nhẹ nhàng hơn','Mua 2 giảm 10%'],
  'Phụ kiện':['/assets/banner-accessories.png','PHỤ KIỆN CÔNG NGHỆ','Kết nối phong cách mới','Đồng giá từ 199K'],
  'Âm thanh':['/assets/banner-audio.png','BẬT CHẤT ÂM','Không gian giải trí sống động','Giảm đến 40%']
};

export default function Products(){
  const navigate=useNavigate();
  const [params,setParams]=useSearchParams();
  const cat=params.get('category')||'Tất cả';
  const q=params.get('q')||'';
  const [max,setMax]=useState(45000000);
  const [sort,setSort]=useState('featured');
  const [brand,setBrand]=useState('Tất cả');
  const [saleOnly,setSaleOnly]=useState(false);
  const [page,setPage]=useState(1);
  const [filtersOpen,setFiltersOpen]=useState(false);

  const categoryProducts=useMemo(()=>products.filter(product=>cat==='Tất cả'||product.category===cat),[cat]);
  const brands=useMemo(()=>['Tất cả',...new Set(categoryProducts.map(product=>product.brand))],[categoryProducts]);
  const list=useMemo(()=>{
    let result=products.filter(product=>
      (cat==='Tất cả'||product.category===cat)&&
      (brand==='Tất cả'||product.brand===brand)&&
      product.price<=max&&
      (!saleOnly||product.discount>=20)&&
      (!q||product.name.toLowerCase().includes(q.toLowerCase()))
    );
    if(sort==='asc')result=[...result].sort((a,b)=>a.price-b.price);
    if(sort==='desc')result=[...result].sort((a,b)=>b.price-a.price);
    if(sort==='rating')result=[...result].sort((a,b)=>b.rating-a.rating);
    if(sort==='discount')result=[...result].sort((a,b)=>b.discount-a.discount);
    if(sort==='featured')result=[...result].sort((a,b)=>(b.bestseller-a.bestseller)||(b.featured-a.featured));
    return result;
  },[cat,q,max,sort,brand,saleOnly]);

  useEffect(()=>{setPage(1);setBrand('Tất cả')},[cat,q]);
  useEffect(()=>setPage(1),[max,sort,brand,saleOnly]);
  const pageCount=Math.max(1,Math.ceil(list.length/PAGE_SIZE));
  const visible=list.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE);
  const changeCategory=next=>next==='Tất cả'?navigate('/'):setParams({category:next});
  const banner=categoryBanners[cat]||['/assets/hero-nova-retail-v2.png','ĐIỆN MÁY NOVA','Chọn đúng sản phẩm, mua đúng giá','Hơn 100 sản phẩm'];

  return <>
    <section className={`catalog-hero category-tone-${Math.max(0,categories.findIndex(item=>item.name===cat)+1)}`} style={{'--category-banner':`url("${banner[0]}")`}}>
      <div className="container category-hero-inner">
        <div className="category-hero-copy">
          <span>{banner[1]}</span>
          <h1>{q?`Kết quả cho “${q}”`:banner[2]}</h1>
          <strong>{banner[3]}</strong>
          <p>Hàng chính hãng · Trả góp 0% · Giao lắp tận nơi</p>
          <a href="#catalog-products">Xem sản phẩm</a>
          <div className="category-perks"><span>✓ Giao nhanh</span><span>✓ Bảo hành chính hãng</span><span>✓ Đổi trả 7 ngày</span></div>
        </div>
        <div className="category-hero-visual"><i/><img src={banner[0]} alt={`Khuyến mại ${cat}`}/></div>
      </div>
    </section>
    <div className="container catalog-shell" id="catalog-products">
      <div className="category-pills">
        {['Tất cả',...categories.map(item=>item.name)].map(item=>
          <button key={item} className={cat===item?'active':''} onClick={()=>changeCategory(item)}>{item}</button>
        )}
      </div>
      <button className="mobile-filter-toggle" onClick={()=>setFiltersOpen(!filtersOpen)}>
        <SlidersHorizontal size={17}/> Bộ lọc sản phẩm
      </button>
      <div className="catalog">
        <aside className={`filters ${filtersOpen?'open':''}`}>
          <div className="filter-title"><h3>Bộ lọc</h3><button onClick={()=>{setMax(45000000);setBrand('Tất cả');setSaleOnly(false)}}>Xóa lọc</button></div>
          <div><b>Thương hiệu</b><div className="brand-filter">{brands.map(item=><button key={item} className={brand===item?'active':''} onClick={()=>setBrand(item)}>{item}</button>)}</div></div>
          <div><b>Mức giá tối đa</b><input type="range" min="1000000" max="45000000" step="1000000" value={max} onChange={event=>setMax(+event.target.value)}/><small>Đến {money(max)}</small></div>
          <label className="sale-filter"><input type="checkbox" checked={saleOnly} onChange={event=>setSaleOnly(event.target.checked)}/><span>Chỉ xem giảm từ 20%</span></label>
          <div className="filter-services"><b>Cam kết Nova</b><span>✓ 100% hàng chính hãng</span><span>✓ Giao lắp đúng hẹn</span><span>✓ Đổi trả trong 7 ngày</span></div>
        </aside>
        <section className="catalog-main">
          <div className="catalog-toolbar">
            <div><b>{list.length} sản phẩm</b><span>Trang {page}/{pageCount}</span></div>
            <select value={sort} onChange={event=>setSort(event.target.value)}>
              <option value="featured">Nổi bật nhất</option>
              <option value="discount">Giảm giá nhiều</option>
              <option value="asc">Giá thấp đến cao</option>
              <option value="desc">Giá cao đến thấp</option>
              <option value="rating">Đánh giá cao</option>
            </select>
          </div>
          {visible.length?<div className="product-grid four">{visible.map(product=><ProductCard key={product.id} p={product}/>)}</div>:<div className="empty">Không có sản phẩm phù hợp với bộ lọc.</div>}
          {pageCount>1&&<nav className="pagination" aria-label="Phân trang">
            <button disabled={page===1} onClick={()=>setPage(value=>value-1)}><ChevronLeft size={16}/></button>
            {Array.from({length:pageCount},(_,index)=>index+1).map(number=><button key={number} className={page===number?'active':''} onClick={()=>setPage(number)}>{number}</button>)}
            <button disabled={page===pageCount} onClick={()=>setPage(value=>value+1)}><ChevronRight size={16}/></button>
          </nav>}
        </section>
      </div>
    </div>
  </>;
}
