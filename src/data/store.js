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

const baseProducts = [
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

const catalogBlueprints = [
  {category:'Tivi',image:'/assets/tv.png',brands:['Samsung','LG','Sony','TCL','Aqua','Hisense'],lines:['Crystal UHD','OLED evo','Bravia XR','QLED Pro','Google TV','Mini LED'],units:['43 inch','50 inch','55 inch','65 inch'],base:7990000,step:1250000,tags:['4K','Smart TV','HDR10+'],specs:i=>({'Kích thước':`${[43,50,55,65][i%4]} inch`,'Độ phân giải':'4K UHD','Hệ điều hành':i%2?'Google TV':'Smart OS','Tần số quét':i%3?'60 Hz':'120 Hz','Bảo hành':'24 tháng'})},
  {category:'Laptop',image:'/assets/laptop.png',brands:['ASUS','Acer','Dell','HP','Lenovo','MSI'],lines:['Vivobook','Aspire','Inspiron','Pavilion','IdeaPad','Modern'],units:['Core i5 16GB','Ryzen 5 16GB','Core i7 16GB','Ryzen 7 32GB'],base:11990000,step:1050000,tags:['512GB SSD','Wi-Fi 6','Windows 11'],specs:i=>({'CPU':i%2?'AMD Ryzen 5':'Intel Core i5','RAM':i%3?'16GB':'8GB','Ổ cứng':'512GB SSD','Màn hình':`${[14,15.6,16][i%3]} inch Full HD`,'Bảo hành':'24 tháng'})},
  {category:'Điện thoại',image:'/assets/phone.png',brands:['Apple','Samsung','OPPO','Xiaomi','vivo','realme'],lines:['Series','Galaxy','Reno','Redmi Note','V Series','Number Pro'],units:['128GB','256GB','512GB','5G 256GB'],base:5990000,step:1450000,tags:['5G','Camera AI','Sạc nhanh'],specs:i=>({'Màn hình':`${[6.1,6.5,6.7][i%3]} inch AMOLED`,'Bộ nhớ':[128,256,512][i%3]+'GB','Camera':`${[50,64,108][i%3]}MP`,'Pin':`${[4500,5000,5500][i%3]}mAh`,'Bảo hành':'12 tháng'})},
  {category:'Máy lạnh',image:'/assets/air-conditioner.png',brands:['Daikin','Panasonic','LG','Aqua','Casper','Midea'],lines:['Inverter Standard','XU Series','Dual Cool','Fresh Air','EcoPrime','AI Cool'],units:['1 HP','1.5 HP','2 HP','2.5 HP'],base:7490000,step:820000,tags:['Inverter','Gas R32','Làm lạnh nhanh'],specs:i=>({'Công suất':[1,1.5,2,2.5][i%4]+' HP','Diện tích':`${[15,20,30,40][i%4]}m²`,'Công nghệ':'Inverter tiết kiệm điện','Gas':'R32','Bảo hành':'24 tháng'})},
  {category:'Tủ lạnh',image:'/assets/fridge.png',brands:['Samsung','LG','Panasonic','Toshiba','Aqua','Electrolux'],lines:['Bespoke','InstaView','Prime Fresh','Origin Inverter','Magic Room','TasteLock'],units:['236 lít','320 lít','480 lít','600 lít'],base:7290000,step:1120000,tags:['Inverter','Khử mùi','Làm lạnh đa chiều'],specs:i=>({'Dung tích':`${[236,320,480,600][i%4]} lít`,'Kiểu tủ':i%3===0?'Side by side':'Ngăn đá dưới','Công nghệ':'Inverter','Làm lạnh':'Đa chiều','Bảo hành':'24 tháng'})},
  {category:'Máy giặt',image:'/assets/washer.png',brands:['LG','Samsung','Electrolux','Panasonic','Toshiba','Aqua'],lines:['AI DD','AI Ecobubble','UltimateCare','ActiveFoam','GreatWaves','Refresh'],units:['9kg','10kg','11kg','13kg'],base:6490000,step:760000,tags:['Inverter','Giặt hơi nước','Cửa trước'],specs:i=>({'Khối lượng giặt':`${[9,10,11,13][i%4]}kg`,'Loại máy':i%3?'Cửa trước':'Cửa trên','Động cơ':'Inverter','Tốc độ vắt':'1400 vòng/phút','Bảo hành':'24 tháng'})},
  {category:'Gia dụng',image:'/assets/home-appliance.png',brands:['Philips','Sunhouse','LocknLock','Tefal','Bluestone','Panasonic'],lines:['Airfryer XXL','Mama Series','EJF Series','Easy Fry','Smart Cook','Healthy Chef'],units:['5 lít','6.5 lít','7 lít','8 lít'],base:1290000,step:310000,tags:['Tiết kiệm điện','Cảm ứng','Bảo hành chính hãng'],specs:i=>({'Dung tích':`${[5,6.5,7,8][i%4]} lít`,'Công suất':`${[1500,1700,1800,2000][i%4]}W`,'Điều khiển':i%2?'Cảm ứng':'Nút xoay','Chất liệu':'Inox cao cấp','Bảo hành':'12 tháng'})},
  {category:'Phụ kiện',image:'/assets/earbuds.png',brands:['Sony','JBL','Anker','Logitech','Baseus','Samsung'],lines:['Wireless Pro','Tune Flex','Soundcore','MX Series','Bowie','Galaxy Buds'],units:['Bluetooth 5.3','ANC Pro','Hi-Res','Gaming'],base:590000,step:280000,tags:['Bluetooth','Pin lâu','Chính hãng'],specs:i=>({'Kết nối':'Bluetooth 5.3','Pin':`${[18,24,30,36][i%4]} giờ`,'Chống ồn':i%2?'Chủ động ANC':'Thụ động','Kháng nước':'IPX4','Bảo hành':'12 tháng'})},
  {category:'Âm thanh',image:'/assets/speaker.png',brands:['JBL','Sony','LG','Samsung','Marshall','Bose'],lines:['PartyBox','X-Series','XBOOM','Sound Tower','Acton','SoundLink'],units:['40W','80W','120W','300W'],base:1490000,step:730000,tags:['Bluetooth','Bass mạnh','Karaoke'],specs:i=>({'Công suất':`${[40,80,120,300][i%4]}W`,'Kết nối':'Bluetooth 5.3','Pin':`${[12,16,20,24][i%4]} giờ`,'Chống nước':i%2?'IP67':'IPX4','Bảo hành':'12 tháng'})}
];

const slugify = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');

const generatedProducts = catalogBlueprints.flatMap((group,groupIndex)=>
  Array.from({length:12},(_,index)=>{
    const brand=group.brands[index%group.brands.length];
    const line=group.lines[index%group.lines.length];
    const unit=group.units[index%group.units.length];
    const model=`${String.fromCharCode(65+groupIndex)}${2026+index}${['A','S','X','Pro'][index%4]}`;
    const name=`${group.category} ${brand} ${line} ${unit} ${model}`;
    const discount=10+(index*3+groupIndex)%26;
    const price=Math.round((group.base+group.step*index)/10000)*10000;
    return {
      id:13+groupIndex*12+index,name,slug:slugify(name),category:group.category,brand,
      price,oldPrice:Math.round(price/(1-discount/100)/10000)*10000,discount,
      rating:Number((4.4+((index+groupIndex)%6)/10).toFixed(1)),reviews:18+((index*37+groupIndex*11)%260),
      stock:4+((index*7+groupIndex)%36),image:group.image,imageVariant:(index+groupIndex)%6,
      featured:index===0,bestseller:index%4===0,tags:group.tags,
      short:`${name} nổi bật với thiết kế hiện đại, vận hành ổn định và chính sách bảo hành chính hãng.`,
      specs:group.specs(index)
    };
  })
);

export const products = [...baseProducts,...generatedProducts];

export const promotions = [
  {title:'Trả góp 0%',desc:'Lãi suất 0% với kỳ hạn linh hoạt',icon:'0%',className:'orange'},
  {title:'Freeship toàn quốc',desc:'Áp dụng với đơn đủ điều kiện',icon:'🚚',className:'blue'},
  {title:'Giờ vàng giá sốc',desc:'Deal đặc biệt từ 20:00–22:00',icon:'🏷️',className:'orange'},
  {title:'Thu cũ đổi mới',desc:'Trợ giá đến 3 triệu cho thiết bị cũ',icon:'♻️',className:'blue'},
  {title:'Combo gia đình',desc:'Mua từ 2 sản phẩm giảm thêm đến 10%',icon:'🎁',className:'orange'},
  {title:'Giao lắp siêu tốc',desc:'Miễn phí giao lắp trong khu vực áp dụng',icon:'⚡',className:'blue'}
];

export const reviews = [
  {name:'Minh Anh',rating:5,content:'Giao hàng nhanh, đóng gói cẩn thận và nhân viên tư vấn rất rõ ràng.'},
  {name:'Tuấn Phong',rating:5,content:'Nova Core hỏi đúng nhu cầu nên mình chọn laptop khá nhanh.'},
  {name:'Hoàng Lan',rating:4,content:'Sản phẩm đúng mô tả, giao diện web dễ sử dụng trên điện thoại.'}
];
