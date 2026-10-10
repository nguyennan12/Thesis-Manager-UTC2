TRƯỜNG ĐẠI HỌC GIAO THÔNG VẬN TẢI

PHÂN HIỆU TẠI TP. HỒ CHÍ MINH

TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM

(Software Requirements Specification – SRS)

HỆ THỐNG WEB QUẢN LÝ

ĐỒ ÁN CƠ SỞ VÀ ĐỒ ÁN CHUYÊN NGÀNH

Phiên bản: 1.0 (bản nháp để thẩm định)

Ngày lập: 10/10/2026

Giảng viên hướng dẫn: ThS. Phạm Thị Miên

Sinh viên thực hiện: Dư Nguyên An – MSSV 6551071001

Lớp CQ.65.CNTT – Khóa 65

TP. Hồ Chí Minh, tháng 10 năm 2026

LỊCH SỬ THAY ĐỔI TÀI LIỆU


| Phiên bản | Ngày | Người thực hiện | Nội dung thay đổi |
| --- | --- | --- | --- |
| 1.0 | 10/10/2026 | Dư Nguyên An | Lập SRS từ báo cáo phân tích thiết kế; bổ sung yêu cầu cho ứng dụng web |

MỤC LỤC


# 1. GIỚI THIỆU


## 1.1. Mục đích tài liệu

Tài liệu Đặc tả yêu cầu phần mềm (Software Requirements Specification – SRS) này mô tả đầy đủ các yêu cầu chức năng, yêu cầu dữ liệu, yêu cầu giao diện và yêu cầu phi chức năng của Hệ thống web Quản lý Đồ án Cơ sở và Đồ án Chuyên ngành dùng chung cho toàn Trường Đại học Giao thông Vận tải Phân hiệu tại TP. Hồ Chí Minh (UTC2).

Tài liệu là cơ sở thống nhất giữa các bên liên quan (Ban Giám đốc, Phòng Đào tạo, các Khoa/Bộ môn, nhóm phát triển) và là đầu vào trực tiếp cho các hoạt động thiết kế kiến trúc, thiết kế giao diện, thiết kế cơ sở dữ liệu, lập trình và kiểm thử hệ thống. Nội dung được xây dựng dựa trên báo cáo “Phân tích thiết kế theo yêu cầu – Quản lý đồ án cơ sở, đồ án chuyên ngành” (khảo sát hiện trạng, BFD, DFD, ERD/RM) và được bổ sung các yêu cầu cần thiết để một ứng dụng web có thể vận hành thực tế.


## 1.2. Phạm vi sản phẩm

Hệ thống (tạm gọi là UTC2-DAMS – Đồ án Management System) là ứng dụng web tập trung hóa toàn bộ vòng đời của một đồ án, từ khi đề tài được đề xuất đến khi kết quả học phần được công bố và lưu trữ. Hệ thống hỗ trợ 5 phân hệ nghiệp vụ tương ứng với BFD của báo cáo phân tích:

Phân hệ 1.0 – Quản lý đề tài: đề xuất, xét duyệt, tra cứu đề tài.

Phân hệ 2.0 – Quản lý đăng ký: tra cứu đề tài đã duyệt, đăng ký/hủy, kiểm tra điều kiện, chốt danh sách.

Phân hệ 3.0 – Quản lý tiến độ: báo cáo tuần, nhận xét của giảng viên, theo dõi và cảnh báo chậm tiến độ.

Phân hệ 4.0 – Quản lý Hội đồng: thành lập hội đồng, phân công thành viên, xếp lịch và thông báo lịch bảo vệ.

Phân hệ 5.0 – Quản lý chấm điểm và báo cáo: nộp báo cáo toàn văn, kiểm tra trùng lặp, chấm điểm theo tiêu chí, tổng kết – xếp loại, công bố và thống kê.

Ngoài ra hệ thống có các chức năng nền: xác thực – phân quyền, quản lý danh mục dữ liệu nền, thông báo, nhật ký hoạt động và lưu trữ hồ sơ.

Ngoài phạm vi (phiên bản 1.0): quản lý học phần/đăng ký môn học chung, tính học phí, đăng nhập một lần (SSO) với cổng đào tạo, chữ ký số, tích hợp API phát hiện đạo văn bên thứ ba, thuật toán xếp lịch tự động tối ưu, ứng dụng di động riêng (giao diện web phải dùng được trên điện thoại). Các mục này là hướng mở rộng (xem Phụ lục C).


## 1.3. Định nghĩa, từ viết tắt


| Thuật ngữ | Giải nghĩa |
| --- | --- |
| UTC2 | Trường Đại học Giao thông Vận tải Phân hiệu tại TP. Hồ Chí Minh |
| CS / CN | Đồ án Cơ sở / Đồ án Chuyên ngành (gọi chung là “đồ án”) |
| GVHD | Giảng viên hướng dẫn |
| TBM | Trưởng Bộ môn |
| BCN Khoa | Ban Chủ nhiệm Khoa |
| BGĐ | Ban Giám đốc Phân hiệu |
| Hội đồng | Hội đồng chấm bảo vệ đồ án (Chủ tịch, Thư ký, các Ủy viên; tối thiểu 3 thành viên) |
| Đăng ký | Bản ghi thể hiện một sinh viên thực hiện một đề tài trong một học kỳ (đơn vị trung tâm của hệ thống) |
| Tiêu chí chấm | Hạng mục đánh giá (hình thức, nội dung, trình bày, phản biện…) có thang điểm và trọng số |
| Tỷ lệ trùng lặp | Phần trăm nội dung báo cáo trùng với các báo cáo/đề tài đã lưu trong kho |
| RBAC | Role-Based Access Control – phân quyền theo vai trò |
| FR / NFR / BR / UC | Yêu cầu chức năng / Yêu cầu phi chức năng / Quy tắc nghiệp vụ / Ca sử dụng |
| SRS | Software Requirements Specification |
| BFD, DFD, ERD, RM | Sơ đồ phân cấp chức năng, Biểu đồ luồng dữ liệu, Mô hình thực thể liên kết, Mô hình quan hệ |


## 1.4. Tài liệu tham chiếu

Báo cáo môn học “Phân tích thiết kế theo yêu cầu – Đề tài: Quản lý Đồ án cơ sở, Đồ án chuyên ngành”, UTC2, 20/05/2026 (sinh viên Dư Nguyên An, GVHD ThS. Phạm Thị Miên).

IEEE Std 830-1998 – Recommended Practice for Software Requirements Specifications (cấu trúc tham khảo).

Quy chế đào tạo đại học hiện hành của Trường/Phân hiệu (quy đổi điểm, xếp loại, quy định về đồ án) – cần được cung cấp để chốt các tham số ở mục 5 và Phụ lục C.

Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.


## 1.5. Quy ước trình bày

Mỗi yêu cầu có mã định danh duy nhất: FR-xxx-nn (chức năng), NFR-xxx-nn (phi chức năng), BR-nn (quy tắc nghiệp vụ), UC-nn (ca sử dụng). Mức ưu tiên: Cao (bắt buộc cho bản phát hành đầu), Trung bình (nên có), Thấp (có thể hoãn). Từ “phải” chỉ yêu cầu bắt buộc, “nên” chỉ yêu cầu khuyến nghị. Các nội dung do tài liệu này đề xuất bổ sung (không có trong báo cáo phân tích gốc) được đánh dấu “(đề xuất)” để các bên xác nhận.


# 2. MÔ TẢ TỔNG QUAN


## 2.1. Bối cảnh và vấn đề cần giải quyết

Phân hiệu có hơn 7.000 sinh viên chính quy, 135 giảng viên và nhiều khoa/ngành đều có học phần đồ án. Hiện mỗi khoa vận hành theo cách riêng, chủ yếu bằng giấy tờ, bảng tính, email và nhóm trò chuyện. Khảo sát chỉ ra các bất cập mà hệ thống mới phải giải quyết:


| Bất cập hiện tại | Mục tiêu của hệ thống |
| --- | --- |
| Thiếu thống nhất giữa các khoa về biểu mẫu, thời hạn, cách chấm điểm | Chuẩn hóa quy trình dùng chung, nhưng cho phép mỗi khoa cấu hình theo đặc thù (mốc thời gian, tiêu chí chấm) |
| Dữ liệu phân tán (máy cá nhân, email, hồ sơ giấy), khó tra cứu khóa trước | Cơ sở dữ liệu và kho tài liệu tập trung, có thể tra cứu và truy vết |
| Khó theo dõi tiến độ hằng tuần; nhóm chậm tiến độ phát hiện muộn | Báo cáo tuần trực tuyến, dashboard theo thời gian thực, cảnh báo sớm |
| Khó kiểm soát đạo văn, trùng lặp đề tài | Đối chiếu tự động với kho báo cáo/đề tài đã lưu giữa các khóa, nhóm, khoa |
| Đăng ký, phân công, tổng hợp điểm thủ công, dễ sai sót; thống kê toàn trường thiếu nhất quán | Tự động kiểm tra điều kiện, tính điểm có trọng số, thống kê tự động, một kênh duy nhất cho sinh viên |


## 2.2. Góc nhìn sản phẩm

Hệ thống là ứng dụng web độc lập, truy cập qua trình duyệt, gồm giao diện người dùng (frontend), tầng nghiệp vụ (backend API), cơ sở dữ liệu quan hệ và kho lưu trữ tệp. Công nghệ dự kiến: Next.js cho frontend, NestJS (TypeScript) cho backend và PostgreSQL cho cơ sở dữ liệu. Mô hình dữ liệu 14 bảng trong báo cáo phân tích gốc (thiết kế trên SQL Server) là mô hình quan hệ chuẩn nên được chuyển sang PostgreSQL mà không đổi cấu trúc nghiệp vụ. Hệ thống gửi email thông báo qua dịch vụ SMTP của Trường và trong tương lai có thể kết nối cổng đào tạo (SSO, đồng bộ danh sách sinh viên/giảng viên).


## 2.3. Các nhóm người dùng (tác nhân)

Báo cáo gốc xác định 8 tác nhân. Hệ thống bổ sung 1 vai trò kỹ thuật (Quản trị hệ thống) để vận hành tài khoản và cấu hình. Một người dùng có thể có nhiều vai trò (ví dụ: một giảng viên đồng thời là GVHD, Trưởng bộ môn và thành viên Hội đồng).


| STT | Tác nhân | Vai trò chính | Chức năng chính trong hệ thống |
| --- | --- | --- | --- |
| 1 | Ban Giám đốc Phân hiệu | Lãnh đạo, giám sát toàn trường | Xem báo cáo, thống kê toàn trường (chỉ đọc) |
| 2 | Phòng Đào tạo | Điều phối, quản lý đào tạo | Quản lý danh mục nền (học kỳ, khoa, ngành, học phần), kế hoạch học kỳ, tiếp nhận điểm cuối cùng |
| 3 | Ban Chủ nhiệm Khoa | Phê duyệt, giám sát trong khoa | Quyết định phân công GVHD, thành lập Hội đồng, xử lý đổi đề tài/gia hạn/khiếu nại, giám sát dữ liệu khoa |
| 4 | Trưởng Bộ môn | Thẩm định chuyên môn | Duyệt/từ chối đề tài, rà soát trùng lặp, đề xuất GVHD và thành viên Hội đồng, theo dõi tiến độ bộ môn |
| 5 | Giáo vụ Khoa | Điều phối, tổng hợp, lưu trữ | Tổng hợp đăng ký, chốt danh sách, lập Hội đồng và lịch bảo vệ, thiết lập tiêu chí chấm, tổng hợp – công bố điểm, lưu trữ hồ sơ |
| 6 | Giảng viên hướng dẫn | Hướng dẫn, đánh giá quá trình | Đề xuất đề tài, xác nhận đăng ký, nhận xét tiến độ, xác nhận đủ điều kiện bảo vệ, chấm điểm quá trình |
| 7 | Hội đồng chấm bảo vệ | Đánh giá kết quả cuối cùng | Xem hồ sơ, nhập phiếu điểm theo tiêu chí, ghi biên bản (Thư ký) |
| 8 | Sinh viên | Thực hiện đồ án | Đăng ký đề tài, nộp báo cáo tuần/toàn văn, tra cứu lịch và kết quả, khiếu nại điểm |
| 9 | Quản trị hệ thống (đề xuất) | Vận hành kỹ thuật | Quản lý tài khoản, gán vai trò, cấu hình tham số, sao lưu, xem nhật ký |

Lưu ý về vai trò trong hệ thống: 8 tác nhân trên là vai trò nghiệp vụ. Khi cài đặt, hệ thống gom thành 4 role kỹ thuật: Sinh viên, Giảng viên, Nhân viên quản lý và Quản trị. Các tác nhân còn lại được xác định bằng chức danh gán cho tài khoản, kèm đơn vị áp dụng (khoa/bộ môn/toàn trường) và thời gian hiệu lực:


| Tác nhân nghiệp vụ | Role hệ thống | Cách xác định |
| --- | --- | --- |
| Sinh viên | Sinh viên | Role riêng |
| Giảng viên hướng dẫn | Giảng viên | Quan hệ qua bản ghi đăng ký (ma_gvhd) – không cần role riêng |
| Hội đồng chấm bảo vệ | Giảng viên | Vai trò theo từng buổi bảo vệ (Chủ tịch/Thư ký/Ủy viên) qua thành viên hội đồng |
| Trưởng bộ môn | Giảng viên | Chức danh TBM gắn với một bộ môn |
| Ban Chủ nhiệm Khoa | Giảng viên | Chức danh BCN gắn với một khoa |
| Giáo vụ Khoa | Nhân viên quản lý | Chức danh Giáo vụ gắn với một khoa |
| Phòng Đào tạo | Nhân viên quản lý | Chức danh Phòng Đào tạo, phạm vi toàn trường |
| Ban Giám đốc | Nhân viên quản lý | Chức danh BGĐ, phạm vi toàn trường, chỉ đọc |
| Quản trị hệ thống | Quản trị | Role riêng |


## 2.4. Môi trường vận hành

Truy cập qua trình duyệt hiện đại (Chrome, Edge, Firefox, Safari – hai phiên bản chính gần nhất) trên máy tính, máy tính bảng và điện thoại.

Máy chủ ứng dụng và cơ sở dữ liệu đặt tại hạ tầng của Trường hoặc đám mây trong nước; CSDL PostgreSQL.

Người dùng truy cập qua mạng nội bộ và Internet (sinh viên có thể dùng ngoài khuôn viên trường).


## 2.5. Ràng buộc thiết kế và triển khai

Công nghệ: frontend Next.js, backend NestJS (TypeScript), cơ sở dữ liệu PostgreSQL; triển khai bằng container (Docker). Đây là lựa chọn của nhóm phát triển và có thể thay đổi ở giai đoạn thiết kế kiến trúc nếu nhà trường có yêu cầu khác.

Cơ sở dữ liệu thiết kế theo mô hình quan hệ đã chuẩn hóa tới 3NF (xem mục 7).

Hệ thống phải tuân thủ quy chế đào tạo và quy định đồ án của Trường; các tham số có thể thay đổi theo năm học (ngưỡng đạo văn, thang quy đổi, trọng số) phải cấu hình được, không được cố định trong mã nguồn.

Giao diện hoàn toàn bằng tiếng Việt, mã hóa Unicode (UTF-8).

Dữ liệu cá nhân của sinh viên, giảng viên phải được bảo vệ theo quy định pháp luật hiện hành.


## 2.6. Giả định và phụ thuộc

Phòng Đào tạo cung cấp danh sách sinh viên, giảng viên, lớp, ngành, khoa ở dạng tệp (Excel/CSV) để nhập ban đầu mỗi học kỳ.

Mỗi người dùng có địa chỉ email hợp lệ để nhận thông báo và khôi phục mật khẩu.

Có sẵn kho báo cáo/đề tài các khóa trước (nếu có) để nạp vào kho đối chiếu trùng lặp; nếu chưa có, kho được xây dần từ khi hệ thống đi vào hoạt động.

Quy chế quy đổi điểm – xếp loại và công thức điểm tổng kết do Phòng Đào tạo cung cấp (xem câu hỏi mở ở Phụ lục C).


# 3. MÔ TẢ NGHIỆP VỤ


## 3.1. Quy trình tổng thể qua 7 giai đoạn

Vòng đời của một đồ án gồm 7 giai đoạn nối tiếp. Bảng dưới đây tóm tắt đầu vào – đầu ra của từng giai đoạn và là cơ sở để suy ra các yêu cầu chức năng ở mục 4.


| GĐ | Tên giai đoạn | Diễn biến chính | Kết quả đầu ra |
| --- | --- | --- | --- |
| 1 | Đề xuất và xét duyệt đề tài | GV đề xuất đề tài (tên, mô tả, yêu cầu, ngành phù hợp, số SV tối đa) → “Mới tạo”; gửi → “Chờ duyệt”; TBM xem xét tính khoa học, khả thi, trùng lặp → “Đã duyệt” hoặc “Từ chối” kèm lý do | Danh sách đề tài đã duyệt |
| 2 | Tra cứu, đăng ký, chốt danh sách | SV tra cứu đề tài đã duyệt, gửi đăng ký; hệ thống kiểm tra chỉ tiêu, chuyên ngành, trùng đăng ký; GV xác nhận; hết hạn đăng ký Giáo vụ chốt và công bố; BCN ra quyết định phân công GVHD | Danh sách đăng ký chính thức |
| 3 | Theo dõi tiến độ theo tuần | SV nộp báo cáo tuần (đã làm, kết quả, kế hoạch tuần sau); GVHD đánh giá và nhận xét; TBM/Giáo vụ theo dõi số liệu tổng hợp | Lịch sử tiến độ, cảnh báo nhóm chậm |
| 4 | Nộp báo cáo toàn văn, kiểm tra đạo văn | SV nộp báo cáo + sản phẩm; hệ thống tính tỷ lệ trùng lặp; GVHD xác nhận đủ điều kiện bảo vệ hay không | Danh sách SV đủ điều kiện bảo vệ |
| 5 | Thành lập Hội đồng, xếp lịch | Giáo vụ lập Hội đồng theo bộ môn; phân công Chủ tịch, Thư ký, Ủy viên (TBM đề xuất); xếp lịch (thời gian, phòng, thứ tự); thông báo | Hội đồng và lịch bảo vệ |
| 6 | Chấm điểm độc lập theo tiêu chí | Mỗi thành viên Hội đồng chấm độc lập từng SV theo bộ tiêu chí (thang điểm, trọng số), ghi vào phiếu điểm chi tiết | Phiếu điểm chi tiết |
| 7 | Tổng kết, xếp loại, công bố | Hệ thống tính điểm trung bình có trọng số, lấy trung bình các thành viên, quy đổi xếp loại; Giáo vụ kiểm tra, công bố, lập thống kê; điểm chuyển Phòng Đào tạo | Kết quả học phần, báo cáo thống kê |


## 3.2. Vòng đời trạng thái

Các đối tượng chính có vòng đời trạng thái sau; hệ thống phải kiểm soát chuyển trạng thái hợp lệ và ghi nhật ký mỗi lần chuyển (ai, lúc nào, lý do).


| Đối tượng | Các trạng thái và chuyển đổi |
| --- | --- |
| Đề tài | Mới tạo → Chờ duyệt → Đã duyệt | Từ chối. Đề tài “Từ chối” được GV chỉnh sửa và gửi lại (→ Chờ duyệt). (đề xuất bổ sung: Đã đóng khi hết chỉ tiêu hoặc kết thúc học kỳ) |
| Đăng ký | Chờ xác nhận → GV xác nhận | GV từ chối | SV hủy → Đã chốt (sau khi Giáo vụ chốt danh sách) (đề xuất: tên trạng thái cụ thể do nhóm phát triển chuẩn hóa) |
| Tiến độ tuần | Đã nộp → Đã nhận xét |
| Hồ sơ bảo vệ | Chưa nộp báo cáo → Đã nộp → Đã kiểm tra trùng lặp → Đủ điều kiện | Không đủ điều kiện → Đã xếp lịch → Đã chấm → Đã công bố |
| Hội đồng | Mới lập → Đã phân công → Đã xếp lịch → Đã hoàn thành |


## 3.3. Luồng trao đổi thông tin giữa các bên


| Từ | Đến | Thông tin trao đổi |
| --- | --- | --- |
| Giảng viên | Trưởng bộ môn | Đề tài đề xuất chờ duyệt |
| Trưởng bộ môn | Giảng viên | Kết quả duyệt, lý do từ chối |
| Sinh viên | Hệ thống / Giảng viên | Yêu cầu đăng ký, báo cáo tuần, báo cáo toàn văn |
| Giảng viên | Sinh viên | Xác nhận đăng ký, nhận xét tiến độ |
| Giáo vụ khoa | Sinh viên, Giảng viên, Hội đồng | Danh sách chính thức, quyết định thành lập Hội đồng, lịch bảo vệ |
| Hội đồng chấm thi | Giáo vụ khoa | Phiếu điểm chi tiết theo tiêu chí |
| Giáo vụ khoa | Sinh viên | Kết quả học phần |
| Giáo vụ khoa | Phòng Đào tạo | Bảng điểm cuối cùng (cập nhật vào bảng điểm) |


# 4. YÊU CẦU CHỨC NĂNG

Các yêu cầu được nhóm theo module. Cột “Tác nhân” là bên thực hiện hoặc được hưởng chức năng; “Hệ thống” nghĩa là xử lý tự động.


## 4.1. Module Xác thực và phân quyền (AUT)


| Mã YC | Mô tả yêu cầu | Tác nhân | Ưu tiên |
| --- | --- | --- | --- |
| FR-AUT-01 | Cho phép đăng nhập bằng tài khoản (mã sinh viên/mã giảng viên hoặc email) và mật khẩu. Thông báo lỗi không tiết lộ tài khoản có tồn tại hay không. | Mọi người dùng | Cao |
| FR-AUT-02 | Đăng xuất; tự động hết phiên sau một khoảng thời gian không hoạt động (cấu hình, mặc định 30 phút). | Mọi người dùng | Cao |
| FR-AUT-03 | Đổi mật khẩu; khôi phục mật khẩu qua liên kết gửi email, có thời hạn hiệu lực. Bắt buộc đổi mật khẩu ở lần đăng nhập đầu. | Mọi người dùng | Cao |
| FR-AUT-04 | Phân quyền theo vai trò (RBAC) theo ma trận ở mục 6. Mỗi chức năng và dữ liệu chỉ hiển thị/cho thao tác với vai trò được phép; kiểm tra quyền ở cả giao diện và phía máy chủ. | Hệ thống | Cao |
| FR-AUT-05 | Hỗ trợ một người dùng có nhiều chức danh (ví dụ giảng viên vừa là GVHD, Trưởng bộ môn, thành viên Hội đồng) trên một tài khoản. Chức danh được gán kèm đơn vị áp dụng (khoa/bộ môn/toàn trường) và thời gian hiệu lực; có thể chuyển đổi ngữ cảnh làm việc trên giao diện. Quyền được kiểm tra theo role hệ thống trước, sau đó theo chức danh và phạm vi đơn vị. | Giảng viên, Nhân viên quản lý | Cao |
| FR-AUT-06 | Quản lý tài khoản: tạo, khóa/mở khóa, đặt lại mật khẩu, gán/thu hồi vai trò; nhập hàng loạt từ tệp Excel/CSV. | Quản trị HT, Phòng Đào tạo | Cao |
| FR-AUT-07 | Xem và cập nhật hồ sơ cá nhân (email, số điện thoại); không cho sửa các thông tin do Phòng Đào tạo quản lý. | Mọi người dùng | Trung bình |
| FR-AUT-08 | Khóa tạm tài khoản khi nhập sai mật khẩu nhiều lần liên tiếp (cấu hình, mặc định 5 lần). | Hệ thống | Trung bình |
| FR-AUT-09 | Ghi nhật ký hoạt động (đăng nhập, thao tác thêm/sửa/xóa, chuyển trạng thái, xem điểm, mở khóa phiếu điểm) gồm người thực hiện, thời gian, đối tượng, giá trị cũ/mới; cho phép tra cứu theo bộ lọc. | Hệ thống, Quản trị HT | Cao |
| FR-AUT-10 | Tích hợp đăng nhập một lần (SSO) với cổng đào tạo của Trường. | Mọi người dùng | Thấp |


## 4.2. Module Quản lý danh mục và cấu hình (DM)

Dữ liệu nền do Phòng Đào tạo quản lý toàn trường; từng Khoa cấu hình các tham số riêng trong phạm vi được phép.


| Mã YC | Mô tả yêu cầu | Tác nhân | Ưu tiên |
| --- | --- | --- | --- |
| FR-DM-01 | Quản lý danh mục Khoa, Ngành, Bộ môn (thêm, sửa, ngừng sử dụng); mỗi bộ môn có thể gán một Trưởng bộ môn. | Phòng Đào tạo | Cao |
| FR-DM-02 | Quản lý danh mục Lớp (thuộc một ngành, có giảng viên chủ nhiệm, sĩ số), Giảng viên (mã, tên, email, SĐT, học vị, bộ môn), Sinh viên (mã, tên, ngày sinh, giới tính, email, SĐT, lớp, GPA tích lũy, trạng thái học tập). | Phòng Đào tạo | Cao |
| FR-DM-03 | Nhập dữ liệu hàng loạt từ Excel/CSV cho Sinh viên, Giảng viên, Lớp; có bước xem trước, báo lỗi theo từng dòng và không ghi dữ liệu nếu người dùng chưa xác nhận. | Phòng Đào tạo | Cao |
| FR-DM-04 | Quản lý Học kỳ: tên, năm học, học kỳ thứ, ngày bắt đầu/kết thúc và các mốc: hạn đăng ký, hạn nộp báo cáo, hạn bảo vệ; khoảng thời gian thực hiện đồ án (cho phép nộp báo cáo tuần). | Phòng Đào tạo, BCN Khoa | Cao |
| FR-DM-05 | Quản lý loại học phần đồ án (Đồ án cơ sở, Đồ án chuyên ngành, tên gọi khác theo khoa) và cấu hình áp dụng cho ngành/khoa. | Phòng Đào tạo | Cao |
| FR-DM-06 | Thiết lập chỉ tiêu hướng dẫn tối đa của từng giảng viên trong từng học kỳ. | Giáo vụ Khoa, BCN Khoa | Cao |
| FR-DM-07 | Cấu hình tham số hệ thống: ngưỡng tỷ lệ trùng lặp cho phép, ngưỡng cảnh báo chậm tiến độ, thang quy đổi điểm – xếp loại, quy tắc làm tròn, dung lượng và định dạng tệp cho phép, thời gian hết phiên. | Phòng Đào tạo, Quản trị HT | Cao |
| FR-DM-08 | Cấu hình theo khoa: mốc thời gian riêng, biểu mẫu/tiêu chí chấm riêng nhưng phải nằm trong khung chung do Phòng Đào tạo ban hành. | BCN Khoa, Giáo vụ | Trung bình |
| FR-DM-09 | Chuyển học kỳ: đóng học kỳ cũ (khóa mọi thao tác ghi, chuyển sang kho lưu trữ), mở học kỳ mới. | Phòng Đào tạo | Trung bình |


## 4.3. Module Quản lý đề tài (DT) – Phân hệ 1.0


| Mã YC | Mô tả yêu cầu | Tác nhân | Ưu tiên |
| --- | --- | --- | --- |
| FR-DT-01 | Tạo đề tài mới gồm: tên đề tài, mô tả, yêu cầu, loại đồ án (CS/CN), bộ môn, ngành/chuyên ngành phù hợp, số sinh viên tối đa, học kỳ. Đề tài mới có trạng thái “Mới tạo”. | Giảng viên | Cao |
| FR-DT-02 | Sửa, xóa đề tài khi chưa được duyệt; đề tài đã duyệt không được xóa, chỉ được điều chỉnh qua quy trình của BCN Khoa (FR-DK-10). | Giảng viên | Cao |
| FR-DT-03 | Gửi đề tài chờ duyệt: trạng thái chuyển “Chờ duyệt” và TBM nhận thông báo. | Giảng viên | Cao |
| FR-DT-04 | TBM xem danh sách đề tài chờ duyệt của bộ môn, lọc theo giảng viên/học kỳ/ngành, xem chi tiết. | Trưởng bộ môn | Cao |
| FR-DT-05 | Hỗ trợ rà soát trùng lặp: khi mở một đề tài chờ duyệt, hệ thống liệt kê các đề tài tương tự (so khớp tên/mô tả với đề tài của các học kỳ trước và các khoa) kèm mức độ giống nhau. | Hệ thống, TBM | Trung bình |
| FR-DT-06 | Duyệt hoặc từ chối đề tài; từ chối bắt buộc nhập lý do. Hệ thống ghi nhận người duyệt, ngày duyệt và chuyển trạng thái “Đã duyệt”/“Từ chối”. Có thao tác duyệt/từ chối hàng loạt. | Trưởng bộ môn | Cao |
| FR-DT-07 | Giảng viên nhận thông báo kết quả; đề tài bị từ chối có thể chỉnh sửa và gửi duyệt lại; lưu lịch sử các lần duyệt. | Giảng viên | Cao |
| FR-DT-08 | Tra cứu đề tài theo bộ môn, giảng viên, học kỳ, ngành, loại đồ án, trạng thái và từ khóa; phân trang, sắp xếp. Phạm vi xem phụ thuộc vai trò (sinh viên chỉ thấy đề tài đã duyệt). | Mọi người dùng | Cao |
| FR-DT-09 | Xuất danh sách đề tài (Excel/PDF) theo bộ lọc. | TBM, Giáo vụ, BCN | Trung bình |
| FR-DT-10 | Sinh viên đề xuất đề tài riêng và nhờ giảng viên nhận hướng dẫn (đề xuất – báo cáo gốc có nhắc quyền này của sinh viên nhưng chưa mô hình hóa luồng). | Sinh viên, Giảng viên | Thấp |


## 4.4. Module Đăng ký đề tài (DK) – Phân hệ 2.0


| Mã YC | Mô tả yêu cầu | Tác nhân | Ưu tiên |
| --- | --- | --- | --- |
| FR-DK-01 | Sinh viên xem danh sách đề tài Đã duyệt của học kỳ hiện tại thuộc ngành phù hợp; xem còn bao nhiêu chỉ tiêu. | Sinh viên | Cao |
| FR-DK-02 | Sinh viên gửi đăng ký một đề tài trong thời hạn đăng ký của học kỳ. | Sinh viên | Cao |
| FR-DK-03 | Kiểm tra điều kiện đăng ký tự động trước khi ghi nhận: (a) đề tài còn chỉ tiêu và GVHD còn chỉ tiêu trong học kỳ; (b) chuyên ngành của sinh viên phù hợp; (c) sinh viên chưa đăng ký đề tài khác cho cùng học phần đồ án trong học kỳ; (d) đang trong thời hạn đăng ký. Nếu không hợp lệ phải nêu rõ lý do. | Hệ thống | Cao |
| FR-DK-04 | Xử lý đồng thời: khi nhiều sinh viên cùng đăng ký một đề tài ở thời điểm sát nhau, hệ thống không được vượt chỉ tiêu (dùng giao dịch/khóa ở tầng cơ sở dữ liệu). | Hệ thống | Cao |
| FR-DK-05 | Sinh viên xem trạng thái đăng ký của mình; hủy đăng ký khi chưa được chốt danh sách (giải phóng chỉ tiêu). | Sinh viên | Cao |
| FR-DK-06 | Giảng viên xem danh sách sinh viên đăng ký đề tài của mình; xác nhận hoặc từ chối (kèm lý do) đăng ký hợp lệ. | Giảng viên | Cao |
| FR-DK-07 | Giáo vụ theo dõi tổng hợp đăng ký toàn khoa: số đề tài còn chỗ, danh sách sinh viên chưa đăng ký, xuất danh sách. | Giáo vụ Khoa | Cao |
| FR-DK-08 | Giáo vụ cân đối/phân công thủ công cho sinh viên chưa có đề tài hoặc đăng ký bị từ chối, trình BCN Khoa phê duyệt. | Giáo vụ, BCN Khoa | Trung bình |
| FR-DK-09 | Chốt danh sách khi hết hạn đăng ký: Giáo vụ chốt và công bố danh sách chính thức; sau khi chốt khóa đăng ký/hủy. BCN Khoa ra quyết định phân công GVHD (xuất biểu mẫu quyết định PDF/Word). | Giáo vụ, BCN Khoa | Cao |
| FR-DK-10 | Đổi đề tài, đổi GVHD, gia hạn sau khi chốt: sinh viên/giảng viên gửi đề nghị kèm lý do, BCN Khoa phê duyệt; lưu lịch sử thay đổi và thông báo các bên. | BCN Khoa | Trung bình |


## 4.5. Module Theo dõi tiến độ (TD) – Phân hệ 3.0


| Mã YC | Mô tả yêu cầu | Tác nhân | Ưu tiên |
| --- | --- | --- | --- |
| FR-TD-01 | Sinh viên nộp báo cáo tiến độ mỗi tuần gồm: công việc đã làm, kết quả đạt được, kế hoạch tuần kế tiếp, có thể đính kèm tệp. Chỉ nộp được trong thời gian thực hiện của học kỳ và cho đăng ký đã chốt. | Sinh viên | Cao |
| FR-TD-02 | Cho phép sửa báo cáo tuần cho đến khi giảng viên nhận xét; mỗi tuần chỉ một báo cáo cho một đăng ký. | Sinh viên | Trung bình |
| FR-TD-03 | GVHD xem báo cáo tuần của từng sinh viên hướng dẫn, đánh giá mức độ hoàn thành và ghi nhận xét; lưu mã giảng viên và ngày nhận xét. | Giảng viên | Cao |
| FR-TD-04 | Sinh viên xem nhận xét của giảng viên và toàn bộ lịch sử các tuần. | Sinh viên | Cao |
| FR-TD-05 | Nhắc nhở tự động (thông báo/email): sinh viên chưa nộp báo cáo tuần khi gần/đến hạn; giảng viên còn báo cáo chưa nhận xét quá số ngày quy định. | Hệ thống | Trung bình |
| FR-TD-06 | Bảng theo dõi tiến độ tổng hợp theo bộ môn/khoa: số tuần đã nộp, số báo cáo chưa nhận xét, mức hoàn thành; tự động đánh dấu nhóm chậm tiến độ khi vượt ngưỡng (ví dụ bỏ nộp từ 2 tuần liên tiếp – cấu hình). | TBM, Giáo vụ, BCN | Cao |
| FR-TD-07 | Xuất báo cáo tiến độ (Excel/PDF) theo bộ lọc. | TBM, Giáo vụ | Trung bình |
| FR-TD-08 | Đặt lịch hẹn gặp giữa sinh viên và GVHD (đề xuất; báo cáo gốc nhắc “gặp giảng viên theo lịch”). | Sinh viên, Giảng viên | Thấp |


## 4.6. Module Báo cáo toàn văn và kiểm tra trùng lặp (BC) – Giai đoạn 4


| Mã YC | Mô tả yêu cầu | Tác nhân | Ưu tiên |
| --- | --- | --- | --- |
| FR-BC-01 | Sinh viên nộp báo cáo toàn văn (PDF/DOCX) và sản phẩm (tệp nén hoặc đường dẫn kho mã nguồn), tùy chọn slide bảo vệ; kiểm tra định dạng, dung lượng; chỉ nộp trong hạn. | Sinh viên | Cao |
| FR-BC-02 | Cho phép nộp lại đến hết hạn; lưu các phiên bản, phiên bản mới nhất là bản chính thức. | Sinh viên | Trung bình |
| FR-BC-03 | Sau khi nộp, hệ thống trích văn bản và đối chiếu với kho báo cáo đã lưu (các khóa trước, các nhóm cùng kỳ, các khoa) để tính tỷ lệ trùng lặp; lưu tỷ lệ trên đăng ký. | Hệ thống | Cao |
| FR-BC-04 | Hiển thị cho GVHD kết quả: tỷ lệ trùng lặp tổng, các báo cáo nguồn trùng, đoạn văn bản trùng. | Giảng viên | Cao |
| FR-BC-05 | GVHD xác nhận “đủ điều kiện bảo vệ” hoặc “không đủ điều kiện” kèm lý do (vi phạm liêm chính học thuật, chưa đạt yêu cầu). Sinh viên chỉ vào danh sách đủ điều kiện khi tỷ lệ trùng lặp không vượt ngưỡng và có xác nhận của GVHD. | Giảng viên, Hệ thống | Cao |
| FR-BC-06 | Gửi danh sách sinh viên đủ điều kiện bảo vệ cho Giáo vụ; thông báo cho sinh viên không đủ điều kiện kèm lý do. | Hệ thống | Cao |
| FR-BC-07 | Sau khi hoàn tất học kỳ, báo cáo được đưa vào kho đối chiếu và kho lưu trữ; chỉ người có quyền mới tải được tệp. | Hệ thống | Cao |
| FR-BC-08 | Cho phép tích hợp API/dịch vụ kiểm tra đạo văn bên ngoài thông qua giao diện nối ghép (adapter) có thể thay thế. | Hệ thống | Thấp |


## 4.7. Module Quản lý Hội đồng và lịch bảo vệ (HD) – Phân hệ 4.0


| Mã YC | Mô tả yêu cầu | Tác nhân | Ưu tiên |
| --- | --- | --- | --- |
| FR-HD-01 | Tạo Hội đồng theo bộ môn: ngày, giờ bắt đầu/kết thúc, địa điểm, số sinh viên tối đa/buổi. | Giáo vụ Khoa | Cao |
| FR-HD-02 | TBM đề xuất danh sách thành viên; BCN Khoa/Giáo vụ phân công Chủ tịch, Thư ký, các Ủy viên. Hội đồng phải có tối thiểu 3 thành viên; mỗi thành viên có một vai trò. | TBM, BCN, Giáo vụ | Cao |
| FR-HD-03 | Phân sinh viên đủ điều kiện vào Hội đồng và xếp lịch chi tiết (thời gian, phòng, thứ tự trình bày). | Giáo vụ Khoa | Cao |
| FR-HD-04 | Kiểm tra xung đột khi xếp lịch: một thành viên không được ở hai buổi bảo vệ trùng thời gian; một phòng không bị dùng chồng giờ; không vượt số sinh viên tối đa. | Hệ thống | Cao |
| FR-HD-05 | Thông báo lịch bảo vệ cho sinh viên, GVHD và các thành viên; khi điều chỉnh lịch phải thông báo lại, lưu lịch sử thay đổi. | Hệ thống, Giáo vụ | Cao |
| FR-HD-06 | Thành viên Hội đồng xác nhận (hoặc từ chối kèm lý do) tham dự; Giáo vụ thấy trạng thái xác nhận để xử lý thay thế. | Giảng viên (thành viên) | Trung bình |
| FR-HD-07 | Xuất quyết định thành lập Hội đồng, lịch bảo vệ, danh sách sinh viên theo Hội đồng (PDF/Word/Excel). | Giáo vụ | Trung bình |
| FR-HD-08 | Thư ký ghi và lưu biên bản buổi bảo vệ (nhận xét, câu hỏi, kiến nghị chỉnh sửa/xử lý); đính kèm vào hồ sơ. | Thư ký Hội đồng | Trung bình |
| FR-HD-09 | Gợi ý xếp lịch tự động và đề xuất thành viên Hội đồng theo chuyên môn, tải công việc. | Hệ thống | Thấp |


## 4.8. Module Chấm điểm, tổng kết và công bố (CD) – Giai đoạn 6, 7


| Mã YC | Mô tả yêu cầu | Tác nhân | Ưu tiên |
| --- | --- | --- | --- |
| FR-CD-01 | Thiết lập bộ tiêu chí chấm theo loại đồ án (CS/CN): tên/mô tả tiêu chí, thang điểm, trọng số; tổng trọng số mỗi bộ tiêu chí phải bằng 100% mới được kích hoạt. Tiêu chí được khóa khi đã có phiếu điểm. | Giáo vụ Khoa | Cao |
| FR-CD-02 | Thành viên Hội đồng xem danh sách sinh viên của buổi bảo vệ, hồ sơ (báo cáo, sản phẩm, nhận xét GVHD, tỷ lệ trùng lặp) và tiêu chí chấm. | Hội đồng | Cao |
| FR-CD-03 | Thành viên chấm độc lập từng sinh viên theo từng tiêu chí, kèm ghi chú; mỗi thành viên chỉ có một phiếu cho một sinh viên. Không được xem điểm của thành viên khác cho tới khi nộp phiếu/khóa chấm. | Hội đồng | Cao |
| FR-CD-04 | Kiểm tra dữ liệu nhập: điểm trong thang, đủ mọi tiêu chí mới được nộp phiếu; sau khi nộp phiếu bị khóa. Mở khóa chỉ do BCN Khoa/Giáo vụ thực hiện, bắt buộc ghi lý do và lưu nhật ký. | Hệ thống | Cao |
| FR-CD-05 | GVHD nhập điểm quá trình (điểm GVHD) cho từng sinh viên. | Giảng viên | Cao |
| FR-CD-06 | Tự động tính: điểm mỗi thành viên = Σ (điểm tiêu chí × trọng số); điểm Hội đồng = trung bình các thành viên; điểm tổng kết theo công thức cấu hình (kết hợp điểm GVHD và điểm Hội đồng); quy đổi điểm chữ/xếp loại theo quy chế; làm tròn theo cấu hình. | Hệ thống | Cao |
| FR-CD-07 | Cảnh báo chênh lệch điểm lớn giữa các thành viên (ngưỡng cấu hình) để Hội đồng/Giáo vụ xem xét. | Hệ thống | Trung bình |
| FR-CD-08 | Giáo vụ kiểm tra bảng điểm, công bố kết quả học phần; sau công bố sinh viên tra cứu điểm tổng kết và điểm chi tiết theo tiêu chí. Điểm cuối cùng chuyển cho Phòng Đào tạo (xuất tệp/đồng bộ). | Giáo vụ, Phòng Đào tạo | Cao |
| FR-CD-09 | Sinh viên gửi khiếu nại điểm trong thời hạn quy định; BCN Khoa tiếp nhận, xử lý, ghi kết quả; điểm điều chỉnh (nếu có) lưu kèm lịch sử. | Sinh viên, BCN Khoa | Trung bình |
| FR-CD-10 | Xử lý sinh viên không đạt/phải bảo vệ lại: ghi nhận “lần bảo vệ”, cho phép xếp lịch lại và chấm lại mà vẫn lưu kết quả các lần trước. | Giáo vụ | Trung bình |


## 4.9. Module Báo cáo thống kê (TK) – Giai đoạn 7


| Mã YC | Mô tả yêu cầu | Tác nhân | Ưu tiên |
| --- | --- | --- | --- |
| FR-TK-01 | Dashboard thời gian thực theo vai trò: BGĐ/Phòng Đào tạo (toàn trường), BCN/Giáo vụ (khoa), TBM (bộ môn), GV (sinh viên hướng dẫn). | BGĐ, PĐT, BCN, TBM, GV | Cao |
| FR-TK-02 | Thống kê: số đề tài theo trạng thái; tỷ lệ sinh viên đã đăng ký; tiến độ và số nhóm chậm; tỷ lệ trùng lặp; số sinh viên đủ điều kiện bảo vệ; phổ điểm, tỷ lệ đạt, phân bố xếp loại; khối lượng hướng dẫn của giảng viên; so sánh giữa các khoa/học kỳ. | Hệ thống | Cao |
| FR-TK-03 | Lọc theo học kỳ, năm học, khoa, ngành, bộ môn, loại đồ án; xuất Excel/PDF; biểu đồ trực quan. | Các vai trò quản lý | Cao |
| FR-TK-04 | Tra cứu kho lưu trữ: đề tài, báo cáo, điểm của các khóa trước theo quyền truy cập. | Giáo vụ, TBM, BCN | Trung bình |


## 4.10. Module Thông báo (TB)


| Mã YC | Mô tả yêu cầu | Tác nhân | Ưu tiên |
| --- | --- | --- | --- |
| FR-TB-01 | Thông báo trong hệ thống (chuông thông báo, đánh dấu đã đọc) và gửi email cho các sự kiện: đề tài được duyệt/từ chối, đăng ký được xác nhận/từ chối, chốt danh sách, nhắc nộp báo cáo, nhận xét tiến độ, kết quả kiểm tra trùng lặp, lịch bảo vệ/điều chỉnh, công bố điểm. | Hệ thống | Cao |
| FR-TB-02 | Giáo vụ/BCN đăng thông báo chung (kế hoạch, hạn chót) đến nhóm đối tượng được chọn (cả khoa, một ngành, một bộ môn…). | Giáo vụ, BCN, PĐT | Trung bình |
| FR-TB-03 | Người dùng cấu hình loại thông báo nhận qua email. | Mọi người dùng | Thấp |


# 5. QUY TẮC NGHIỆP VỤ

Các quy tắc dưới đây được rút từ phần “Quy định và điều kiện ràng buộc” của báo cáo phân tích và được bổ sung để làm rõ. Hệ thống phải cưỡng chế các quy tắc này ở tầng nghiệp vụ (không chỉ ở giao diện).


| Mã | Quy tắc nghiệp vụ | Nguồn |
| --- | --- | --- |
| BR-01 | Chỉ đề tài ở trạng thái “Đã duyệt” mới được công bố cho sinh viên đăng ký. | Báo cáo gốc |
| BR-02 | Giảng viên chỉ được sửa hoặc xóa đề tài khi chưa được duyệt. Từ chối đề tài phải có lý do. | Báo cáo gốc |
| BR-03 | Số đăng ký không được vượt số sinh viên tối đa của đề tài và chỉ tiêu hướng dẫn của giảng viên trong học kỳ. | Báo cáo gốc |
| BR-04 | Mỗi sinh viên chỉ được đăng ký một đề tài cho một học phần đồ án trong một học kỳ, và chuyên ngành của sinh viên phải phù hợp với đề tài. | Báo cáo gốc |
| BR-05 | Báo cáo tuần chỉ được nộp trong thời gian thực hiện của học kỳ tương ứng; mỗi tuần một báo cáo cho một đăng ký. | Báo cáo gốc |
| BR-06 | Chỉ sinh viên có tỷ lệ trùng lặp không vượt ngưỡng quy định và được GVHD xác nhận mới được xếp lịch bảo vệ. | Báo cáo gốc |
| BR-07 | Hội đồng có tối thiểu 3 thành viên; một thành viên không được xếp hai buổi bảo vệ trùng thời gian. | Báo cáo gốc |
| BR-08 | Tổng trọng số các tiêu chí chấm của một loại đồ án bằng 100%; mỗi thành viên chỉ chấm một phiếu cho một sinh viên. | Báo cáo gốc |
| BR-09 | Điểm thành viên = Σ(điểm tiêu chí × trọng số); điểm Hội đồng = trung bình điểm các thành viên; xếp loại theo quy chế đào tạo. | Báo cáo gốc |
| BR-10 | Sau khi Giáo vụ chốt danh sách, sinh viên không tự hủy/đổi đề tài; mọi thay đổi phải qua BCN Khoa phê duyệt và được lưu lịch sử. | Đề xuất (từ quyền hạn BCN Khoa) |
| BR-11 | Thành viên Hội đồng chấm độc lập, không xem điểm của nhau trước khi khóa phiếu; phiếu đã nộp bị khóa, chỉ mở khóa bằng quyết định có ghi lý do. | Đề xuất |
| BR-12 | GVHD của sinh viên không đóng vai Chủ tịch Hội đồng của buổi bảo vệ sinh viên đó (cần Phòng Đào tạo xác nhận có áp dụng hay không). | Đề xuất – chờ xác nhận |
| BR-13 | Sau khi kết quả được công bố, dữ liệu học kỳ chuyển sang chế độ chỉ đọc; chỉ sửa được thông qua quy trình khiếu nại/điều chỉnh có nhật ký. | Đề xuất |
| BR-14 | Tài liệu và điểm chỉ hiển thị cho đúng người có quyền: sinh viên chỉ thấy dữ liệu của mình; giảng viên chỉ thấy sinh viên mình hướng dẫn hoặc buổi bảo vệ mình tham gia. | Đề xuất |


# 6. MA TRẬN PHÂN QUYỀN

Ký hiệu: T = tạo, S = sửa/xóa, X = xem, D = duyệt/phê duyệt/xác nhận, N = nhập/nộp, Q = quản trị/cấu hình, – = không có quyền. Phạm vi “của mình” hoặc “trong đơn vị” được cưỡng chế ở phía máy chủ.


| Chức năng | SV | GVHD | TBM | Giáo vụ | BCN | Hội đồng | PĐT | BGĐ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Quản lý danh mục nền | – | – | – | X | X | – | Q | X |
| Đề xuất/sửa đề tài | – | T,S (của mình) | X | X | X | – | X | – |
| Duyệt/từ chối đề tài | – | – | D (bộ môn) | – | X | – | – | – |
| Tra cứu đề tài | X (đã duyệt) | X | X | X | X | X | X | X |
| Đăng ký/hủy đề tài | N | – | – | X | X | – | – | – |
| Xác nhận đăng ký | – | D (của mình) | X | X | X | – | – | – |
| Chốt danh sách/công bố | X | X | X | D | X | – | – | – |
| Quyết định phân công GVHD | X | X | X | T | D | – | – | – |
| Nộp báo cáo tuần | N | X | X | X | X | – | – | – |
| Nhận xét tiến độ | X (của mình) | N | X | X | X | – | – | – |
| Nộp báo cáo toàn văn | N | X | X | X | X | X | – | – |
| Xem kết quả trùng lặp | X (của mình) | X | X | X | X | X | – | – |
| Xác nhận đủ điều kiện bảo vệ | – | D | X | X | X | – | – | – |
| Lập Hội đồng/xếp lịch | X (lịch của mình) | X | Đề xuất | T,S | D | X (lịch mình) | – | – |
| Thiết lập tiêu chí chấm | – | – | X | Q | D | – | X | – |
| Nhập phiếu điểm | – | N (điểm quá trình) | – | – | – | N (độc lập) | – | – |
| Mở khóa phiếu điểm | – | – | – | T (đề nghị) | D | – | – | – |
| Công bố kết quả | X (của mình) | X | X | D | X | – | X | X |
| Khiếu nại điểm | N | X | – | X | D | – | – | – |
| Thống kê, dashboard | – | X (của mình) | X (bộ môn) | X (khoa) | X (khoa) | – | X (toàn trường) | X (toàn trường) |
| Quản lý tài khoản, cấu hình, nhật ký | – | – | – | – | – | – | Q (một phần) | – |

Ma trận viết theo 8 tác nhân nghiệp vụ; khi cài đặt ánh xạ sang 4 role + chức danh như mục 2.3. Quản trị hệ thống (vai trò kỹ thuật) có toàn quyền quản lý tài khoản, cấu hình và nhật ký nhưng không có quyền nhập/sửa nội dung nghiệp vụ (điểm, duyệt đề tài).


# 7. YÊU CẦU VỀ DỮ LIỆU


## 7.1. Mô hình dữ liệu logic

Cơ sở dữ liệu quan hệ gồm 14 bảng đã chuẩn hóa tới 3NF theo báo cáo phân tích. Bảng sau tóm tắt các bảng, khóa chính và các khóa ngoại chính.


| Bảng | Khóa chính | Thuộc tính chính | Khóa ngoại |
| --- | --- | --- | --- |
| khoa | ma_khoa | ten_khoa | – |
| nganh | ma_nganh | ten_nganh | ma_khoa |
| bo_mon | ma_bo_mon | ten_bo_mon | ma_khoa, ma_truong_bo_mon → giang_vien |
| giang_vien | ma_giang_vien | ten, email, sdt, hoc_vi | ma_bo_mon |
| lop | ma_lop | ten_lop, si_so | ma_nganh, giang_vien_chu_nhiem |
| sinh_vien | ma_sinh_vien | ten, ngay_sinh, gioi_tinh, email, sdt, gpa, trang_thai | ma_lop |
| hoc_ky | ma_hoc_ky | ten, nam_hoc, hoc_ky_thu, ngay_bat_dau, ngay_ket_thuc, han_dang_ky, han_nop_bao_cao, han_bao_ve | – |
| de_tai | ma_de_tai | ten, mo_ta, yeu_cau, loai_de_tai, so_nhom_toi_da, trang_thai, ngay_duyet | gv_de_xuat, gv_duyet, ma_bo_mon, ma_nganh_ap_dung, ma_hoc_ky |
| hoi_dong | ma_hoi_dong | ngay_bao_ve, gio_bat_dau, gio_ket_thuc, dia_diem, so_luong_toi_da, trang_thai | ma_bo_mon |
| dang_ky | ma_dang_ky | ngay_dang_ky, ngay_nop_bao_cao, lan_bao_ve, link_bao_cao, ty_le_trung_lap, diem_gvhd, diem_hoi_dong, diem_tong_ket, ghi_chu | ma_sinh_vien, ma_de_tai, ma_hoc_ky, ma_hoi_dong, ma_gvhd |
| thanh_vien_hoi_dong | (ma_hoi_dong, ma_giang_vien) | vai_tro, xac_nhan_tham_du | ma_hoi_dong, ma_giang_vien |
| tien_do | ma_tien_do | tuan, noi_dung, nhan_xet, ngay_nhan_xet, trang_thai | ma_dang_ky, gv_nhan_xet |
| tieu_chi_cham | ma_tieu_chi | mo_ta, trong_so, loai_de_tai | – |
| phieu_diem_chi_tiet | (ma_dang_ky, ma_giang_vien, ma_tieu_chi) | diem_so, ghi_chu | ma_dang_ky, ma_giang_vien, ma_tieu_chi |


## 7.2. Các bảng bổ sung cần thiết cho ứng dụng web (đề xuất)

Mô hình 14 bảng của báo cáo gốc đáp ứng nghiệp vụ lõi nhưng chưa có các cấu trúc cần để vận hành một ứng dụng web. Nhóm thiết kế nên bổ sung (chi tiết thuộc tính ở mục 7.3 và 7.4):


| Bảng đề xuất | Mục đích | Yêu cầu liên quan |
| --- | --- | --- |
| tai_khoan, chuc_danh_gan | Đăng nhập, mật khẩu băm, trạng thái khóa, role hệ thống (SV/GV/NV quản lý/Quản trị); chức danh (TBM, BCN, Giáo vụ, Phòng ĐT, BGĐ) gắn đơn vị và thời gian hiệu lực | FR-AUT-01..06 |
| tep_dinh_kem / phien_ban_bao_cao | Lưu siêu dữ liệu tệp (tên, dung lượng, loại, băm, đường dẫn), nhiều phiên bản báo cáo; thay cho một cột link_bao_cao duy nhất | FR-TD-01, FR-BC-01..02 |
| ket_qua_trung_lap | Chi tiết đối chiếu: báo cáo nguồn, tỷ lệ, đoạn trùng | FR-BC-03..04 |
| lich_su_trang_thai | Lịch sử chuyển trạng thái đề tài/đăng ký/phiếu điểm kèm lý do | FR-DT-07, FR-DK-10 |
| yeu_cau_thay_doi | Đề nghị đổi đề tài/GVHD/gia hạn và quyết định của BCN | FR-DK-10 |
| khieu_nai_diem | Khiếu nại điểm và kết quả xử lý | FR-CD-09 |
| thong_bao | Thông báo trong hệ thống và trạng thái đã đọc/đã gửi email | FR-TB-01..03 |
| nhat_ky_he_thong | Audit log thao tác | FR-AUT-09 |
| cau_hinh_he_thong, cau_hinh_khoa | Tham số: ngưỡng, công thức, thang quy đổi, mốc thời gian theo khoa | FR-DM-07..08 |
| hoc_phan_do_an (hoặc cột loại đồ án) | Phân biệt Đồ án cơ sở/chuyên ngành; ràng buộc “một đề tài/học phần/học kỳ” | BR-04 |
| bien_ban_hoi_dong | Biên bản buổi bảo vệ | FR-HD-08 |
| bo_tieu_chi | Bộ tiêu chí theo loại đồ án/năm học (đảm bảo tổng 100%) | FR-CD-01 |


## 7.3. Từ điển dữ liệu – 14 bảng gốc

Phần này liệt kê thuộc tính từng bảng theo mô hình quan hệ trong báo cáo phân tích, quy ước PostgreSQL (tên snake_case, mã tiếng Việt không dấu). Giả định: đồ án làm cá nhân (mỗi đăng ký gắn một sinh viên). Các cột kèm dấu (+) là bổ sung của SRS so với báo cáo gốc nhằm đáp ứng yêu cầu chức năng (trạng thái đăng ký, khóa phiếu điểm, thang điểm, v.v.). Trong cột Khóa: PK = khóa chính, FK = khóa ngoại, UQ = duy nhất.


### 7.3.1. Bảng khoa

Danh mục khoa của Phân hiệu.


| Tên cột | Kiểu dữ liệu | Khóa | Null | Mô tả / ràng buộc |
| --- | --- | --- | --- | --- |
| ma_khoa | varchar(10) | PK | Không | Mã khoa |
| ten_khoa | varchar(150) | UQ | Không | Tên khoa |


### 7.3.2. Bảng nganh

Ngành đào tạo, thuộc một khoa.


| Tên cột | Kiểu dữ liệu | Khóa | Null | Mô tả / ràng buộc |
| --- | --- | --- | --- | --- |
| ma_nganh | varchar(10) | PK | Không | Mã ngành |
| ten_nganh | varchar(150) |  | Không | Tên ngành |
| ma_khoa | varchar(10) | FK → khoa | Không | Khoa quản lý ngành |


### 7.3.3. Bảng bo_mon

Bộ môn thuộc khoa; có thể có một Trưởng bộ môn.


| Tên cột | Kiểu dữ liệu | Khóa | Null | Mô tả / ràng buộc |
| --- | --- | --- | --- | --- |
| ma_bo_mon | varchar(10) | PK | Không | Mã bộ môn |
| ten_bo_mon | varchar(150) |  | Không | Tên bộ môn |
| ma_khoa | varchar(10) | FK → khoa | Không | Khoa chứa bộ môn |
| ma_truong_bo_mon | varchar(20) | FK → giang_vien, UQ | Có | Trưởng bộ môn hiện tại; mỗi giảng viên làm trưởng tối đa một bộ môn |


### 7.3.4. Bảng giang_vien

Hồ sơ giảng viên.


| Tên cột | Kiểu dữ liệu | Khóa | Null | Mô tả / ràng buộc |
| --- | --- | --- | --- | --- |
| ma_giang_vien | varchar(20) | PK | Không | Mã giảng viên |
| ten_giang_vien | varchar(100) |  | Không | Họ tên |
| email | varchar(150) | UQ | Không | Email (dùng nhận thông báo) |
| sdt | varchar(15) |  | Có | Số điện thoại |
| hoc_vi | varchar(30) |  | Có | Học vị: Cử nhân, ThS, TS, PGS, GS |
| ma_bo_mon | varchar(10) | FK → bo_mon | Không | Bộ môn công tác |


### 7.3.5. Bảng lop

Lớp sinh viên.


| Tên cột | Kiểu dữ liệu | Khóa | Null | Mô tả / ràng buộc |
| --- | --- | --- | --- | --- |
| ma_lop | varchar(20) | PK | Không | Mã lớp |
| ten_lop | varchar(100) |  | Không | Tên lớp |
| ma_nganh | varchar(10) | FK → nganh | Không | Ngành của lớp |
| ma_gv_chu_nhiem | varchar(20) | FK → giang_vien | Có | Giảng viên chủ nhiệm (mỗi lớp một giảng viên; một giảng viên chủ nhiệm nhiều lớp) |
| si_so | integer |  | Không | Sĩ số, ≥ 0 |


### 7.3.6. Bảng sinh_vien

Hồ sơ sinh viên.


| Tên cột | Kiểu dữ liệu | Khóa | Null | Mô tả / ràng buộc |
| --- | --- | --- | --- | --- |
| ma_sinh_vien | varchar(20) | PK | Không | Mã sinh viên |
| ten_sinh_vien | varchar(100) |  | Không | Họ tên |
| ngay_sinh | date |  | Có | Ngày sinh |
| gioi_tinh | varchar(10) |  | Có | Nam / Nữ / Khác |
| email | varchar(150) | UQ | Không | Email |
| sdt | varchar(15) |  | Có | Số điện thoại |
| ma_lop | varchar(20) | FK → lop | Không | Lớp |
| gpa | numeric(3,2) |  | Có | GPA tích lũy, 0–4 |
| trang_thai | varchar(20) |  | Không | DANG_HOC, BAO_LUU, THOI_HOC, TOT_NGHIEP |


### 7.3.7. Bảng hoc_ky

Học kỳ và các mốc thời gian của kế hoạch đồ án.


| Tên cột | Kiểu dữ liệu | Khóa | Null | Mô tả / ràng buộc |
| --- | --- | --- | --- | --- |
| ma_hoc_ky | integer identity | PK | Không | Mã học kỳ |
| ten_hoc_ky | varchar(50) |  | Không | Tên học kỳ |
| nam_hoc | varchar(9) | UQ (cùng hoc_ky_thu) | Không | Năm học, ví dụ 2026-2027 |
| hoc_ky_thu | smallint |  | Không | Học kỳ thứ 1, 2 hoặc 3 (hè) |
| ngay_bat_dau | date |  | Không | Ngày bắt đầu thời gian thực hiện |
| ngay_ket_thuc | date |  | Không | Ngày kết thúc; CHECK > ngay_bat_dau |
| han_dang_ky | timestamptz |  | Không | Hạn chót đăng ký đề tài |
| han_nop_bao_cao | timestamptz |  | Không | Hạn nộp báo cáo toàn văn |
| han_bao_ve | date |  | Có | Hạn bảo vệ |


### 7.3.8. Bảng de_tai

Đề tài đồ án do giảng viên đề xuất.


| Tên cột | Kiểu dữ liệu | Khóa | Null | Mô tả / ràng buộc |
| --- | --- | --- | --- | --- |
| ma_de_tai | integer identity | PK | Không | Mã đề tài |
| ten_de_tai | varchar(300) |  | Không | Tên đề tài |
| mo_ta | text |  | Có | Mô tả |
| yeu_cau | text |  | Có | Yêu cầu đối với sinh viên |
| loai_de_tai | varchar(20) |  | Không | CO_SO (Đồ án cơ sở) hoặc CHUYEN_NGANH |
| ma_gv_de_xuat | varchar(20) | FK → giang_vien | Không | Giảng viên đề xuất |
| ma_bo_mon | varchar(10) | FK → bo_mon | Không | Bộ môn thẩm định |
| ma_nganh_ap_dung | varchar(10) | FK → nganh | Không | Ngành/chuyên ngành phù hợp |
| so_nhom_toi_da | smallint |  | Không | Số sinh viên (nhóm) tối đa nhận đề tài, ≥ 1 |
| trang_thai | varchar(15) |  | Không | MOI_TAO, CHO_DUYET, DA_DUYET, TU_CHOI |
| ma_gv_duyet | varchar(20) | FK → giang_vien | Có | Người duyệt (Trưởng bộ môn) |
| ngay_duyet | timestamptz |  | Có | Thời điểm duyệt/từ chối |
| ma_hoc_ky | integer | FK → hoc_ky | Không | Học kỳ áp dụng |


### 7.3.9. Bảng hoi_dong

Hội đồng chấm bảo vệ (một buổi bảo vệ).


| Tên cột | Kiểu dữ liệu | Khóa | Null | Mô tả / ràng buộc |
| --- | --- | --- | --- | --- |
| ma_hoi_dong | integer identity | PK | Không | Mã hội đồng |
| ngay_bao_ve | date |  | Không | Ngày bảo vệ |
| gio_bat_dau | time |  | Không | Giờ bắt đầu |
| gio_ket_thuc | time |  | Không | Giờ kết thúc; CHECK > gio_bat_dau |
| dia_diem | varchar(100) |  | Không | Phòng/địa điểm |
| ma_bo_mon | varchar(10) | FK → bo_mon | Không | Bộ môn tổ chức |
| so_luong_toi_da | smallint |  | Không | Số sinh viên tối đa của buổi |
| trang_thai | varchar(15) |  | Không | MOI_LAP, DA_PHAN_CONG, DA_XEP_LICH, HOAN_THANH |


### 7.3.10. Bảng dang_ky

Đăng ký đề tài của sinh viên – bảng trung tâm của hệ thống. Các cột đánh dấu (+) là bổ sung so với báo cáo gốc.


| Tên cột | Kiểu dữ liệu | Khóa | Null | Mô tả / ràng buộc |
| --- | --- | --- | --- | --- |
| ma_dang_ky | integer identity | PK | Không | Mã đăng ký |
| ma_sinh_vien | varchar(20) | FK → sinh_vien | Không | Sinh viên |
| ma_de_tai | integer | FK → de_tai | Không | Đề tài |
| ma_hoc_ky | integer | FK → hoc_ky | Không | Học kỳ |
| ma_hoi_dong | integer | FK → hoi_dong | Có | Hội đồng bảo vệ (khi đã xếp lịch) |
| ma_gvhd | varchar(20) | FK → giang_vien | Không | Giảng viên hướng dẫn |
| ngay_dang_ky | timestamptz |  | Không | Thời điểm đăng ký |
| ngay_nop_bao_cao | timestamptz |  | Có | Thời điểm nộp báo cáo toàn văn |
| lan_bao_ve | smallint |  | Không | Lần bảo vệ (mặc định 1) |
| link_bao_cao | varchar(500) |  | Có | Đường dẫn báo cáo; chi tiết tệp lưu ở tep_dinh_kem |
| ty_le_trung_lap | numeric(5,2) |  | Có | Tỷ lệ trùng lặp %, 0–100 |
| diem_gvhd | numeric(4,2) |  | Có | Điểm GVHD (quá trình) |
| diem_hoi_dong | numeric(4,2) |  | Có | Điểm Hội đồng (trung bình các thành viên) |
| diem_tong_ket | numeric(4,2) |  | Có | Điểm tổng kết (tính bởi hệ thống) |
| ghi_chu | text |  | Có | Ghi chú |
| loai_do_an (+) | varchar(20) | UQ (ma_sinh_vien, ma_hoc_ky, loai_do_an) | Không | CO_SO / CHUYEN_NGANH; bảo đảm mỗi sinh viên một đề tài/học phần/học kỳ (BR-04); sao chép từ de_tai |
| trang_thai (+) | varchar(20) |  | Không | CHO_XAC_NHAN, GV_XAC_NHAN, GV_TU_CHOI, DA_HUY, DA_CHOT |
| du_dieu_kien_bao_ve (+) | boolean |  | Có | NULL = chưa xét; true/false = GVHD xác nhận (BR-06) |
| trang_thai_ho_so (+) | varchar(25) |  | Không | CHUA_NOP, DA_NOP, DA_KIEM_TRA, DA_XEP_LICH, DA_CHAM, DA_CONG_BO |


### 7.3.11. Bảng thanh_vien_hoi_dong

Bảng trung gian N–N giữa hội đồng và giảng viên.


| Tên cột | Kiểu dữ liệu | Khóa | Null | Mô tả / ràng buộc |
| --- | --- | --- | --- | --- |
| ma_hoi_dong | integer | PK, FK → hoi_dong | Không | Hội đồng |
| ma_giang_vien | varchar(20) | PK, FK → giang_vien | Không | Thành viên (một giảng viên không trùng thời gian ở hai hội đồng – BR-07) |
| vai_tro | varchar(15) |  | Không | CHU_TICH, THU_KY, UY_VIEN |
| xac_nhan_tham_du | varchar(15) |  | Không | CHUA_XAC_NHAN, DONG_Y, TU_CHOI |


### 7.3.12. Bảng tien_do

Báo cáo tiến độ hằng tuần và nhận xét của giảng viên.


| Tên cột | Kiểu dữ liệu | Khóa | Null | Mô tả / ràng buộc |
| --- | --- | --- | --- | --- |
| ma_tien_do | integer identity | PK | Không | Mã tiến độ |
| ma_dang_ky | integer | FK → dang_ky, UQ (cùng tuan) | Không | Đăng ký |
| tuan | smallint |  | Không | Tuần thứ, ≥ 1; một báo cáo/tuần/đăng ký |
| noi_dung_bao_cao | text |  | Không | Công việc đã làm, kết quả, kế hoạch tuần sau |
| ma_gv_nhan_xet | varchar(20) | FK → giang_vien | Có | Giảng viên nhận xét |
| nhan_xet | text |  | Có | Nhận xét, đánh giá mức hoàn thành |
| ngay_nhan_xet | timestamptz |  | Có | Thời điểm nhận xét |
| trang_thai | varchar(15) |  | Không | DA_NOP, DA_NHAN_XET |
| ngay_nop (+) | timestamptz |  | Không | Thời điểm sinh viên nộp |
| muc_hoan_thanh (+) | smallint |  | Có | Mức hoàn thành 0–100% |


### 7.3.13. Bảng tieu_chi_cham

Tiêu chí chấm điểm. Các cột (+) là bổ sung để gom tiêu chí thành bộ, kiểm tra tổng trọng số 100%.


| Tên cột | Kiểu dữ liệu | Khóa | Null | Mô tả / ràng buộc |
| --- | --- | --- | --- | --- |
| ma_tieu_chi | integer identity | PK | Không | Mã tiêu chí |
| mo_ta | varchar(300) |  | Không | Mô tả tiêu chí (hình thức, nội dung, trình bày, phản biện…) |
| trong_so | numeric(5,2) |  | Không | Trọng số %, 0 < giá trị ≤ 100 |
| loai_de_tai | varchar(20) |  | Có | CO_SO / CHUYEN_NGANH (dư thừa khi đã có bộ tiêu chí; giữ để tương thích) |
| ma_bo_tieu_chi (+) | integer | FK → bo_tieu_chi | Không | Bộ tiêu chí chứa tiêu chí |
| thang_diem (+) | numeric(4,2) |  | Không | Điểm tối đa của tiêu chí (mặc định 10) |
| thu_tu (+) | smallint |  | Không | Thứ tự hiển thị |


### 7.3.14. Bảng phieu_diem_chi_tiet

Điểm từng thành viên chấm cho từng sinh viên theo từng tiêu chí.


| Tên cột | Kiểu dữ liệu | Khóa | Null | Mô tả / ràng buộc |
| --- | --- | --- | --- | --- |
| ma_dang_ky | integer | PK, FK → dang_ky | Không | Đăng ký (sinh viên được chấm) |
| ma_giang_vien | varchar(20) | PK, FK → giang_vien | Không | Thành viên chấm (phải thuộc hội đồng của đăng ký) |
| ma_tieu_chi | integer | PK, FK → tieu_chi_cham | Không | Tiêu chí |
| diem_so | numeric(4,2) |  | Không | Điểm, 0 ≤ giá trị ≤ thang_diem |
| ghi_chu | text |  | Có | Ghi chú |
| da_nop (+) | boolean |  | Không | Phiếu đã nộp/khóa (BR-11) |
| ngay_nop (+) | timestamptz |  | Có | Thời điểm nộp phiếu |


## 7.4. Từ điển dữ liệu – các bảng bổ sung

11 bảng dưới đây không có trong báo cáo gốc nhưng cần để vận hành ứng dụng web. Các bảng đề xuất còn lại ở mục 7.2 (bien_ban_hoi_dong, cau_hinh_khoa, hoc_phan_do_an) có thể hoãn sang giai đoạn sau; nếu làm đồ án nhóm thì cần thêm bảng nhom và thanh_vien_nhom.


### 7.4.1. Bảng tai_khoan

Tài khoản đăng nhập. Mỗi tài khoản gắn tối đa một hồ sơ sinh viên hoặc giảng viên.


| Tên cột | Kiểu dữ liệu | Khóa | Null | Mô tả / ràng buộc |
| --- | --- | --- | --- | --- |
| ma_tai_khoan | integer identity | PK | Không | Mã tài khoản |
| ten_dang_nhap | varchar(50) | UQ | Không | Tên đăng nhập (mã sinh viên/giảng viên hoặc email) |
| mat_khau_bam | varchar(255) |  | Không | Mật khẩu đã băm (bcrypt/Argon2) |
| ho_ten | varchar(100) |  | Không | Họ tên hiển thị |
| email | varchar(150) | UQ | Không | Email nhận thông báo và khôi phục mật khẩu |
| role | varchar(20) |  | Không | SINH_VIEN, GIANG_VIEN, NV_QUAN_LY, QUAN_TRI |
| ma_sinh_vien | varchar(20) | FK → sinh_vien, UQ | Có | Bắt buộc khi role = SINH_VIEN |
| ma_giang_vien | varchar(20) | FK → giang_vien, UQ | Có | Bắt buộc khi role = GIANG_VIEN |
| trang_thai | varchar(15) |  | Không | HOAT_DONG, KHOA |
| so_lan_sai | smallint |  | Không | Số lần nhập sai liên tiếp |
| khoa_den | timestamptz |  | Có | Khóa tạm đến thời điểm này |
| bat_buoc_doi_mat_khau | boolean |  | Không | Bắt buộc đổi mật khẩu ở lần đăng nhập đầu |
| lan_dang_nhap_cuoi | timestamptz |  | Có | Lần đăng nhập gần nhất |
| ngay_tao | timestamptz |  | Không | Ngày tạo |


### 7.4.2. Bảng chuc_danh_gan

Chức danh nghiệp vụ gán cho tài khoản, kèm đơn vị và thời hạn hiệu lực.


| Tên cột | Kiểu dữ liệu | Khóa | Null | Mô tả / ràng buộc |
| --- | --- | --- | --- | --- |
| ma_chuc_danh_gan | integer identity | PK | Không | Mã |
| ma_tai_khoan | integer | FK → tai_khoan | Không | Tài khoản được gán |
| chuc_danh | varchar(20) |  | Không | TBM, BCN_KHOA, GIAO_VU, PHONG_DAO_TAO, BGD |
| ma_khoa | varchar(10) | FK → khoa | Có | Khoa áp dụng (BCN, Giáo vụ); NULL nếu toàn trường |
| ma_bo_mon | varchar(10) | FK → bo_mon | Có | Bộ môn áp dụng (TBM) |
| hieu_luc_tu | date |  | Không | Ngày bắt đầu hiệu lực |
| hieu_luc_den | date |  | Có | Ngày hết hiệu lực; NULL = đang hiệu lực |
| ghi_chu | varchar(300) |  | Có | Ghi chú (số quyết định bổ nhiệm…) |


### 7.4.3. Bảng bo_tieu_chi

Bộ tiêu chí chấm theo loại đồ án và năm học; tổng trọng số các tiêu chí con phải bằng 100% mới được kích hoạt.


| Tên cột | Kiểu dữ liệu | Khóa | Null | Mô tả / ràng buộc |
| --- | --- | --- | --- | --- |
| ma_bo_tieu_chi | integer identity | PK | Không | Mã bộ tiêu chí |
| ten_bo | varchar(150) |  | Không | Tên bộ tiêu chí |
| loai_de_tai | varchar(20) |  | Không | CO_SO / CHUYEN_NGANH |
| nam_hoc | varchar(9) |  | Không | Năm học áp dụng |
| ma_khoa | varchar(10) | FK → khoa | Có | Khoa áp dụng; NULL = dùng chung toàn trường |
| da_kich_hoat | boolean |  | Không | true chỉ khi tổng trọng số = 100 và chưa có phiếu điểm chỉnh sửa |
| ngay_tao | timestamptz |  | Không | Ngày tạo |


### 7.4.4. Bảng tep_dinh_kem

Siêu dữ liệu tệp tải lên (tệp lưu ngoài CSDL).


| Tên cột | Kiểu dữ liệu | Khóa | Null | Mô tả / ràng buộc |
| --- | --- | --- | --- | --- |
| ma_tep | integer identity | PK | Không | Mã tệp |
| ma_dang_ky | integer | FK → dang_ky | Không | Đăng ký liên quan |
| ma_tien_do | integer | FK → tien_do | Có | Báo cáo tuần chứa tệp (nếu có) |
| loai_tep | varchar(25) |  | Không | BAO_CAO_TUAN, BAO_CAO_TOAN_VAN, SAN_PHAM, SLIDE, BIEN_BAN |
| ten_tep | varchar(255) |  | Không | Tên tệp gốc |
| duong_dan | varchar(500) |  | Không | Đường dẫn/khóa trong kho tệp |
| kich_thuoc | bigint |  | Không | Dung lượng (byte) |
| kieu_mime | varchar(100) |  | Không | Loại nội dung (kiểm tra theo nội dung thật) |
| ma_bam | char(64) |  | Không | Mã băm SHA-256 để phát hiện trùng/hỏng tệp |
| phien_ban | smallint |  | Không | Số phiên bản, bắt đầu từ 1 |
| la_ban_chinh | boolean |  | Không | Phiên bản chính thức mới nhất |
| ma_nguoi_tai | integer | FK → tai_khoan | Không | Người tải lên |
| ngay_tai | timestamptz |  | Không | Thời điểm tải lên |


### 7.4.5. Bảng ket_qua_trung_lap

Chi tiết đối chiếu trùng lặp của một báo cáo với từng báo cáo nguồn.


| Tên cột | Kiểu dữ liệu | Khóa | Null | Mô tả / ràng buộc |
| --- | --- | --- | --- | --- |
| ma_ket_qua | integer identity | PK | Không | Mã kết quả |
| ma_dang_ky | integer | FK → dang_ky | Không | Đăng ký được kiểm tra |
| ma_dang_ky_nguon | integer | FK → dang_ky | Không | Đăng ký có báo cáo nguồn trùng |
| ty_le | numeric(5,2) |  | Không | Tỷ lệ trùng với nguồn này, % |
| doan_trung | jsonb |  | Có | Danh sách đoạn văn trùng (vị trí, nội dung) |
| ngay_kiem_tra | timestamptz |  | Không | Thời điểm kiểm tra |


### 7.4.6. Bảng lich_su_trang_thai

Lịch sử chuyển trạng thái của các đối tượng nghiệp vụ.


| Tên cột | Kiểu dữ liệu | Khóa | Null | Mô tả / ràng buộc |
| --- | --- | --- | --- | --- |
| ma_lich_su | bigint identity | PK | Không | Mã |
| loai_doi_tuong | varchar(20) |  | Không | DE_TAI, DANG_KY, HOI_DONG, PHIEU_DIEM |
| ma_doi_tuong | varchar(40) |  | Không | Khóa của đối tượng |
| trang_thai_cu | varchar(25) |  | Có | Trạng thái trước |
| trang_thai_moi | varchar(25) |  | Không | Trạng thái sau |
| ly_do | text |  | Có | Lý do (bắt buộc khi từ chối, mở khóa phiếu điểm) |
| ma_nguoi_thuc_hien | integer | FK → tai_khoan | Không | Người thực hiện |
| ngay_thuc_hien | timestamptz |  | Không | Thời điểm |


### 7.4.7. Bảng yeu_cau_thay_doi

Đề nghị đổi đề tài, đổi GVHD, gia hạn sau khi chốt danh sách.


| Tên cột | Kiểu dữ liệu | Khóa | Null | Mô tả / ràng buộc |
| --- | --- | --- | --- | --- |
| ma_yeu_cau | integer identity | PK | Không | Mã yêu cầu |
| ma_dang_ky | integer | FK → dang_ky | Không | Đăng ký liên quan |
| loai | varchar(15) |  | Không | DOI_DE_TAI, DOI_GVHD, GIA_HAN |
| ma_de_tai_moi | integer | FK → de_tai | Có | Đề tài mới (khi đổi đề tài) |
| ma_gvhd_moi | varchar(20) | FK → giang_vien | Có | GVHD mới (khi đổi GVHD) |
| han_moi | date |  | Có | Hạn mới (khi gia hạn) |
| ly_do | text |  | Không | Lý do đề nghị |
| ma_nguoi_gui | integer | FK → tai_khoan | Không | Người gửi |
| trang_thai | varchar(15) |  | Không | CHO_DUYET, DA_DUYET, TU_CHOI |
| ma_nguoi_duyet | integer | FK → tai_khoan | Có | Người phê duyệt (BCN Khoa) |
| ket_luan | text |  | Có | Ý kiến xử lý |
| ngay_tao | timestamptz |  | Không | Ngày gửi |
| ngay_duyet | timestamptz |  | Có | Ngày xử lý |


### 7.4.8. Bảng khieu_nai_diem

Khiếu nại điểm của sinh viên và kết quả xử lý.


| Tên cột | Kiểu dữ liệu | Khóa | Null | Mô tả / ràng buộc |
| --- | --- | --- | --- | --- |
| ma_khieu_nai | integer identity | PK | Không | Mã khiếu nại |
| ma_dang_ky | integer | FK → dang_ky | Không | Đăng ký bị khiếu nại |
| noi_dung | text |  | Không | Nội dung khiếu nại |
| trang_thai | varchar(15) |  | Không | MOI, DANG_XU_LY, DA_XU_LY |
| diem_truoc | numeric(4,2) |  | Có | Điểm trước khi điều chỉnh |
| diem_sau | numeric(4,2) |  | Có | Điểm sau khi điều chỉnh (nếu có) |
| ket_qua_xu_ly | text |  | Có | Kết luận xử lý |
| ma_nguoi_xu_ly | integer | FK → tai_khoan | Có | Người xử lý (BCN Khoa) |
| ngay_gui | timestamptz |  | Không | Ngày gửi |
| ngay_xu_ly | timestamptz |  | Có | Ngày xử lý |


### 7.4.9. Bảng thong_bao

Thông báo trong hệ thống và trạng thái gửi email.


| Tên cột | Kiểu dữ liệu | Khóa | Null | Mô tả / ràng buộc |
| --- | --- | --- | --- | --- |
| ma_thong_bao | bigint identity | PK | Không | Mã thông báo |
| ma_tai_khoan_nhan | integer | FK → tai_khoan | Không | Người nhận |
| loai | varchar(30) |  | Không | Loại sự kiện (DE_TAI_DUYET, LICH_BAO_VE, CONG_BO_DIEM…) |
| tieu_de | varchar(200) |  | Không | Tiêu đề |
| noi_dung | text |  | Có | Nội dung |
| duong_dan_lien_ket | varchar(300) |  | Có | Liên kết tới trang liên quan |
| da_doc | boolean |  | Không | Đã đọc |
| ngay_doc | timestamptz |  | Có | Thời điểm đọc |
| da_gui_email | boolean |  | Không | Đã gửi email |
| ngay_tao | timestamptz |  | Không | Thời điểm tạo |


### 7.4.10. Bảng nhat_ky_he_thong

Nhật ký hoạt động (chỉ thêm, không sửa/xóa qua giao diện).


| Tên cột | Kiểu dữ liệu | Khóa | Null | Mô tả / ràng buộc |
| --- | --- | --- | --- | --- |
| ma_nhat_ky | bigint identity | PK | Không | Mã nhật ký |
| ma_tai_khoan | integer | FK → tai_khoan | Có | Người thực hiện (NULL nếu hệ thống tự chạy) |
| hanh_dong | varchar(40) |  | Không | DANG_NHAP, TAO, SUA, XOA, DUYET, MO_KHOA… |
| ten_bang | varchar(60) |  | Có | Bảng bị tác động |
| ma_doi_tuong | varchar(40) |  | Có | Khóa bản ghi bị tác động |
| gia_tri_cu | jsonb |  | Có | Giá trị trước |
| gia_tri_moi | jsonb |  | Có | Giá trị sau |
| dia_chi_ip | varchar(45) |  | Có | Địa chỉ IP |
| ngay_tao | timestamptz |  | Không | Thời điểm |


### 7.4.11. Bảng cau_hinh_he_thong

Tham số cấu hình, có thể ghi đè theo khoa.


| Tên cột | Kiểu dữ liệu | Khóa | Null | Mô tả / ràng buộc |
| --- | --- | --- | --- | --- |
| ma_cau_hinh | integer identity | PK | Không | Mã |
| khoa_cau_hinh | varchar(60) | UQ (cùng ma_khoa) | Không | Tên tham số: NGUONG_TRUNG_LAP, NGUONG_CHAM_TIEN_DO, HE_SO_DIEM_GVHD, HE_SO_DIEM_HD, QUY_TAC_LAM_TRON, THOI_GIAN_HET_PHIEN… |
| ma_khoa | varchar(10) | FK → khoa | Có | Khoa áp dụng; NULL = toàn trường |
| gia_tri | jsonb |  | Không | Giá trị tham số |
| mo_ta | varchar(300) |  | Có | Mô tả |
| ma_nguoi_cap_nhat | integer | FK → tai_khoan | Có | Người cập nhật cuối |
| ngay_cap_nhat | timestamptz |  | Không | Thời điểm cập nhật |


## 7.5. Ràng buộc toàn vẹn dữ liệu

Khóa chính, khóa ngoại, duy nhất (email, mã sinh viên, mã giảng viên) và kiểm tra miền giá trị (điểm trong thang, trọng số 0–100, giờ kết thúc > giờ bắt đầu) được cài đặt ở tầng CSDL.

Ràng buộc duy nhất: (ma_sinh_vien, ma_hoc_ky, loai_do_an) trong bảng dang_ky; (ma_dang_ky, tuan) trong tiến độ.

Các quy tắc phức tạp (kiểm tra chỉ tiêu, trùng lịch, tính điểm có trọng số) có thể cài bằng thủ tục lưu trữ/trigger hoặc ở tầng ứng dụng nhưng phải chạy trong giao dịch.

Xóa mềm (đánh dấu không dùng) đối với dữ liệu đã phát sinh nghiệp vụ; không xóa vật lý đề tài, đăng ký, điểm.


## 7.6. Lưu trữ, sao lưu và vòng đời dữ liệu

Dữ liệu đồ án (đề tài, báo cáo, điểm) được lưu trữ lâu dài, tối thiểu theo thời hạn lưu hồ sơ đào tạo của Trường (cần xác nhận).

Tệp lớn lưu trong kho tệp (hệ thống tệp/đối tượng), CSDL chỉ lưu siêu dữ liệu và đường dẫn.

Sao lưu CSDL và kho tệp hằng ngày, kiểm thử phục hồi định kỳ.


# 8. YÊU CẦU GIAO DIỆN NGƯỜI DÙNG


## 8.1. Nguyên tắc chung

Giao diện web responsive, dùng tốt trên màn hình từ điện thoại (≥ 360 px) đến máy tính; tiếng Việt, kiểu chữ rõ ràng, tương phản đủ (WCAG 2.1 mức AA).

Trang chủ (dashboard) hiển thị theo vai trò: việc cần làm (đề tài chờ duyệt, báo cáo chưa nhận xét, hạn sắp tới), thông báo mới, số liệu tóm tắt.

Thanh điều hướng theo phân hệ và theo vai trò; các thao tác thường dùng truy cập được trong tối đa 3 lần nhấp.

Bảng dữ liệu có tìm kiếm, bộ lọc, sắp xếp, phân trang, xuất tệp; biểu mẫu kiểm tra dữ liệu ngay khi nhập và báo lỗi cụ thể bên cạnh trường lỗi.

Hiển thị rõ trạng thái bằng nhãn màu kèm chữ (không chỉ dựa vào màu); hiển thị mốc hạn và đếm ngược cho sinh viên.

Thao tác không thể hoàn tác (chốt danh sách, công bố điểm, nộp phiếu điểm) phải có hộp thoại xác nhận nêu rõ hậu quả.


## 8.2. Danh sách màn hình chính


| Mã | Màn hình | Vai trò | Mô tả |
| --- | --- | --- | --- |
| UI-01 | Đăng nhập / quên mật khẩu | Mọi người | Xác thực, khôi phục mật khẩu |
| UI-02 | Trang chủ (dashboard) | Mọi người | Việc cần làm, thông báo, số liệu theo vai trò |
| UI-03 | Hồ sơ cá nhân, trung tâm thông báo | Mọi người | Xem/sửa thông tin, đọc thông báo |
| UI-10 | Danh mục nền & nhập dữ liệu | PĐT, Giáo vụ | CRUD khoa, ngành, bộ môn, lớp, GV, SV, học kỳ; nhập Excel có xem trước |
| UI-11 | Cấu hình tham số, mốc thời gian | PĐT, BCN, Giáo vụ | Ngưỡng, thang quy đổi, mốc kế hoạch |
| UI-12 | Quản lý tài khoản, vai trò, nhật ký | Quản trị HT | Tạo/khóa tài khoản, gán vai trò, xem nhật ký |
| UI-20 | Danh sách đề tài của tôi + biểu mẫu đề xuất | GVHD | Tạo, sửa, gửi duyệt, theo dõi trạng thái |
| UI-21 | Duyệt đề tài | TBM | Danh sách chờ duyệt, chi tiết, đề tài tương tự, duyệt/từ chối kèm lý do |
| UI-22 | Tra cứu đề tài | Mọi người | Tìm kiếm, lọc, xem chi tiết, nút “Đăng ký” (SV) |
| UI-30 | Đăng ký của tôi | SV | Đề tài đã chọn, trạng thái, hủy, kết quả kiểm tra điều kiện |
| UI-31 | Xác nhận đăng ký | GVHD | Danh sách SV đăng ký, xác nhận/từ chối |
| UI-32 | Tổng hợp đăng ký & chốt danh sách | Giáo vụ | Thống kê, SV chưa đăng ký, phân công thủ công, chốt, xuất quyết định |
| UI-40 | Nộp báo cáo tuần / lịch sử tuần | SV | Biểu mẫu tuần, đính kèm, xem nhận xét |
| UI-41 | Nhận xét tiến độ | GVHD | Danh sách SV, báo cáo từng tuần, nhận xét, mức hoàn thành |
| UI-42 | Theo dõi tiến độ tổng hợp | TBM, Giáo vụ, BCN | Bảng/biểu đồ, cảnh báo nhóm chậm |
| UI-50 | Nộp báo cáo toàn văn | SV | Tải lên báo cáo, sản phẩm, phiên bản, trạng thái kiểm tra |
| UI-51 | Kết quả trùng lặp & xác nhận điều kiện bảo vệ | GVHD | Tỷ lệ, đoạn trùng, nguồn, xác nhận |
| UI-60 | Quản lý Hội đồng | Giáo vụ, BCN, TBM | Tạo Hội đồng, phân công thành viên, xếp lịch (dạng bảng/lịch), kiểm tra xung đột |
| UI-61 | Lịch bảo vệ của tôi | SV, GV | Thời gian, phòng, thứ tự, xác nhận tham dự |
| UI-70 | Thiết lập tiêu chí chấm | Giáo vụ | Danh sách tiêu chí, thang điểm, trọng số, bộ đếm tổng 100% |
| UI-71 | Phiếu chấm điểm | Hội đồng | Hồ sơ SV, nhập điểm theo tiêu chí, tính điểm tạm, nộp phiếu |
| UI-72 | Tổng hợp điểm & công bố | Giáo vụ | Bảng điểm TV, điểm trung bình, xếp loại, công bố, xuất cho PĐT |
| UI-73 | Kết quả của tôi & khiếu nại | SV | Điểm tổng kết, chi tiết theo tiêu chí, gửi khiếu nại |
| UI-80 | Báo cáo thống kê | BGĐ, PĐT, BCN, Giáo vụ, TBM | Bộ lọc, biểu đồ, xuất tệp |
| UI-81 | Kho lưu trữ | Giáo vụ, TBM, BCN | Tra cứu đề tài/báo cáo/điểm các khóa trước |


## 8.3. Giao diện với hệ thống ngoài

Email (SMTP): gửi thông báo và khôi phục mật khẩu; có hàng đợi và thử lại khi gửi lỗi.

Nhập/xuất tệp: Excel/CSV (danh mục, danh sách, bảng điểm), PDF/Word (quyết định, lịch, biên bản).

Cổng đào tạo / SSO (mở rộng): đồng bộ danh sách sinh viên, giảng viên, đẩy điểm cuối cùng.

Dịch vụ kiểm tra đạo văn (mở rộng): qua giao diện nối ghép có thể thay thế.


# 9. YÊU CẦU PHI CHỨC NĂNG

Các con số dưới đây là đề xuất khởi điểm dựa trên quy mô khoảng 7.000 sinh viên và 135 giảng viên; cần được các bên xác nhận.


| Mã | Nhóm | Yêu cầu |
| --- | --- | --- |
| NFR-PF-01 | Hiệu năng | Trang thông thường tải trong ≤ 3 giây ở phân vị 95 với 500 người dùng đồng thời; các thao tác ghi (đăng ký, nộp báo cáo tuần) phản hồi ≤ 2 giây. |
| NFR-PF-02 | Hiệu năng – đỉnh tải | Hệ thống phải chịu được đợt đăng ký đề tài mở cùng lúc (tới ~1.000 sinh viên trong vài phút) mà không sai chỉ tiêu (xem FR-DK-04). |
| NFR-PF-03 | Hiệu năng – tệp | Tải lên tệp tới 50 MB (cấu hình); kiểm tra trùng lặp một báo cáo hoàn tất trong ≤ 5 phút và chạy bất đồng bộ, không chặn giao diện. |
| NFR-AV-01 | Sẵn sàng | Khả dụng ≥ 99% trong giờ hành chính và ≥ 99,5% trong các tuần cao điểm (đăng ký, nộp báo cáo, bảo vệ); thời gian bảo trì thông báo trước. |
| NFR-AV-02 | Sao lưu – phục hồi | Sao lưu hằng ngày; mục tiêu điểm phục hồi (RPO) ≤ 24 giờ, thời gian phục hồi (RTO) ≤ 4 giờ. |
| NFR-SE-01 | Bảo mật – truyền tải | Toàn bộ truy cập qua HTTPS (TLS 1.2 trở lên). |
| NFR-SE-02 | Bảo mật – xác thực | Mật khẩu băm bằng thuật toán băm có muối (bcrypt/Argon2), chính sách độ mạnh mật khẩu, chống dò mật khẩu (khóa tạm, giới hạn tần suất). |
| NFR-SE-03 | Bảo mật – ứng dụng | Phòng chống các lỗ hổng phổ biến (OWASP Top 10): SQL injection (truy vấn tham số hóa), XSS, CSRF, kiểm soát truy cập hỏng (IDOR). Quét mã độc và kiểm tra loại tệp thật khi tải lên. |
| NFR-SE-04 | Bảo mật – phân quyền | Mọi API kiểm tra quyền theo vai trò và phạm vi dữ liệu ở máy chủ; nguyên tắc đặc quyền tối thiểu. |
| NFR-SE-05 | Toàn vẹn điểm | Điểm và quyết định quan trọng không bị sửa âm thầm: mọi thay đổi có nhật ký bất biến (người, thời gian, giá trị cũ/mới, lý do). |
| NFR-SE-06 | Dữ liệu cá nhân | Chỉ thu thập dữ liệu cần thiết, giới hạn truy cập, mã hóa dữ liệu nhạy cảm khi lưu trữ; tuân thủ Nghị định 13/2023/NĐ-CP. |
| NFR-US-01 | Khả dụng | Người dùng mới hoàn thành tác vụ chính (sinh viên đăng ký đề tài, giảng viên nhận xét tuần) không cần tài liệu hướng dẫn dài; có trợ giúp ngữ cảnh ngắn. |
| NFR-US-02 | Truy cập được | Đáp ứng WCAG 2.1 AA ở mức hợp lý: điều hướng bằng bàn phím, nhãn biểu mẫu, tương phản. |
| NFR-CP-01 | Tương thích | Chạy trên các trình duyệt hiện đại (Chrome, Edge, Firefox, Safari) và thiết bị di động; không cần cài thêm phần mềm. |
| NFR-MA-01 | Bảo trì | Mã nguồn có kiểm thử tự động cho các quy tắc nghiệp vụ lõi (BR-01..BR-09); tách biệt cấu hình khỏi mã; có tài liệu API. |
| NFR-MA-02 | Mở rộng | Thiết kế mô-đun, thêm khoa/ngành/loại đồ án mới không phải sửa mã; kiến trúc cho phép thay thành phần kiểm tra đạo văn, thêm SSO. |
| NFR-CO-01 | Tính nhất quán dữ liệu | Các thao tác nhiều bước (đăng ký, chốt danh sách, tính điểm, công bố) thực hiện theo giao dịch ACID. |
| NFR-LO-01 | Địa phương hóa | Giao diện và thông báo tiếng Việt; định dạng ngày dd/MM/yyyy; điểm theo thang và quy tắc làm tròn của Trường; múi giờ UTC+7. |
| NFR-AU-01 | Kiểm toán | Nhật ký hoạt động lưu tối thiểu ít nhất một năm học và không cho sửa/xóa qua giao diện. |


# 10. CÁC CA SỬ DỤNG CHÍNH

Mục này mô tả chi tiết các ca sử dụng cốt lõi; các ca còn lại được suy ra từ bảng yêu cầu chức năng ở mục 4.


### UC-01 – Đăng ký đề tài


| Mục | Nội dung |
| --- | --- |
| Tác nhân | Sinh viên (chính); Giảng viên, Giáo vụ (phụ) |
| Tiền điều kiện | Sinh viên đã đăng nhập; học kỳ đang trong thời hạn đăng ký; có đề tài “Đã duyệt” phù hợp ngành |
| Luồng chính | 1. Sinh viên mở danh sách đề tài đã duyệt, lọc theo bộ môn/giảng viên/chuyên ngành.<br>2. Chọn đề tài và nhấn “Đăng ký”.<br>3. Hệ thống kiểm tra: còn chỉ tiêu đề tài và GVHD; chuyên ngành phù hợp; chưa đăng ký đề tài khác trong học kỳ.<br>4. Hệ thống ghi nhận đăng ký “Chờ xác nhận”, giữ chỗ chỉ tiêu và thông báo cho GVHD.<br>5. GVHD xác nhận; sinh viên nhận thông báo.<br>6. Hết hạn, Giáo vụ chốt và công bố danh sách chính thức. |
| Luồng thay thế | 3a. Không hợp lệ → hệ thống từ chối và nêu rõ lý do, sinh viên có thể chọn đề tài khác. 5a. GVHD từ chối kèm lý do → giải phóng chỉ tiêu, sinh viên đăng ký lại nếu còn hạn. 2a. Sinh viên hủy trước khi chốt → giải phóng chỉ tiêu. |
| Hậu điều kiện | Bản ghi đăng ký được tạo/cập nhật; chỉ tiêu cập nhật đúng; nhật ký được ghi |
| Yêu cầu liên quan | FR-DK-01..06, FR-DK-09, BR-01, BR-03, BR-04 |


### UC-02 – Xét duyệt đề tài


| Mục | Nội dung |
| --- | --- |
| Tác nhân | Trưởng bộ môn (chính); Giảng viên (nhận kết quả) |
| Tiền điều kiện | Đề tài ở trạng thái “Chờ duyệt” thuộc bộ môn của TBM |
| Luồng chính | 1. TBM mở danh sách chờ duyệt.<br>2. Xem chi tiết và danh sách đề tài tương tự do hệ thống gợi ý.<br>3. Chọn “Duyệt”.<br>4. Hệ thống chuyển “Đã duyệt”, ghi người duyệt và ngày duyệt, thông báo giảng viên. |
| Luồng thay thế | 3a. Chọn “Từ chối”, bắt buộc nhập lý do → trạng thái “Từ chối”; giảng viên chỉnh sửa và gửi lại. |
| Hậu điều kiện | Đề tài đã duyệt xuất hiện trong danh sách cho sinh viên đăng ký |
| Yêu cầu liên quan | FR-DT-03..07, BR-01, BR-02 |


### UC-03 – Nộp và nhận xét báo cáo tuần


| Mục | Nội dung |
| --- | --- |
| Tác nhân | Sinh viên, Giảng viên hướng dẫn |
| Tiền điều kiện | Đăng ký đã chốt; đang trong thời gian thực hiện của học kỳ |
| Luồng chính | 1. Sinh viên mở biểu mẫu báo cáo tuần, nhập công việc đã làm, kết quả, kế hoạch tuần sau, đính kèm tệp (nếu có), nộp.<br>2. Hệ thống lưu báo cáo “Đã nộp”, thông báo GVHD.<br>3. GVHD đọc báo cáo, đánh giá mức độ hoàn thành, nhập nhận xét.<br>4. Hệ thống chuyển “Đã nhận xét”, thông báo sinh viên và cập nhật số liệu tiến độ. |
| Luồng thay thế | 1a. Ngoài thời gian thực hiện hoặc đã có báo cáo tuần đó → từ chối. Sinh viên không nộp đến hạn → hệ thống nhắc, và đánh dấu chậm tiến độ khi vượt ngưỡng. |
| Hậu điều kiện | Lịch sử tiến độ được cập nhật; TBM/Giáo vụ thấy trên bảng theo dõi |
| Yêu cầu liên quan | FR-TD-01..06, BR-05 |


### UC-04 – Kiểm tra trùng lặp và xác nhận đủ điều kiện bảo vệ


| Mục | Nội dung |
| --- | --- |
| Tác nhân | Sinh viên, Hệ thống, Giảng viên hướng dẫn, Giáo vụ |
| Tiền điều kiện | Sinh viên đã nộp báo cáo toàn văn trong hạn |
| Luồng chính | 1. Hệ thống trích văn bản, đối chiếu với kho và tính tỷ lệ trùng lặp.<br>2. GVHD xem tỷ lệ, nguồn và đoạn trùng.<br>3. GVHD xác nhận “đủ điều kiện bảo vệ”.<br>4. Nếu tỷ lệ ≤ ngưỡng, sinh viên được đưa vào danh sách đủ điều kiện chuyển Giáo vụ. |
| Luồng thay thế | 3a. GVHD chọn “không đủ điều kiện” kèm lý do (vi phạm liêm chính, chưa đạt yêu cầu) → sinh viên được thông báo. 4a. Tỷ lệ > ngưỡng → không vào danh sách dù có xác nhận; GVHD/BCN xử lý theo quy chế. |
| Hậu điều kiện | Trạng thái hồ sơ bảo vệ được cập nhật |
| Yêu cầu liên quan | FR-BC-01..06, BR-06 |


### UC-05 – Thành lập Hội đồng và xếp lịch bảo vệ


| Mục | Nội dung |
| --- | --- |
| Tác nhân | Giáo vụ Khoa, Trưởng bộ môn, Ban Chủ nhiệm Khoa |
| Tiền điều kiện | Có danh sách sinh viên đủ điều kiện; có giảng viên khả dụng |
| Luồng chính | 1. Giáo vụ tạo Hội đồng (bộ môn, thời gian, địa điểm).<br>2. TBM đề xuất thành viên; BCN/Giáo vụ phân công Chủ tịch, Thư ký, Ủy viên (≥ 3).<br>3. Giáo vụ gán sinh viên và xếp thứ tự, giờ.<br>4. Hệ thống kiểm tra xung đột thành viên/phòng/sức chứa.<br>5. Hệ thống thông báo lịch cho sinh viên, GVHD và thành viên; thành viên xác nhận tham dự. |
| Luồng thay thế | 4a. Có xung đột → hệ thống báo và không cho lưu. 5a. Thay đổi lịch → thông báo lại, lưu lịch sử. |
| Hậu điều kiện | Hội đồng và lịch bảo vệ có hiệu lực; xuất được quyết định |
| Yêu cầu liên quan | FR-HD-01..07, BR-07 |


### UC-06 – Chấm điểm theo tiêu chí


| Mục | Nội dung |
| --- | --- |
| Tác nhân | Thành viên Hội đồng, Giáo vụ Khoa |
| Tiền điều kiện | Bộ tiêu chí đã kích hoạt (tổng trọng số 100%); buổi bảo vệ đã diễn ra/đang diễn ra |
| Luồng chính | 1. Thành viên mở danh sách sinh viên của buổi bảo vệ và hồ sơ.<br>2. Với từng sinh viên, nhập điểm từng tiêu chí và ghi chú.<br>3. Hệ thống kiểm tra đủ tiêu chí, điểm trong thang; hiển thị điểm tạm.<br>4. Thành viên nộp phiếu; hệ thống khóa phiếu. |
| Luồng thay thế | 3a. Thiếu/sai điểm → báo lỗi. 4a. Cần sửa sau khi nộp → đề nghị mở khóa, BCN/Giáo vụ duyệt kèm lý do. |
| Hậu điều kiện | Phiếu điểm chi tiết được lưu, sẵn sàng để tổng kết |
| Yêu cầu liên quan | FR-CD-01..04, BR-08, BR-11 |


### UC-07 – Tổng kết, xếp loại và công bố kết quả


| Mục | Nội dung |
| --- | --- |
| Tác nhân | Hệ thống, Giáo vụ Khoa, Sinh viên, Phòng Đào tạo |
| Tiền điều kiện | Mọi thành viên Hội đồng đã nộp phiếu cho sinh viên; điểm GVHD đã nhập |
| Luồng chính | 1. Hệ thống tính điểm từng thành viên, điểm Hội đồng, điểm tổng kết và xếp loại.<br>2. Giáo vụ kiểm tra bảng điểm, xử lý cảnh báo chênh lệch.<br>3. Giáo vụ công bố; sinh viên tra cứu điểm.<br>4. Điểm cuối cùng được chuyển cho Phòng Đào tạo; hệ thống lập báo cáo thống kê. |
| Luồng thay thế | 3a. Sinh viên khiếu nại → BCN Khoa xử lý, điểm điều chỉnh có nhật ký. |
| Hậu điều kiện | Học kỳ chuyển chế độ chỉ đọc; dữ liệu đưa vào kho lưu trữ |
| Yêu cầu liên quan | FR-CD-05..10, FR-TK-01..03, BR-09, BR-13 |


# PHỤ LỤC A. MA TRẬN TRUY VẾT BFD – YÊU CẦU

Bảng đối chiếu từng chức năng trong sơ đồ phân cấp chức năng (BFD) của báo cáo phân tích với các yêu cầu trong tài liệu này, để bảo đảm không bỏ sót nghiệp vụ.


| Chức năng BFD | Nội dung | Yêu cầu chức năng |
| --- | --- | --- |
| 1.1 | Đề xuất đề tài | FR-DT-01, 02, 03 |
| 1.2 | Xét duyệt đề tài | FR-DT-04, 05, 06, 07 |
| 1.3 | Tra cứu đề tài | FR-DT-08, 09 |
| 2.1 | Tra cứu đề tài đã duyệt | FR-DK-01 |
| 2.2 | Đăng ký / hủy đăng ký | FR-DK-02, 05 |
| 2.3 | Kiểm tra điều kiện đăng ký | FR-DK-03, 04 |
| 2.4 | Chốt danh sách | FR-DK-06, 07, 08, 09, 10 |
| 3.1 | Nộp báo cáo tuần | FR-TD-01, 02, 04 |
| 3.2 | Đánh giá, nhận xét tiến độ | FR-TD-03, 05 |
| 3.3 | Theo dõi, thống kê tiến độ | FR-TD-06, 07, FR-TK-01 |
| 4.1 | Thành lập Hội đồng | FR-HD-01, 07 |
| 4.2 | Phân công thành viên | FR-HD-02, 06 |
| 4.3 | Xếp lịch bảo vệ | FR-HD-03, 04 |
| 4.4 | Thông báo, điều chỉnh lịch | FR-HD-05, FR-TB-01 |
| 5.1 | Tiếp nhận báo cáo toàn văn | FR-BC-01, 02 |
| 5.2 | Kiểm tra trùng lặp | FR-BC-03..07 |
| 5.3 | Chấm điểm theo tiêu chí | FR-CD-01..05 |
| 5.4 | Tổng kết và xếp loại | FR-CD-06, 07, 10 |
| 5.5 | Công bố kết quả và thống kê | FR-CD-08, 09, FR-TK-01..04 |
| (bổ sung) | Xác thực, danh mục, thông báo, nhật ký | FR-AUT-xx, FR-DM-xx, FR-TB-xx |


# PHỤ LỤC B. CÁCH TÍNH ĐIỂM (THAM KHẢO)

Công thức chi tiết do Phòng Đào tạo/Khoa quyết định và được cấu hình trong hệ thống (FR-DM-07). Cách tính tối thiểu theo báo cáo phân tích:

Điểm thành viên i cho sinh viên s: Đ(i,s) = Σ_k [ điểm(i,s,k) × trọng số(k) ] với Σ trọng số = 100%.

Điểm Hội đồng: ĐHĐ(s) = trung bình cộng Đ(i,s) của các thành viên đã nộp phiếu.

Điểm tổng kết: ĐTK(s) = f(ĐGVHD(s), ĐHĐ(s)) – ví dụ trung bình có trọng số (a × ĐGVHD + b × ĐHĐ, a + b = 1). Hệ số a, b cấu hình theo loại đồ án.

Xếp loại: quy đổi ĐTK sang điểm chữ/xếp loại theo bảng quy đổi của quy chế đào tạo, làm tròn theo quy tắc cấu hình.

Ví dụ minh họa (số liệu giả định): tiêu chí Nội dung 50%, Trình bày 30%, Phản biện 20%; thành viên chấm 8,0 – 9,0 – 7,0 → Đ = 8,0×0,5 + 9,0×0,3 + 7,0×0,2 = 8,1.


# PHỤ LỤC C. VẤN ĐỀ CẦN LÀM RÕ VÀ HƯỚNG MỞ RỘNG


## C.1. Câu hỏi mở cần các bên xác nhận


| # | Vấn đề | Ghi chú / đề xuất tạm thời |
| --- | --- | --- |
| 1 | Đồ án làm theo cá nhân hay nhóm? Báo cáo gốc vừa có “số nhóm tối đa” ở đề tài, vừa mô hình mỗi đăng ký gắn một sinh viên. | Tạm hiểu: đồ án cá nhân, một đề tài nhận nhiều sinh viên đến mức chỉ tiêu; nếu làm nhóm cần thêm thực thể Nhóm và điểm cá nhân trong nhóm. |
| 2 | Công thức điểm tổng kết (tỷ lệ điểm GVHD/điểm Hội đồng), thang quy đổi và xếp loại, quy tắc làm tròn. | Cần quy chế; hệ thống cấu hình được (FR-CD-06). |
| 3 | Ngưỡng tỷ lệ trùng lặp cho phép và phạm vi đối chiếu (chỉ nội bộ hay có nguồn Internet). | Giai đoạn 1: đối chiếu nội bộ; ngưỡng cấu hình. |
| 4 | Người duyệt đề tài là Trưởng bộ môn (theo mô tả nghiệp vụ) nhưng ERD ghi “giảng viên duyệt”. Phê duyệt cuối cùng thuộc TBM hay BCN Khoa? | Tạm hiểu: TBM thẩm định và duyệt; BCN Khoa phê duyệt/giám sát và xử lý ngoại lệ. |
| 5 | Ai là người phân công GVHD: sinh viên tự chọn GV qua đề tài (đang mô hình hóa) hay BCN gán sau khi cân đối? | Tạm hiểu: GVHD là giảng viên đề xuất đề tài; BCN ra quyết định chính thức sau khi chốt. |
| 6 | Sinh viên có được tự đề xuất đề tài không (FR-DT-10)? | Ưu tiên thấp. |
| 7 | Có quy định GVHD không được là thành viên/Chủ tịch Hội đồng chấm sinh viên mình hướng dẫn không (BR-12)? | Cần xác nhận. |
| 8 | Có Giảng viên phản biện riêng ngoài Hội đồng không? (Báo cáo gốc chỉ nhắc “phản biện” như một tiêu chí.) | Hiện coi phản biện là tiêu chí chấm của Hội đồng. |
| 9 | Thời hạn lưu trữ hồ sơ đồ án và quyền truy cập báo cáo khóa cũ. | Theo quy định lưu trữ của Trường. |
| 10 | Có cần tích hợp ngay với cổng đào tạo (SSO, đồng bộ điểm) trong bản đầu không? | Tạm hoãn; thiết kế sẵn điểm nối ghép. |


## C.2. Hướng mở rộng (ngoài phạm vi bản 1.0)

Tích hợp hệ sinh thái nhà trường: đăng nhập một lần (SSO), đồng bộ dữ liệu sinh viên/giảng viên và điểm với cổng đào tạo.

Phát hiện đạo văn tự động qua dịch vụ bên ngoài, nguồn Internet.

Thuật toán tự động phân công giảng viên phản biện và xếp lịch Hội đồng tối ưu.

Trợ lý AI gợi ý đề tài phù hợp với định hướng và năng lực sinh viên.

Chữ ký số khi phê duyệt đề tài và nộp bảng điểm Hội đồng.

Ứng dụng di động và thông báo đẩy.
