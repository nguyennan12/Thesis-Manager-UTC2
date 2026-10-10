-- 1. BẢNG KHOA
CREATE TABLE khoa (
	ma_khoa VARCHAR(15) PRIMARY KEY NOT NULL,
	ten_khoa NVARCHAR(100) NOT NULL
);

-- 2. BẢNG NGÀNH
CREATE TABLE nganh (
	ma_nganh VARCHAR(15) PRIMARY KEY NOT NULL,
	ten_nganh NVARCHAR(100) NOT NULL,
	ma_khoa VARCHAR(15) NOT NULL,
	FOREIGN KEY (ma_khoa) REFERENCES khoa(ma_khoa)
);

-- 3. BẢNG BỘ MÔN
CREATE TABLE bo_mon (
	ma_bo_mon VARCHAR(15) PRIMARY KEY NOT NULL,
	ten_bo_mon NVARCHAR(100) NOT NULL,
	ma_khoa VARCHAR(15) NOT NULL,
	ma_truong_bo_mon VARCHAR(15) NULL, 
	FOREIGN KEY (ma_khoa) REFERENCES khoa(ma_khoa)
);

-- 4. BẢNG GIẢNG VIÊN 
CREATE TABLE giang_vien (
	ma_giang_vien VARCHAR(15) PRIMARY KEY NOT NULL,
	ten_giang_vien NVARCHAR(250) NOT NULL,
	email_giang_vien VARCHAR(150) UNIQUE,
	sdt_giang_vien VARCHAR(15),
	hoc_vi NVARCHAR(50), 
	ma_bo_mon VARCHAR(15),
	dich_muc_hd INT CHECK (dich_muc_hd > 0),
	FOREIGN KEY (ma_bo_mon) REFERENCES bo_mon(ma_bo_mon)
);


ALTER TABLE bo_mon
ADD CONSTRAINT fk_truong_bo_mon FOREIGN KEY (ma_truong_bo_mon) REFERENCES giang_vien(ma_giang_vien);

-- 5. BẢNG LỚP
CREATE TABLE lop (
	ma_lop VARCHAR(15) PRIMARY KEY NOT NULL,
	ten_lop NVARCHAR(100) NOT NULL,
	ma_nganh VARCHAR(15) NOT NULL,
	giang_vien_cn VARCHAR(15) NOT NULL,
	si_so INT CHECK (si_so > 0),
	FOREIGN KEY (ma_nganh) REFERENCES nganh(ma_nganh),
	FOREIGN KEY (giang_vien_cn) REFERENCES giang_vien(ma_giang_vien)
);

-- 6. BẢNG SINH VIÊN 
CREATE TABLE sinh_vien (
	ma_sinh_vien VARCHAR(15) PRIMARY KEY NOT NULL,
	ten_sinh_vien NVARCHAR(250) NOT NULL,
	ngay_sinh DATE,
	gioi_tinh VARCHAR(6) CHECK (gioi_tinh IN ('nam', 'nu', 'khac')),
	email_sinh_vien VARCHAR(150) UNIQUE,
	sdt_sinh_vien VARCHAR(15),
	ma_lop VARCHAR(15) NOT NULL,
	tinh_chi_tich_luy INT DEFAULT 0,
	gpa_tich_luy DECIMAL(3,2),
	trang_thai VARCHAR(10) CHECK (trang_thai IN ('Dang hoc', 'Bao luu', 'Thoi hoc', 'Tot nghiep')),
	FOREIGN KEY (ma_lop) REFERENCES lop(ma_lop)
);

-- 7. BẢNG HỌC KỲ
CREATE TABLE hoc_ky (
	ma_hoc_ky VARCHAR(10) PRIMARY KEY NOT NULL,
	ten_hoc_ky NVARCHAR(50) NOT NULL,
	nam_hoc VARCHAR(20) NOT NULL,
	hoc_ky_thu TINYINT,
	ngay_bat_dau DATE,
	ngay_ket_thuc DATE,
	HanDangKy DATETIME,
	HanNopBaoCao DATETIME,
	HanBaoVe DATETIME
);

-- 8. BẢNG ĐỀ TÀI
CREATE TABLE de_tai (
    ma_de_tai VARCHAR(15) PRIMARY KEY,
    ten_de_tai NVARCHAR(200) NOT NULL,
    mo_ta NVARCHAR(MAX),
    yeu_cau NVARCHAR(MAX),
    loai_de_tai VARCHAR(2) NOT NULL CHECK (loai_de_tai IN ('CS', 'CN')),
    ma_gv_de_xuat VARCHAR(15),
    ma_bo_mon VARCHAR(15),
    ma_nganh_ap_dung VARCHAR(15),
    so_nhom_toi_da TINYINT DEFAULT 1,
    trang_thai_dt NVARCHAR(20) CHECK (trang_thai_dt IN (N'Mới tạo', N'Chờ duyệt', N'Đã duyệt', N'Từ chối', N'Đã giao')),
    ma_gv_duyet_dt VARCHAR(15),
    ngay_duyet DATE,
    ma_hk_tao_moi VARCHAR(10),
    FOREIGN KEY (ma_gv_de_xuat) REFERENCES giang_vien(ma_giang_vien),
    FOREIGN KEY (ma_bo_mon) REFERENCES bo_mon(ma_bo_mon),
    FOREIGN KEY (ma_nganh_ap_dung) REFERENCES nganh(ma_nganh),
    FOREIGN KEY (ma_gv_duyet_dt) REFERENCES giang_vien(ma_giang_vien),
    FOREIGN KEY (ma_hk_tao_moi) REFERENCES hoc_ky(ma_hoc_ky)
);

-- 9. BẢNG HỘI ĐỒNG
CREATE TABLE hoi_dong (
	ma_hoi_dong VARCHAR(15) PRIMARY KEY NOT NULL,
	ngay_bao_ve DATE NOT NULL,
	gio_bat_dau TIME NOT NULL,
	gio_ket_thuc TIME NOT NULL,
	dia_diem NVARCHAR(200) NOT NULL,
	ma_bo_mon VARCHAR(15) NOT NULL,
	so_luong_toi_da TINYINT DEFAULT 5,
	trang_thai NVARCHAR(20) CHECK (trang_thai IN (N'Chuẩn bị', N'Đang diễn ra', N'Kết thúc')),
	FOREIGN KEY (ma_bo_mon) REFERENCES bo_mon(ma_bo_mon)
);

-- 10. BẢNG ĐĂNG KÝ 
CREATE TABLE dang_ky (
    ma_dang_ky VARCHAR(15) PRIMARY KEY,
    ma_sinh_vien VARCHAR(15) NOT NULL,
    ma_de_tai VARCHAR(15) NOT NULL,
    ma_hoc_ky VARCHAR(10) NOT NULL,
    ma_hoi_dong VARCHAR(15) NULL,
    ma_gv_huong_dan VARCHAR(15) NOT NULL,
    ngay_dang_ky DATETIME DEFAULT GETDATE(),
    ngay_nop_bao_cao DATETIME NULL,
    lan_bao_ve TINYINT DEFAULT 1 CHECK (lan_bao_ve IN (1,2)),
    link_file_bao_cao NVARCHAR(200),     
    ti_le_trung DECIMAL(5,2) CHECK (ti_le_trung BETWEEN 0 AND 100), 
	diem_gvhd DECIMAL(4,2) CHECK (diem_gvhd BETWEEN 0 AND 10),
    diem_hoi_dong DECIMAL(4,2) CHECK (diem_hoi_dong BETWEEN 0 AND 10),
    diem_tong_ket DECIMAL(4,2),
    ghi_chu NVARCHAR(MAX),
    FOREIGN KEY (ma_sinh_vien) REFERENCES sinh_vien(ma_sinh_vien),
    FOREIGN KEY (ma_de_tai) REFERENCES de_tai(ma_de_tai),
    FOREIGN KEY (ma_hoc_ky) REFERENCES hoc_ky(ma_hoc_ky),
    FOREIGN KEY (ma_hoi_dong) REFERENCES hoi_dong(ma_hoi_dong),
	FOREIGN KEY (ma_gv_huong_dan) REFERENCES giang_vien(ma_giang_vien)
);

-- 11. BẢNG THÀNH VIÊN HỘI ĐỒNG
CREATE TABLE thanh_vien_hoi_dong (
	ma_hoi_dong VARCHAR(15) NOT NULL,
	ma_giang_vien VARCHAR(15) NOT NULL,
	vai_tro NVARCHAR(40) NOT NULL,
	xac_nhan_tham_du BIT NOT NULL,
	PRIMARY KEY (ma_hoi_dong, ma_giang_vien),
	FOREIGN KEY (ma_giang_vien) REFERENCES giang_vien(ma_giang_vien),
    FOREIGN KEY (ma_hoi_dong) REFERENCES hoi_dong(ma_hoi_dong)
);

-- 12. BẢNG TIẾN ĐỘ
CREATE TABLE tien_do (
	ma_tien_do VARCHAR(15) PRIMARY KEY NOT NULL,
	ma_dang_ky  VARCHAR(15) NOT NULL,
	tuan TINYINT,
	noi_dung_bao_cao NVARCHAR(MAX),
	ma_gv_nhan_xet VARCHAR(15) NOT NULL,
	nhan_xet_gv NVARCHAR(MAX),
	ngay_nhan_xet DATE,
	trang_thai NVARCHAR(20) CHECK (trang_thai IN (N'Chờ nhận xét', N'Đã nhận xét', N'Quá hạn')),
	FOREIGN KEY (ma_dang_ky) REFERENCES dang_ky(ma_dang_ky),
    FOREIGN KEY (ma_gv_nhan_xet) REFERENCES giang_vien(ma_giang_vien)
);

-- 13. BẢNG TIÊU CHÍ CHẤM ĐIỂM
CREATE TABLE tieu_chi_cham (
	ma_tieu_chi VARCHAR(15) PRIMARY KEY NOT NULL,
	mo_ta NVARCHAR(MAX),
	trong_so DECIMAL(5,2) NOT NULL,
	loai_de_tai VARCHAR(2) NOT NULL CHECK (loai_de_tai IN ('CS', 'CN'))
);

-- 14. BẢNG PHIẾU ĐIỂM CHI TIẾT
CREATE TABLE phieu_diem_chi_tiet (
	ma_dang_ky  VARCHAR(15) NOT NULL,
	ma_giang_vien VARCHAR(15) NOT NULL,
	ma_tieu_chi VARCHAR(15) NOT NULL,
	diem_so DECIMAL(4,2) CHECK (diem_so BETWEEN 0 AND 10),
	ghi_chu NVARCHAR(MAX),
	thoi_gian_cham DATETIME DEFAULT GETDATE(),
	PRIMARY KEY(ma_dang_ky, ma_tieu_chi, ma_giang_vien),
	FOREIGN KEY (ma_dang_ky) REFERENCES dang_ky(ma_dang_ky),
    FOREIGN KEY (ma_giang_vien) REFERENCES giang_vien(ma_giang_vien),
	FOREIGN KEY (ma_tieu_chi) REFERENCES tieu_chi_cham(ma_tieu_chi)
);