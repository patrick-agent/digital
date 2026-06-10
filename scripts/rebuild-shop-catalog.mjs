import path from "node:path"
import { writeFile } from "node:fs/promises"

const blog = (slug, title) => ({ slug, title })

const products = [
  {
    name: "Audient iD14 MKII",
    brand: "Audient",
    affiliateUrl: "https://s.shopee.vn/3g1COtvXYT",
    type: "audio-interface",
    category: "Audio Interface",
    priceFallback: 9990000,
    tags: ["audio interface", "sound card thu am", "home studio", "audient"],
    summaryLine:
      "rất đáng mua nếu bạn cần một audio interface 2 input có preamp sạch, headphone amp khỏe và còn đường nâng cấp bằng ADAT cho home studio bán chuyên",
    audienceLine:
      "Nó hợp nhất với producer tự thu vocal, guitar, voice-over và mix bằng tai nghe nhiều giờ mỗi tuần.",
    workflowLine:
      "Trong workflow hằng ngày, iD14 MKII cho cảm giác ổn định và trưởng thành hơn hẳn nhóm interface nhập môn.",
    recommendationLine:
      "Điểm Tachy đánh giá cao nhất là chất nền sạch, volume headphone dư dả và khả năng giữ giá trị khi bạn nâng cấp toàn bộ setup sau này.",
    cautionLine:
      "Điều cần lưu ý là mức đầu tư ban đầu cao hơn M2 hoặc EVO 4, nên nó hợp hơn với người đã xác định làm việc nghiêm túc lâu dài.",
    pairingLine:
      "Để khai thác tốt hơn, bạn có thể ghép nó với Lewitt LCT 440 PURE, Rode NT1 5th Gen hoặc các tai nghe open-back như AKG K702.",
    features: [
      "2 input chất lượng tốt cho vocal, guitar và voice-over tại nhà",
      "Headphone output khỏe, hợp người mix trên tai nghe thường xuyên",
      "Có đường ADAT để mở rộng input khi setup lớn dần",
      "Build chắc tay và hợp workflow dùng lâu dài",
    ],
    relatedArticles: [
      blog("review-audient-id14-mkii-cho-home-studio-ban-chuyen", "Review Audient iD14 MKII cho home studio bán chuyên"),
      blog("so-sanh-audient-id14-mkii-motu-m2-ssl2-plus", "So sánh Audient iD14 MKII, MOTU M2 và SSL 2+"),
      blog("combo-home-studio-duoi-20-trieu-cho-producer-ban-chuyen", "Combo home studio dưới 20 triệu cho producer bán chuyên"),
    ],
  },
  {
    name: "MOTU M2",
    brand: "MOTU",
    affiliateUrl: "https://s.shopee.vn/3B4vsNxmI3",
    type: "audio-interface",
    category: "Audio Interface",
    priceFallback: 6290000,
    tags: ["audio interface", "motu m2", "home studio", "thu vocal"],
    summaryLine:
      "là lựa chọn cân bằng nhất nếu bạn ưu tiên driver ổn định, meter mặt trước dễ canh gain và workflow hằng ngày ít rắc rối",
    audienceLine:
      "Nó hợp với producer home studio, nhạc sĩ tự thu vocal hoặc guitar và creator cần một interface gọn nhưng bền.",
    workflowLine:
      "Trong use case thực tế, M2 rất dễ sống vì bạn nhìn gain nhanh, cắm vào là làm việc và ít phải đoán mức tín hiệu.",
    recommendationLine:
      "Tachy gợi ý M2 cho người muốn bỏ qua phần 'học cách chịu đựng gear' để tập trung vào viết, thu và chỉnh sửa ngay.",
    cautionLine:
      "Nếu bạn cần headphone out khỏe hơn hoặc muốn mở rộng input về sau, iD14 MKII vẫn có lợi thế rõ hơn.",
    pairingLine:
      "MOTU M2 đi rất hợp với ATH-M40x, Shure MV7+ và cả bộ dưới 20 triệu thiên về producer đa nhiệm.",
    features: [
      "Meter mặt trước trực quan, dễ canh gain khi tự thu một mình",
      "Driver ổn định, hợp workflow thu và monitoring mỗi ngày",
      "Kích thước gọn, dễ đưa vào góc làm việc hoặc rig di động",
      "Giữ cân bằng tốt giữa giá, trải nghiệm dùng và chất lượng tổng thể",
    ],
    relatedArticles: [
      blog("so-sanh-audient-id14-mkii-motu-m2-ssl2-plus", "So sánh Audient iD14 MKII, MOTU M2 và SSL 2+"),
      blog("combo-home-studio-duoi-20-trieu-cho-producer-ban-chuyen", "Combo home studio dưới 20 triệu cho producer bán chuyên"),
      blog("bo-gear-thu-rap-vocal-tai-nha-cho-phong-chua-xu-ly-am", "Bộ gear thu rap vocal tại nhà cho phòng chưa xử lý âm"),
    ],
  },
  {
    name: "SSL 2+",
    brand: "Solid State Logic",
    affiliateUrl: "https://s.shopee.vn/2BCOggk3vx",
    type: "audio-interface",
    category: "Audio Interface",
    priceFallback: 6890000,
    tags: ["ssl 2+", "audio interface", "thu vocal", "home studio"],
    summaryLine:
      "đáng mua nếu bạn thích chất âm có màu hơn một chút, cần thêm output và muốn vocal hoặc guitar nghe đã tai ngay từ đầu vào",
    audienceLine:
      "Nó hợp với songwriter, producer tự thu vocal và người thích cảm giác sound có cá tính hơn là quá trung tính.",
    workflowLine:
      "SSL 2+ thiên về cảm giác thu nhanh, bật lên là có hứng ghi âm thay vì chỉnh quá nhiều.",
    recommendationLine:
      "Điểm hấp dẫn nhất là nó mang tinh thần 'thu xong nghe thích ngay' mà vẫn đủ gọn để dùng trong home studio nhỏ.",
    cautionLine:
      "Nếu bạn ưu tiên sự trung tính tuyệt đối hoặc đường nâng cấp bằng ADAT, iD14 MKII hợp lý hơn.",
    pairingLine:
      "Mẫu này hợp với condenser cho vocal pop, guitar acoustic và producer thích workflow thu demo giàu cảm xúc.",
    features: [
      "Màu âm có cá tính hơn nhóm interface quá trung tính",
      "Có thêm output và kết nối tiện cho setup mở rộng vừa phải",
      "Hợp người thích thu vocal hoặc guitar nghe đầy hơn ngay từ đầu",
      "Form nhỏ gọn, hợp desk setup và góc thu cá nhân",
    ],
    relatedArticles: [
      blog("so-sanh-audient-id14-mkii-motu-m2-ssl2-plus", "So sánh Audient iD14 MKII, MOTU M2 và SSL 2+"),
      blog("huong-dan-lam-home-studio-co-ban-cho-producer", "Hướng dẫn làm home studio cơ bản cho producer"),
    ],
  },
  {
    name: "Audient EVO 4",
    brand: "Audient",
    affiliateUrl: "https://s.shopee.vn/3B4vsZWFCn",
    type: "audio-interface",
    category: "Audio Interface",
    priceFallback: 3390000,
    tags: ["evo 4", "audio interface", "nguoi moi thu am", "singer songwriter"],
    summaryLine:
      "là interface khởi đầu thực dụng cho singer-songwriter và creator cần setup nhanh, ít lỗi vặt và dễ lên tiếng sạch sẽ",
    audienceLine:
      "Nó hợp với người mới làm home studio, singer-songwriter, podcaster và ai chưa muốn đầu tư quá sâu từ ngày đầu.",
    workflowLine:
      "Điểm mạnh của EVO 4 là vào việc rất nhanh, đặc biệt khi bạn vẫn đang học cách set gain và tổ chức góc thu.",
    recommendationLine:
      "Tachy gợi ý EVO 4 cho người cần một chiếc interface đơn giản nhưng vẫn đủ tử tế để thu demo và học quy trình chuẩn.",
    cautionLine:
      "Khi workflow đã lên mức bán chuyên, bạn sẽ thấy M2 hoặc iD14 MKII cho nhiều dư địa nâng cấp hơn.",
    pairingLine:
      "EVO 4 đi rất hợp với Lewitt LCT 240 PRO, ATH-M20x và bộ gear dưới 10 triệu cho người mới.",
    features: [
      "Dễ dùng, ít làm người mới bị ngợp bởi quá nhiều thao tác",
      "Hợp thu demo vocal, guitar và spoken word tại nhà",
      "Kích thước nhỏ gọn, dễ đặt trên bàn làm việc nhỏ",
      "Tỷ lệ hiệu quả trên chi phí tốt cho giai đoạn bắt đầu",
    ],
    relatedArticles: [
      blog("combo-home-studio-duoi-10-trieu-cho-singer-songwriter", "Combo home studio dưới 10 triệu cho singer-songwriter"),
      blog("huong-dan-lam-home-studio-co-ban-cho-producer", "Hướng dẫn làm home studio cơ bản cho producer"),
    ],
  },
  {
    name: "Rode NT1 5th Gen",
    brand: "Rode",
    affiliateUrl: "https://s.shopee.vn/2g8fHl6i1x",
    type: "condenser-mic",
    category: "Micro Condenser",
    priceFallback: 6990000,
    tags: ["rode nt1 5th gen", "micro condenser", "thu vocal", "home studio"],
    summaryLine:
      "là condenser an toàn và dễ gợi ý nhất nếu bạn muốn vocal sạch, nhiều chi tiết và có thể dùng lâu cho home studio bán chuyên",
    audienceLine:
      "Nó hợp với ca sĩ, producer tự thu vocal, acoustic và người muốn một chiếc condenser đa dụng nhưng không quá khó phối ghép.",
    workflowLine:
      "Trong thực tế, Rode NT1 5th Gen là kiểu micro cho bạn kết quả ổn định với nhiều chất giọng và nhiều thể loại khác nhau.",
    recommendationLine:
      "Tachy đánh giá cao mẫu này vì nó giữ được sự cân bằng giữa độ sạch, độ chi tiết và tính dễ dùng lâu dài.",
    cautionLine:
      "Nếu phòng còn vang hoặc nhiều tiếng nền, bạn vẫn nên xử lý góc thu trước vì mọi condenser nhạy đều sẽ lôi tiếng phòng theo.",
    pairingLine:
      "Nó hợp với iD14 MKII, SSL 2+ và cả reflection filter khi bạn chưa thể làm treatment bài bản.",
    features: [
      "Chất âm sạch, dễ dùng với nhiều loại giọng và thể loại",
      "Hợp cả vocal, acoustic guitar và spoken word chất lượng cao",
      "Dễ ghép với nhiều interface phổ biến trong home studio",
      "Là lựa chọn an toàn cho người muốn mua một lần dùng lâu",
    ],
    relatedArticles: [
      blog("so-sanh-rode-nt1-5th-gen-lewitt-lct-440-pure-aston-origin", "So sánh Rode NT1 5th Gen, Lewitt LCT 440 PURE và Aston Origin"),
      blog("chon-micro-thu-am-tai-nha-condenser-dynamic", "Chọn micro condenser hay dynamic cho home studio"),
      blog("cach-xu-ly-tieu-am-phong-thu-tai-nha-don-gian", "Cách xử lý tiêu âm phòng thu tại nhà đơn giản"),
    ],
  },
  {
    name: "Lewitt LCT 440 PURE",
    brand: "Lewitt",
    affiliateUrl: "https://s.shopee.vn/4LGtGs6iMH",
    type: "condenser-mic",
    category: "Micro Condenser",
    priceFallback: 6390000,
    tags: ["lewitt lct 440 pure", "micro condenser", "thu vocal pop", "home studio"],
    summaryLine:
      "rất đáng mua nếu bạn cần vocal hiện đại, sáng, chi tiết và muốn giúp giọng hát nổi lên nhanh trong bản phối",
    audienceLine:
      "Nó hợp với producer pop, R&B, indie hiện đại và singer thường tự thu vocal tại nhà.",
    workflowLine:
      "LCT 440 PURE phát huy tốt nhất khi bạn đã biết canh gain đúng và giữ góc thu gọn gàng.",
    recommendationLine:
      "Điểm Tachy thích ở mẫu này là cảm giác 'ra bài' rất nhanh với vocal cần độ mở và độ nổi.",
    cautionLine:
      "Độ nhạy phòng của nó cao hơn mặt bằng chung, nên không phải lựa chọn tha thứ nhất cho phòng ngủ chưa xử lý âm.",
    pairingLine:
      "Micro này hợp với interface sạch như iD14 MKII và workflow vocal cần nghe rõ consonant, texture và hơi thở.",
    features: [
      "Vocal sáng, rõ và dễ nổi trong bản phối hiện đại",
      "Hợp với producer cần thu nhanh và giảm gánh nặng chỉnh hậu kỳ",
      "Giữ chi tiết tốt khi nguồn thu và góc thu đã ổn định",
      "Là bước nâng cấp rõ ràng so với nhóm condenser nhập môn",
    ],
    relatedArticles: [
      blog("review-lewitt-lct-440-pure-co-dang-mua", "Review Lewitt LCT 440 PURE có đáng mua không"),
      blog("so-sanh-rode-nt1-5th-gen-lewitt-lct-440-pure-aston-origin", "So sánh Rode NT1 5th Gen, Lewitt LCT 440 PURE và Aston Origin"),
      blog("setup-phong-thu-am-tai-nha-diy", "Hướng dẫn setup phòng thu âm tại nhà DIY"),
    ],
  },
  {
    name: "Lewitt LCT 240 PRO",
    brand: "Lewitt",
    affiliateUrl: "https://s.shopee.vn/40e2sR7OEC",
    type: "condenser-mic",
    category: "Micro Condenser",
    priceFallback: 3290000,
    tags: ["lewitt lct 240 pro", "micro condenser", "thu demo", "home studio"],
    summaryLine:
      "là condenser nhập môn đáng tiền khi bạn cần một mẫu mic để thu demo, vocal và acoustic sạch sẽ mà không đòi hỏi ngân sách quá cao",
    audienceLine:
      "Nó hợp với singer-songwriter, producer mới và người đang set up bộ thu dưới 10 triệu.",
    workflowLine:
      "LCT 240 PRO cho kiểu kết quả dễ dùng, ít làm người mới bị choáng và đủ sạch để học đúng quy trình thu âm.",
    recommendationLine:
      "Tachy gợi ý mẫu này như một điểm bắt đầu cân bằng giữa giá, độ dễ dùng và chất lượng thu cơ bản.",
    cautionLine:
      "Nếu bạn muốn vocal mở và chi tiết hơn ở nhóm nâng cấp, LCT 440 PURE sẽ là bước lên rõ ràng hơn.",
    pairingLine:
      "Nó đi hợp với EVO 4, ATH-M20x, pop filter cơ bản và desk stand trong combo tiết kiệm.",
    features: [
      "Mức giá dễ tiếp cận cho người mới xây home studio",
      "Đủ sạch để thu demo vocal, guitar và nội dung spoken word",
      "Dễ ghép với interface nhập môn phổ biến",
      "Hợp người cần bắt đầu nhanh rồi nâng dần phụ kiện sau",
    ],
    relatedArticles: [
      blog("combo-home-studio-duoi-10-trieu-cho-singer-songwriter", "Combo home studio dưới 10 triệu cho singer-songwriter"),
      blog("huong-dan-lam-home-studio-co-ban-cho-producer", "Hướng dẫn làm home studio cơ bản cho producer"),
    ],
  },
  {
    name: "Shure MV7+",
    brand: "Shure",
    affiliateUrl: "https://s.shopee.vn/7fXLFFg4IN",
    type: "hybrid-mic",
    category: "Micro Dynamic",
    priceFallback: 7590000,
    tags: ["shure mv7+", "micro usb xlr", "podcast", "thu vocal"],
    summaryLine:
      "là micro hybrid cao cấp rất hợp cho người vừa làm nhạc vừa làm content, muốn thu nhanh qua USB nhưng vẫn có đường XLR để nâng cấp",
    audienceLine:
      "Nó hợp với creator, podcaster, streamer và vocalist đang làm việc trong phòng chưa xử lý âm quá kỹ.",
    workflowLine:
      "MV7+ mạnh ở sự linh hoạt: một chiếc mic có thể phục vụ content hằng ngày lẫn chain thu nghiêm túc hơn về sau.",
    recommendationLine:
      "Tachy đánh giá cao MV7+ vì nó giảm ma sát setup rất nhiều nhưng vẫn giữ được hình ảnh chuyên nghiệp của một dynamic mic tốt.",
    cautionLine:
      "Mức giá của nó chỉ thật sự đáng khi bạn dùng cả hai đường USB và XLR, hoặc cần một chiếc mic gánh nhiều vai trò.",
    pairingLine:
      "MV7+ hợp với MOTU M2, desk microphone stand và chain thu gần miệng để giảm bắt tiếng phòng.",
    features: [
      "Dùng được cả USB lẫn XLR cho hai kiểu workflow khác nhau",
      "Hợp phòng chưa xử lý âm bằng vì ít bắt phòng hơn condenser",
      "Phù hợp cho podcast, stream, content và demo vocal tại nhà",
      "Giảm đáng kể thời gian setup với người làm một mình",
    ],
    relatedArticles: [
      blog("co-nen-mua-micro-usb-xlr-hybrid-mv7-podmic-usb-q9u", "Có nên mua micro USB/XLR hybrid không"),
      blog("bo-gear-thu-rap-vocal-tai-nha-cho-phong-chua-xu-ly-am", "Bộ gear thu rap vocal tại nhà cho phòng chưa xử lý âm"),
      blog("chon-micro-thu-am-tai-nha-condenser-dynamic", "Chọn micro condenser hay dynamic cho home studio"),
    ],
  },
  {
    name: "Rode PodMic USB",
    brand: "Rode",
    affiliateUrl: "https://s.shopee.vn/8pjIdRCYnu",
    type: "hybrid-mic",
    category: "Micro Dynamic",
    priceFallback: 5990000,
    tags: ["podmic usb", "micro usb xlr", "podcast", "rap vocal"],
    summaryLine:
      "là lựa chọn giá trị cao nếu bạn cần micro USB/XLR có tone dày, dễ kiểm soát tiếng phòng và hợp cả content lẫn demo vocal",
    audienceLine:
      "Nó hợp với creator, podcaster, rapper thu gần mic và producer làm việc trong phòng ngủ.",
    workflowLine:
      "PodMic USB phù hợp với người muốn tự thu nhanh, giảm phụ thuộc vào treatment mà vẫn còn đường XLR để nâng cấp sau.",
    recommendationLine:
      "Điểm Tachy thích là cảm giác tone dày, dễ vào bài và hợp cực tốt với workflow nói gần, thu gần, edit nhanh.",
    cautionLine:
      "Kích thước mic khá lớn, nên bạn cần stand đủ chắc và bàn làm việc đủ gọn để không vướng tay thao tác.",
    pairingLine:
      "Nó đi hợp với M2, HD 280 Pro và reflection filter kiểu PF8 trong chain thu rap vocal tại nhà.",
    features: [
      "Tone dày và dễ kiểm soát hơn condenser trong phòng nhỏ",
      "Linh hoạt giữa workflow USB nhanh và XLR nghiêm túc hơn",
      "Hợp podcast, content, rap vocal và spoken word",
      "Giá trị rất mạnh ở phân khúc micro hybrid tầm trung",
    ],
    relatedArticles: [
      blog("co-nen-mua-micro-usb-xlr-hybrid-mv7-podmic-usb-q9u", "Có nên mua micro USB/XLR hybrid không"),
      blog("bo-gear-thu-rap-vocal-tai-nha-cho-phong-chua-xu-ly-am", "Bộ gear thu rap vocal tại nhà cho phòng chưa xử lý âm"),
    ],
  },
  {
    name: "Audio-Technica ATH-M40x",
    brand: "Audio-Technica",
    affiliateUrl: "https://s.shopee.vn/9zvG1p79AR",
    type: "closed-headphone",
    category: "Tai nghe Closed-back",
    priceFallback: 2490000,
    tags: ["ath m40x", "tai nghe closed back", "tracking", "thu vocal"],
    summaryLine:
      "vẫn là closed-back cân bằng và dễ gợi ý nhất nếu bạn cần một chiếc tai nghe vừa tracking vừa nghe chỉnh sửa cơ bản",
    audienceLine:
      "Nó hợp với producer mới lên home studio nghiêm túc, vocalist tự tracking và người chỉ muốn mua một chiếc dùng nhiều việc.",
    workflowLine:
      "ATH-M40x cho kiểu nghe đủ cân bằng để tracking, edit nhẹ và kiểm tra mix nhanh mà không quá cực đoan ở dải nào.",
    recommendationLine:
      "Tachy thường ưu tiên M40x khi cần một lựa chọn an toàn, bền và dễ sống hằng ngày cho phòng ngủ.",
    cautionLine:
      "Nếu bạn ưu tiên edit lỗi consonant thật nhanh, MDR-7506 sẽ sắc hơn; nếu cần cách âm mạnh hơn khi thu, HD 280 Pro kín hơn.",
    pairingLine:
      "Nó hợp với MOTU M2, EVO 4 và những bộ thu vocal nhỏ gọn cần một tai nghe đa dụng.",
    features: [
      "Cân bằng tốt cho cả tracking lẫn chỉnh sửa cơ bản",
      "Đeo ổn trong nhiều phiên làm việc liên tiếp",
      "Hợp home studio nhỏ chỉ muốn một tai nghe đa dụng",
      "Là mức nâng cấp rõ ràng so với tai nghe tiêu dùng",
    ],
    relatedArticles: [
      blog("so-sanh-tai-nghe-closed-back-m40x-mdr7506-hd280pro", "So sánh ATH-M40x, MDR-7506 và HD 280 Pro"),
      blog("combo-home-studio-duoi-20-trieu-cho-producer-ban-chuyen", "Combo home studio dưới 20 triệu cho producer bán chuyên"),
    ],
  },
  {
    name: "Sony MDR-7506",
    brand: "Sony",
    affiliateUrl: "https://s.shopee.vn/1LdHhw7vMH",
    type: "closed-headphone",
    category: "Tai nghe Closed-back",
    priceFallback: 2890000,
    tags: ["mdr 7506", "tai nghe closed back", "edit vocal", "monitoring"],
    summaryLine:
      "là tai nghe rất hợp để bắt lỗi vocal, edit consonant và nghe phần mid/high rõ ràng trong workflow thu tại nhà",
    audienceLine:
      "Nó hợp với người edit vocal nhiều, làm spoken word hoặc producer thích nghe lỗi thật nhanh.",
    workflowLine:
      "MDR-7506 phát huy tốt khi bạn cần speed: nghe lỗi, sửa take, cắt hơi thở và chốt edit mà không phải nghe quá lâu.",
    recommendationLine:
      "Tachy gợi ý mẫu này cho các workflow thiên về kiểm tra chi tiết hơn là thư giãn nghe nhạc.",
    cautionLine:
      "Nếu bạn muốn chất nghe cân bằng hơn cho cả tracking lẫn use everyday, ATH-M40x vẫn là lựa chọn dễ sống hơn.",
    pairingLine:
      "Nó hợp với chain vocal, MV7+, PodMic USB và mọi workflow cần nghe rõ phần lời.",
    features: [
      "Rõ phần mid/high, hợp bắt lỗi và chỉnh vocal",
      "Phản hồi nhanh với những chi tiết nhỏ trong spoken word",
      "Hợp phòng ngủ khi bạn chưa thể nghe monitor lớn",
      "Đáng cân nhắc cho người thích nghe lỗi hơn nghe nịnh tai",
    ],
    relatedArticles: [
      blog("so-sanh-tai-nghe-closed-back-m40x-mdr7506-hd280pro", "So sánh ATH-M40x, MDR-7506 và HD 280 Pro"),
    ],
  },
  {
    name: "Sennheiser HD 280 Pro",
    brand: "Sennheiser",
    affiliateUrl: "https://s.shopee.vn/6pyEGFLBbb",
    type: "closed-headphone",
    category: "Tai nghe Closed-back",
    priceFallback: 2690000,
    tags: ["hd 280 pro", "tai nghe closed back", "thu vocal", "cach am"],
    summaryLine:
      "là closed-back đáng tiền nếu bạn cần độ kín cao, giảm leak vào micro và giữ click chắc khi thu nhiều take",
    audienceLine:
      "Nó hợp với ca sĩ thu tại nhà, podcaster và người có phòng còn nhiều tiếng nền.",
    workflowLine:
      "HD 280 Pro mạnh khi nhiệm vụ chính là tracking sạch, giảm âm lọt và giữ cảm giác kiểm soát ổn định cho người hát.",
    recommendationLine:
      "Tachy thường ưu tiên HD 280 Pro trong các chain rap vocal hoặc voice-over ở phòng chưa thật yên tĩnh.",
    cautionLine:
      "Form đeo của nó chặt hơn một số mẫu khác, nên bạn nên cân nhắc nếu phải đeo liên tục quá lâu.",
    pairingLine:
      "Nó đi tốt với MV7+, PodMic USB, M2 và các setup ưu tiên tracking hơn mixing.",
    features: [
      "Cách âm tốt, giảm leak vào micro khi thu gần",
      "Hợp ca sĩ cần nghe click chắc và ổn định",
      "Dễ ghép trong các chain thu rap vocal tại nhà",
      "Là lựa chọn thực dụng cho phòng còn nhiều tiếng nền",
    ],
    relatedArticles: [
      blog("so-sanh-tai-nghe-closed-back-m40x-mdr7506-hd280pro", "So sánh ATH-M40x, MDR-7506 và HD 280 Pro"),
      blog("bo-gear-thu-rap-vocal-tai-nha-cho-phong-chua-xu-ly-am", "Bộ gear thu rap vocal tại nhà cho phòng chưa xử lý âm"),
    ],
  },
  {
    name: "Audio-Technica ATH-M20x",
    brand: "Audio-Technica",
    affiliateUrl: "https://s.shopee.vn/qh17H7lR8",
    type: "closed-headphone",
    category: "Tai nghe Closed-back",
    priceFallback: 1390000,
    tags: ["ath m20x", "tai nghe budget", "home studio", "tracking"],
    summaryLine:
      "là tai nghe budget để bắt đầu home studio khi bạn ưu tiên độ bền, dễ đeo và có thể tracking cơ bản ngay",
    audienceLine:
      "Nó hợp với người mới, singer-songwriter và content creator cần chiếc tai nghe đầu tiên cho workflow thu tại nhà.",
    workflowLine:
      "ATH-M20x không nhằm thay tai nghe mix chuyên sâu, nhưng nó giúp bạn vượt khỏi mức nghe bằng tai nghe tiêu dùng rất nhanh.",
    recommendationLine:
      "Tachy xem đây là lựa chọn tiết kiệm nhưng đủ thực dụng để bắt đầu học tracking đúng cách.",
    cautionLine:
      "Khi bạn bắt đầu chỉnh sửa kỹ hơn, ATH-M40x sẽ là bước nâng cấp hợp lý hơn cả về cân bằng lẫn sự dễ dùng.",
    pairingLine:
      "Nó đi hợp với EVO 4, LCT 240 PRO, pop filter và combo singer-songwriter dưới 10 triệu.",
    features: [
      "Ngân sách dễ chịu cho người mới bắt đầu setup",
      "Đủ ổn để tracking vocal, guitar và spoken word cơ bản",
      "Dễ ghép với interface nhập môn phổ biến",
      "Là bước đi hợp lý trước khi nâng lên nhóm tai nghe tốt hơn",
    ],
    relatedArticles: [
      blog("combo-home-studio-duoi-10-trieu-cho-singer-songwriter", "Combo home studio dưới 10 triệu cho singer-songwriter"),
    ],
  },
  {
    name: "AKG K702",
    brand: "AKG",
    affiliateUrl: "https://s.shopee.vn/8pjIeATRWb",
    type: "open-headphone",
    category: "Tai nghe Open-back",
    priceFallback: 3890000,
    tags: ["akg k702", "tai nghe open back", "mixing", "home studio"],
    summaryLine:
      "rất đáng mua nếu bạn mix bằng tai nghe và cần soundstage rộng để nghe stereo, reverb và không gian dễ thở hơn",
    audienceLine:
      "Nó hợp với producer mix tại phòng ngủ, composer và người làm nhiều phần ambience hoặc stereo width.",
    workflowLine:
      "K702 hữu ích nhất khi bạn đã có interface đủ sức kéo và cần thêm một tham chiếu open-back đúng nghĩa.",
    recommendationLine:
      "Tachy gợi ý K702 cho người đang thiếu cảm giác không gian khi chỉ nghe bằng closed-back hoặc monitor chưa tối ưu phòng.",
    cautionLine:
      "Đây không phải tai nghe tracking; nó leak âm và cần headphone amp của interface đủ ổn để phát huy hết giá trị.",
    pairingLine:
      "K702 rất hợp với iD14 MKII, MOTU M2 và workflow kiểm tra mix song song với monitor 5 inch.",
    features: [
      "Soundstage rộng, hợp nghe stereo và ambience",
      "Phù hợp mix tại nhà khi phòng chưa tối ưu monitor hoàn toàn",
      "Giúp phát hiện vấn đề không gian tốt hơn closed-back phổ thông",
      "Đáng giá cho producer phải làm việc đêm hoặc phòng nhỏ",
    ],
    relatedArticles: [
      blog("so-sanh-tai-nghe-open-back-k702-hd560s-dt880pro", "So sánh AKG K702, HD 560S và DT 880 Pro"),
      blog("nang-cap-home-studio-mua-gi-truoc-de-nghe-hay-hon", "Nâng cấp home studio mua gì trước để nghe hay hơn"),
    ],
  },
  {
    name: "Sennheiser HD 560S",
    brand: "Sennheiser",
    affiliateUrl: "https://s.shopee.vn/17u82hbg2",
    type: "open-headphone",
    category: "Tai nghe Open-back",
    priceFallback: 4390000,
    tags: ["hd 560s", "tai nghe open back", "mixing", "reference"],
    summaryLine:
      "là open-back trung tính dễ làm quen nhất nếu bạn cần một tai nghe mix tại nhà không quá khó thuần phục",
    audienceLine:
      "Nó hợp với producer đã có interface cơ bản và muốn một điểm tham chiếu cân bằng cho nhiều thể loại nhạc.",
    workflowLine:
      "HD 560S mạnh ở cảm giác 'nghe đúng' và ít drama, rất hữu ích khi bạn đang xây gu nghe tham chiếu bền vững.",
    recommendationLine:
      "Tachy gợi ý HD 560S cho người không muốn quá phân cực giữa kiểu nghe quá rộng hoặc quá sắc.",
    cautionLine:
      "Nếu bạn cần soundstage rộng hơn, K702 sẽ thoáng hơn; nếu muốn nghe chi tiết sắc hơn, DT 880 Pro có lợi thế riêng.",
    pairingLine:
      "Nó đi tốt với iD14 MKII, MOTU M2 và workflow kiểm tra EQ, balance tổng và vocal level.",
    features: [
      "Chất nghe trung tính, dễ dùng cho nhiều thể loại",
      "Hợp làm tai nghe tham chiếu chính khi mix tại nhà",
      "Ít mệt tai hơn kiểu tuning quá gắt hoặc quá màu",
      "Dễ khuyên cho người muốn một reference rõ ràng và thực dụng",
    ],
    relatedArticles: [
      blog("so-sanh-tai-nghe-open-back-k702-hd560s-dt880pro", "So sánh AKG K702, HD 560S và DT 880 Pro"),
    ],
  },
  {
    name: "Beyerdynamic DT 880 Pro",
    brand: "Beyerdynamic",
    affiliateUrl: "https://s.shopee.vn/50Wa5JNaEv",
    type: "open-headphone",
    category: "Tai nghe Open-back",
    priceFallback: 4790000,
    tags: ["dt 880 pro", "tai nghe open back", "mixing", "chi tiet"],
    summaryLine:
      "là open-back nửa mở rất hợp nếu bạn cần tai nghe phân tích chi tiết nhưng vẫn giữ được độ dày thân âm tương đối",
    audienceLine:
      "Nó hợp với producer mix kỹ, người sửa vocal và ai cần nghe high-end, texture, transients rõ hơn.",
    workflowLine:
      "DT 880 Pro thường phát huy ở giai đoạn bạn đã biết mình muốn soi kỹ chi tiết nào trong bản phối.",
    recommendationLine:
      "Tachy xem đây là lựa chọn đáng cân nhắc cho workflow kiểm tra high-end sau khi đã có một tham chiếu cân bằng cơ bản.",
    cautionLine:
      "Bạn nên kiểm tra trở kháng phiên bản mình định mua và khả năng kéo của interface trước khi chốt.",
    pairingLine:
      "Mẫu này hợp với iD14 MKII và các chain mix thiên về sửa vocal, treble và spatial details.",
    features: [
      "Chi tiết tốt, hợp nghe high-end và texture",
      "Giữ body tương đối ổn so với nhiều tai nghe quá thiên phân tích",
      "Hữu ích cho bước kiểm tra sau cùng khi mix tại nhà",
      "Đáng tiền với người đã hiểu rõ gu tham chiếu của mình",
    ],
    relatedArticles: [
      blog("so-sanh-tai-nghe-open-back-k702-hd560s-dt880pro", "So sánh AKG K702, HD 560S và DT 880 Pro"),
    ],
  },
  {
    name: "JBL 305P MkII",
    brand: "JBL",
    affiliateUrl: "https://s.shopee.vn/8fPsS73bq2",
    type: "monitor",
    category: "Loa Kiểm Âm",
    priceFallback: 8190000,
    tags: ["jbl 305p mkii", "loa kiem am", "monitor phong nho", "mixing"],
    summaryLine:
      "là monitor dễ làm quen và dễ sống nhất cho phòng nhỏ nếu bạn muốn âm trường thoáng, nghe lâu ít mệt tai",
    audienceLine:
      "Nó hợp với producer phòng nhỏ, người lần đầu lên monitor nghiêm túc và ai cần cặp loa ít gây hoang mang khi set up ban đầu.",
    workflowLine:
      "JBL 305P MkII phù hợp với góc nghe gần, bàn vừa và những workflow cần quyết định mix dễ hiểu hơn ngay từ đầu.",
    recommendationLine:
      "Tachy gợi ý 305P MkII như một lựa chọn 'an toàn nhưng không nhạt' cho rất nhiều bedroom producer.",
    cautionLine:
      "Giá monitor trên sàn có thể khác nhau khá nhiều và bạn luôn nên kiểm tra kỹ shop đang bán theo từng chiếc hay theo cặp.",
    pairingLine:
      "Cặp loa này đi hợp với monitor stand, pad cách rung và thêm một tai nghe open-back để đối chiếu mix.",
    features: [
      "Âm trường thoáng, dễ làm quen trong phòng nhỏ",
      "Ít gây mệt tai ở các phiên nghe dài",
      "Hợp producer lần đầu lên monitor tử tế",
      "Phản ứng tốt khi placement được làm đúng cơ bản",
    ],
    relatedArticles: [
      blog("so-sanh-jbl-305p-mkii-kali-lp6-v2-adam-t5v", "So sánh JBL 305P MkII, Kali LP-6 V2 và ADAM T5V"),
      blog("loa-kiem-am-cho-phong-duoi-15m2-nen-chon-kich-thuoc-nao", "Phòng dưới 15m2 nên chọn monitor cỡ nào"),
    ],
  },
  {
    name: "Kali LP-6 V2",
    brand: "Kali Audio",
    affiliateUrl: "https://s.shopee.vn/8Kn23XCnjG",
    type: "monitor",
    category: "Loa Kiểm Âm",
    priceFallback: 8990000,
    tags: ["kali lp-6 v2", "loa kiem am", "edm", "hip hop"],
    summaryLine:
      "rất đáng mua nếu bạn làm EDM, trap hoặc hip-hop và muốn low-end tự tin hơn trong tầm monitor bán chuyên",
    audienceLine:
      "Nó hợp với beatmaker, producer nhạc điện tử và người sẵn sàng tối ưu placement cho phòng của mình.",
    workflowLine:
      "LP-6 V2 đáng giá khi bạn cần nghe kick, bassline và low-mid rõ hơn mặt bằng chung để ra quyết định arrangement tốt hơn.",
    recommendationLine:
      "Tachy gợi ý mẫu này cho người thật sự muốn xây hệ monitor nghiêm túc, không chỉ thử cho biết.",
    cautionLine:
      "Nếu bạn buộc phải đặt loa sát tường hoặc bàn quá ngắn, low-end của LP-6 V2 có thể khiến phòng nhỏ khó kiểm soát hơn.",
    pairingLine:
      "Kali LP-6 V2 hợp với monitor stand, pad cách rung và tai nghe open-back để kiểm tra low-end chéo.",
    features: [
      "Low-end mạnh và rõ, hợp beatmaker và producer điện tử",
      "Cho cảm giác monitor lớn và đầy hơn nhiều mẫu cùng tầm",
      "Đáng tiền khi bạn có thể tối ưu vị trí đặt loa tử tế",
      "Giúp ra quyết định về kick, bassline và low-mid tự tin hơn",
    ],
    relatedArticles: [
      blog("review-kali-lp6-v2-cho-phong-nho", "Review Kali LP-6 V2 cho phòng nhỏ"),
      blog("so-sanh-jbl-305p-mkii-kali-lp6-v2-adam-t5v", "So sánh JBL 305P MkII, Kali LP-6 V2 và ADAM T5V"),
      blog("loa-kiem-am-cho-phong-duoi-15m2-nen-chon-kich-thuoc-nao", "Phòng dưới 15m2 nên chọn monitor cỡ nào"),
    ],
  },
  {
    name: "ADAM T5V",
    brand: "ADAM Audio",
    affiliateUrl: "https://s.shopee.vn/2g8fJBeFdB",
    type: "monitor",
    category: "Loa Kiểm Âm",
    priceFallback: 9490000,
    tags: ["adam t5v", "loa kiem am", "vocal", "chi tiet"],
    summaryLine:
      "là monitor đáng cân nhắc nếu bạn cần high-end rõ, tách lớp tốt và hay xử lý vocal, synth hoặc ambience",
    audienceLine:
      "Nó hợp với producer pop, electronic và người cần nghe chi tiết phần high-end nhiều hơn.",
    workflowLine:
      "ADAM T5V phát huy khi bạn muốn soi sibilance, texture và không gian của bản phối rõ ràng hơn.",
    recommendationLine:
      "Tachy đánh giá mẫu này cao ở khả năng giúp bạn tập trung vào lớp treble và độ mở chi tiết mà không cần lên monitor quá lớn.",
    cautionLine:
      "Treble của nó mở hơn một số đối thủ, nên placement và thời lượng nghe dài vẫn cần được kiểm soát cẩn thận.",
    pairingLine:
      "T5V hợp với phòng nhỏ có đặt loa đúng góc, thêm monitor stand và một closed-back để tracking song song.",
    features: [
      "Tách lớp tốt ở phần high-end và ambience",
      "Hợp producer hay sửa vocal, synth và texture",
      "Phát huy trong phòng nhỏ nếu placement được tối ưu",
      "Là lựa chọn thú vị cho người muốn nghe chi tiết hơn ở dải cao",
    ],
    relatedArticles: [
      blog("so-sanh-jbl-305p-mkii-kali-lp6-v2-adam-t5v", "So sánh JBL 305P MkII, Kali LP-6 V2 và ADAM T5V"),
      blog("loa-kiem-am-cho-phong-duoi-15m2-nen-chon-kich-thuoc-nao", "Phòng dưới 15m2 nên chọn monitor cỡ nào"),
    ],
  },
  {
    name: "Arturia MiniLab 3",
    brand: "Arturia",
    affiliateUrl: "https://s.shopee.vn/6pyEGteE4h",
    type: "midi-mini",
    category: "MIDI Mini Controller",
    priceFallback: 2990000,
    tags: ["minilab 3", "midi mini", "controller", "producer phong ngu"],
    summaryLine:
      "là mini controller cân bằng nhất nếu bạn cần feel phím ổn, build đẹp và bộ phần mềm đi kèm thực sự hữu ích",
    audienceLine:
      "Nó hợp với bedroom producer đa DAW, songwriter và người muốn một bộ starter gọn nhưng dùng được dài lâu.",
    workflowLine:
      "MiniLab 3 rất hợp bàn nhỏ và workflow sáng tác nhanh, nơi bạn cần nhập nốt, điều khiển cơ bản và giữ cảm hứng liên tục.",
    recommendationLine:
      "Tachy gợi ý MiniLab 3 cho người muốn một controller 'ít hối hận nhất' khi chưa khóa chặt vào một DAW cụ thể.",
    cautionLine:
      "Nếu bạn dùng FL Studio là trung tâm tuyệt đối, FLkey Mini vẫn cho cảm giác đúng workflow hơn.",
    pairingLine:
      "Nó đi rất hợp với bộ dưới 20 triệu, laptop setup gọn và producer cần bàn phím mini nhưng không muốn quá đồ chơi.",
    features: [
      "Feel phím ổn và build đẹp trong nhóm mini controller",
      "Hợp nhiều DAW thay vì khóa cứng vào một hệ sinh thái",
      "Kích thước gọn, dễ đặt trên bàn làm việc nhỏ",
      "Là điểm khởi đầu tốt cho producer cần tốc độ sáng tác cao",
    ],
    relatedArticles: [
      blog("so-sanh-midi-mini-arturia-minilab-3-flkey-mini-oxygen-pro-mini", "So sánh MiniLab 3, FLkey Mini và Oxygen Pro Mini"),
      blog("combo-home-studio-duoi-20-trieu-cho-producer-ban-chuyen", "Combo home studio dưới 20 triệu cho producer bán chuyên"),
    ],
  },
  {
    name: "Novation FLkey Mini",
    brand: "Novation",
    affiliateUrl: "https://s.shopee.vn/2VpF70g7er",
    type: "midi-mini",
    category: "MIDI Mini Controller",
    priceFallback: 3190000,
    tags: ["flkey mini", "midi mini", "fl studio", "beatmaker"],
    summaryLine:
      "là lựa chọn rất đáng mua cho producer FL Studio cần controller nhỏ nhưng thao tác pattern, channel rack và workflow beat nhanh",
    audienceLine:
      "Nó hợp với beatmaker, producer FL Studio và bedroom setup chú trọng tốc độ ra ý tưởng.",
    workflowLine:
      "FLkey Mini phát huy giá trị rõ nhất khi phần lớn thời gian sáng tác của bạn diễn ra ngay trong FL Studio.",
    recommendationLine:
      "Tachy xem đây là chiếc controller tối ưu đúng bài cho FL hơn là một lựa chọn đa dụng cho mọi người.",
    cautionLine:
      "Nếu bạn dùng Ableton, Logic hoặc nhiều DAW khác nhau, MiniLab 3 thường linh hoạt và an toàn hơn.",
    pairingLine:
      "Nó đi hợp với interface gọn như M2 hoặc EVO 4 và góc viết beat thật nhỏ trên bàn làm việc.",
    features: [
      "Tích hợp FL Studio hợp flow hơn nhóm controller mini chung chung",
      "Rất hợp beatmaker ưu tiên tốc độ pattern và channel control",
      "Kích thước gọn cho bedroom setup hoặc rig di động",
      "Đáng giá nhất khi bạn thực sự sống trong FL Studio",
    ],
    relatedArticles: [
      blog("so-sanh-midi-mini-arturia-minilab-3-flkey-mini-oxygen-pro-mini", "So sánh MiniLab 3, FLkey Mini và Oxygen Pro Mini"),
    ],
  },
  {
    name: "Arturia KeyLab Essential 49 mk3",
    brand: "Arturia",
    affiliateUrl: "https://s.shopee.vn/AAEgFG01p3",
    type: "midi-49",
    category: "MIDI Keyboard 49 Phím",
    priceFallback: 6390000,
    tags: ["keylab essential 49 mk3", "midi 49 phim", "keyboard controller", "arrangement"],
    summaryLine:
      "là MIDI 49 phím toàn diện nhất cho producer bán chuyên cần feel phím ổn, layout cân đối và gói âm thanh kèm theo mạnh",
    audienceLine:
      "Nó hợp với producer sáng tác nghiêm túc, songwriter và arranger đã thấy mini controller bắt đầu bó tay.",
    workflowLine:
      "KeyLab Essential 49 mk3 hợp nhất khi bạn muốn viết hợp âm, piano layer và arrangement nhanh hơn nhưng vẫn giữ bàn làm việc gọn vừa phải.",
    recommendationLine:
      "Tachy gợi ý mẫu này cho người muốn một keyboard controller trung tâm chứ không chỉ là công cụ nhập nốt phụ.",
    cautionLine:
      "Nếu bạn thiên hẳn về Ableton Live và ưu tiên perform clip/session, Launchkey 49 vẫn có chất riêng rõ rệt hơn.",
    pairingLine:
      "Mẫu này đi hợp với iD14 MKII, monitor 5 inch và setup producer bán chuyên tại nhà.",
    features: [
      "49 phím đủ rộng cho hòa âm và arrangement nghiêm túc hơn",
      "Layout cân bằng cho producer đa dụng, không khóa vào một DAW duy nhất",
      "Hợp người muốn nâng cấp hẳn từ mini controller",
      "Đủ gọn để vẫn dùng tốt trong home studio phòng ngủ",
    ],
    relatedArticles: [
      blog("so-sanh-midi-49-phim-keylab-launchkey-a49", "So sánh KeyLab Essential 49 mk3, Launchkey 49 và A49"),
      blog("so-sanh-midi-mini-arturia-minilab-3-flkey-mini-oxygen-pro-mini", "So sánh nhóm MIDI mini controller"),
    ],
  },
  {
    name: "Novation Launchkey 49",
    brand: "Novation",
    affiliateUrl: "https://s.shopee.vn/9UyzS45soq",
    type: "midi-49",
    category: "MIDI Keyboard 49 Phím",
    priceFallback: 6990000,
    tags: ["launchkey 49", "midi 49 phim", "ableton", "keyboard controller"],
    summaryLine:
      "đáng mua nếu bạn dùng Ableton Live và muốn một keyboard 49 phím có workflow performance, clip launch và control rất hợp tay",
    audienceLine:
      "Nó hợp với producer Ableton, live performer và beatmaker cần 49 phím nhưng vẫn thích cảm giác điều khiển performance.",
    workflowLine:
      "Launchkey 49 mạnh ở những setup mà sáng tác và perform diễn ra trong cùng một góc làm việc.",
    recommendationLine:
      "Tachy xem Launchkey 49 là lựa chọn có cá tính rõ ràng cho hệ Ableton thay vì một controller chung chung.",
    cautionLine:
      "Nếu bạn cần giải pháp đa DAW trung tính hơn, KeyLab Essential 49 mk3 vẫn là điểm ngọt toàn diện hơn.",
    pairingLine:
      "Nó đi tốt với laptop Ableton rig, monitor nhỏ và workflow jam hoặc live edit ngay tại bàn.",
    features: [
      "Hợp Ableton Live và workflow performance rõ rệt",
      "49 phím giúp viết hợp âm, bassline và lead thoải mái hơn",
      "Giữ được tinh thần controller năng động chứ không quá khô kỹ thuật",
      "Phù hợp producer vừa sáng tác vừa thích thao tác live",
    ],
    relatedArticles: [
      blog("so-sanh-midi-49-phim-keylab-launchkey-a49", "So sánh KeyLab Essential 49 mk3, Launchkey 49 và A49"),
    ],
  },
  {
    name: "Cloudlifter CL-1",
    brand: "Cloud Microphones",
    affiliateUrl: "https://s.shopee.vn/W4AjlUASz",
    type: "booster",
    category: "Booster Gain",
    priceFallback: 4190000,
    tags: ["cloudlifter cl-1", "booster gain", "dynamic mic", "sm7b"],
    summaryLine:
      "chỉ đáng mua khi interface của bạn thiếu gain sạch cho dynamic mic low-output và bạn muốn vocal dày hơn mà ít noise hơn",
    audienceLine:
      "Nó hợp với người dùng SM7B-style chain, podcaster, broadcaster hoặc vocalist đang phải kéo gain quá cao trên interface.",
    workflowLine:
      "Cloudlifter CL-1 phát huy tác dụng khi bài toán của bạn là thiếu headroom sạch ở phần đầu chain chứ không phải đặt mic sai.",
    recommendationLine:
      "Tachy gợi ý CL-1 cho người muốn một giải pháp phổ biến, dễ tìm hiểu và dễ mua bán lại nếu cần đổi setup.",
    cautionLine:
      "Nếu interface hiện tại đã đủ gain sạch cho micro của bạn, booster có thể không tạo khác biệt tương xứng với số tiền bỏ ra.",
    pairingLine:
      "Nó hợp với chain dynamic mic, M2 hoặc interface tầm trung khi bạn thu gần và muốn thêm độ yên tĩnh ở gain cao.",
    features: [
      "Giải quyết bài toán thiếu gain sạch cho dynamic mic low-output",
      "Phù hợp các chain broadcast và vocal gần miệng",
      "Dễ tìm hiểu vì là lựa chọn phổ biến trong cộng đồng",
      "Đáng cân nhắc khi bạn đã chắc vấn đề nằm ở preamp/interface",
    ],
    relatedArticles: [
      blog("co-can-booster-gain-cloudlifter-fethead-cho-micro-dynamic", "Có cần booster gain cho micro dynamic không"),
      blog("bo-gear-thu-rap-vocal-tai-nha-cho-phong-chua-xu-ly-am", "Bộ gear thu rap vocal tại nhà cho phòng chưa xử lý âm"),
    ],
  },
  {
    name: "sE Dynamite DM1",
    brand: "sE Electronics",
    affiliateUrl: "https://s.shopee.vn/7fXLH16Mg4",
    type: "booster",
    category: "Booster Gain",
    priceFallback: 2690000,
    tags: ["se dynamite dm1", "booster gain", "dynamic mic", "inline preamp"],
    summaryLine:
      "là booster gain inline gọn và thực dụng nếu bạn cần thêm gain sạch cho dynamic mic mà không muốn thêm box rời rạc",
    audienceLine:
      "Nó hợp với home studio nhỏ, podcaster và vocalist dùng dynamic mic nhưng muốn setup gọn hơn loại box lớn.",
    workflowLine:
      "DM1 hợp với các setup cần tối giản dây dợ nhưng vẫn phải giải quyết bài toán gain sạch cho micro dynamic.",
    recommendationLine:
      "Tachy đánh giá cao DM1 ở sự gọn gàng và dễ lắp vào chain hơn nhiều giải pháp cồng kềnh hơn.",
    cautionLine:
      "Nó vẫn chỉ thật sự đáng tiền khi vấn đề của bạn là thiếu gain sạch, không phải kỹ thuật đứng mic hoặc xử lý room.",
    pairingLine:
      "DM1 đi hợp với PodMic, các dynamic vocal mic và interface gain vừa phải trong phòng nhỏ.",
    features: [
      "Thiết kế inline gọn, ít chiếm chỗ trong setup nhỏ",
      "Tăng gain sạch cho dynamic mic low-output khi thật sự cần",
      "Phù hợp podcaster, creator và vocalist home studio",
      "Là lựa chọn thực dụng cho người ghét thêm hộp rời vào chain",
    ],
    relatedArticles: [
      blog("co-can-booster-gain-cloudlifter-fethead-cho-micro-dynamic", "Có cần booster gain cho micro dynamic không"),
    ],
  },
  {
    name: "Alctron PF8",
    brand: "Alctron",
    affiliateUrl: "https://s.shopee.vn/8pjIfEHyWR",
    type: "reflection-filter",
    category: "Reflection Filter",
    priceFallback: 1190000,
    tags: ["alctron pf8", "reflection filter", "thu vocal", "phong ngu"],
    summaryLine:
      "là reflection filter giá trị tốt nếu bạn muốn làm gọn góc thu vocal trong phòng ngủ mà chưa thể treatment bài bản ngay",
    audienceLine:
      "Nó hợp với người thu vocal tại phòng ngủ, podcaster và singer-songwriter chưa đủ ngân sách xử lý âm toàn phòng.",
    workflowLine:
      "PF8 hữu ích như một bước giảm bớt phản xạ gần quanh micro, giúp góc thu đỡ lộn xộn hơn khi thu một mình.",
    recommendationLine:
      "Tachy gợi ý PF8 như giải pháp thực dụng, dễ tiếp cận và đủ hiệu quả cho nhiều home studio nhỏ.",
    cautionLine:
      "Bạn không nên kỳ vọng reflection filter thay thế acoustic treatment tổng thể, và nó vẫn cần stand đủ chắc để phát huy tốt.",
    pairingLine:
      "PF8 hợp với MV7+, PodMic USB, LCT 240 PRO và cả các góc thu vocal gần tường mềm, rèm dày hoặc thảm.",
    features: [
      "Giúp góc thu gọn hơn trong phòng ngủ chưa xử lý âm",
      "Chi phí dễ chịu hơn nhiều giải pháp treatment lớn",
      "Phù hợp creator, singer và podcaster tự thu tại nhà",
      "Hiệu quả nhất khi kết hợp đúng placement và stand chắc chắn",
    ],
    relatedArticles: [
      blog("co-nen-mua-reflection-filter-cho-phong-ngu-thu-vocal", "Có nên mua reflection filter cho phòng ngủ thu vocal"),
      blog("bo-gear-thu-rap-vocal-tai-nha-cho-phong-chua-xu-ly-am", "Bộ gear thu rap vocal tại nhà cho phòng chưa xử lý âm"),
    ],
  },
  {
    name: "Soundking monitor stand",
    brand: "Soundking",
    affiliateUrl: "https://s.shopee.vn/3g1CVs5gZE",
    type: "monitor-accessory",
    category: "Phụ Kiện Monitor",
    priceFallback: 1490000,
    tags: ["monitor stand", "ke loa", "phu kien monitor", "placement"],
    summaryLine:
      "đáng tiền nếu monitor của bạn đang đặt thẳng lên mặt bàn và cần một bước sửa placement để nghe đúng hơn",
    audienceLine:
      "Nó hợp với người dùng monitor trên desk setup, phòng nhỏ và producer chưa có chân loa rời đúng nghĩa.",
    workflowLine:
      "Một cặp stand phù hợp thường cải thiện khả năng nghe đúng nhanh hơn việc đổi sang cặp loa khác nhưng vẫn đặt sai vị trí.",
    recommendationLine:
      "Tachy gợi ý món này khi tweeter chưa ngang tai hoặc mặt bàn đang truyền rung quá nhiều vào trải nghiệm nghe.",
    cautionLine:
      "Bạn nên đo kích thước bàn, độ cao ghế và khoảng cách nghe trước khi mua để tránh chọn sai cỡ hoặc sai chiều cao.",
    pairingLine:
      "Monitor stand hợp với JBL 305P MkII, Kali LP-6 V2, ADAM T5V và cả setup dùng thêm pad cách rung.",
    features: [
      "Giúp đưa tweeter lên gần tầm tai hơn trong desk setup",
      "Hỗ trợ giảm rung truyền xuống mặt bàn tốt hơn cách kê tạm",
      "Rất hữu ích cho phòng nhỏ chưa có chỗ đặt chân loa rời",
      "Tăng hiệu quả cho monitor hiện tại trước khi nghĩ tới đổi loa",
    ],
    relatedArticles: [
      blog("monitor-isolation-pad-chan-loa-ke-loa-phu-kien-dang-nang-cap", "Pad kê loa, chân loa hay kệ loa phụ nên nâng cấp gì trước"),
      blog("loa-kiem-am-cho-phong-duoi-15m2-nen-chon-kich-thuoc-nao", "Phòng dưới 15m2 nên chọn monitor cỡ nào"),
    ],
  },
  {
    name: "desk microphone stand",
    brand: "Generic",
    affiliateUrl: "https://s.shopee.vn/20syWvnQ2T",
    type: "recording-accessory",
    category: "Phụ Kiện Thu Âm",
    priceFallback: 450000,
    tags: ["desk microphone stand", "chan mic", "thu am tai nha", "podcast"],
    summaryLine:
      "là món phụ kiện nên có nếu bạn thu vocal, podcast hoặc voice-over trên bàn làm việc và muốn đặt mic ổn định hơn",
    audienceLine:
      "Nó hợp với creator, podcaster, singer-songwriter và mọi home studio nhỏ cần setup thu gọn.",
    workflowLine:
      "Một chân mic để bàn tốt giúp góc mic lặp lại đúng, giảm lỗi do đặt sai vị trí và làm việc nhanh hơn rõ rệt.",
    recommendationLine:
      "Tachy xem đây là món nhỏ nhưng ảnh hưởng lớn đến tính nhất quán của mỗi take thu.",
    cautionLine:
      "Bạn nên kiểm tra tải trọng thực tế vì micro dynamic lớn hoặc filter nặng có thể làm stand yếu bị võng.",
    pairingLine:
      "Nó hợp với MV7+, PodMic USB, LCT 240 PRO, pop filter và các góc thu trên bàn máy tính.",
    features: [
      "Giúp giữ vị trí mic ổn định và lặp lại dễ hơn",
      "Rất hợp podcast, voice-over và vocal thu tại bàn làm việc",
      "Tiết kiệm không gian hơn các chân mic floor lớn",
      "Tăng độ gọn gàng cho home studio nhỏ và setup content",
    ],
    relatedArticles: [
      blog("combo-home-studio-duoi-10-trieu-cho-singer-songwriter", "Combo home studio dưới 10 triệu cho singer-songwriter"),
      blog("bo-gear-thu-rap-vocal-tai-nha-cho-phong-chua-xu-ly-am", "Bộ gear thu rap vocal tại nhà cho phòng chưa xử lý âm"),
    ],
  },
  {
    name: "pop filter",
    brand: "Generic",
    affiliateUrl: "https://s.shopee.vn/9fIPfByKNo",
    type: "recording-accessory",
    category: "Phụ Kiện Thu Âm",
    priceFallback: 190000,
    tags: ["pop filter", "phu kien micro", "thu vocal", "home studio"],
    summaryLine:
      "là phụ kiện rẻ nhưng rất đáng mua nếu bạn thu vocal gần mic và muốn giảm pop, giữ take sạch hơn ngay từ đầu",
    audienceLine:
      "Nó hợp với ca sĩ, podcaster, voice-over artist và bất kỳ ai đang thu lời nói hoặc hát bằng mic hướng trực diện.",
    workflowLine:
      "Một pop filter tốt giúp bạn bớt phải sửa plosive trong mix và cho phép đứng mic gần, ổn định hơn khi thu.",
    recommendationLine:
      "Tachy xem đây là món phụ kiện nhỏ có tỷ lệ hiệu quả trên chi phí cực cao cho người mới thu âm.",
    cautionLine:
      "Pop filter không xử lý được room tone hay diction, nên đừng kỳ vọng nó giải quyết những lỗi không thuộc về plosive.",
    pairingLine:
      "Nó đi hợp với condenser, dynamic vocal mic và chân mic để bàn hoặc boom arm cơ bản.",
    features: [
      "Giảm mạnh plosive kiểu P, B khi thu gần micro",
      "Giúp take sạch hơn trước khi vào chỉnh sửa",
      "Rất dễ ghép vào mọi chain thu vocal cơ bản",
      "Là nâng cấp nhỏ nhưng hữu ích cho người mới thu âm tại nhà",
    ],
    relatedArticles: [
      blog("combo-home-studio-duoi-10-trieu-cho-singer-songwriter", "Combo home studio dưới 10 triệu cho singer-songwriter"),
      blog("huong-dan-lam-home-studio-co-ban-cho-producer", "Hướng dẫn làm home studio cơ bản cho producer"),
    ],
  },
  {
    name: "XLR cable",
    brand: "Generic",
    affiliateUrl: "https://s.shopee.vn/7KuUsyMzIQ",
    type: "recording-accessory",
    category: "Phụ Kiện Thu Âm",
    priceFallback: 250000,
    tags: ["xlr cable", "cap micro", "thu am", "home studio"],
    summaryLine:
      "là món không nên tiết kiệm quá mức nếu bạn muốn chain thu ổn định, ít hum và dễ dùng lâu cho home studio",
    audienceLine:
      "Nó hợp với bất kỳ ai dùng micro XLR, audio interface hoặc monitor cần kết nối cân bằng ổn định.",
    workflowLine:
      "Cáp XLR tốt không làm âm thanh màu nhiệm hơn, nhưng giúp setup hoạt động yên ổn, ít lỗi vặt và dễ kiểm tra khi có sự cố.",
    recommendationLine:
      "Tachy ưu tiên cáp chắc jack, vừa đủ độ dài và đáng tin hơn là chạy theo những lời quảng cáo quá đà.",
    cautionLine:
      "Bạn không cần lao vào cáp quá đắt, nhưng cũng không nên chọn loại quá rẻ nếu phải cắm rút hoặc dùng lâu dài thường xuyên.",
    pairingLine:
      "Nó đi với mọi chain từ EVO 4 + LCT 240 PRO đến iD14 MKII + condenser nâng cấp và cả monitor active.",
    features: [
      "Giúp chain thu ổn định và ít lỗi vặt hơn trong thời gian dài",
      "Phù hợp cho micro XLR, interface và monitor active",
      "Giải quyết nhu cầu cơ bản nhưng rất quan trọng của home studio",
      "Đáng đầu tư vừa đủ để tránh rủi ro hum, jack lỏng hoặc đứt ngầm",
    ],
    relatedArticles: [
      blog("combo-home-studio-duoi-10-trieu-cho-singer-songwriter", "Combo home studio dưới 10 triệu cho singer-songwriter"),
      blog("huong-dan-lam-home-studio-co-ban-cho-producer", "Hướng dẫn làm home studio cơ bản cho producer"),
    ],
  },
  {
    name: "Samsung T7",
    brand: "Samsung",
    affiliateUrl: "https://s.shopee.vn/7VDv5VrCYi",
    type: "ssd",
    category: "SSD Ngoài",
    priceFallback: 2490000,
    tags: ["samsung t7", "ssd ngoai", "sample library", "producer"],
    summaryLine:
      "là SSD ngoài an toàn và dễ gợi ý nhất nếu bạn cần lưu sample, project và backup workflow làm nhạc giữa laptop với máy bàn",
    audienceLine:
      "Nó hợp với producer di chuyển, người có sample library lớn và home studio bán chuyên cần workflow ổn định.",
    workflowLine:
      "Samsung T7 mạnh ở sự cân bằng: đủ nhanh, đủ gọn, đủ dễ dùng để trở thành ổ làm việc hằng ngày thay vì chỉ là ổ backup.",
    recommendationLine:
      "Tachy ưu tiên T7 cho người muốn một lựa chọn all-round ít phải suy nghĩ và ít kén workflow.",
    cautionLine:
      "Nếu bạn di chuyển cực nhiều và ưu tiên phần vỏ yên tâm hơn, SanDisk Extreme Portable có sức hút riêng.",
    pairingLine:
      "T7 hợp cho sample library, project Ableton, stem export và backup session giữa nhiều máy.",
    features: [
      "Dễ cân bằng giữa tốc độ, độ ổn định và tính cơ động",
      "Hợp dùng như ổ làm việc hằng ngày cho project âm nhạc",
      "Rất tiện để mang sample library giữa desktop và laptop",
      "Là lựa chọn all-round an toàn cho producer bán chuyên",
    ],
    relatedArticles: [
      blog("ssd-ngoai-cho-producer-samsung-t7-sandisk-extreme-crucial-x9", "Producer nên mua Samsung T7, SanDisk hay Crucial X9"),
      blog("nang-cap-home-studio-mua-gi-truoc-de-nghe-hay-hon", "Nâng cấp home studio mua gì trước để nghe hay hơn"),
    ],
  },
  {
    name: "SanDisk Extreme Portable SSD",
    brand: "SanDisk",
    affiliateUrl: "https://s.shopee.vn/4AxT7RwZNY",
    type: "ssd",
    category: "SSD Ngoài",
    priceFallback: 2790000,
    tags: ["sandisk extreme portable", "ssd ngoai", "producer mobile", "backup"],
    summaryLine:
      "đáng mua nếu bạn thường xuyên mang laptop đi làm việc và muốn SSD ngoài có cảm giác yên tâm hơn cho workflow di động",
    audienceLine:
      "Nó hợp với producer mobile, creator quay hoặc thu ở nhiều địa điểm và người phải mang project ra khỏi studio thường xuyên.",
    workflowLine:
      "SanDisk Extreme Portable đặc biệt hợp cho việc di chuyển project, stem và backup nhanh mà không muốn mang thêm ổ cồng kềnh.",
    recommendationLine:
      "Tachy gợi ý mẫu này cho người xem tính cơ động là một phần quan trọng của workflow chứ không phải tính năng phụ.",
    cautionLine:
      "Nếu bạn ưu tiên cân bằng chung và sự dễ khuyên nhất cho đa số case, Samsung T7 vẫn là lựa chọn all-round an toàn hơn.",
    pairingLine:
      "Nó hợp với laptop rig, sample library di động và cả workflow dựng nội dung kèm âm thanh khi đi ngoài studio.",
    features: [
      "Hợp producer và creator phải di chuyển project thường xuyên",
      "Tiện cho backup nhanh giữa nhiều thiết bị làm việc",
      "Phù hợp workflow lưu sample, stem và session ngoài studio chính",
      "Là lựa chọn tốt cho người đề cao tính di động của toàn bộ setup",
    ],
    relatedArticles: [
      blog("ssd-ngoai-cho-producer-samsung-t7-sandisk-extreme-crucial-x9", "Producer nên mua Samsung T7, SanDisk hay Crucial X9"),
    ],
  },
  {
    name: "Crucial X9",
    brand: "Crucial",
    affiliateUrl: "https://s.shopee.vn/30lVjMQCJA",
    type: "ssd",
    category: "SSD Ngoài",
    priceFallback: 2190000,
    tags: ["crucial x9", "ssd ngoai", "backup project", "sample library"],
    summaryLine:
      "là SSD giá trị tốt nếu bạn cần thêm dung lượng cho sample library và backup project mà không muốn chi quá tay",
    audienceLine:
      "Nó hợp với producer cần mở rộng lưu trữ, người muốn tách sample khỏi ổ hệ điều hành và ai cần ổ phụ đáng tin để archive dự án.",
    workflowLine:
      "Crucial X9 hợp với vai trò ổ lưu trữ phụ cho sample, stem, backup tuần hoặc thư viện project cũ.",
    recommendationLine:
      "Tachy xem đây là hướng đi thực dụng cho người ưu tiên tỷ lệ dung lượng trên chi phí hơn là cảm giác thương hiệu.",
    cautionLine:
      "Nếu bạn cần cảm giác cao cấp hơn hoặc muốn lựa chọn dễ bán lại hơn, Samsung T7 thường thuyết phục hơn.",
    pairingLine:
      "Nó đi tốt với workflow backup 3-2-1 cơ bản, sample library lớn và các session không muốn để chung với ổ hệ điều hành.",
    features: [
      "Giá trị tốt cho nhu cầu mở rộng dung lượng lưu trữ",
      "Hợp sample library, stem archive và backup project",
      "Dễ đưa vào workflow backup định kỳ của home studio",
      "Phù hợp người cần ổ phụ đáng tin hơn là ổ show-off",
    ],
    relatedArticles: [
      blog("ssd-ngoai-cho-producer-samsung-t7-sandisk-extreme-crucial-x9", "Producer nên mua Samsung T7, SanDisk hay Crucial X9"),
    ],
  },
]

const IMAGE_MAP = {
  'Audient iD14 MKII': ['https://www.thomann.de/pics/prod/510533.jpg'],
  'MOTU M2': ['https://www.thomann.de/pics/prod/478035.jpg'],
  'SSL 2+': ['https://www.thomann.de/pics/prod/601306.jpg'],
  'Audient EVO 4': ['https://www.thomann.de/pics/prod/483323.jpg'],
  'Rode NT1 5th Gen': ['https://www.thomann.de/pics/prod/561426.jpg'],
  'Lewitt LCT 440 PURE': ['https://www.thomann.de/pics/prod/412424.jpg'],
  'Lewitt LCT 240 PRO': ['https://www.thomann.de/pics/prod/562461.jpg'],
  'Shure MV7+': ['https://www.thomann.de/pics/prod/587484.jpg'],
  'Rode PodMic USB': ['https://www.thomann.de/pics/prod/567098.jpg'],
  'Audio-Technica ATH-M40x': ['https://www.thomann.de/pics/prod/331904.jpg'],
  'Sony MDR-7506': ['https://www.thomann.de/pics/prod/135709.jpg'],
  'Sennheiser HD 280 Pro': ['https://www.thomann.de/pics/prod/400099.jpg'],
  'Audio-Technica ATH-M20x': ['https://www.thomann.de/pics/prod/331902.jpg'],
  'AKG K702': ['https://www.thomann.de/pics/prod/217575.jpg'],
  'Sennheiser HD 560S': ['https://www.thomann.de/pics/prod/501912.jpg'],
  'Beyerdynamic DT 880 Pro': ['https://www.thomann.de/pics/prod/424105.jpg'],
  'JBL 305P MkII': ['https://www.thomann.de/pics/prod/447479.jpg'],
  'Kali LP-6 V2': ['https://www.thomann.de/pics/prod/528943.jpg'],
  'ADAM T5V': ['https://www.thomann.de/pics/prod/431376.jpg'],
  'Arturia MiniLab 3': ['https://www.thomann.de/pics/prod/553721.jpg'],
  'Novation FLkey Mini': ['https://www.thomann.de/pics/prod/540012.jpg'],
  'Arturia KeyLab Essential 49 mk3': ['https://www.thomann.de/pics/prod/567142.jpg'],
  'Novation Launchkey 49': ['https://www.thomann.de/pics/prod/594594.jpg'],
  'Cloudlifter CL-1': ['https://www.thomann.de/pics/prod/320773.jpg'],
  'sE Dynamite DM1': ['https://www.thomann.de/pics/prod/462124.jpg'],
  'Alctron PF8': ['https://alctron-audio.com/EN/upload/images/2024/5/PF8白底图_(4).jpg'],
  'Soundking monitor stand': ['https://jdsound.com.au/cdn/shop/files/monitor_stand_1.jpg?v=1742901245'],
  'desk microphone stand': ['https://m.media-amazon.com/images/I/61CH0DZb4XL._AC_SY300_SX300_QL70_ML2_.jpg'],
  'pop filter': ['https://neewer.com/cdn/shop/files/1_afc43d96-1cbf-41ce-88e4-6f28d13c3602.jpg?v=1766393894'],
  'XLR cable': ['https://www.thomann.de/pics/prod/479797.jpg'],
  'Samsung T7': ['https://images.samsung.com/is/image/samsung/p6pim/us/mu-pc1t0h-am/gallery/us-portable-ssd-t7-574760-mu-pc1t0h-am-550551750'],
  'SanDisk Extreme Portable SSD': ['https://www.sandisk.com/content/dam/sandisk/en-us/assets/products/portable/extreme-portable-ssd/gallery/extreme-portable-ssd-left-reddot.png'],
  'Crucial X9': ['https://assets.micron.com/adobe/assets/urn:aaid:aem:79ac163c-5253-465e-bb24-1fe1a3bf3543/renditions/transformpng-640-640.png/as/crucial-x9-isolated-left.png'],
}

function slugify(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\+/g, " plus ")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
}

function formatPrice(price) {
  return `${Number(price || 0).toLocaleString("vi-VN")} VND`
}

function decodeHtml(value = "") {
  return String(value)
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
}

function parsePrice(value) {
  if (value === null || value === undefined) return null
  const cleaned = String(value).replace(/[^0-9]/g, "")
  if (!cleaned) return null
  const parsed = Number(cleaned)
  return Number.isFinite(parsed) ? parsed : null
}

function normalizeImageUrl(url) {
  if (!url) return null
  const cleaned = decodeHtml(url).trim()
  if (!/^https?:\/\//i.test(cleaned)) return null
  return cleaned
}

function uniq(values) {
  return [...new Set(values.filter(Boolean))]
}

function joinArticleLinks(items = []) {
  const links = items.map((item) => `<a href="/blog/${item.slug}">${item.title}</a>`)
  if (links.length === 0) return ""
  if (links.length === 1) return links[0]
  if (links.length === 2) return `${links[0]} và ${links[1]}`
  return `${links.slice(0, -1).join(", ")} và ${links.at(-1)}`
}

function buildDescription(product, price) {
  const articleLinks = joinArticleLinks(product.relatedArticles.slice(0, 2))
  const priceText = formatPrice(price)
  return [
    `<p><strong>Kết luận nhanh:</strong> ${product.name} ${product.summaryLine}.</p>`,
    `<p>Giá tham khảo hiện tại quanh <strong>${priceText}</strong>. ${product.audienceLine} ${product.workflowLine}</p>`,
    articleLinks
      ? `<p>${product.recommendationLine} Trước khi chốt mua, bạn nên đối chiếu thêm với ${articleLinks}. ${product.cautionLine}</p>`
      : `<p>${product.recommendationLine} ${product.cautionLine}</p>`,
  ].join("")
}

function buildWhyRecommend(product) {
  return [
    `<p>${product.recommendationLine}</p>`,
    `<p>${product.pairingLine} ${product.cautionLine}</p>`,
  ].join("")
}

function buildPriceNote(product) {
  if (product.type === "monitor") {
    return "Giá tham khảo, cần kiểm tra kỹ listing đang bán theo từng chiếc hay theo cặp và mức voucher theo thời điểm."
  }
  if (product.type === "recording-accessory") {
    return "Giá tham khảo, có thể thay đổi theo combo phụ kiện, chất liệu và shop bán cụ thể."
  }
  return "Giá tham khảo, có thể thay đổi theo shop, voucher và thời điểm cập nhật."
}

function buildSeoTitle(product) {
  return `${product.name} cho Home Studio | Gia tham khao va review nhanh`
}

function buildSeoDescription(product) {
  return `${product.name} co dang mua cho home studio khong? Xem gia tham khao, diem manh, luu y khi mua va bai viet lien quan tu Tachy.`
}

function buildFaq(product) {
  const articleLinks = joinArticleLinks(product.relatedArticles.slice(0, 2))
  if (product.type === "audio-interface") {
    return [
      {
        question: `${product.name} hợp với ai nhất?`,
        answer: `${product.audienceLine} ${product.workflowLine}`,
      },
      {
        question: `${product.name} có đáng mua để dùng lâu dài không?`,
        answer: `${product.recommendationLine} ${product.cautionLine}`,
      },
      {
        question: `Nên đọc gì trước khi chốt ${product.name}?`,
        answer: articleLinks
          ? `Bạn nên xem ${articleLinks} để đặt ${product.name} vào đúng bài toán workflow, ngân sách và nâng cấp lâu dài.`
          : `${product.name} hợp nhất khi bạn đối chiếu nó theo đúng workflow thu, monitor và mix của mình.`,
      },
    ]
  }

  if (["condenser-mic", "hybrid-mic"].includes(product.type)) {
    return [
      {
        question: `${product.name} hợp với kiểu giọng và kiểu phòng nào?`,
        answer: `${product.audienceLine} ${product.workflowLine}`,
      },
      {
        question: `Phòng chưa xử lý âm có nên mua ${product.name} không?`,
        answer: product.cautionLine,
      },
      {
        question: `Nên ghép ${product.name} với gear nào cho hợp lý?`,
        answer: product.pairingLine,
      },
    ]
  }

  if (["closed-headphone", "open-headphone"].includes(product.type)) {
    return [
      {
        question: `${product.name} hợp tracking hay mix hơn?`,
        answer: `${product.workflowLine} ${product.audienceLine}`,
      },
      {
        question: `Điều cần lưu ý trước khi mua ${product.name} là gì?`,
        answer: product.cautionLine,
      },
      {
        question: `Nên đọc bài nào trước khi chốt ${product.name}?`,
        answer: articleLinks
          ? `Bạn nên xem ${articleLinks} để biết ${product.name} đứng ở đâu so với các lựa chọn còn lại trong cùng tầm nhu cầu.`
          : `${product.name} nên được chọn theo đúng vai trò tracking, edit hay mix trong workflow của bạn.`,
      },
    ]
  }

  if (product.type === "monitor") {
    return [
      {
        question: `${product.name} hợp với kiểu phòng nào?`,
        answer: `${product.audienceLine} ${product.workflowLine}`,
      },
      {
        question: `Cần lưu ý gì về placement và giá của ${product.name}?`,
        answer: `${product.cautionLine} ${product.pairingLine}`,
      },
      {
        question: `Nên đọc bài nào trước khi mua ${product.name}?`,
        answer: articleLinks
          ? `Bạn nên xem ${articleLinks} để chọn đúng kích thước, tính cách loa và mức kiểm soát low-end phù hợp với phòng của mình.`
          : `${product.name} nên được chọn sau khi bạn hiểu rõ phòng, khoảng cách nghe và vị trí đặt loa hiện tại.`,
      },
    ]
  }

  if (["midi-mini", "midi-49"].includes(product.type)) {
    return [
      {
        question: `${product.name} hợp với ai nhất?`,
        answer: `${product.audienceLine} ${product.workflowLine}`,
      },
      {
        question: `Điều cần lưu ý trước khi mua ${product.name} là gì?`,
        answer: product.cautionLine,
      },
      {
        question: `Nên đọc gì để chọn đúng controller như ${product.name}?`,
        answer: articleLinks
          ? `Bạn nên xem ${articleLinks} để đối chiếu đúng DAW, số phím và kiểu workflow sáng tác của mình.`
          : `${product.name} nên được chọn theo DAW chính, không gian bàn làm việc và cách bạn viết nhạc mỗi ngày.`,
      },
    ]
  }

  if (["booster", "reflection-filter", "monitor-accessory", "recording-accessory"].includes(product.type)) {
    return [
      {
        question: `${product.name} có phải món nên mua ngay không?`,
        answer: `${product.recommendationLine} ${product.cautionLine}`,
      },
      {
        question: `${product.name} giải quyết vấn đề gì rõ nhất trong home studio?`,
        answer: `${product.workflowLine} ${product.pairingLine}`,
      },
      {
        question: `Nên đọc bài nào trước khi chốt ${product.name}?`,
        answer: articleLinks
          ? `Bạn nên xem ${articleLinks} để biết món phụ kiện này giải quyết đúng nút thắt nào và khi nào nên ưu tiên mua.`
          : `${product.name} chỉ đáng tiền khi nó xử lý đúng vấn đề mà setup hiện tại của bạn đang gặp.`,
      },
    ]
  }

  if (product.type === "ssd") {
    return [
      {
        question: `${product.name} có hợp để lưu sample và project âm nhạc không?`,
        answer: `${product.workflowLine} ${product.audienceLine}`,
      },
      {
        question: `Điều cần lưu ý trước khi mua ${product.name} là gì?`,
        answer: product.cautionLine,
      },
      {
        question: `Nên đọc gì để chọn SSD ngoài cho producer?`,
        answer: articleLinks
          ? `Bạn nên xem ${articleLinks} để đối chiếu ${product.name} với nhu cầu backup, di chuyển project và dung lượng sample của mình.`
          : `${product.name} nên được chọn theo vai trò lưu project, sample hay backup mà bạn cần nhiều nhất.`,
      },
    ]
  }

  return []
}

function parseJsonLdBlocks(html) {
  const matches = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
  const results = []

  for (const match of matches) {
    const raw = decodeHtml(match[1]).trim()
    if (!raw) continue
    try {
      results.push(JSON.parse(raw))
    } catch {
      // Ignore malformed LD+JSON blobs.
    }
  }

  return results
}

function flattenNodes(node) {
  if (!node) return []
  if (Array.isArray(node)) return node.flatMap(flattenNodes)
  if (typeof node !== "object") return []
  const self = [node]
  if (Array.isArray(node["@graph"])) return [...self, ...node["@graph"].flatMap(flattenNodes)]
  return self
}

function findProductSchema(html) {
  const nodes = parseJsonLdBlocks(html).flatMap(flattenNodes)
  return nodes.find((node) => {
    const type = node?.["@type"]
    if (Array.isArray(type)) return type.includes("Product")
    return type === "Product"
  }) || null
}

function extractShopeeData(html) {
  const productSchema = findProductSchema(html)
  const metaPrice = html.match(/<meta[^>]+property="product:price:amount"[^>]+content="([^"]+)"/i)?.[1]
  const metaImage = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i)?.[1]
  const schemaImages = productSchema?.image
  const schemaOffers = productSchema?.offers

  let price = parsePrice(metaPrice)
  if (!price && schemaOffers) {
    if (Array.isArray(schemaOffers)) {
      price = parsePrice(schemaOffers[0]?.price)
    } else {
      price = parsePrice(schemaOffers.price)
    }
  }

  const images = uniq([
    ...(Array.isArray(schemaImages) ? schemaImages : [schemaImages]),
    metaImage,
  ].map(normalizeImageUrl)).slice(0, 5)

  return { price, images }
}

async function fetchShopeeMeta(product, attempt = 1) {
  try {
    const res = await fetch(product.affiliateUrl, {
      redirect: "follow",
      headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/137.0 Safari/537.36",
        "accept-language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7",
      },
    })

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }

    const html = await res.text()
    return extractShopeeData(html)
  } catch (error) {
    if (attempt < 3) {
      await new Promise((resolve) => setTimeout(resolve, attempt * 1000))
      return fetchShopeeMeta(product, attempt + 1)
    }
    console.warn(`Failed to fetch live data for ${product.name}: ${error.message}`)
    return { price: null, images: [] }
  }
}

async function main() {
  const now = Date.now()
  const catalog = []

  for (const [index, product] of products.entries()) {
    const live = await fetchShopeeMeta(product)
    const price = live.price || product.priceFallback
    const images = IMAGE_MAP[product.name] || live.images

    console.log(`- ${product.name}: ${price ? formatPrice(price) : "no price"}, images=${images.length}`)

    catalog.push({
      id: crypto.randomUUID(),
      brand: product.brand,
      name: product.name,
      slug: slugify(product.name),
      description: buildDescription(product, price),
      price,
      currency: "VND",
      images,
      category: product.category,
      tags: product.tags,
      affiliateUrl: product.affiliateUrl,
      stockQuantity: 0,
      stripeProductId: "",
      status: "active",
      seoTitle: buildSeoTitle(product),
      seoDescription: buildSeoDescription(product),
      priceNote: buildPriceNote(product),
      features: product.features,
      whyRecommend: buildWhyRecommend(product),
      faq: buildFaq(product),
      relatedArticles: product.relatedArticles,
      createdAt: new Date(now - index * 60_000).toISOString(),
      updatedAt: new Date(now).toISOString(),
    })

    await new Promise((resolve) => setTimeout(resolve, 350))
  }

  const outFile = path.join(process.cwd(), "db", "shop.json")
  await writeFile(outFile, `${JSON.stringify(catalog, null, 2)}\n`, "utf8")
  console.log(`Wrote ${catalog.length} products to ${outFile}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
