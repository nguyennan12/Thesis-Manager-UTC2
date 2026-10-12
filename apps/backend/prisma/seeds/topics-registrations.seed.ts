// ==============================================================================
// SEED MODULE: TOPICS, REGISTRATIONS, PROGRESS & COUNCILS
// Hệ thống Web Quản lý Đồ án Tốt nghiệp UTC2 (UTC2-DAMS)
// ==============================================================================

import {
  PrismaClient,
  TopicStatus,
  RegistrationStatus,
  ProgressStatus,
  CouncilRole,
  CouncilStatus,
  ChangeRequestType,
  ChangeRequestStatus,
} from '@prisma/client';

export async function seedTopicsAndRegistrations(
  prisma: PrismaClient,
  departmentMap: Map<string, string>,
  majorMap: Map<string, string>,
  lecturerMap: Map<string, string>,
  studentMap: Map<string, string>,
  semesterId: string,
) {
  console.log('[Seed] Seeding 30 Topics across Departments...');

  const cnpmDeptId = departmentMap.get('BM_CNPM')!;
  const htttDeptId = departmentMap.get('BM_HTTT_MANG')!;
  const khmtDeptId = departmentMap.get('BM_KHMT') || cnpmDeptId;

  const cnpmMajorId = majorMap.get('CNPM')!;
  const htttMajorId = majorMap.get('HTTT')!;
  const cnttMajorId = majorMap.get('CNTT') || cnpmMajorId;

  const gv = (code: string) => lecturerMap.get(code) || lecturerMap.get('GV001')!;

  // 1. Danh sách 30 Đề tài phong phú
  const topicsData = [
    {
      code: 'DT-2026-001',
      titleVi: 'Nghiên cứu và ứng dụng Computer Vision phát hiện sự cố giao thông tự động',
      titleEn: 'Traffic Incident Detection Using Computer Vision',
      description: 'Xây dựng mô hình YOLOv11 phát hiện va chạm và ùn tắc trên camera giao thông TP.HCM.',
      objectives: 'Phát hiện sự cố thời gian thực với độ chính xác > 92%.',
      requirements: 'Python, PyTorch, React, Docker',
      maxStudents: 2,
      departmentId: cnpmDeptId,
      majorId: cnpmMajorId,
      proposerLecturerId: gv('GV004'), // ThS. Phạm Thị Miên
      reviewerLecturerId: gv('GV003'), // TS. Lê Thị Cẩm (GVPB)
      status: TopicStatus.APPROVED,
    },
    {
      code: 'DT-2026-002',
      titleVi: 'Xây dựng hệ thống IoT giám sát trạng thái kết cấu cầu đường sắt',
      titleEn: 'IoT-based Structural Health Monitoring for Railway Bridges',
      description: 'Triển khai mạng cảm biến đo độ võng và độ rung theo thời gian thực.',
      objectives: 'Thu thập và cảnh báo nguy cơ vượt ngưỡng tải trọng kết cấu.',
      requirements: 'Embedded C, MQTT, Node.js, TimescaleDB',
      maxStudents: 2,
      departmentId: htttDeptId,
      majorId: htttMajorId,
      proposerLecturerId: gv('GV002'),
      reviewerLecturerId: gv('GV005'),
      status: TopicStatus.APPROVED,
    },
    {
      code: 'DT-2026-003',
      titleVi: 'Hệ thống gợi ý lộ trình vận tải hàng hóa xanh tối ưu chi phí phát thải',
      titleEn: 'Green Freight Routing System for Emission Reduction',
      description: 'Tối ưu hóa bài toán giao hàng đa điểm giảm phát thải CO2.',
      objectives: 'Giảm 15% lượng phát thải carbon so với thuật toán tìm đường Dijkstra truyền thống.',
      requirements: 'Algorithms, Python OR-Tools, Next.js, GIS',
      maxStudents: 1,
      departmentId: khmtDeptId,
      majorId: cnttMajorId,
      proposerLecturerId: gv('GV001'),
      reviewerLecturerId: gv('GV006'),
      status: TopicStatus.APPROVED,
    },
    {
      code: 'DT-2026-004',
      titleVi: 'Ứng dụng Blockchain chống giả mạo hồ sơ kiểm định kỹ thuật phương tiện',
      titleEn: 'Blockchain for Vehicle Technical Inspection Integrity',
      description: 'Lưu trữ mã băm kết quả kiểm định lên mạng riêng Ethereum/Polygon.',
      objectives: 'Ngăn chặn sửa đổi kết quả kiểm tra khí thải và phanh cơ học.',
      requirements: 'Solidity, Web3.js, React, Smart Contracts',
      maxStudents: 2,
      departmentId: cnpmDeptId,
      majorId: cnpmMajorId,
      proposerLecturerId: gv('GV003'),
      reviewerLecturerId: gv('GV004'),
      status: TopicStatus.APPROVED,
    },
    {
      code: 'DT-2026-005',
      titleVi: 'Xây dựng hệ thống Microservices quản lý đăng ký học phần tín chỉ trường UTC2',
      titleEn: 'Microservices Architecture for UTC2 Course Registration',
      description: 'Hạ tầng NestJS, RabbitMQ, Redis xử lý tải cao 10.000 requests/s.',
      objectives: 'Đảm bảo hệ thống chịu tải cao và không bị race-condition khi ghi danh.',
      requirements: 'NestJS, Redis, RabbitMQ, PostgreSQL, Docker',
      maxStudents: 2,
      departmentId: cnpmDeptId,
      majorId: cnpmMajorId,
      proposerLecturerId: gv('GV007'),
      reviewerLecturerId: gv('GV009'),
      status: TopicStatus.APPROVED,
    },
    {
      code: 'DT-2026-006',
      titleVi: 'Ứng dụng Học sâu (Deep Learning) nhận diện biển báo giao thông Việt Nam',
      titleEn: 'Traffic Sign Recognition in Vietnam Using Deep Learning',
      description: 'Mô hình phát hiện biển báo cấm, biển hiệu lệnh trên hệ thống camera hành trình.',
      objectives: 'Độ chính xác mAP50 đạt trên 94% trong điều kiện thời tiết xấu.',
      requirements: 'Python, OpenCV, YOLO, Flutter',
      maxStudents: 1,
      departmentId: khmtDeptId,
      majorId: cnttMajorId,
      proposerLecturerId: gv('GV006'),
      reviewerLecturerId: gv('GV008'),
      status: TopicStatus.APPROVED,
    },
    {
      code: 'DT-2026-007',
      titleVi: 'Phát triển ứng dụng đặt vé và điều phối xe buýt thông minh đa phương thức',
      titleEn: 'Smart Multimodal Bus Ticketing and Dispatching System',
      description: 'Tích hợp bản đồ OpenStreetMap và giải thuật phân phối tuyến xe buýt theo giờ cao điểm.',
      objectives: 'Tối ưu thời gian chờ của hành khách dưới 7 phút.',
      requirements: 'React Native, Node.js, PostGIS',
      maxStudents: 2,
      departmentId: htttDeptId,
      majorId: htttMajorId,
      proposerLecturerId: gv('GV005'),
      reviewerLecturerId: gv('GV010'),
      status: TopicStatus.APPROVED,
    },
    {
      code: 'DT-2026-008',
      titleVi: 'Nền tảng phân tích cảm xúc phản hồi người học ứng dụng mô hình ngôn ngữ lớn (LLM)',
      titleEn: 'Student Feedback Sentiment Analysis Platform Using LLMs',
      description: 'Phân tích tự động ý kiến đóng góp của sinh viên để nâng cao chất lượng bài giảng.',
      objectives: 'Phân loại cảm xúc chính xác 90% với văn bản tiếng Việt học thuật.',
      requirements: 'Python, LangChain, FastAPI, Next.js',
      maxStudents: 1,
      departmentId: khmtDeptId,
      majorId: cnttMajorId,
      proposerLecturerId: gv('GV008'),
      reviewerLecturerId: gv('GV011'),
      status: TopicStatus.APPROVED,
    },
    {
      code: 'DT-2026-009',
      titleVi: 'Giám sát và phân tích lưu lượng mạng phát hiện tấn công DDoS bằng Machine Learning',
      titleEn: 'Network Traffic Monitoring and DDoS Detection Using Machine Learning',
      description: 'Phân tích gói tin NetFlow/IPFIX để phát hiện sớm các cuộc tấn công SYN Flood và UDP Amplification.',
      objectives: 'Phát hiện tấn công trong vòng dưới 3 giây, false positive < 1%.',
      requirements: 'Python, Scapy, Random Forest, Grafana',
      maxStudents: 2,
      departmentId: htttDeptId,
      majorId: htttMajorId,
      proposerLecturerId: gv('GV010'),
      reviewerLecturerId: gv('GV013'),
      status: TopicStatus.APPROVED,
    },
    {
      code: 'DT-2026-010',
      titleVi: 'Hệ thống quản lý kho vận thông minh (Smart Warehouse) ứng dụng QR Code & RFID',
      titleEn: 'Smart Warehouse Management System Integrating QR Code and RFID',
      description: 'Tự động hóa xuất nhập kho, tối ưu vị trí lưu trữ hàng hóa và cảnh báo tồn kho.',
      objectives: 'Giảm 40% thời gian kiểm kê hàng hóa định kỳ.',
      requirements: 'Java Spring Boot, Vue.js, RFID Reader SDK',
      maxStudents: 2,
      departmentId: cnpmDeptId,
      majorId: cnpmMajorId,
      proposerLecturerId: gv('GV009'),
      reviewerLecturerId: gv('GV012'),
      status: TopicStatus.APPROVED,
    },
    {
      code: 'DT-2026-011',
      titleVi: 'Xây dựng cổng thông tin thực tập và kết nối việc làm CNTT sinh viên UTC2',
      titleEn: 'UTC2 IT Internship and Job Matching Portal',
      description: 'Kết nối doanh nghiệp công nghệ với sinh viên sắp tốt nghiệp, gợi ý việc làm phù hợp kỹ năng.',
      objectives: 'Thu hút trên 50 doanh nghiệp đối tác tham gia tuyển dụng.',
      requirements: 'Next.js, Tailwind CSS, PostgreSQL, NestJS',
      maxStudents: 2,
      departmentId: cnpmDeptId,
      majorId: cnpmMajorId,
      proposerLecturerId: gv('GV012'),
      reviewerLecturerId: gv('GV015'),
      status: TopicStatus.APPROVED,
    },
    {
      code: 'DT-2026-012',
      titleVi: 'Phát triển ứng dụng Telemedicine hỗ trợ chẩn đoán từ xa qua WebRTC',
      titleEn: 'Telemedicine Remote Consultation Application via WebRTC',
      description: 'Kết nối video chất lượng cao với độ trễ thấp và tích hợp hồ sơ bệnh án điện tử.',
      objectives: 'Truyền tải âm thanh, hình ảnh mượt mà ở băng thông 3G/4G.',
      requirements: 'WebRTC, Socket.IO, React, Node.js',
      maxStudents: 1,
      departmentId: htttDeptId,
      majorId: htttMajorId,
      proposerLecturerId: gv('GV013'),
      reviewerLecturerId: gv('GV016'),
      status: TopicStatus.APPROVED,
    },
    {
      code: 'DT-2026-013',
      titleVi: 'Nghiên cứu kỹ thuật Zero-Trust Architecture trong bảo mật hạ tầng Cloud',
      titleEn: 'Zero-Trust Architecture for Cloud Infrastructure Security',
      description: 'Xác thực liên tục, phân quyền theo bối cảnh truy cập và mã hóa lưu lượng nội bộ mTLS.',
      objectives: 'Bảo vệ tài nguyên trước các cuộc tấn công Lateral Movement.',
      requirements: 'Kubernetes, Istio, Keycloak, Open Policy Agent',
      maxStudents: 2,
      departmentId: htttDeptId,
      majorId: htttMajorId,
      proposerLecturerId: gv('GV016'),
      reviewerLecturerId: gv('GV003'),
      status: TopicStatus.APPROVED,
    },
    {
      code: 'DT-2026-014',
      titleVi: 'Hệ thống tự động chấm điểm bài tập lập trình trực tuyến (Automated Online Judge)',
      titleEn: 'Automated Online Judge System for Programming Assignments',
      description: 'Thực thi mã nguồn trong sandbox Docker cô lập an toàn, đo thời gian thực thi và bộ nhớ.',
      objectives: 'Chấm điểm an toàn chống fork bomb và bypass sandbox.',
      requirements: 'Go, Docker, Linux cgroups, Next.js',
      maxStudents: 2,
      departmentId: cnpmDeptId,
      majorId: cnpmMajorId,
      proposerLecturerId: gv('GV015'),
      reviewerLecturerId: gv('GV004'),
      status: TopicStatus.APPROVED,
    },
    {
      code: 'DT-2026-015',
      titleVi: 'Ứng dụng Generative AI hỗ trợ soạn giáo án và sinh bài tập tương tác',
      titleEn: 'Generative AI Assistant for Lesson Planning and Interactive Quiz Generation',
      description: 'Tích hợp OpenAI API và RAG để sinh câu hỏi trắc nghiệm dựa theo giáo trình môn học.',
      objectives: 'Rút ngắn 60% thời gian biên soạn ngân hàng đề thi môn học.',
      requirements: 'Python, ChromaDB, Next.js, FastAPI',
      maxStudents: 1,
      departmentId: khmtDeptId,
      majorId: cnttMajorId,
      proposerLecturerId: gv('GV011'),
      reviewerLecturerId: gv('GV014'),
      status: TopicStatus.APPROVED,
    },
    {
      code: 'DT-2026-016',
      titleVi: 'Xây dựng hệ thống phát hiện tin giả (Fake News Detection) trên mạng xã hội tiếng Việt',
      titleEn: 'Vietnamese Social Media Fake News Detection System',
      description: 'Sử dụng mô hình PhoBERT kết hợp phân tích mạng lưới lan truyền thông tin.',
      objectives: 'Độ chính xác F1-score đạt trên 88% trên tập dữ liệu kiểm thử.',
      requirements: 'PyTorch, PhoBERT, NetworkX, Flask',
      maxStudents: 2,
      departmentId: khmtDeptId,
      majorId: cnttMajorId,
      proposerLecturerId: gv('GV014'),
      reviewerLecturerId: gv('GV006'),
      status: TopicStatus.APPROVED,
    },
    {
      code: 'DT-2026-017',
      titleVi: 'Ứng dụng định vị trong nhà (Indoor Positioning) bằng công nghệ BLE Beacon',
      titleEn: 'Indoor Positioning System Using Bluetooth Low Energy Beacons',
      description: 'Định vị người dùng bên trong tòa nhà nhiều tầng phục vụ hướng dẫn di chuyển tại UTC2.',
      objectives: 'Sai số định vị trung bình dưới 1.5 mét.',
      requirements: 'Flutter, BLE SDK, Trilateration Algorithm',
      maxStudents: 1,
      departmentId: htttDeptId,
      majorId: htttMajorId,
      proposerLecturerId: gv('GV005'),
      reviewerLecturerId: gv('GV013'),
      status: TopicStatus.APPROVED,
    },
    {
      code: 'DT-2026-018',
      titleVi: 'Nền tảng thương mại điện tử phân tán ứng dụng Smart Contract và Web3',
      titleEn: 'Decentralized E-Commerce Platform Using Smart Contracts and Web3',
      description: 'Giao dịch thanh toán phi tập trung ký gửi (Escrow) đảm bảo an toàn cho người mua và bán.',
      objectives: 'Giảm thiểu gian lận hoàn tiền và bảo vệ dữ liệu người tiêu dùng.',
      requirements: 'Solidity, Hardhat, Ethers.js, React',
      maxStudents: 2,
      departmentId: cnpmDeptId,
      majorId: cnpmMajorId,
      proposerLecturerId: gv('GV017'),
      reviewerLecturerId: gv('GV002'),
      status: TopicStatus.APPROVED,
    },
    {
      code: 'DT-2026-019',
      titleVi: 'Hệ sinh thái IoT cảnh báo ngập úng đô thị thời gian thực theo triều cường',
      titleEn: 'Real-time Urban Inundation Warning IoT Ecosystem for Tidal Flooding',
      description: 'Cảm biến siêu âm đo mực nước kết hợp bản đồ nhiệt cảnh báo điểm ngập cho người tham gia giao thông.',
      objectives: 'Gửi cảnh báo trước 15 phút khi mực nước đường phố vượt 20cm.',
      requirements: 'ESP32, MQTT, InfluxDB, Leaflet.js',
      maxStudents: 2,
      departmentId: htttDeptId,
      majorId: htttMajorId,
      proposerLecturerId: gv('GV002'),
      reviewerLecturerId: gv('GV005'),
      status: TopicStatus.APPROVED,
    },
    {
      code: 'DT-2026-020',
      titleVi: 'Hệ thống số hóa và quản lý văn bản hành chính lưu trữ phi tập trung IPFS',
      titleEn: 'Decentralized Administrative Document Management System Using IPFS',
      description: 'Quản lý phiên bản văn bản, ký số điện tử và lưu trữ phân tán chống giả mạo hồ sơ.',
      objectives: 'Đảm bảo tính toàn vẹn 100% của văn bản hành chính lưu trữ.',
      requirements: 'IPFS, Node.js, Digital Signature, React',
      maxStudents: 2,
      departmentId: cnpmDeptId,
      majorId: cnpmMajorId,
      proposerLecturerId: gv('GV004'),
      reviewerLecturerId: gv('GV001'),
      status: TopicStatus.APPROVED,
    },
    {
      code: 'DT-2026-021',
      titleVi: 'Phát triển Chatbot trợ lý ảo tư vấn tuyển sinh đại học tích hợp RAG',
      titleEn: 'University Admission Consulting AI Chatbot with Retrieval-Augmented Generation',
      description: 'Trả lời tức thì thông tin học phí, điểm chuẩn, đề án tuyển sinh các năm của UTC2.',
      objectives: 'Tỷ lệ trả lời chính xác thông tin tuyển sinh đạt trên 95%.',
      requirements: 'LangChain, OpenAI, Qdrant, React',
      maxStudents: 1,
      departmentId: khmtDeptId,
      majorId: cnttMajorId,
      proposerLecturerId: gv('GV006'),
      reviewerLecturerId: gv('GV008'),
      status: TopicStatus.APPROVED,
    },
    {
      code: 'DT-2026-022',
      titleVi: 'Tối ưu hóa định tuyến xe tải giao hàng chặng cuối (Last-mile delivery) bằng Di truyền (GA)',
      titleEn: 'Last-Mile Delivery Vehicle Routing Optimization Using Genetic Algorithm',
      description: 'Giải quyết bài toán VRP với ràng buộc cửa sổ thời gian (VRPTW).',
      objectives: 'Giảm 18% tổng quãng đường di chuyển và chi phí nhiên liệu của đội xe.',
      requirements: 'Python, Genetic Algorithms, Google Maps API',
      maxStudents: 2,
      departmentId: cnpmDeptId,
      majorId: cnpmMajorId,
      proposerLecturerId: gv('GV001'),
      reviewerLecturerId: gv('GV007'),
      status: TopicStatus.APPROVED,
    },
    // Đề tài ở trạng thái PENDING_HOD (đang chờ duyệt)
    {
      code: 'DT-2026-023',
      titleVi: 'Xây dựng ứng dụng quản lý tài chính cá nhân thông minh tích hợp Open Banking',
      titleEn: 'Smart Personal Financial Management Application with Open Banking',
      description: 'Tự động phân loại chi tiêu và lập kế hoạch ngân sách tài chính cá nhân.',
      objectives: 'Giúp người dùng kiểm soát chi tiêu và tiết kiệm hiệu quả.',
      requirements: 'React Native, Spring Boot, Open Banking APIs',
      maxStudents: 2,
      departmentId: cnpmDeptId,
      majorId: cnpmMajorId,
      proposerLecturerId: gv('GV007'),
      reviewerLecturerId: null,
      status: TopicStatus.PENDING_HOD,
    },
    {
      code: 'DT-2026-024',
      titleVi: 'Ứng dụng Federated Learning bảo vệ quyền riêng tư trong phân tích dữ liệu y tế',
      titleEn: 'Federated Learning for Privacy-Preserving Healthcare Data Analytics',
      description: 'Huấn luyện mô hình chuẩn đoán không cần chia sẻ dữ liệu bệnh nhân thô giữa các bệnh viện.',
      objectives: 'Bảo vệ quyền riêng tư theo chuẩn HIPAA trong khi vẫn giữ độ chính xác mô hình.',
      requirements: 'PyTorch, PySyft, Docker',
      maxStudents: 1,
      departmentId: khmtDeptId,
      majorId: cnttMajorId,
      proposerLecturerId: gv('GV008'),
      reviewerLecturerId: null,
      status: TopicStatus.PENDING_HOD,
    },
    {
      code: 'DT-2026-025',
      titleVi: 'Nền tảng kiểm thử API tự động và phân tích hiệu năng tải microservices',
      titleEn: 'Automated API Testing and Load Performance Analytics Platform',
      description: 'Tự động sinh ca kiểm thử API từ tài liệu OpenAPI/Swagger và phân tích độ trễ p99.',
      objectives: 'Phát hiện sớm các điểm nghẽn hiệu năng trước khi release sản phẩm.',
      requirements: 'k6, Go, Node.js, Next.js',
      maxStudents: 2,
      departmentId: cnpmDeptId,
      majorId: cnpmMajorId,
      proposerLecturerId: gv('GV009'),
      reviewerLecturerId: null,
      status: TopicStatus.PENDING_HOD,
    },
    {
      code: 'DT-2026-026',
      titleVi: 'Xây dựng mạng cảm biến WSN giám sát chất lượng không khí đô thị',
      titleEn: 'Wireless Sensor Network for Urban Air Quality Monitoring',
      description: 'Đo lường nồng độ bụi mịn PM2.5, PM10, khí CO và NO2 tại các nút giao thông trọng điểm.',
      objectives: 'Truyền thông tin cậy qua giao thức LoRa khoảng cách trên 3km.',
      requirements: 'LoRa, Arduino, Node-RED, TimescaleDB',
      maxStudents: 2,
      departmentId: htttDeptId,
      majorId: htttMajorId,
      proposerLecturerId: gv('GV010'),
      reviewerLecturerId: null,
      status: TopicStatus.PENDING_HOD,
    },
    {
      code: 'DT-2026-027',
      titleVi: 'Ứng dụng thị giác máy tính nhận dạng khuôn mặt điểm danh sinh viên tự động',
      titleEn: 'Computer Vision Facial Recognition for Automated Student Attendance',
      description: 'Nhận diện đa khuôn mặt trong giảng đường với góc nghiêng và ánh sáng thay đổi.',
      objectives: 'Tốc độ nhận diện dưới 0.5s/khuôn mặt với độ chính xác > 97%.',
      requirements: 'InsightFace, OpenCV, PyTorch, React',
      maxStudents: 2,
      departmentId: cnpmDeptId,
      majorId: cnpmMajorId,
      proposerLecturerId: gv('GV012'),
      reviewerLecturerId: null,
      status: TopicStatus.PENDING_HOD,
    },
    // Đề tài ở trạng thái ASSIGNED (đã được sinh viên đăng ký)
    {
      code: 'DT-2026-028',
      titleVi: 'Xây dựng giải pháp DevSecOps CI/CD tự động quét lỗ hổng bảo mật SAST/DAST',
      titleEn: 'DevSecOps Automated Security Scanning CI/CD Pipeline Solution',
      description: 'Tích hợp SonarQube, Trivy, OWASP ZAP vào quy trình GitHub Actions.',
      objectives: 'Chặn việc merge mã nguồn chứa lỗ hổng bảo mật nghiêm trọng.',
      requirements: 'GitHub Actions, SonarQube, Docker, Shell',
      maxStudents: 2,
      departmentId: cnpmDeptId,
      majorId: cnpmMajorId,
      proposerLecturerId: gv('GV015'),
      reviewerLecturerId: gv('GV002'),
      status: TopicStatus.ASSIGNED,
    },
    {
      code: 'DT-2026-029',
      titleVi: 'Hệ thống khuyến nghị tài liệu học tập thích ứng theo năng lực cá nhân hóa',
      titleEn: 'Personalized Adaptive Learning Material Recommendation System',
      description: 'Ứng dụng thuật toán lọc cộng tác (Collaborative Filtering) gợi ý lộ trình tự học.',
      objectives: 'Nâng cao 25% tỷ lệ hoàn thành khóa học của sinh viên.',
      requirements: 'Python, Scikit-learn, FastAPI, Vue.js',
      maxStudents: 1,
      departmentId: khmtDeptId,
      majorId: cnttMajorId,
      proposerLecturerId: gv('GV014'),
      reviewerLecturerId: gv('GV006'),
      status: TopicStatus.ASSIGNED,
    },
    {
      code: 'DT-2026-030',
      titleVi: 'Nền tảng phân tích dữ liệu cảm biến phương tiện xe điện (EV Telematics Platform)',
      titleEn: 'Electric Vehicle Telematics and Battery Sensor Analytics Platform',
      description: 'Thu thập trạng thái pin (SoC, SoH), nhiệt độ động cơ và dự báo phạm vi hoạt động còn lại.',
      objectives: 'Dự báo dung lượng pin với sai số dưới 3% bằng LSTM.',
      requirements: 'CAN bus, MQTT, TensorFlow, React',
      maxStudents: 2,
      departmentId: htttDeptId,
      majorId: htttMajorId,
      proposerLecturerId: gv('GV016'),
      reviewerLecturerId: gv('GV013'),
      status: TopicStatus.ASSIGNED,
    },
  ];

  const topicMap = new Map<string, string>();

  for (const t of topicsData) {
    const topic = await prisma.topic.upsert({
      where: { code: t.code },
      update: {
        titleVi: t.titleVi,
        titleEn: t.titleEn,
        description: t.description,
        objectives: t.objectives,
        requirements: t.requirements,
        maxStudents: t.maxStudents,
        departmentId: t.departmentId,
        majorId: t.majorId,
        semesterId,
        proposerLecturerId: t.proposerLecturerId,
        reviewerLecturerId: t.reviewerLecturerId,
        status: t.status,
      },
      create: {
        code: t.code,
        titleVi: t.titleVi,
        titleEn: t.titleEn,
        description: t.description,
        objectives: t.objectives,
        requirements: t.requirements,
        maxStudents: t.maxStudents,
        departmentId: t.departmentId,
        majorId: t.majorId,
        semesterId,
        proposerLecturerId: t.proposerLecturerId,
        reviewerLecturerId: t.reviewerLecturerId,
        status: t.status,
      },
    });
    topicMap.set(topic.code, topic.id);
  }
  console.log(`[Seed] Successfully seeded ${topicMap.size} topics.`);

  // 2. Seed 3 Defense Councils
  console.log('[Seed] Seeding Defense Councils (HD-CNPM-01, HD-CNPM-02, HD-HTTT-01)...');

  const council1 = await prisma.council.upsert({
    where: { code: 'HD-CNPM-01' },
    update: {
      name: 'Hội đồng Bảo vệ ĐATN K65 - BM Công nghệ phần mềm số 1',
      defenseDate: new Date('2027-01-15'),
      defenseRoom: 'Phòng Hội đồng E2.04',
      status: CouncilStatus.ESTABLISHED,
    },
    create: {
      code: 'HD-CNPM-01',
      name: 'Hội đồng Bảo vệ ĐATN K65 - BM Công nghệ phần mềm số 1',
      departmentId: cnpmDeptId,
      semesterId,
      defenseDate: new Date('2027-01-15'),
      defenseRoom: 'Phòng Hội đồng E2.04',
      startTime: '08:00',
      endTime: '11:30',
      status: CouncilStatus.ESTABLISHED,
      decisionNumber: 'QD-789/QD-UTC2',
      decisionDate: new Date('2026-12-01'),
    },
  });

  // Thành viên Hội đồng 1 (Chủ tịch GV002, Thư ký GV004, Ủy viên GV001)
  await prisma.councilMember.upsert({
    where: { councilId_lecturerId: { councilId: council1.id, lecturerId: gv('GV002') } },
    update: { role: CouncilRole.PRESIDENT },
    create: { councilId: council1.id, lecturerId: gv('GV002'), role: CouncilRole.PRESIDENT },
  });
  await prisma.councilMember.upsert({
    where: { councilId_lecturerId: { councilId: council1.id, lecturerId: gv('GV004') } },
    update: { role: CouncilRole.SECRETARY },
    create: { councilId: council1.id, lecturerId: gv('GV004'), role: CouncilRole.SECRETARY },
  });
  await prisma.councilMember.upsert({
    where: { councilId_lecturerId: { councilId: council1.id, lecturerId: gv('GV001') } },
    update: { role: CouncilRole.MEMBER },
    create: { councilId: council1.id, lecturerId: gv('GV001'), role: CouncilRole.MEMBER },
  });

  const council2 = await prisma.council.upsert({
    where: { code: 'HD-CNPM-02' },
    update: {
      name: 'Hội đồng Bảo vệ ĐATN K65 - BM Công nghệ phần mềm số 2',
      defenseDate: new Date('2027-01-16'),
      defenseRoom: 'Phòng C103',
      status: CouncilStatus.ESTABLISHED,
    },
    create: {
      code: 'HD-CNPM-02',
      name: 'Hội đồng Bảo vệ ĐATN K65 - BM Công nghệ phần mềm số 2',
      departmentId: cnpmDeptId,
      semesterId,
      defenseDate: new Date('2027-01-16'),
      defenseRoom: 'Phòng C103',
      startTime: '08:00',
      endTime: '11:30',
      status: CouncilStatus.ESTABLISHED,
      decisionNumber: 'QD-790/QD-UTC2',
      decisionDate: new Date('2026-12-01'),
    },
  });

  // Thành viên Hội đồng 2 (Chủ tịch GV009, Thư ký GV007, Ủy viên GV012)
  await prisma.councilMember.upsert({
    where: { councilId_lecturerId: { councilId: council2.id, lecturerId: gv('GV009') } },
    update: { role: CouncilRole.PRESIDENT },
    create: { councilId: council2.id, lecturerId: gv('GV009'), role: CouncilRole.PRESIDENT },
  });
  await prisma.councilMember.upsert({
    where: { councilId_lecturerId: { councilId: council2.id, lecturerId: gv('GV007') } },
    update: { role: CouncilRole.SECRETARY },
    create: { councilId: council2.id, lecturerId: gv('GV007'), role: CouncilRole.SECRETARY },
  });
  await prisma.councilMember.upsert({
    where: { councilId_lecturerId: { councilId: council2.id, lecturerId: gv('GV012') } },
    update: { role: CouncilRole.MEMBER },
    create: { councilId: council2.id, lecturerId: gv('GV012'), role: CouncilRole.MEMBER },
  });

  const council3 = await prisma.council.upsert({
    where: { code: 'HD-HTTT-01' },
    update: {
      name: 'Hội đồng Bảo vệ ĐATN K65 - BM Hệ thống thông tin số 1',
      defenseDate: new Date('2027-01-15'),
      defenseRoom: 'Phòng C102',
      status: CouncilStatus.ESTABLISHED,
    },
    create: {
      code: 'HD-HTTT-01',
      name: 'Hội đồng Bảo vệ ĐATN K65 - BM Hệ thống thông tin số 1',
      departmentId: htttDeptId,
      semesterId,
      defenseDate: new Date('2027-01-15'),
      defenseRoom: 'Phòng C102',
      startTime: '08:00',
      endTime: '11:30',
      status: CouncilStatus.ESTABLISHED,
      decisionNumber: 'QD-791/QD-UTC2',
      decisionDate: new Date('2026-12-01'),
    },
  });

  // Thành viên Hội đồng 3 (Chủ tịch GV003, Thư ký GV005, Ủy viên GV010)
  await prisma.councilMember.upsert({
    where: { councilId_lecturerId: { councilId: council3.id, lecturerId: gv('GV003') } },
    update: { role: CouncilRole.PRESIDENT },
    create: { councilId: council3.id, lecturerId: gv('GV003'), role: CouncilRole.PRESIDENT },
  });
  await prisma.councilMember.upsert({
    where: { councilId_lecturerId: { councilId: council3.id, lecturerId: gv('GV005') } },
    update: { role: CouncilRole.SECRETARY },
    create: { councilId: council3.id, lecturerId: gv('GV005'), role: CouncilRole.SECRETARY },
  });
  await prisma.councilMember.upsert({
    where: { councilId_lecturerId: { councilId: council3.id, lecturerId: gv('GV010') } },
    update: { role: CouncilRole.MEMBER },
    create: { councilId: council3.id, lecturerId: gv('GV010'), role: CouncilRole.MEMBER },
  });

  // 3. FULL LIFECYCLE SEED FOR PRIMARY DEMO STUDENT: 6551071001 (Dư Nguyên An)
  console.log('\n[Seed] >>> SEEDING FULL LIFECYCLE FOR DEMO STUDENT 6551071001 (Dư Nguyên An) <<<');

  const demoStudentId = studentMap.get('6551071001')!;
  const demoTopicId = topicMap.get('DT-2026-001')!;
  const demoAdvisorId = gv('GV004'); // ThS. Phạm Thị Miên

  const reg1 = await prisma.registration.upsert({
    where: { studentId_semesterId: { studentId: demoStudentId, semesterId } },
    update: {
      topicId: demoTopicId,
      advisorLecturerId: demoAdvisorId,
      councilId: council1.id,
      status: RegistrationStatus.DEFENDED,
      isQualifiedForDefense: true,
      advisorFeedback: 'Sinh viên hoàn thành xuất sắc 15 tuần nghiên cứu, tỷ lệ đạo văn 6.8% đạt chuẩn, đồng ý cho bảo vệ trước Hội đồng.',
      reportSubmissionUrl: '/uploads/KLTN_6551071001_DuNguyenAn_FullText.pdf',
      submittedAt: new Date('2026-12-20T09:00:00Z'),
      scoreProcess: 8.5,
      scoreReviewer: 8.0,
      scoreCouncilAvg: 8.8,
      scoreFinal: 8.55,
      gradeScale4: 3.70,
      gradeLetter: 'A',
    },
    create: {
      code: 'REG-2026-001',
      topicId: demoTopicId,
      studentId: demoStudentId,
      semesterId,
      advisorLecturerId: demoAdvisorId,
      councilId: council1.id,
      status: RegistrationStatus.DEFENDED,
      isQualifiedForDefense: true,
      advisorFeedback: 'Sinh viên hoàn thành xuất sắc 15 tuần nghiên cứu, tỷ lệ đạo văn 6.8% đạt chuẩn, đồng ý cho bảo vệ trước Hội đồng.',
      reportSubmissionUrl: '/uploads/KLTN_6551071001_DuNguyenAn_FullText.pdf',
      submittedAt: new Date('2026-12-20T09:00:00Z'),
      scoreProcess: 8.5,
      scoreReviewer: 8.0,
      scoreCouncilAvg: 8.8,
      scoreFinal: 8.55,
      gradeScale4: 3.70,
      gradeLetter: 'A',
    },
  });

  // 3.1. 15 Weekly Progress Reports cho reg1
  const reportWeeklyPlans = [
    { week: 1, comp: 'Khảo sát tài liệu tổng quan, bài báo IEEE về phát hiện sự cố giao thông.', plan: 'Thu thập dataset camera giao thông tại các nút giao TP. Thủ Đức.', fb: 'Đề cương khảo sát đạt yêu cầu.' },
    { week: 2, comp: 'Thu thập và dán nhãn 1,500 khung hình camera giao thông.', plan: 'Huấn luyện mô hình cơ sở YOLOv8n để kiểm tra độ trễ.', fb: 'Cần bổ sung các tình huống ban đêm và mưa.' },
    { week: 3, comp: 'Huấn luyện thử nghiệm mô hình, mAP50 đạt 84.5%.', plan: 'Tối ưu hóa mô hình với TensorRT để tăng FPS.', fb: 'Tiến độ đúng hạn.' },
    { week: 4, comp: 'Xây dựng module cảnh báo WebSocket và giao diện Dashboard theo dõi luồng video.', plan: 'Nối pipeline video streaming RTSP trực tiếp.', fb: 'Giao diện trực quan, rõ ràng.' },
    { week: 5, comp: 'Đóng gói ứng dụng thành Docker container và thử nghiệm trên server thử nghiệm.', plan: 'Viết chương 3 của khóa luận: Thiết kế kiến trúc hệ thống.', fb: 'Format chuẩn mẫu ĐATN trường UTC2.' },
    { week: 6, comp: 'Hoàn thiện bản nháp Chương 1-3 thuyết minh tốt nghiệp.', plan: 'Kiểm tra độ trễ luồng video và xử lý nghẽn mạng.', fb: 'Bố cục chương 3 logic.' },
    { week: 7, comp: 'Kiểm thử thực nghiệm trên 4 camera giao thông tuyến Xa lộ Hà Nội.', plan: 'Tổng hợp số liệu thống kê độ chính xác thực tế.', fb: 'Đưa số liệu thực nghiệm vào biểu đồ so sánh.' },
    { week: 8, comp: 'Báo cáo sơ kết giữa kỳ: Báo cáo giữa kỳ và đánh giá hiệu năng thuật toán.', plan: 'Bắt đầu viết Chương 4: Đánh giá và bàn luận.', fb: 'Đánh giá giữa kỳ đạt 8.5 điểm.' },
    { week: 9, comp: 'Hoàn thiện giải thuật lọc nhiễu bóng xe và phản chiếu mặt đường ướt.', plan: 'Tích hợp hệ thống phân tích luồng xe theo làn.', fb: 'Giải thuật lọc nhiễu sáng tạo.' },
    { week: 10, comp: 'Triển khai mô hình lên thiết bị Edge (NVIDIA Jetson Orin Nano).', plan: 'Đo lường điện năng tiêu thụ và nhiệt độ thiết bị.', fb: 'Thực nghiệm trên Edge rất giá trị.' },
    { week: 11, comp: 'Xây dựng API RESTful và thông báo tự động qua Telegram Bot.', plan: 'Tối ưu hóa thời gian phản hồi API dưới 50ms.', fb: 'Tính năng cảnh báo kịp thời.' },
    { week: 12, comp: 'Hoàn thành bản thảo hoàn chỉnh Chương 4 và Chương 5 (Kết luận & Hướng phát triển).', plan: 'Rà soát toàn bộ tài liệu tham khảo theo chuẩn IEEE.', fb: 'Viết tốt, chú ý chính tả thuật ngữ tiếng Anh.' },
    { week: 13, comp: 'Chạy kiểm thử tải hệ thống với 20 camera RTSP đồng thời.', plan: 'Tổng hợp kết quả kiểm thử tải đưa vào phụ lục.', fb: 'Hệ thống chịu tải ổn định.' },
    { week: 14, comp: 'Nộp bản nháp toàn văn cho GVHD thẩm định và chạy quét đạo văn thử nghiệm.', plan: 'Chỉnh sửa câu chữ, lược bớt các trích dẫn trùng lặp.', fb: 'Đã góp ý chi tiết trong bản in nháp.' },
    { week: 15, comp: 'Hoàn thiện toàn văn báo cáo KLTN, slide thuyết trình và video demo sản phẩm.', plan: 'Chuẩn bị bảo vệ trước Hội đồng chấm khóa luận tốt nghiệp.', fb: 'Đồng ý cho bảo vệ trước Hội đồng ĐATN.' },
  ];

  for (const r of reportWeeklyPlans) {
    await prisma.progressReport.upsert({
      where: { registrationId_weekNumber: { registrationId: reg1.id, weekNumber: r.week } },
      update: {
        tasksCompleted: r.comp,
        nextWeekPlan: r.plan,
        advisorFeedback: r.fb,
        status: ProgressStatus.APPROVED,
        reviewedAt: new Date(`2026-10-${String(Math.min(r.week * 2, 28)).padStart(2, '0')}`),
      },
      create: {
        registrationId: reg1.id,
        weekNumber: r.week,
        tasksCompleted: r.comp,
        nextWeekPlan: r.plan,
        reviewerLecturerId: demoAdvisorId,
        advisorFeedback: r.fb,
        status: ProgressStatus.APPROVED,
        reviewedAt: new Date(`2026-10-${String(Math.min(r.week * 2, 28)).padStart(2, '0')}`),
      },
    });
  }

  // 3.2. Plagiarism Result (Tỷ lệ 6.8% < 20% đạt chuẩn)
  await prisma.plagiarismResult.deleteMany({ where: { registrationId: reg1.id } });
  await prisma.plagiarismResult.create({
    data: {
      registrationId: reg1.id,
      similarityPercentage: 6.8,
      matchingDetails: {
        sources: [
          { name: 'IEEE Xplore Digital Library', percent: 3.2 },
          { name: 'UTC2 Institutional Repository (KLTN 2024)', percent: 2.1 },
          { name: 'ArXiv Machine Learning Papers', percent: 1.5 },
        ],
        status: 'PASSED',
        threshold: 20.0,
        checkedAt: '2026-12-21T08:30:00Z',
      },
    },
  });

  // 3.3. Rubric Evaluation Scores (Chi tiết điểm từ 3 thành viên Hội đồng)
  const criteria = await prisma.evaluationCriterion.findMany({
    orderBy: { orderIndex: 'asc' },
  });

  if (criteria.length > 0) {
    // Hội đồng gồm: GV002 (Chủ tịch), GV004 (Thư ký), GV001 (Ủy viên)
    const members = [
      { lecturerId: gv('GV002'), scores: [9.0, 8.5, 9.0, 8.5], notes: 'Bảo vệ tự tin, sản phẩm demo chạy mượt mà.' },
      { lecturerId: gv('GV004'), scores: [9.0, 9.0, 9.0, 9.0], notes: 'Quá trình nghiên cứu nghiêm túc, kết quả xuất sắc.' },
      { lecturerId: gv('GV001'), scores: [8.5, 8.5, 9.0, 8.5], notes: 'Đề tài có tính thực tiễn cao, thuật toán tối ưu tốt.' },
    ];

    for (const m of members) {
      for (let idx = 0; idx < criteria.length; idx++) {
        const crit = criteria[idx];
        const score = m.scores[idx] || 8.5;
        await prisma.detailedScore.upsert({
          where: {
            registrationId_criterionId_lecturerId: {
              registrationId: reg1.id,
              criterionId: crit.id,
              lecturerId: m.lecturerId,
            },
          },
          update: {
            score,
            notes: m.notes,
            isLocked: true,
          },
          create: {
            registrationId: reg1.id,
            criterionId: crit.id,
            lecturerId: m.lecturerId,
            score,
            notes: m.notes,
            isLocked: true,
          },
        });
      }
    }
  }

  // 3.4. Change Request trong lịch sử cho reg1 (Đã duyệt)
  await prisma.changeRequest.deleteMany({ where: { registrationId: reg1.id } });
  await prisma.changeRequest.create({
    data: {
      registrationId: reg1.id,
      requestType: ChangeRequestType.CHANGE_TOPIC,
      reason: 'Bổ sung phương pháp nhận diện tự động và tối ưu hóa xử lý thời gian thực theo góp ý của GVHD tại tuần 4.',
      requestedData: {
        oldTitle: 'Phát hiện sự cố giao thông bằng Camera tại TP.HCM',
        newTitle: 'Nghiên cứu và ứng dụng Computer Vision phát hiện sự cố giao thông tự động',
      },
      status: ChangeRequestStatus.APPROVED,
    },
  });

  console.log('[Seed] Completed full flow for 6551071001 (Reports, Submission, Plagiarism 6.8%, Rubric 8.8, Final 8.55 A, ChangeRequest).');

  // 4. Seed Registrations for other students to populate system views
  console.log('[Seed] Seeding realistic registrations for students 6551071002 -> 6551071015...');
  const sampleRegistrations = [
    {
      code: 'REG-2026-002',
      stCode: '6551071002',
      tpCode: 'DT-2026-002',
      advisor: gv('GV002'),
      council: council1.id,
      status: RegistrationStatus.QUALIFIED_DEFENSE,
      qual: true,
      proc: 8.0,
      rev: 8.5,
      subUrl: '/uploads/KLTN_6551071002_FullText.pdf',
      plag: 11.2,
      weeks: 15,
    },
    {
      code: 'REG-2026-003',
      stCode: '6551071003',
      tpCode: 'DT-2026-003',
      advisor: gv('GV001'),
      council: null,
      status: RegistrationStatus.SUBMITTED,
      qual: false,
      proc: 7.5,
      rev: null,
      subUrl: '/uploads/KLTN_6551071003_FullText.pdf',
      plag: 14.8,
      weeks: 14,
    },
    {
      code: 'REG-2026-005',
      stCode: '6551071005',
      tpCode: 'DT-2026-005',
      advisor: gv('GV007'),
      council: council2.id,
      status: RegistrationStatus.QUALIFIED_DEFENSE,
      qual: true,
      proc: 8.5,
      rev: 8.0,
      subUrl: '/uploads/KLTN_6551071005_FullText.pdf',
      plag: 8.5,
      weeks: 15,
    },
    {
      code: 'REG-2026-006',
      stCode: '6551071006',
      tpCode: 'DT-2026-006',
      advisor: gv('GV006'),
      council: null,
      status: RegistrationStatus.IN_PROGRESS,
      qual: false,
      proc: null,
      rev: null,
      subUrl: null,
      plag: null,
      weeks: 10,
    },
    {
      code: 'REG-2026-007',
      stCode: '6551071007',
      tpCode: 'DT-2026-007',
      advisor: gv('GV005'),
      council: council3.id,
      status: RegistrationStatus.DEFENDED,
      qual: true,
      proc: 8.0,
      rev: 8.5,
      subUrl: '/uploads/KLTN_6551071007_FullText.pdf',
      plag: 7.2,
      weeks: 15,
    },
    {
      code: 'REG-2026-008',
      stCode: '6551071008',
      tpCode: 'DT-2026-008',
      advisor: gv('GV008'),
      council: null,
      status: RegistrationStatus.IN_PROGRESS,
      qual: false,
      proc: null,
      rev: null,
      subUrl: null,
      plag: null,
      weeks: 8,
    },
    {
      code: 'REG-2026-009',
      stCode: '6551071009',
      tpCode: 'DT-2026-009',
      advisor: gv('GV010'),
      council: council3.id,
      status: RegistrationStatus.QUALIFIED_DEFENSE,
      qual: true,
      proc: 8.0,
      rev: 7.5,
      subUrl: '/uploads/KLTN_6551071009_FullText.pdf',
      plag: 12.0,
      weeks: 15,
    },
    {
      code: 'REG-2026-010',
      stCode: '6551071010',
      tpCode: 'DT-2026-010',
      advisor: gv('GV009'),
      council: council2.id,
      status: RegistrationStatus.QUALIFIED_DEFENSE,
      qual: true,
      proc: 8.5,
      rev: 8.5,
      subUrl: '/uploads/KLTN_6551071010_FullText.pdf',
      plag: 5.4,
      weeks: 15,
    },
    {
      code: 'REG-2026-011',
      stCode: '6551071011',
      tpCode: 'DT-2026-011',
      advisor: gv('GV012'),
      council: null,
      status: RegistrationStatus.REGISTERED,
      qual: false,
      proc: null,
      rev: null,
      subUrl: null,
      plag: null,
      weeks: 3,
    },
    {
      code: 'REG-2026-012',
      stCode: '6551071012',
      tpCode: 'DT-2026-012',
      advisor: gv('GV013'),
      council: null,
      status: RegistrationStatus.IN_PROGRESS,
      qual: false,
      proc: null,
      rev: null,
      subUrl: null,
      plag: null,
      weeks: 6,
    },
  ];

  for (const item of sampleRegistrations) {
    const stId = studentMap.get(item.stCode);
    const tpId = topicMap.get(item.tpCode);
    if (!stId || !tpId) continue;

    const reg = await prisma.registration.upsert({
      where: { studentId_semesterId: { studentId: stId, semesterId } },
      update: {
        topicId: tpId,
        advisorLecturerId: item.advisor,
        councilId: item.council,
        status: item.status,
        isQualifiedForDefense: item.qual,
        scoreProcess: item.proc,
        scoreReviewer: item.rev,
        reportSubmissionUrl: item.subUrl,
      },
      create: {
        code: item.code,
        studentId: stId,
        topicId: tpId,
        semesterId,
        advisorLecturerId: item.advisor,
        councilId: item.council,
        status: item.status,
        isQualifiedForDefense: item.qual,
        scoreProcess: item.proc,
        scoreReviewer: item.rev,
        reportSubmissionUrl: item.subUrl,
      },
    });

    // Seed progress reports
    for (let w = 1; w <= item.weeks; w++) {
      await prisma.progressReport.upsert({
        where: { registrationId_weekNumber: { registrationId: reg.id, weekNumber: w } },
        update: {
          tasksCompleted: `Hoàn thành nội dung nghiên cứu và thực nghiệm tuần ${w}.`,
          nextWeekPlan: `Triển khai các hạng mục tiếp theo cho tuần ${w + 1}.`,
          advisorFeedback: 'Tiến độ làm việc đạt yêu cầu đề ra.',
          status: ProgressStatus.APPROVED,
        },
        create: {
          registrationId: reg.id,
          weekNumber: w,
          tasksCompleted: `Hoàn thành nội dung nghiên cứu và thực nghiệm tuần ${w}.`,
          nextWeekPlan: `Triển khai các hạng mục tiếp theo cho tuần ${w + 1}.`,
          reviewerLecturerId: item.advisor,
          advisorFeedback: 'Tiến độ làm việc đạt yêu cầu đề ra.',
          status: ProgressStatus.APPROVED,
        },
      });
    }

    // Seed plagiarism nếu có
    if (item.plag) {
      await prisma.plagiarismResult.deleteMany({ where: { registrationId: reg.id } });
      await prisma.plagiarismResult.create({
        data: {
          registrationId: reg.id,
          similarityPercentage: item.plag,
          matchingDetails: { sources: ['IEEE Xplore', 'UTC2 Repository'], status: item.plag < 20 ? 'PASSED' : 'FLAGGED' },
        },
      });
    }
  }

  console.log('[Seed] Successfully seeded all Topics, Councils, Registrations, Progress Reports & Evaluation Data.');
}
