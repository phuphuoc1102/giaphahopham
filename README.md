# Gia Phả OS

Gia Phả OS là ứng dụng nguồn mở dành cho việc tạo và quản lý cây gia phả,
phù hợp cho các dòng họ, gia đình muốn lưu trữ thông tin cội nguồn một
cách trực quan và tự chủ. Mọi dữ liệu được đặt trong tài khoản Supabase
của bạn; phần mềm chỉ cung cấp giao diện và logic, không thu thập gì từ
phía tác giả.

## Chạy trên máy cá nhân

Yêu cầu: [Node.js](https://nodejs.org) và [Bun](https://bun.sh/) đã cài.

1. Clone repository:

```bash
git clone https://github.com/phuphuoc1102/ancestor-tree.git
cd ancestor-tree
```

2. Copy file môi trường và chỉnh lại `SUPABASE` của bạn:

```bash
cp .env.example .env.local
echo "NEXT_PUBLIC_SUPABASE_URL=\"https://your-project.supabase.co\"" >> .env.local
echo "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=\"your-anon-key\"" >> .env.local
```

3. Cài phụ thuộc và chạy dev server:

```bash
bun install
bun run dev
```

4. Mở trình duyệt đến `http://localhost:3000`.

Sau khi khởi động, bạn có thể đăng ký tài khoản để thử cập nhật dữ liệu.
Xem dữ liệu vẫn hoạt động với người dùng chưa đăng nhập.

## Mục đích dự án

Phát triển cho gia phả họ Phạm (An Long/An Thiện, Núi Thành, Đà Nẵng) và
thuần Việt, nhưng toàn bộ mã nguồn được mở để ai cũng tự triển khai trên
mạng riêng của mình. Chúng tôi hướng tới một giải pháp đơn giản, nhẹ,
và tự lưu trữ để người dùng hoàn toàn kiểm soát dữ liệu nhạy cảm của
họ.

---

Giấy phép MIT — xem phần dưới cùng của file gốc để biết chi tiết.
## Phân quyền người dùng (User Roles)

Hệ thống có 3 cấp độ phân quyền để dễ dàng quản lý ai được phép cập nhật gia phả:

1. **Admin (Quản trị viên):** Có toàn quyền đối với hệ thống.
2. **Editor (Biên soạn):** Cho phép thêm, sửa, xóa thông tin hồ sơ và các mối quan hệ.
3. **Member (Thành viên):** Chỉ có thể xem sơ đồ gia phả và các thống kê trực quan.

## Đóng góp (Contributing)

Dự án này là mã nguồn mở, hoan nghênh mọi đóng góp, báo cáo lỗi (issues) và yêu cầu sửa đổi (pull requests) để phát triển ứng dụng ngày càng tốt hơn.

## Tuyên bố từ chối trách nhiệm & Quyền riêng tư

> **Dự án này chỉ cung cấp mã nguồn (source code). Không có bất kỳ dữ liệu cá nhân nào được thu thập hay lưu trữ bởi tác giả.**

- **Tự lưu trữ hoàn toàn (Self-hosted):** Khi bạn triển khai ứng dụng, toàn bộ dữ liệu gia phả (tên, ngày sinh, quan hệ, thông tin liên hệ...) được lưu trữ **trong tài khoản Supabase của chính bạn**. Tác giả dự án không có quyền truy cập vào database đó.

- **Không thu thập dữ liệu:** Không có analytics, không có tracking, không có telemetry, không có bất kỳ hình thức thu thập thông tin người dùng nào được tích hợp trong mã nguồn.

- **Bạn kiểm soát dữ liệu của bạn:** Mọi dữ liệu gia đình, thông tin thành viên đều nằm hoàn toàn trong cơ sở dữ liệu Supabase mà bạn tạo và quản lý. Bạn có thể xóa, xuất hoặc di chuyển dữ liệu bất cứ lúc nào.

- **Demo công khai:** Trang demo tại `giapha-os.homielab.com` sử dụng dữ liệu mẫu hư cấu, không chứa thông tin của người thật. Không nên nhập thông tin cá nhân thật vào trang demo.

## Giấy phép (License)

Dự án được phân phối dưới giấy phép MIT.
