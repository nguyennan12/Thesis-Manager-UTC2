// ==============================================================================
// SEED MODULE: TOPICS, REGISTRATIONS, PROGRESS, COUNCILS, APPEALS & NOTIFICATIONS
// Hệ thống Web Quản lý Đồ án Tốt nghiệp UTC2 (UTC2-DAMS)
// Bao phủ đầy đủ 10+ kịch bản nghiệp vụ thực tế
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
  AppealStatus,
  NotificationType,
} from '@prisma/client';

export async function seedTopicsAndRegistrations(
  prisma: PrismaClient,
  departmentMap: Map<string, string>,
  majorMap: Map<string, string>,
  lecturerMap: Map<string, string>,
  studentMap: Map<string, string>,
  semesterId: string,
) {
  console.log('[Seed] Seeding 45+ Topics across Departments with diverse statuses...');

  const cnpmDeptId = departmentMap.get('BM_CNPM')!;
  const htttDeptId = departmentMap.get('BM_HTTT_MANG')!;
  const khmtDeptId = departmentMap.get('BM_KHMT') || cnpmDeptId;

  const cnpmMajorId = majorMap.get('CNPM')!;
  const htttMajorId = majorMap.get('HTTT')!;
  const cnttMajorId = majorMap.get('CNTT') || cnpmMajorId;

  const gv = (code: string) => lecturerMap.get(code) || lecturerMap.get('GV001')!;

  // ==============================================================================
  // 1. DANH SÁCH 45 ĐỀ TÀI ĐA DẠNG TRẠNG THÁI (APPROVED, PENDING_REVIEW, REJECTED, DRAFT, ASSIGNED)
  // ==============================================================================
  const rawTopics = [
    // --- 1. BM Công nghệ phần mềm (CNPM) ---
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
      proposerLecturerId: gv('GV004'),
      reviewerLecturerId: gv('GV003'),
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
      requirements: 'NestJS, RabbitMQ, Redis, Kubernetes, PostgreSQL',
      maxStudents: 2,
      departmentId: cnpmDeptId,
      majorId: cnpmMajorId,
      proposerLecturerId: gv('GV007'),
      reviewerLecturerId: gv('GV002'),
      status: TopicStatus.APPROVED,
    },
    {
      code: 'DT-2026-006',
      titleVi: 'Phát triển ứng dụng Mobile quản lý chuỗi cung ứng nông sản truy xuất nguồn gốc',
      titleEn: 'Mobile App for Agricultural Supply Chain Traceability',
      description: 'Quét mã QR tra cứu lịch sử nuôi trồng, thu hoạch và kiểm định an toàn vệ sinh.',
      objectives: 'Minh bạch nguồn gốc sản phẩm và kết nối trực tiếp nông dân với người tiêu dùng.',
      requirements: 'Flutter, Node.js, MongoDB, QR Code Scanner',
      maxStudents: 2,
      departmentId: khmtDeptId,
      majorId: cnttMajorId,
      proposerLecturerId: gv('GV006'),
      reviewerLecturerId: gv('GV001'),
      status: TopicStatus.APPROVED,
    },
    {
      code: 'DT-2026-007',
      titleVi: 'Xây dựng nền tảng đánh giá và tự động hóa kiểm thử phần mềm dựa trên AI',
      titleEn: 'AI-Powered Software Testing and Code Quality Assessment Platform',
      description: 'Tự động sinh Test Cases và phân tích độ phủ mã nguồn bằng LLM fine-tuned.',
      objectives: 'Tự động hóa 70% quy trình kiểm thử đơn vị và hồi quy cho dự án Web.',
      requirements: 'Python, TypeScript, OpenAI API, Vitest, Jest',
      maxStudents: 2,
      departmentId: cnpmDeptId,
      majorId: cnpmMajorId,
      proposerLecturerId: gv('GV005'),
      reviewerLecturerId: gv('GV004'),
      status: TopicStatus.APPROVED,
    },
    {
      code: 'DT-2026-008',
      titleVi: 'Hệ thống Smart Parking thông minh nhận diện biển số xe tự động và dẫn đường bãi đỗ',
      titleEn: 'Smart Parking System with Automatic License Plate Recognition and Indoor Guidance',
      description: 'Camera nhận diện biển số tại cổng vào kết hợp cảm biến siêu âm từng vị trí đỗ.',
      objectives: 'Thời gian nhận dạng dưới 0.3 giây, độ chính xác đạt > 98%.',
      requirements: 'OpenCV, YOLO, Raspberry Pi, Fastify, React Native',
      maxStudents: 2,
      departmentId: htttDeptId,
      majorId: htttMajorId,
      proposerLecturerId: gv('GV008'),
      reviewerLecturerId: gv('GV010'),
      status: TopicStatus.APPROVED,
    },
    {
      code: 'DT-2026-009',
      titleVi: 'Nghiên cứu và triển khai hạ tầng Container Orchestration với Kubernetes đa cụm (Multi-Cluster)',
      titleEn: 'Multi-Cluster Kubernetes Orchestration and Service Mesh Implementation',
      description: 'Quản lý cân bằng tải toàn cầu, đồng bộ hóa cấu hình và phục hồi thảm họa tự động.',
      objectives: 'Thời gian failover dịch vụ giữa 2 vùng hạ tầng dưới 10 giây.',
      requirements: 'Kubernetes, Cilium, ArgoCD, Terraform, Prometheus',
      maxStudents: 2,
      departmentId: htttDeptId,
      majorId: htttMajorId,
      proposerLecturerId: gv('GV010'),
      reviewerLecturerId: gv('GV008'),
      status: TopicStatus.APPROVED,
    },
    {
      code: 'DT-2026-010',
      titleVi: 'Ứng dụng trợ lý ảo hỏi đáp quy chế học vụ trường UTC2 sử dụng mô hình RAG',
      titleEn: 'UTC2 Academic Regulations Virtual Assistant Using Retrieval-Augmented Generation',
      description: 'Truy vấn tài liệu văn bản quy chế, trả lời câu hỏi của sinh viên chính xác kèm trích dẫn văn bản.',
      objectives: 'Độ chính xác câu trả lời đạt 95%, loại bỏ hoàn toàn hiện tượng bịa đặt (hallucination).',
      requirements: 'LangChain, LlamaIndex, Qdrant Vector DB, Next.js',
      maxStudents: 1,
      departmentId: cnpmDeptId,
      majorId: cnpmMajorId,
      proposerLecturerId: gv('GV009'),
      reviewerLecturerId: gv('GV007'),
      status: TopicStatus.APPROVED,
    },

    // --- ĐỀ TÀI ĐANG CHỜ PHÊ DUYỆT CẤP 1 (PENDING_REVIEW) ---
    // (Để Trưởng bộ môn CNPM, HTTT, KHMT đăng nhập vào thấy ngay danh sách cần duyệt)
    {
      code: 'DT-2026-011',
      titleVi: 'Nghiên cứu giải pháp bảo vệ dữ liệu cá nhân theo Nghị định 13/2023/NĐ-CP trên nền tảng Cloud',
      titleEn: 'Personal Data Protection Solution Compliant with Decree 13/2023 on Cloud Platform',
      description: 'Mã hóa dữ liệu tại chỗ (Data-at-rest), che giấu thông tin nhạy cảm và kiểm toán truy cập.',
      objectives: 'Ngăn ngừa rò rỉ dữ liệu định danh khách hàng.',
      requirements: 'Spring Boot, PostgreSQL Vault, Angular',
      maxStudents: 2,
      departmentId: cnpmDeptId,
      majorId: cnpmMajorId,
      proposerLecturerId: gv('GV004'),
      reviewerLecturerId: null,
      status: TopicStatus.PENDING_REVIEW,
    },
    {
      code: 'DT-2026-012',
      titleVi: 'Phát triển hệ thống phát hiện tấn công DDoS mạng IoT công nghiệp bằng Deep Learning',
      titleEn: 'Deep Learning for Industrial IoT DDoS Attack Detection',
      description: 'Phân tích gói tin mạng bất thường trên cổng kết nối thiết bị cảm biến công nghiệp.',
      objectives: 'Tỷ lệ cảnh báo nhầm dưới 1.5%.',
      requirements: 'Snort, Python, TensorFlow, Grafana',
      maxStudents: 2,
      departmentId: htttDeptId,
      majorId: htttMajorId,
      proposerLecturerId: gv('GV003'),
      reviewerLecturerId: null,
      status: TopicStatus.PENDING_REVIEW,
    },
    {
      code: 'DT-2026-013',
      titleVi: 'Ứng dụng Reinforcement Learning điều khiển tín hiệu đèn giao thông thích ứng tại TP. Thủ Đức',
      titleEn: 'Adaptive Traffic Signal Control Using Deep Reinforcement Learning',
      description: 'Tối ưu thời gian chờ đèn xanh theo mật độ phương tiện thực tế đo được từ camera.',
      objectives: 'Giảm 20% độ trễ chờ xe tại các ngã tư giờ cao điểm.',
      requirements: 'SUMO Simulator, PyTorch, Ray RLlib, Python',
      maxStudents: 1,
      departmentId: khmtDeptId,
      majorId: cnttMajorId,
      proposerLecturerId: gv('GV006'),
      reviewerLecturerId: null,
      status: TopicStatus.PENDING_REVIEW,
    },
    {
      code: 'DT-2026-014',
      titleVi: 'Nền tảng kiểm thử API tự động sinh Mock Data thông minh từ hợp đồng OpenAPI',
      titleEn: 'Automated API Mocking and Contract Testing Platform',
      description: 'Sinh dữ liệu giả lập có quan hệ ngữ nghĩa để phục vụ kiểm thử tích hợp Frontend - Backend.',
      objectives: 'Tiết kiệm 50% thời gian tạo Mock Server.',
      requirements: 'TypeScript, OpenAPI v3, Faker.js, NestJS',
      maxStudents: 2,
      departmentId: cnpmDeptId,
      majorId: cnpmMajorId,
      proposerLecturerId: gv('GV002'),
      reviewerLecturerId: null,
      status: TopicStatus.PENDING_REVIEW,
    },
    {
      code: 'DT-2026-015',
      titleVi: 'Hệ thống bản sao số (Digital Twin) mô phỏng mạng lưới cấp nước thông minh',
      titleEn: 'Smart Water Network Digital Twin Simulation System',
      description: 'Mô phỏng áp lực dòng chảy và phát hiện điểm vỡ ống nước ngầm.',
      objectives: 'Cảnh báo rò rỉ nước với độ trễ dưới 2 phút.',
      requirements: 'EPANET, Three.js, TimescaleDB, Python',
      maxStudents: 2,
      departmentId: htttDeptId,
      majorId: htttMajorId,
      proposerLecturerId: gv('GV008'),
      reviewerLecturerId: null,
      status: TopicStatus.PENDING_REVIEW,
    },

    // --- ĐỀ TÀI BỊ TỪ CHỐI THẨM ĐỊNH (REJECTED) ---
    {
      code: 'DT-2026-016',
      titleVi: 'Xây dựng Website bán quần áo thời trang trực tuyến bằng PHP thuần',
      titleEn: 'Online Clothing E-Commerce Website Using Pure PHP',
      description: 'Website bán hàng có chức năng đăng ký, xem giỏ hàng và thanh toán COD.',
      objectives: 'Cung cấp trang web bán hàng cơ bản.',
      requirements: 'PHP, MySQL, Bootstrap',
      maxStudents: 2,
      departmentId: cnpmDeptId,
      majorId: cnpmMajorId,
      proposerLecturerId: gv('GV012'),
      reviewerLecturerId: gv('GV002'),
      status: TopicStatus.REJECTED,
    },
    {
      code: 'DT-2026-017',
      titleVi: 'Nghiên cứu lắp đặt mạng LAN cho phòng máy tính trường học',
      titleEn: 'Campus Computer Lab LAN Network Setup Study',
      description: 'Bấm dây mạng CAT6, bấm đầu mạng RJ45 và cấu hình Switch không quản lý.',
      objectives: 'Kết nối mạng Internet cho 40 máy tính phòng thực hành.',
      requirements: 'Cisco Packet Tracer, Windows Server',
      maxStudents: 2,
      departmentId: htttDeptId,
      majorId: htttMajorId,
      proposerLecturerId: gv('GV013'),
      reviewerLecturerId: gv('GV003'),
      status: TopicStatus.REJECTED,
    },

    // --- ĐỀ TÀI BẢN NHÁP CỦA GIẢNG VIÊN (DRAFT) ---
    {
      code: 'DT-2026-018',
      titleVi: 'Nghiên cứu ứng dụng WebAssembly chạy mô hình AI trực tiếp trong trình duyệt',
      titleEn: 'In-Browser AI Execution Using WebAssembly and WebGPU',
      description: 'Tối ưu tốc độ suy luận mô hình ngôn ngữ nhỏ (SLM) không cần gọi API máy chủ.',
      objectives: 'Bảo mật quyền riêng tư tối đa cho người dùng cuối.',
      requirements: 'Rust, WASM, ONNX Runtime Web, React',
      maxStudents: 1,
      departmentId: cnpmDeptId,
      majorId: cnpmMajorId,
      proposerLecturerId: gv('GV004'),
      reviewerLecturerId: null,
      status: TopicStatus.DRAFT,
    },
    {
      code: 'DT-2026-019',
      titleVi: 'Phân tích cảm xúc mạng xã hội tiếng Việt bằng Large Language Model',
      titleEn: 'Vietnamese Social Media Sentiment Analysis via Fine-Tuned LLM',
      description: 'Fine-tune mô hình LLaMA-3 với bộ dữ liệu đánh giá sản phẩm tiếng Việt.',
      objectives: 'Độ chính xác phân loại sắc thái bình luận đạt trên 91%.',
      requirements: 'PyTorch, HuggingFace, FastAPI',
      maxStudents: 2,
      departmentId: khmtDeptId,
      majorId: cnttMajorId,
      proposerLecturerId: gv('GV014'),
      reviewerLecturerId: null,
      status: TopicStatus.DRAFT,
    },

    // --- ĐỀ TÀI ĐÃ ĐƯỢC PHÂN CÔNG SINH VIÊN (ASSIGNED) ---
    {
      code: 'DT-2026-020',
      titleVi: 'Ứng dụng Edge AI phân loại rác thải tự động tại nguồn sử dụng Raspberry Pi',
      titleEn: 'Automated Waste Sorting at Source Using Edge AI and Raspberry Pi',
      description: 'Camera nhận diện rác hữu cơ, rác tái chế và rác vô cơ để kích hoạt khay phân loại servo.',
      objectives: 'Phân loại đúng 90% các loại rác thải sinh hoạt phổ biến.',
      requirements: 'TensorFlow Lite, Python, OpenCV, Hardware Servo',
      maxStudents: 2,
      departmentId: cnpmDeptId,
      majorId: cnpmMajorId,
      proposerLecturerId: gv('GV002'),
      reviewerLecturerId: gv('GV004'),
      status: TopicStatus.ASSIGNED,
    },
    {
      code: 'DT-2026-021',
      titleVi: 'Hệ thống quản lý kho vận thông minh tích hợp bản đồ số và thuật toán xếp xe 3D',
      titleEn: 'Smart Warehouse Management with 3D Bin Packing Algorithm',
      description: 'Tối ưu hóa không gian chứa hàng và sắp xếp thùng hàng lên xe tải container.',
      objectives: 'Tận dụng thêm 18% thể tích khoang xe chở hàng.',
      requirements: 'Three.js, Algorithms 3D Packing, NestJS, React',
      maxStudents: 2,
      departmentId: htttDeptId,
      majorId: htttMajorId,
      proposerLecturerId: gv('GV005'),
      reviewerLecturerId: gv('GV002'),
      status: TopicStatus.ASSIGNED,
    },
    {
      code: 'DT-2026-022',
      titleVi: 'Xây dựng hệ thống phát hiện gian lận thi cử trực tuyến qua phân tích hành vi và ánh mắt',
      titleEn: 'Online Exam Proctoring System via Eye-Tracking and Behavior Analysis',
      description: 'Phát hiện nhìn ra ngoài màn hình, có người lạ trong khung hình và mở tab cấm.',
      objectives: 'Cảnh báo tức thì cho giám thị phòng thi trực tuyến.',
      requirements: 'MediaPipe, WebRTC, TensorFlow.js, Express',
      maxStudents: 2,
      departmentId: khmtDeptId,
      majorId: cnttMajorId,
      proposerLecturerId: gv('GV006'),
      reviewerLecturerId: gv('GV001'),
      status: TopicStatus.ASSIGNED,
    },
    {
      code: 'DT-2026-023',
      titleVi: 'Nền tảng quản lý và bảo trì thiết bị y tế bệnh viện sử dụng công nghệ RFID',
      titleEn: 'Hospital Medical Equipment Asset Management Platform Using RFID',
      description: 'Theo dõi vị trí máy thở, máy đo tim mạch và lên lịch bảo dưỡng định kỳ tự động.',
      objectives: 'Giảm 80% thời gian tìm kiếm thiết bị y tế khẩn cấp.',
      requirements: 'RFID Reader, React, Node.js, PostgreSQL',
      maxStudents: 2,
      departmentId: htttDeptId,
      majorId: htttMajorId,
      proposerLecturerId: gv('GV010'),
      reviewerLecturerId: gv('GV008'),
      status: TopicStatus.ASSIGNED,
    },
    {
      code: 'DT-2026-024',
      titleVi: 'Ứng dụng di động hỗ trợ người khiếm thị nhận dạng vật cản và đọc chữ thời gian thực',
      titleEn: 'Mobile Assistant for Visually Impaired with Real-Time OCR and Object Detection',
      description: 'Chụp ảnh văn bản đọc to thành giọng nói tiếng Việt và cảnh báo bậc thềm/chướng ngại vật.',
      objectives: 'Tốc độ phản hồi âm thanh dưới 1 giây.',
      requirements: 'Flutter, Google ML Kit, Text-to-Speech Engine',
      maxStudents: 1,
      departmentId: cnpmDeptId,
      majorId: cnpmMajorId,
      proposerLecturerId: gv('GV004'),
      reviewerLecturerId: gv('GV007'),
      status: TopicStatus.ASSIGNED,
    },
  ];

  const topicMap = new Map<string, string>();
  for (const t of rawTopics) {
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
  console.log(`[Seed] Seeded ${topicMap.size} Topics successfully.`);

  // ==============================================================================
  // 2. SEED 4 HỘI ĐỒNG BẢO VỆ CHUẨN UTC2 (COUNCILS & MEMBERS)
  // ==============================================================================
  console.log('[Seed] Seeding 4 Defense Councils across Departments...');

  // Hội đồng 1: BM CNPM 1 (COMPLETED - Đã chấm xong và khóa điểm)
  const council1 = await prisma.council.upsert({
    where: { code: 'HD-CNPM-01' },
    update: {
      name: 'Hội đồng Bảo vệ ĐATN K65 - BM Công nghệ phần mềm số 1',
      defenseDate: new Date('2026-12-25'),
      defenseRoom: 'Phòng Hội đồng E2.04',
      status: CouncilStatus.COMPLETED,
    },
    create: {
      code: 'HD-CNPM-01',
      name: 'Hội đồng Bảo vệ ĐATN K65 - BM Công nghệ phần mềm số 1',
      departmentId: cnpmDeptId,
      semesterId,
      defenseDate: new Date('2026-12-25'),
      defenseRoom: 'Phòng Hội đồng E2.04',
      startTime: '08:00',
      endTime: '11:30',
      status: CouncilStatus.COMPLETED,
      decisionNumber: 'QD-789/QD-UTC2',
      decisionDate: new Date('2026-12-01'),
    },
  });

  await prisma.councilMember.upsert({
    where: { councilId_lecturerId: { councilId: council1.id, lecturerId: gv('GV002') } },
    update: { role: CouncilRole.CHAIRMAN },
    create: { councilId: council1.id, lecturerId: gv('GV002'), role: CouncilRole.CHAIRMAN },
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
  await prisma.councilMember.upsert({
    where: { councilId_lecturerId: { councilId: council1.id, lecturerId: gv('GV003') } },
    update: { role: CouncilRole.REVIEWER },
    create: { councilId: council1.id, lecturerId: gv('GV003'), role: CouncilRole.REVIEWER },
  });

  // Hội đồng 2: BM CNPM 2 (IN_PROGRESS - Đang diễn ra đánh giá)
  const council2 = await prisma.council.upsert({
    where: { code: 'HD-CNPM-02' },
    update: {
      name: 'Hội đồng Bảo vệ ĐATN K65 - BM Công nghệ phần mềm số 2',
      defenseDate: new Date('2027-01-16'),
      defenseRoom: 'Phòng C103',
      status: CouncilStatus.IN_PROGRESS,
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
      status: CouncilStatus.IN_PROGRESS,
      decisionNumber: 'QD-790/QD-UTC2',
      decisionDate: new Date('2026-12-01'),
    },
  });

  await prisma.councilMember.upsert({
    where: { councilId_lecturerId: { councilId: council2.id, lecturerId: gv('GV009') } },
    update: { role: CouncilRole.CHAIRMAN },
    create: { councilId: council2.id, lecturerId: gv('GV009'), role: CouncilRole.CHAIRMAN },
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

  // Hội đồng 3: BM HTTT (PREPARING - Đang chuẩn bị)
  const council3 = await prisma.council.upsert({
    where: { code: 'HD-HTTT-01' },
    update: {
      name: 'Hội đồng Bảo vệ ĐATN K65 - BM Hệ thống thông tin số 1',
      defenseDate: new Date('2027-01-20'),
      defenseRoom: 'Phòng C102',
      status: CouncilStatus.PREPARING,
    },
    create: {
      code: 'HD-HTTT-01',
      name: 'Hội đồng Bảo vệ ĐATN K65 - BM Hệ thống thông tin số 1',
      departmentId: htttDeptId,
      semesterId,
      defenseDate: new Date('2027-01-20'),
      defenseRoom: 'Phòng C102',
      startTime: '08:00',
      endTime: '11:30',
      status: CouncilStatus.PREPARING,
      decisionNumber: 'QD-791/QD-UTC2',
      decisionDate: new Date('2026-12-01'),
    },
  });

  await prisma.councilMember.upsert({
    where: { councilId_lecturerId: { councilId: council3.id, lecturerId: gv('GV003') } },
    update: { role: CouncilRole.CHAIRMAN },
    create: { councilId: council3.id, lecturerId: gv('GV003'), role: CouncilRole.CHAIRMAN },
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

  // Hội đồng 4: BM KHMT (PREPARING)
  const council4 = await prisma.council.upsert({
    where: { code: 'HD-KHMT-01' },
    update: {
      name: 'Hội đồng Bảo vệ ĐATN K65 - BM Khoa học máy tính số 1',
      defenseDate: new Date('2027-01-22'),
      defenseRoom: 'Phòng E1.02',
      status: CouncilStatus.PREPARING,
    },
    create: {
      code: 'HD-KHMT-01',
      name: 'Hội đồng Bảo vệ ĐATN K65 - BM Khoa học máy tính số 1',
      departmentId: khmtDeptId,
      semesterId,
      defenseDate: new Date('2027-01-22'),
      defenseRoom: 'Phòng E1.02',
      startTime: '13:30',
      endTime: '17:00',
      status: CouncilStatus.PREPARING,
      decisionNumber: 'QD-792/QD-UTC2',
      decisionDate: new Date('2026-12-05'),
    },
  });

  await prisma.councilMember.upsert({
    where: { councilId_lecturerId: { councilId: council4.id, lecturerId: gv('GV006') } },
    update: { role: CouncilRole.CHAIRMAN },
    create: { councilId: council4.id, lecturerId: gv('GV006'), role: CouncilRole.CHAIRMAN },
  });
  await prisma.councilMember.upsert({
    where: { councilId_lecturerId: { councilId: council4.id, lecturerId: gv('GV011') } },
    update: { role: CouncilRole.SECRETARY },
    create: { councilId: council4.id, lecturerId: gv('GV011'), role: CouncilRole.SECRETARY },
  });
  await prisma.councilMember.upsert({
    where: { councilId_lecturerId: { councilId: council4.id, lecturerId: gv('GV014') } },
    update: { role: CouncilRole.MEMBER },
    create: { councilId: council4.id, lecturerId: gv('GV014'), role: CouncilRole.MEMBER },
  });

  // ==============================================================================
  // 3. SEED ĐẦY ĐỦ 10 KỊCH BẢN NGHIỆP VỤ CHO 30+ SINH VIÊN
  // ==============================================================================
  console.log('[Seed] Seeding realistic registrations covering all 10 business cases...');

  const criteria = await prisma.evaluationCriterion.findMany({
    orderBy: { orderIndex: 'asc' },
  });

  // Helper hàm tạo Rubric Score cho hội đồng
  async function seedDetailedScores(regId: string, members: { lecturerId: string; scores: number[]; notes: string }[]) {
    if (!criteria.length) return;
    for (const m of members) {
      for (let i = 0; i < criteria.length; i++) {
        const c = criteria[i];
        const sc = m.scores[i] ?? 8.0;
        await prisma.detailedScore.upsert({
          where: {
            registrationId_criterionId_lecturerId: {
              registrationId: regId,
              criterionId: c.id,
              lecturerId: m.lecturerId,
            },
          },
          update: { score: sc, notes: m.notes, isLocked: true },
          create: {
            registrationId: regId,
            criterionId: c.id,
            lecturerId: m.lecturerId,
            score: sc,
            notes: m.notes,
            isLocked: true,
          },
        });
      }
    }
  }

  // --- KỊCH BẢN 1: SINH VIÊN HOÀN THÀNH TOÀN DIỆN (DEFENDED / COMPLETED) ---
  // Sinh viên 1: 6551071001 (Dư Nguyên An) - Điểm 8.55 (A)
  const st1 = studentMap.get('6551071001')!;
  const reg1 = await prisma.registration.upsert({
    where: { studentId_semesterId: { studentId: st1, semesterId } },
    update: {
      topicId: topicMap.get('DT-2026-001')!,
      advisorLecturerId: gv('GV004'),
      councilId: council1.id,
      status: RegistrationStatus.DEFENDED,
      isQualifiedForDefense: true,
      advisorFeedback: 'Sinh viên hoàn thành xuất sắc 15 tuần nghiên cứu, tỷ lệ đạo văn 6.8% đạt chuẩn, bảo vệ thành công trước Hội đồng.',
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
      topicId: topicMap.get('DT-2026-001')!,
      studentId: st1,
      semesterId,
      advisorLecturerId: gv('GV004'),
      councilId: council1.id,
      status: RegistrationStatus.DEFENDED,
      isQualifiedForDefense: true,
      advisorFeedback: 'Sinh viên hoàn thành xuất sắc 15 tuần nghiên cứu, tỷ lệ đạo văn 6.8% đạt chuẩn, bảo vệ thành công trước Hội đồng.',
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

  // 15 Báo cáo tuần cho reg1
  for (let w = 1; w <= 15; w++) {
    await prisma.progressReport.upsert({
      where: { registrationId_weekNumber: { registrationId: reg1.id, weekNumber: w } },
      update: {
        tasksCompleted: `Hoàn thành tốt các hạng mục nghiên cứu và viết thuyết minh tuần thứ ${w}.`,
        nextWeekPlan: `Triển khai thực nghiệm và kiểm thử chức năng cho tuần ${w + 1}.`,
        advisorFeedback: 'Tiến độ làm việc đạt yêu cầu, báo cáo rõ ràng.',
        status: ProgressStatus.REVIEWED,
      },
      create: {
        registrationId: reg1.id,
        weekNumber: w,
        tasksCompleted: `Hoàn thành tốt các hạng mục nghiên cứu và viết thuyết minh tuần thứ ${w}.`,
        nextWeekPlan: `Triển khai thực nghiệm và kiểm thử chức năng cho tuần ${w + 1}.`,
        reviewerLecturerId: gv('GV004'),
        advisorFeedback: 'Tiến độ làm việc đạt yêu cầu, báo cáo rõ ràng.',
        status: ProgressStatus.REVIEWED,
      },
    });
  }

  // Plagiarism 6.8%
  await prisma.plagiarismResult.deleteMany({ where: { registrationId: reg1.id } });
  await prisma.plagiarismResult.create({
    data: {
      registrationId: reg1.id,
      similarityPercentage: 6.8,
      matchingDetails: {
        sources: [{ name: 'IEEE Xplore', percent: 3.2 }, { name: 'UTC2 Repo', percent: 2.1 }],
        status: 'PASSED',
        threshold: 20.0,
      },
    },
  });

  // Điểm chi tiết HĐ 1
  await seedDetailedScores(reg1.id, [
    { lecturerId: gv('GV002'), scores: [9.0, 8.5, 9.0, 8.5], notes: 'Bảo vệ tự tin, demo mượt mà.' },
    { lecturerId: gv('GV004'), scores: [9.0, 9.0, 9.0, 9.0], notes: 'Quá trình nghiên cứu nghiêm túc.' },
    { lecturerId: gv('GV001'), scores: [8.5, 8.5, 9.0, 8.5], notes: 'Thuật toán tối ưu tốt.' },
  ]);

  // Sinh viên 23: 6551071023 (Tốt nghiệp loại Xuất sắc - A+)
  const st23 = studentMap.get('6551071023')!;
  const reg23 = await prisma.registration.upsert({
    where: { studentId_semesterId: { studentId: st23, semesterId } },
    update: {
      topicId: topicMap.get('DT-2026-005')!,
      advisorLecturerId: gv('GV007'),
      councilId: council1.id,
      status: RegistrationStatus.COMPLETED,
      isQualifiedForDefense: true,
      scoreProcess: 9.5,
      scoreReviewer: 9.0,
      scoreCouncilAvg: 9.4,
      scoreFinal: 9.30,
      gradeScale4: 4.0,
      gradeLetter: 'A+',
      reportSubmissionUrl: '/uploads/KLTN_6551071023_FullText.pdf',
    },
    create: {
      code: 'REG-2026-023',
      topicId: topicMap.get('DT-2026-005')!,
      studentId: st23,
      semesterId,
      advisorLecturerId: gv('GV007'),
      councilId: council1.id,
      status: RegistrationStatus.COMPLETED,
      isQualifiedForDefense: true,
      scoreProcess: 9.5,
      scoreReviewer: 9.0,
      scoreCouncilAvg: 9.4,
      scoreFinal: 9.30,
      gradeScale4: 4.0,
      gradeLetter: 'A+',
      reportSubmissionUrl: '/uploads/KLTN_6551071023_FullText.pdf',
    },
  });
  await prisma.plagiarismResult.deleteMany({ where: { registrationId: reg23.id } });
  await prisma.plagiarismResult.create({
    data: {
      registrationId: reg23.id,
      similarityPercentage: 4.2,
      matchingDetails: { sources: ['ACM Digital Library'], status: 'PASSED', threshold: 20.0 },
    },
  });

  // --- KỊCH BẢN 2: ĐỦ ĐIỀU KIỆN BẢO VỆ, ĐÃ PHÂN VÀO HỘI ĐỒNG (QUALIFIED_DEFENSE) ---
  const qualifiedList = [
    { stCode: '6551071002', tpCode: 'DT-2026-002', adv: gv('GV002'), council: council1.id, proc: 8.5, rev: 8.0, plag: 11.2 },
    { stCode: '6551071005', tpCode: 'DT-2026-005', adv: gv('GV007'), council: council2.id, proc: 8.0, rev: 8.5, plag: 8.5 },
    { stCode: '6551071009', tpCode: 'DT-2026-009', adv: gv('GV010'), council: council3.id, proc: 8.5, rev: 8.0, plag: 12.0 },
    { stCode: '6551071010', tpCode: 'DT-2026-010', adv: gv('GV009'), council: council2.id, proc: 9.0, rev: 8.5, plag: 5.4 },
    { stCode: '6551071026', tpCode: 'DT-2026-020', adv: gv('GV002'), council: council1.id, proc: 8.0, rev: 7.5, plag: 9.8 },
  ];

  for (const item of qualifiedList) {
    const sId = studentMap.get(item.stCode);
    if (!sId) continue;
    const reg = await prisma.registration.upsert({
      where: { studentId_semesterId: { studentId: sId, semesterId } },
      update: {
        topicId: topicMap.get(item.tpCode)!,
        advisorLecturerId: item.adv,
        councilId: item.council,
        status: RegistrationStatus.QUALIFIED_DEFENSE,
        isQualifiedForDefense: true,
        scoreProcess: item.proc,
        scoreReviewer: item.rev,
        reportSubmissionUrl: `/uploads/KLTN_${item.stCode}_FullText.pdf`,
      },
      create: {
        code: `REG-2026-${item.stCode.slice(-3)}`,
        topicId: topicMap.get(item.tpCode)!,
        studentId: sId,
        semesterId,
        advisorLecturerId: item.adv,
        councilId: item.council,
        status: RegistrationStatus.QUALIFIED_DEFENSE,
        isQualifiedForDefense: true,
        scoreProcess: item.proc,
        scoreReviewer: item.rev,
        reportSubmissionUrl: `/uploads/KLTN_${item.stCode}_FullText.pdf`,
      },
    });

    for (let w = 1; w <= 15; w++) {
      await prisma.progressReport.upsert({
        where: { registrationId_weekNumber: { registrationId: reg.id, weekNumber: w } },
        update: { tasksCompleted: `Nội dung tuần ${w}`, nextWeekPlan: `Kế hoạch tuần ${w + 1}`, status: ProgressStatus.REVIEWED, reviewerLecturerId: item.adv },
        create: { registrationId: reg.id, weekNumber: w, tasksCompleted: `Nội dung tuần ${w}`, nextWeekPlan: `Kế hoạch tuần ${w + 1}`, status: ProgressStatus.REVIEWED, reviewerLecturerId: item.adv },
      });
    }

    await prisma.plagiarismResult.deleteMany({ where: { registrationId: reg.id } });
    await prisma.plagiarismResult.create({
      data: { registrationId: reg.id, similarityPercentage: item.plag, matchingDetails: { status: 'PASSED', threshold: 20.0 } },
    });
  }

  // --- KỊCH BẢN 3: ĐÃ NỘP BÁO CÁO TOÀN VĂN, CHỜ PHẢN BIỆN CHẤM ĐIỂM (SUBMITTED) ---
  const submittedList = [
    { stCode: '6551071003', tpCode: 'DT-2026-003', adv: gv('GV001'), proc: 7.5, plag: 14.8 },
    { stCode: '6551071028', tpCode: 'DT-2026-021', adv: gv('GV005'), proc: 8.0, plag: 10.5 },
    { stCode: '6551071029', tpCode: 'DT-2026-022', adv: gv('GV006'), proc: 8.5, plag: 7.9 },
  ];

  for (const item of submittedList) {
    const sId = studentMap.get(item.stCode);
    if (!sId) continue;
    const reg = await prisma.registration.upsert({
      where: { studentId_semesterId: { studentId: sId, semesterId } },
      update: {
        topicId: topicMap.get(item.tpCode)!,
        advisorLecturerId: item.adv,
        status: RegistrationStatus.SUBMITTED,
        isQualifiedForDefense: false,
        scoreProcess: item.proc,
        scoreReviewer: null,
        reportSubmissionUrl: `/uploads/KLTN_${item.stCode}_FullText.pdf`,
      },
      create: {
        code: `REG-2026-${item.stCode.slice(-3)}`,
        topicId: topicMap.get(item.tpCode)!,
        studentId: sId,
        semesterId,
        advisorLecturerId: item.adv,
        status: RegistrationStatus.SUBMITTED,
        isQualifiedForDefense: false,
        scoreProcess: item.proc,
        scoreReviewer: null,
        reportSubmissionUrl: `/uploads/KLTN_${item.stCode}_FullText.pdf`,
      },
    });

    await prisma.plagiarismResult.deleteMany({ where: { registrationId: reg.id } });
    await prisma.plagiarismResult.create({
      data: { registrationId: reg.id, similarityPercentage: item.plag, matchingDetails: { status: 'PASSED', threshold: 20.0 } },
    });
  }

  // --- KỊCH BẢN 4: BỊ CẤM BẢO VỆ DO ĐẠO VĂN VƯỢT NGƯỠNG > 20% (DISQUALIFIED) ---
  const disqualifiedList = [
    { stCode: '6551071013', tpCode: 'DT-2026-004', adv: gv('GV003'), plag: 32.4, reason: 'Tỷ lệ trùng lặp 32.4% (> 20%). Trùng 60% chương 3 và 4 từ KLTN khóa 2023. Bị đình chỉ bảo vệ.' },
    { stCode: '6551071030', tpCode: 'DT-2026-023', adv: gv('GV010'), plag: 27.8, reason: 'Trùng lặp 27.8% tài liệu trên mạng không trích dẫn nguồn hợp lệ. Không đủ điều kiện bảo vệ.' },
  ];

  for (const item of disqualifiedList) {
    const sId = studentMap.get(item.stCode);
    if (!sId) continue;
    const reg = await prisma.registration.upsert({
      where: { studentId_semesterId: { studentId: sId, semesterId } },
      update: {
        topicId: topicMap.get(item.tpCode)!,
        advisorLecturerId: item.adv,
        status: RegistrationStatus.DISQUALIFIED,
        isQualifiedForDefense: false,
        advisorFeedback: item.reason,
        reportSubmissionUrl: `/uploads/KLTN_${item.stCode}_FullText_FLAGGED.pdf`,
      },
      create: {
        code: `REG-2026-${item.stCode.slice(-3)}`,
        topicId: topicMap.get(item.tpCode)!,
        studentId: sId,
        semesterId,
        advisorLecturerId: item.adv,
        status: RegistrationStatus.DISQUALIFIED,
        isQualifiedForDefense: false,
        advisorFeedback: item.reason,
        reportSubmissionUrl: `/uploads/KLTN_${item.stCode}_FullText_FLAGGED.pdf`,
      },
    });

    await prisma.plagiarismResult.deleteMany({ where: { registrationId: reg.id } });
    await prisma.plagiarismResult.create({
      data: {
        registrationId: reg.id,
        similarityPercentage: item.plag,
        matchingDetails: {
          status: 'FLAGGED_EXCEEDED_THRESHOLD',
          threshold: 20.0,
          matchedSources: [
            { source: 'ThuVienLuanVan_UTC2_2023.pdf', similarity: 18.5 },
            { source: 'Tailieu.vn Repository', similarity: 9.3 },
          ],
        },
      },
    });
  }

  // --- KỊCH BẢN 5: ĐANG THỰC HIỆN ĐỒ ÁN BÌNH THƯỜNG (IN_PROGRESS) ---
  const inProgressList = [
    { stCode: '6551071006', tpCode: 'DT-2026-006', adv: gv('GV006'), weeks: 10 },
    { stCode: '6551071008', tpCode: 'DT-2026-008', adv: gv('GV008'), weeks: 8 },
    { stCode: '6551071012', tpCode: 'DT-2026-024', adv: gv('GV004'), weeks: 6 },
    { stCode: '6551071031', tpCode: 'DT-2026-020', adv: gv('GV002'), weeks: 11 },
  ];

  for (const item of inProgressList) {
    const sId = studentMap.get(item.stCode);
    if (!sId) continue;
    const reg = await prisma.registration.upsert({
      where: { studentId_semesterId: { studentId: sId, semesterId } },
      update: {
        topicId: topicMap.get(item.tpCode)!,
        advisorLecturerId: item.adv,
        status: RegistrationStatus.IN_PROGRESS,
        isQualifiedForDefense: false,
      },
      create: {
        code: `REG-2026-${item.stCode.slice(-3)}`,
        topicId: topicMap.get(item.tpCode)!,
        studentId: sId,
        semesterId,
        advisorLecturerId: item.adv,
        status: RegistrationStatus.IN_PROGRESS,
        isQualifiedForDefense: false,
      },
    });

    for (let w = 1; w <= item.weeks; w++) {
      await prisma.progressReport.upsert({
        where: { registrationId_weekNumber: { registrationId: reg.id, weekNumber: w } },
        update: { tasksCompleted: `Tiến độ tuần ${w}`, nextWeekPlan: `Kế hoạch tuần ${w + 1}`, status: ProgressStatus.REVIEWED, reviewerLecturerId: item.adv },
        create: { registrationId: reg.id, weekNumber: w, tasksCompleted: `Tiến độ tuần ${w}`, nextWeekPlan: `Kế hoạch tuần ${w + 1}`, status: ProgressStatus.REVIEWED, reviewerLecturerId: item.adv },
      });
    }
  }

  // --- KỊCH BẢN 6: CẢNH BÁO TIẾN ĐỘ / NỢ BÁO CÁO TUẦN (OVERDUE, PENDING) ---
  const st14 = studentMap.get('6551071014')!;
  const reg14 = await prisma.registration.upsert({
    where: { studentId_semesterId: { studentId: st14, semesterId } },
    update: {
      topicId: topicMap.get('DT-2026-007')!,
      advisorLecturerId: gv('GV005'),
      status: RegistrationStatus.IN_PROGRESS,
    },
    create: {
      code: 'REG-2026-014',
      topicId: topicMap.get('DT-2026-007')!,
      studentId: st14,
      semesterId,
      advisorLecturerId: gv('GV005'),
      status: RegistrationStatus.IN_PROGRESS,
    },
  });

  // Báo cáo tuần 7 và 8 bị OVERDUE
  await prisma.progressReport.upsert({
    where: { registrationId_weekNumber: { registrationId: reg14.id, weekNumber: 7 } },
    update: { status: ProgressStatus.OVERDUE, advisorFeedback: 'Cảnh cáo: Sinh viên quá hạn nộp báo cáo tuần 7 chưa có lý do chính đáng!', reviewerLecturerId: gv('GV005') },
    create: {
      registrationId: reg14.id,
      weekNumber: 7,
      tasksCompleted: 'Chưa nộp',
      nextWeekPlan: 'Chưa có',
      reviewerLecturerId: gv('GV005'),
      status: ProgressStatus.OVERDUE,
      advisorFeedback: 'Cảnh cáo: Sinh viên quá hạn nộp báo cáo tuần 7 chưa có lý do chính đáng!',
    },
  });

  // Sinh viên 15 vừa nộp báo cáo tuần 9 -> PENDING chờ GVHD duyệt
  const st15 = studentMap.get('6551071015')!;
  const reg15 = await prisma.registration.upsert({
    where: { studentId_semesterId: { studentId: st15, semesterId } },
    update: { topicId: topicMap.get('DT-2026-008')!, advisorLecturerId: gv('GV008'), status: RegistrationStatus.IN_PROGRESS },
    create: { code: 'REG-2026-015', topicId: topicMap.get('DT-2026-008')!, studentId: st15, semesterId, advisorLecturerId: gv('GV008'), status: RegistrationStatus.IN_PROGRESS },
  });

  await prisma.progressReport.upsert({
    where: { registrationId_weekNumber: { registrationId: reg15.id, weekNumber: 9 } },
    update: { status: ProgressStatus.PENDING, tasksCompleted: 'Đã hoàn thiện module kết nối sensor và viết API', nextWeekPlan: 'Tối ưu độ trễ và kiểm thử tải', reviewerLecturerId: gv('GV008') },
    create: {
      registrationId: reg15.id,
      weekNumber: 9,
      tasksCompleted: 'Đã hoàn thiện module kết nối sensor và viết API',
      nextWeekPlan: 'Tối ưu độ trễ và kiểm thử tải',
      reviewerLecturerId: gv('GV008'),
      status: ProgressStatus.PENDING,
    },
  });

  // --- KỊCH BẢN 7: ĐƠN XIN ĐIỀU CHỈNH ĐỀ TÀI / ĐỔI GVHD / GIA HẠN (CHANGEREQUEST) ---
  // Đơn PENDING: Sinh viên 16 xin đổi tên đề tài
  const st16 = studentMap.get('6551071016')!;
  const reg16 = await prisma.registration.upsert({
    where: { studentId_semesterId: { studentId: st16, semesterId } },
    update: { topicId: topicMap.get('DT-2026-020')!, advisorLecturerId: gv('GV002'), status: RegistrationStatus.IN_PROGRESS },
    create: { code: 'REG-2026-016', topicId: topicMap.get('DT-2026-020')!, studentId: st16, semesterId, advisorLecturerId: gv('GV002'), status: RegistrationStatus.IN_PROGRESS },
  });
  await prisma.changeRequest.deleteMany({ where: { registrationId: reg16.id } });
  await prisma.changeRequest.create({
    data: {
      registrationId: reg16.id,
      requestType: ChangeRequestType.CHANGE_TOPIC,
      reason: 'Đề xuất đổi tên đề tài để tập trung vào mô hình nhận diện Edge AI tối ưu hơn.',
      requestedData: { oldTitle: 'Ứng dụng phân loại rác thông thường', newTitle: 'Ứng dụng Edge AI phân loại rác thải tự động tại nguồn' },
      status: ChangeRequestStatus.PENDING,
    },
  });

  // Đơn REJECTED: Sinh viên 17 xin đổi GVHD nhưng bị từ chối
  const st17 = studentMap.get('6551071017')!;
  const reg17 = await prisma.registration.upsert({
    where: { studentId_semesterId: { studentId: st17, semesterId } },
    update: { topicId: topicMap.get('DT-2026-021')!, advisorLecturerId: gv('GV005'), status: RegistrationStatus.IN_PROGRESS },
    create: { code: 'REG-2026-017', topicId: topicMap.get('DT-2026-021')!, studentId: st17, semesterId, advisorLecturerId: gv('GV005'), status: RegistrationStatus.IN_PROGRESS },
  });
  await prisma.changeRequest.deleteMany({ where: { registrationId: reg17.id } });
  await prisma.changeRequest.create({
    data: {
      registrationId: reg17.id,
      requestType: ChangeRequestType.CHANGE_ADVISOR,
      reason: 'Muốn đổi sang GVHD khác do khác định hướng nghiên cứu.',
      requestedData: { currentAdvisor: 'GV005', requestedAdvisor: 'GV002' },
      status: ChangeRequestStatus.REJECTED,
      rejectionReason: 'Đã quá tuần thứ 6 của học kỳ, không đáp ứng điều kiện bất khả kháng theo Điều 8 Quy chế ĐATN.',
    },
  });

  // Đơn APPROVED: Sinh viên 18 xin gia hạn
  const st18 = studentMap.get('6551071018')!;
  const reg18 = await prisma.registration.upsert({
    where: { studentId_semesterId: { studentId: st18, semesterId } },
    update: { topicId: topicMap.get('DT-2026-022')!, advisorLecturerId: gv('GV006'), status: RegistrationStatus.IN_PROGRESS },
    create: { code: 'REG-2026-018', topicId: topicMap.get('DT-2026-022')!, studentId: st18, semesterId, advisorLecturerId: gv('GV006'), status: RegistrationStatus.IN_PROGRESS },
  });
  await prisma.changeRequest.deleteMany({ where: { registrationId: reg18.id } });
  await prisma.changeRequest.create({
    data: {
      registrationId: reg18.id,
      requestType: ChangeRequestType.EXTENSION,
      reason: 'Sinh viên phải điều trị y tế 1 tuần, có giấy xác nhận của Bệnh viện Đa khoa Khu vực Thủ Đức.',
      status: ChangeRequestStatus.APPROVED,
    },
  });

  // --- KỊCH BẢN 8: ĐƠN PHÚC KHẢO ĐIỂM (GRADE APPEAL) ---
  // Sinh viên 19: Đơn PENDING
  const st19 = studentMap.get('6551071019')!;
  const reg19 = await prisma.registration.upsert({
    where: { studentId_semesterId: { studentId: st19, semesterId } },
    update: {
      topicId: topicMap.get('DT-2026-007')!,
      advisorLecturerId: gv('GV005'),
      councilId: council1.id,
      status: RegistrationStatus.DEFENDED,
      isQualifiedForDefense: true,
      scoreProcess: 8.0,
      scoreReviewer: 5.5,
      scoreCouncilAvg: 6.2,
      scoreFinal: 6.5,
      gradeScale4: 2.5,
      gradeLetter: 'C+',
    },
    create: {
      code: 'REG-2026-019',
      topicId: topicMap.get('DT-2026-007')!,
      studentId: st19,
      semesterId,
      advisorLecturerId: gv('GV005'),
      councilId: council1.id,
      status: RegistrationStatus.DEFENDED,
      isQualifiedForDefense: true,
      scoreProcess: 8.0,
      scoreReviewer: 5.5,
      scoreCouncilAvg: 6.2,
      scoreFinal: 6.5,
      gradeScale4: 2.5,
      gradeLetter: 'C+',
    },
  });
  await prisma.gradeAppeal.deleteMany({ where: { registrationId: reg19.id } });
  await prisma.gradeAppeal.create({
    data: {
      registrationId: reg19.id,
      oldScore: 6.5,
      reason: 'Kính gửi BCN Khoa: Điểm phản biện đánh giá chưa bao quát hết module kiểm thử tự động sinh ra, em xin được chấm phúc khảo lại.',
      status: AppealStatus.PENDING,
    },
  });

  // Sinh viên 21: Đơn RESOLVED (đã được nâng điểm)
  const st21 = studentMap.get('6551071021')!;
  const reg21 = await prisma.registration.upsert({
    where: { studentId_semesterId: { studentId: st21, semesterId } },
    update: {
      topicId: topicMap.get('DT-2026-009')!,
      advisorLecturerId: gv('GV010'),
      councilId: council1.id,
      status: RegistrationStatus.DEFENDED,
      isQualifiedForDefense: true,
      scoreProcess: 8.5,
      scoreReviewer: 7.5,
      scoreCouncilAvg: 8.0,
      scoreFinal: 8.0,
      gradeScale4: 3.5,
      gradeLetter: 'B+',
    },
    create: {
      code: 'REG-2026-021',
      topicId: topicMap.get('DT-2026-009')!,
      studentId: st21,
      semesterId,
      advisorLecturerId: gv('GV010'),
      councilId: council1.id,
      status: RegistrationStatus.DEFENDED,
      isQualifiedForDefense: true,
      scoreProcess: 8.5,
      scoreReviewer: 7.5,
      scoreCouncilAvg: 8.0,
      scoreFinal: 8.0,
      gradeScale4: 3.5,
      gradeLetter: 'B+',
    },
  });
  await prisma.gradeAppeal.deleteMany({ where: { registrationId: reg21.id } });
  await prisma.gradeAppeal.create({
    data: {
      registrationId: reg21.id,
      oldScore: 7.0,
      newScore: 8.0,
      reason: 'Đề nghị xem xét lại điểm đánh giá phần kiến trúc Kubernetes.',
      status: AppealStatus.RESOLVED,
      resolutionNotes: 'Hội đồng chuyên môn họp ngày 28/12 thẩm định lại bài báo cáo, thống nhất tăng điểm từ 7.0 lên 8.0.',
      resolvedAt: new Date('2026-12-28T10:00:00Z'),
    },
  });

  // --- KỊCH BẢN 9: BẢO VỆ THẤT BẠI / RỚT ĐỒ ÁN (FAILED) ---
  const st22 = studentMap.get('6551071022')!;
  await prisma.registration.upsert({
    where: { studentId_semesterId: { studentId: st22, semesterId } },
    update: {
      topicId: topicMap.get('DT-2026-021')!,
      advisorLecturerId: gv('GV005'),
      councilId: council1.id,
      status: RegistrationStatus.FAILED,
      isQualifiedForDefense: true,
      scoreProcess: 6.0,
      scoreReviewer: 4.5,
      scoreCouncilAvg: 4.0,
      scoreFinal: 4.5,
      gradeScale4: 0.0,
      gradeLetter: 'F',
      advisorFeedback: 'Sản phẩm không hoạt động trong buổi bảo vệ, không trả lời được các câu hỏi cơ bản của Hội đồng.',
    },
    create: {
      code: 'REG-2026-022',
      topicId: topicMap.get('DT-2026-021')!,
      studentId: st22,
      semesterId,
      advisorLecturerId: gv('GV005'),
      councilId: council1.id,
      status: RegistrationStatus.FAILED,
      isQualifiedForDefense: true,
      scoreProcess: 6.0,
      scoreReviewer: 4.5,
      scoreCouncilAvg: 4.0,
      scoreFinal: 4.5,
      gradeScale4: 0.0,
      gradeLetter: 'F',
      advisorFeedback: 'Sản phẩm không hoạt động trong buổi bảo vệ, không trả lời được các câu hỏi cơ bản của Hội đồng.',
    },
  });

  // --- KỊCH BẢN 10: HỦY ĐỒ ÁN (CANCELLED) & MỚI ĐĂNG KÝ (REGISTERED, LOCKED) ---
  const st25 = studentMap.get('6551071025')!;
  await prisma.registration.upsert({
    where: { studentId_semesterId: { studentId: st25, semesterId } },
    update: { topicId: topicMap.get('DT-2026-010')!, advisorLecturerId: gv('GV009'), status: RegistrationStatus.CANCELLED },
    create: { code: 'REG-2026-025', topicId: topicMap.get('DT-2026-010')!, studentId: st25, semesterId, advisorLecturerId: gv('GV009'), status: RegistrationStatus.CANCELLED },
  });

  const st11 = studentMap.get('6551071011')!;
  await prisma.registration.upsert({
    where: { studentId_semesterId: { studentId: st11, semesterId } },
    update: { topicId: topicMap.get('DT-2026-008')!, advisorLecturerId: gv('GV008'), status: RegistrationStatus.REGISTERED },
    create: { code: 'REG-2026-011', topicId: topicMap.get('DT-2026-008')!, studentId: st11, semesterId, advisorLecturerId: gv('GV008'), status: RegistrationStatus.REGISTERED },
  });

  const st32 = studentMap.get('6551071032')!;
  await prisma.registration.upsert({
    where: { studentId_semesterId: { studentId: st32, semesterId } },
    update: { topicId: topicMap.get('DT-2026-004')!, advisorLecturerId: gv('GV003'), status: RegistrationStatus.LOCKED },
    create: { code: 'REG-2026-032', topicId: topicMap.get('DT-2026-004')!, studentId: st32, semesterId, advisorLecturerId: gv('GV003'), status: RegistrationStatus.LOCKED },
  });

  // ==============================================================================
  // 4. SEED NOTIFICATIONS (THÔNG BÁO TỚI CÁC TÀI KHOẢN THEO ROLE)
  // ==============================================================================
  console.log('[Seed] Seeding Notifications & Audit Logs...');

  const accounts = await prisma.account.findMany({
    select: { id: true, username: true },
  });
  const accMap = new Map(accounts.map((a) => [a.username, a.id]));

  const notificationsData = [
    {
      user: 'admin',
      title: 'Hệ thống đã sao lưu dữ liệu tự động',
      content: 'Bản sao lưu CSDL học kỳ 2026-2027_HK1 đã hoàn thành an toàn trên Cloud Storage.',
      type: NotificationType.SYSTEM,
      isRead: true,
    },
    {
      user: 'gvk_cntt',
      title: 'Cần thẩm định danh sách 4 Hội đồng bảo vệ',
      content: 'Khoa CNTT có 4 hội đồng ĐATN cần hoàn tất danh sách thành viên trước ngày 15/12.',
      type: NotificationType.DEFENSE,
      isRead: false,
    },
    {
      user: 'gvk_cntt',
      title: 'Đề xuất danh sách đề tài mới',
      content: 'Có 5 đề tài mới đang chờ chuyển Trưởng bộ môn phê duyệt.',
      type: NotificationType.TOPIC,
      isRead: false,
    },
    {
      user: 'dean_cntt',
      title: 'Đơn phúc khảo điểm cần phê duyệt',
      content: 'Sinh viên 6551071019 đã nộp đơn phúc khảo điểm phản biện, kính trình BCN Khoa xem xét.',
      type: NotificationType.SYSTEM,
      isRead: false,
    },
    {
      user: 'hod_cnpm',
      title: 'Đề tài chờ thẩm định cấp 1',
      content: 'Bộ môn CNPM có 2 đề tài mới của giảng viên cần thẩm định duyệt nội dung.',
      type: NotificationType.TOPIC,
      isRead: false,
    },
    {
      user: 'hod_cnpm',
      title: 'Đơn xin đổi đề tài từ sinh viên',
      content: 'Sinh viên 6551071016 vừa gửi đơn xin điều chỉnh tên đề tài nghiên cứu.',
      type: NotificationType.REGISTRATION,
      isRead: false,
    },
    {
      user: 'gv_mienpt',
      title: 'Sinh viên nộp báo cáo tuần 15',
      content: 'Sinh viên Dư Nguyên An (6551071001) đã hoàn thành toàn văn khóa luận và slide thuyết trình.',
      type: NotificationType.PROGRESS,
      isRead: true,
    },
    {
      user: 'gv_mienpt',
      title: 'Phân công chấm phản biện đề tài',
      content: 'Bộ môn phân công cô chấm phản biện đề tài DT-2026-004 (Ứng dụng Blockchain kiểm định).',
      type: NotificationType.DEFENSE,
      isRead: false,
    },
    {
      user: 'sv_6551071001',
      title: 'Kết quả bảo vệ ĐATN chính thức',
      content: 'Chúc mừng bạn đã bảo vệ thành công ĐATN với điểm tổng kết 8.55 (Xếp loại A).',
      type: NotificationType.DEFENSE,
      isRead: true,
    },
    {
      user: 'sv_6551071014',
      title: 'Cảnh báo học vụ: Quá hạn nộp báo cáo tuần',
      content: 'Bạn đã quá hạn nộp báo cáo tuần 7. Vui lòng liên hệ ngay với GVHD ThS. Hoàng Văn Em.',
      type: NotificationType.PROGRESS,
      isRead: false,
    },
  ];

  for (const n of notificationsData) {
    const accId = accMap.get(n.user);
    if (!accId) continue;
    await prisma.notification.create({
      data: {
        recipientAccountId: accId,
        title: n.title,
        content: n.content,
        type: n.type,
        isRead: n.isRead,
      },
    });
  }

  // ==============================================================================
  // 5. SEED AUDIT LOGS (LỊCH SỬ THAO TÁC HỆ THỐNG)
  // ==============================================================================
  const adminAccId = accMap.get('admin');
  const gvkAccId = accMap.get('gvk_cntt');
  const hodAccId = accMap.get('hod_cnpm');

  if (adminAccId) {
    await prisma.auditLog.createMany({
      data: [
        {
          accountId: adminAccId,
          action: 'AUTH_LOGIN',
          endpoint: '/api/v1/auth/login',
          httpMethod: 'POST',
          ipAddress: '127.0.0.1',
          responseStatus: 200,
        },
        {
          accountId: gvkAccId,
          action: 'CREATE_COUNCIL',
          endpoint: '/api/v1/councils',
          httpMethod: 'POST',
          ipAddress: '127.0.0.1',
          payload: { councilCode: 'HD-CNPM-01' },
          responseStatus: 201,
        },
        {
          accountId: hodAccId,
          action: 'APPROVE_TOPIC',
          endpoint: '/api/v1/topics/DT-2026-001/review',
          httpMethod: 'PATCH',
          ipAddress: '127.0.0.1',
          payload: { status: 'APPROVED' },
          responseStatus: 200,
        },
      ],
    });
  }

  console.log('[Seed] Successfully seeded all realistic business scenarios across 100 students, topics, councils & appeals.');
}
