# Log Hasil Pengujian Unit Testing

Berikut adalah dokumentasi eksekusi unit test di dalam container backend Laravel.

## 1. Eksekusi Per Unit Test (Individual)

### A. Gemini Sentiment Service Test
#### Command yang Dijalankan:
```bash
docker compose exec backend php artisan test --filter GeminiSentimentServiceTest
```
#### Bukti Eksekusi (Screenshot):
![Screenshot Hasil GeminiSentimentServiceTest](../docs/screenshots/test/screenshot-sentiment-test.png)

---

### B. WhatsApp Service Test
#### Command yang Dijalankan:
```bash
docker compose exec backend php artisan test --filter WhatsAppServiceTest
```
#### Bukti Eksekusi (Screenshot):
![Screenshot Hasil WhatsAppServiceTest](../docs/screenshots/test/screenshot-whatsapp-test.png)

---

### C. Gemini Validation Service Test
#### Command yang Dijalankan:
```bash
docker compose exec backend php artisan test --filter GeminiValidationServiceTest
```
#### Bukti Eksekusi (Screenshot):
![Screenshot Hasil GeminiValidationServiceTest](../docs/screenshots/test/screenshot-validation-test.png.png)

---

## 2. Eksekusi Unit Test Suite (9 Test)

### Command yang Dijalankan:
```bash
docker compose exec backend php artisan test --testsuite=Unit
```

### Bukti Eksekusi (Screenshot):
![Screenshot Hasil Unit Test Suite](../docs/screenshots/test/screenshot-unit-suite.png)

---

## 3. Eksekusi Seluruh Test (Unit + Feature - 48 Test)

### Command yang Dijalankan:
```bash
docker compose exec backend php artisan test
```

### Bukti Eksekusi (Screenshot):
![Screenshot Hasil Seluruh Test](../docs/screenshots/test/screenshot-all-test.png)
![Screenshot Hasil Seluruh Test](../docs/screenshots/test/screenshot-all-test2.png)
