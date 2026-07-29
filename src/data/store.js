export const categories = [
  {name:'Tivi', icon:'📺', slug:'tivi'},
  {name:'Laptop', icon:'💻', slug:'laptop'},
  {name:'Điện thoại', icon:'📱', slug:'dien-thoai'},
  {name:'Máy lạnh', icon:'❄️', slug:'may-lanh'},
  {name:'Tủ lạnh', icon:'🧊', slug:'tu-lanh'},
  {name:'Máy giặt', icon:'🫧', slug:'may-giat'},
  {name:'Gia dụng', icon:'🍳', slug:'gia-dung'},
  {name:'Phụ kiện', icon:'🎧', slug:'phu-kien'},
  {name:'Âm thanh', icon:'🔊', slug:'am-thanh'}
];

export const products = [
  {id:1,name:'Smart Tivi Samsung 55 inch UA55CU8000 4K Crystal UHD',slug:'smart-tivi-samsung-55-ua55cu8000',category:'Tivi',brand:'Samsung',price:18990000,oldPrice:24690000,discount:23,rating:4.8,reviews:120,stock:12,image:'/assets/tv.png',featured:true,bestseller:true,tags:['4K','Smart TV','55 inch'],short:'Smart TV 4K, thiết kế AirSlim, hệ điều hành dễ sử dụng.',specs:{'Kích thước':'55 inch','Độ phân giải':'4K UHD','Hệ điều hành':'Tizen','Tần số quét':'60 Hz','Bảo hành':'24 tháng'}},
  {id:2,name:'Laptop ASUS Vivobook 15 X1502VA i5 1335U',slug:'asus-vivobook-15-x1502va',category:'Laptop',brand:'ASUS',price:14990000,oldPrice:17990000,discount:17,rating:4.7,reviews:86,stock:8,image:'/assets/laptop.png',featured:true,bestseller:true,tags:['Core i5','15.6 inch','512GB SSD'],short:'Laptop phù hợp học tập, văn phòng và lập trình.',specs:{'CPU':'Intel Core i5-1335U','RAM':'16GB','Ổ cứng':'512GB SSD','Màn hình':'15.6 inch Full HD','Bảo hành':'24 tháng'}},
  {id:3,name:'iPhone 15 Pro Max 256GB',slug:'iphone-15-pro-max-256gb',category:'Điện thoại',brand:'Apple',price:29990000,oldPrice:34990000,discount:14,rating:4.9,reviews:256,stock:5,image:'/assets/phone.png',featured:true,bestseller:true,tags:['256GB','5G','Titanium'],short:'Điện thoại cao cấp với chip mạnh, camera chuyên nghiệp.',specs:{'Màn hình':'6.7 inch OLED','Chip':'Apple A17 Pro','Bộ nhớ':'256GB','Camera':'48MP','Bảo hành':'12 tháng'}},
  {id:4,name:'Máy giặt LG Inverter 10.5kg FV1410S4B',slug:'may-giat-lg-fv1410s4b',category:'Máy giặt',brand:'LG',price:8990000,oldPrice:10990000,discount:18,rating:4.8,reviews:70,stock:9,image:'/assets/washer.png',featured:true,bestseller:false,tags:['10.5kg','Inverter','Cửa trước'],short:'Máy giặt cửa trước vận hành êm, phù hợp gia đình 4–6 người.',specs:{'Khối lượng giặt':'10.5kg','Loại máy':'Cửa trước','Động cơ':'Inverter','Tốc độ vắt':'1400 vòng/phút','Bảo hành':'24 tháng'}},
  {id:5,name:'Tủ lạnh Samsung Inverter 655 lít RS62R5001B4/SV',slug:'tu-lanh-samsung-rs62r5001b4',category:'Tủ lạnh',brand:'Samsung',price:14290000,oldPrice:17290000,discount:17,rating:4.7,reviews:64,stock:7,image:'/assets/fridge.png',featured:true,bestseller:false,tags:['655 lít','Side by side','Inverter'],short:'Tủ lạnh dung tích lớn, thiết kế sang trọng và tiết kiệm điện.',specs:{'Dung tích':'655 lít','Kiểu tủ':'Side by side','Công nghệ':'Digital Inverter','Làm lạnh':'Vòm','Bảo hành':'24 tháng'}},
  {id:6,name:'Tai nghe Sony WF-1000XM5',slug:'sony-wf-1000xm5',category:'Phụ kiện',brand:'Sony',price:5290000,oldPrice:6990000,discount:24,rating:4.8,reviews:118,stock:21,image:'/assets/earbuds.png',featured:true,bestseller:true,tags:['Chống ồn','Bluetooth','Hi-Res'],short:'Tai nghe true wireless chống ồn cao cấp, âm thanh chi tiết.',specs:{'Kết nối':'Bluetooth 5.3','Pin':'Tối đa 24 giờ','Chống ồn':'Có','Chuẩn kháng nước':'IPX4','Bảo hành':'12 tháng'}},
  {id:7,name:'Smart Tivi OLED Nova Vision 65 inch 4K 120Hz',slug:'nova-vision-oled-65',category:'Tivi',brand:'Nova',price:25990000,oldPrice:31990000,discount:19,rating:4.9,reviews:93,stock:6,image:'/assets/tv.png',featured:false,bestseller:true,tags:['OLED','65 inch','120Hz'],short:'OLED 65 inch dành cho phim ảnh và thể thao.',specs:{'Kích thước':'65 inch','Công nghệ':'OLED','Tần số quét':'120Hz','HDR':'Dolby Vision','Bảo hành':'24 tháng'}},
  {id:8,name:'Laptop NovaBook Air 14 Ryzen 7 16GB 512GB',slug:'novabook-air-14',category:'Laptop',brand:'Nova',price:18490000,oldPrice:20990000,discount:12,rating:4.8,reviews:51,stock:14,image:'/assets/laptop.png',featured:false,bestseller:false,tags:['Ryzen 7','16GB RAM','Mỏng nhẹ'],short:'Laptop mỏng nhẹ, pin lâu, đa nhiệm tốt.',specs:{'CPU':'Ryzen 7 7840U','RAM':'16GB','SSD':'512GB','Màn hình':'14 inch 2.8K','Bảo hành':'24 tháng'}},
  {id:9,name:'Điện thoại Nova X Pro 5G 256GB',slug:'nova-x-pro-5g',category:'Điện thoại',brand:'Nova',price:12990000,oldPrice:14990000,discount:13,rating:4.6,reviews:74,stock:16,image:'/assets/phone.png',featured:false,bestseller:false,tags:['5G','256GB','AMOLED'],short:'Điện thoại 5G màn hình AMOLED, pin lớn.',specs:{'Màn hình':'6.67 inch AMOLED','RAM':'12GB','Bộ nhớ':'256GB','Pin':'5000mAh','Bảo hành':'18 tháng'}},
  {id:10,name:'Máy lạnh Inverter 1.5 HP NovaCool',slug:'novacool-inverter-15hp',category:'Máy lạnh',brand:'Nova',price:10490000,oldPrice:12490000,discount:16,rating:4.7,reviews:67,stock:10,image:'/assets/fridge.png',featured:false,bestseller:false,tags:['1.5 HP','Inverter','Làm lạnh nhanh'],short:'Máy lạnh cho phòng 15–20m², vận hành êm.',specs:{'Công suất':'1.5 HP','Diện tích':'15–20m²','Công nghệ':'Inverter','Gas':'R32','Bảo hành':'24 tháng'}},
  {id:11,name:'Nồi chiên không dầu NovaChef 7 lít',slug:'novachef-airfryer-7l',category:'Gia dụng',brand:'Nova',price:2490000,oldPrice:3190000,discount:22,rating:4.7,reviews:142,stock:30,image:'/assets/earbuds.png',featured:false,bestseller:true,tags:['7 lít','Ít dầu','Cảm ứng'],short:'Nồi chiên dung tích lớn, nhiều chế độ nấu.',specs:{'Dung tích':'7 lít','Công suất':'1800W','Điều khiển':'Cảm ứng','Nhiệt độ':'80–200°C','Bảo hành':'12 tháng'}},
  {id:12,name:'Loa Bluetooth Nova Sound Max',slug:'nova-sound-max',category:'Âm thanh',brand:'Nova',price:1990000,oldPrice:2490000,discount:20,rating:4.6,reviews:88,stock:18,image:'/assets/earbuds.png',featured:false,bestseller:false,tags:['Bluetooth','Bass mạnh','Chống nước'],short:'Loa di động chống nước, âm trầm mạnh.',specs:{'Công suất':'40W','Pin':'18 giờ','Chống nước':'IP67','Kết nối':'Bluetooth 5.2','Bảo hành':'12 tháng'}}
];

export const promotions = [
  {title:'Trả góp 0%',desc:'Lãi suất 0% với kỳ hạn linh hoạt',icon:'0%',className:'orange'},
  {title:'Freeship toàn quốc',desc:'Áp dụng với đơn đủ điều kiện',icon:'🚚',className:'blue'},
  {title:'Giờ vàng giá sốc',desc:'Deal đặc biệt từ 20:00–22:00',icon:'🏷️',className:'orange'}
];

export const reviews = [
  {name:'Minh Anh',rating:5,content:'Giao hàng nhanh, đóng gói cẩn thận và nhân viên tư vấn rất rõ ràng.'},
  {name:'Tuấn Phong',rating:5,content:'Nova Core hỏi đúng nhu cầu nên mình chọn laptop khá nhanh.'},
  {name:'Hoàng Lan',rating:4,content:'Sản phẩm đúng mô tả, giao diện web dễ sử dụng trên điện thoại.'}
];
