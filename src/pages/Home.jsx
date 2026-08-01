import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AirVent, BadgePercent, Box, ChevronRight, Headphones, Laptop,
  RefreshCcw, ShieldCheck, ShoppingBag, Smartphone, Sparkles, Tv,
  WashingMachine,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

const homeCategories = [
  { name: 'Tivi', slug: 'tivi', image: '/assets/tv.png', icon: Tv },
  { name: 'Laptop', slug: 'laptop', image: '/assets/laptop.png', icon: Laptop },
  { name: 'Điện thoại', slug: 'dien-thoai', image: '/assets/phone.png', icon: Smartphone },
  { name: 'Máy tính bảng', slug: 'may-tinh-bang', image: '/assets/phone.png', icon: Smartphone },
  { name: 'Điều hòa', slug: 'dieu-hoa', image: '/assets/air-conditioner.png', icon: AirVent },
  { name: 'Tủ lạnh', slug: 'tu-lanh', image: '/assets/fridge.png', icon: Box },
  { name: 'Máy giặt', slug: 'may-giat', image: '/assets/washer.png', icon: WashingMachine },
  { name: 'Máy lọc nước', slug: 'may-loc-nuoc', image: '/assets/home-appliance.png', icon: ShoppingBag },
  { name: 'Lò vi sóng', slug: 'lo-vi-song', image: '/assets/home-appliance.png', icon: ShoppingBag },
];

const tabs = ['Dành cho bạn', 'Tivi', 'Laptop', 'Điện thoại', 'Tủ lạnh', 'Máy giặt', 'Điều hòa'];

export default function Home() {
  const { products = [], isLoading = false } = useStore();
  const [activeTab, setActiveTab] = useState('Dành cho bạn');

  const suggested = activeTab === 'Dành cho bạn'
    ? products.slice(6, 12)
    : products.filter((product) => {
      const normalized = product.category.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      const tab = activeTab.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      return normalized.includes(tab);
    });

  return (
    <div className="container nova-home">
      <section className="hero home-hero">
        <div className="hero-copy">
          <span className="hero-kicker">ĐẠI TIỆC ĐIỆN MÁY 2026</span>
          <h1>GIÁ HÈ <b>RỰC RỠ</b></h1>
          <p>Giảm đến <strong>50%</strong> · Trả góp 0% · Giao lắp miễn phí</p>
          <div className="hero-actions">
            <Link className="btn primary" to="/products">Săn deal ngay</Link>
            <Link className="btn secondary" to="/promotions">Xem thể lệ</Link>
          </div>
        </div>
        <div className="benefits">
          <span><Box /><b>Miễn phí giao hàng</b><small>Đơn từ 500.000đ</small></span>
          <span><BadgePercent /><b>Trả góp 0%</b><small>Lãi suất ưu đãi</small></span>
          <span><ShieldCheck /><b>Bảo hành chính hãng</b><small>100% chính hãng</small></span>
          <span><RefreshCcw /><b>Đổi trả dễ dàng</b><small>Trong 7 ngày</small></span>
        </div>
        <img className="hero-art" src="/assets/hero-nova-retail-v2.png" alt="Đại tiệc điện máy Nova với tivi, tủ lạnh, máy giặt và thiết bị công nghệ" />
      </section>

      <section className="campaign-strip" aria-label="Chương trình nổi bật">
        <Link to="/products?category=Tivi"><span>TV WEEK</span><b>Giảm đến 35%</b><small>Smart TV 4K chính hãng</small></Link>
        <Link to="/products?category=Máy lạnh"><span>MÙA HÈ MÁT LẠNH</span><b>Miễn phí lắp đặt</b><small>Điều hòa Inverter tiết kiệm điện</small></Link>
        <Link to="/promotions"><span>ĐỔI CŨ LẤY MỚI</span><b>Trợ giá 3 triệu</b><small>Áp dụng nhiều ngành hàng</small></Link>
      </section>

      <section className="home-categories" aria-label="Danh mục sản phẩm">
        {homeCategories.map(({ name, slug, image, icon: Icon }) => (
          <Link key={slug} to={`/products?category=${encodeURIComponent(name)}`}>
            <span className="category-visual"><img src={image} alt="" /><Icon /></span>
            <span>{name}</span>
          </Link>
        ))}
        <Link to="/products" className="category-more">
          <span className="category-visual"><span className="more-grid">••<br />••</span></span>
          <span>Xem thêm</span>
        </Link>
      </section>

      <section className="home-section featured-section">
        <div className="home-section-head">
          <h2><span>🔥</span> SẢN PHẨM NỔI BẬT</h2>
          <Link to="/products">Xem tất cả <ChevronRight size={14} /></Link>
        </div>
        <div className="featured-layout">
          <div className="product-grid six">
            {products.filter((product) => product.featured).slice(0, 6).map((product) => (
              <ProductCard key={product.id} p={product} />
            ))}
          </div>
          <div className="promo-stack">
            <Link to="/promotions" className="promo promo-installment">
              <div><b>TRẢ GÓP 0% LÃI SUẤT</b><small>Duyệt nhanh, kỳ hạn linh hoạt</small><em>Xem ngay</em></div>
              <strong>0<sup>%</sup></strong>
            </Link>
            <Link to="/promotions" className="promo promo-shipping">
              <div><b>FREESHIP TOÀN QUỐC</b><small>Đơn hàng từ 500.000đ</small><em>Xem ngay</em></div>
              <strong>🚚</strong>
            </Link>
            <Link to="/promotions" className="promo promo-flash">
              <div><b>GIỜ VÀNG GIÁ SỐC</b><small>Deal hot mỗi ngày</small><em>Xem ngay</em></div>
              <strong>%</strong>
            </Link>
          </div>
        </div>
      </section>

      <section className="home-section suggested-section">
        <div className="home-section-head suggestion-head">
          <h2><Sparkles size={18} /> GỢI Ý CHO BẠN</h2>
          <div className="chips">
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab}
                className={activeTab === tab ? 'active' : ''}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <Link to="/products">Xem tất cả <ChevronRight size={14} /></Link>
        </div>
        <div className="product-grid six">
          {(suggested.length ? suggested : products.slice(6, 12)).map((product) => (
            <ProductCard key={product.id} p={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
