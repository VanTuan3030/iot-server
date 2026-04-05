const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// 1. KẾT NỐI MONGODB ATLAS
// Link kết nối (đã chèn sẵn mật khẩu và tên database là iot_database)
const MONGO_URI = "mongodb+srv://tuanvan3030_db_user:y50ShCvNJ5pwxMMN@cluster0.k5fd89k.mongodb.net/iot_database?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI)
    .then(() => console.log("Đã kết nối MongoDB Cloud thành công!"))
    .catch(err => console.error("Lỗi kết nối MongoDB:", err));

// 2. TẠO KHUNG LƯU TRỮ DỮ LIỆU (SCHEMA)
const dataSchema = new mongoose.Schema({
    nhietDo: Number,
    doAm: Number,
    thoiGian: String
});

// Tạo một Model tên là SensorData để thao tác với Database
const SensorData = mongoose.model('SensorData', dataSchema);

// 3. API NHẬN DỮ LIỆU TỪ ESP8266 VÀ LƯU VÀO MONGODB
app.post('/api/data', async (req, res) => {
    try {
        const newData = new SensorData({
            nhietDo: req.body.nhietDo,
            doAm: req.body.doAm,
            thoiGian: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
        });

        await newData.save(); // Lệnh này sẽ lưu thẳng dữ liệu lên Đám mây
        
        console.log("Đã lưu vào Database:", newData);
        res.status(200).send("Server đã nhận và lưu thành công!");
    } catch (error) {
        console.error("Lỗi khi lưu dữ liệu:", error);
        res.status(500).send("Lỗi server");
    }
});

// 4. API GỬI DỮ LIỆU TỪ MONGODB CHO TRANG WEB/APP ANDROID
app.get('/api/data', async (req, res) => {
    try {
        // Lấy dữ liệu từ MongoDB, sắp xếp theo thời gian mới nhất (id giảm dần)
        // Mình cài đặt lấy 50 dòng mới nhất để web không bị giật lag nếu dữ liệu quá nhiều
        const data = await SensorData.find().sort({_id: -1}).limit(50);
        
        res.json(data);
    } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
        res.status(500).send("Lỗi server");
    }
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
