# telegram-proxy-webhook
This is repository for unlocked Telegram proxy bypass in Vietnam gov. Work fine in boths proxy bot and webhook

# Hướng dẫn sử dụng Cloudflare Worker để xử lý Webhook & Proxy cho Telegram

## 🧩 Giới thiệu

Repo này bao gồm 2 file:

1. `webhook-telegram.js`: Dùng để chuyển tiếp webhook từ Telegram sang n8n (hoặc hệ thống backend khác).
2. `proxy-telegram-bot.js`: Dùng để tạo proxy qua Cloudflare để gọi API Telegram khi bị chặn tại Việt Nam.

---

## 📁 1. webhook-telegram.js – Worker chuyển tiếp webhook

### ✅ Công dụng:

Chuyển tiếp webhook từ Telegram bot về đường dẫn webhook thực tế (ví dụ n8n) dựa trên URL mà bạn cấu hình.

### 📌 Hướng dẫn sử dụng:

1. Mở Cloudflare dashboard → Workers → Tạo một Worker mới.
2. Dán toàn bộ nội dung file `webhook-telegram.js` vào.
3. Chỉnh sửa các dòng sau để phù hợp với webhook thật của bạn:

```js
const webhookMap = {
  '/webhook-bot1': 'https://n8n.aivnd.com/webhook/<id-bot1>/webhook',
  '/webhook-bot2': 'https://n8n.ainvd.com/webhook/<id-bot2>/webhook'
};
```

4. Lưu lại và deploy.
5. Trên Telegram BotFather, bạn gán Webhook trỏ về Worker, ví dụ:

```
https://ten-worker.cloudflare.workers.dev/webhook-bot1
```

---

## 🌐 2. proxy-telegram-bot.js – Worker làm proxy gọi API Telegram

## 💡 Lưu ý quan trọng:
Ngay tại link của worker bạn phải remove bỏ dấu flash "/" ở cuối URL.
Ví dụ: https://proxy-telegram-bot.lequocthai.workers.dev  ===> OK work
       https://proxy-telegram-bot.lequocthai.workers.dev/  ===> NO OK not work

### ✅ Công dụng:

Cho phép bạn gọi API Telegram từ nơi bị chặn (VN) bằng cách "bọc" API telegram qua domain của Cloudflare Worker.

### 📌 Hướng dẫn sử dụng:

1. Tạo một Worker khác trong Cloudflare.
2. Dán toàn bộ nội dung file `proxy-telegram-bot.js`.
3. Deploy và dùng URL của Worker để thay cho API Telegram.

Ví dụ:

* Thay vì gọi: `https://api.telegram.org/bot<token>/sendMessage`
* Hãy gọi: `https://ten-worker.cloudflare.workers.dev/bot<token>/sendMessage`

---

## 💡 Mẹo:

* Nếu bạn có nhiều bot → có thể tạo nhiều đường dẫn trong `webhookMap`.
* Nếu bạn dùng `n8n` hoặc `Dify` platforms hoặc server tự host Telegram webhook → kết hợp 2 file trên để đảm bảo không bị chặn & bảo mật hơn.
* Worker hoạt động tốt trên cả domain của Cloudflare là `.workers.dev` hoặc custom domain của bạn ví dụ `.aivnd.com`.

---
