const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.static('public')); // Phục vụ file giao diện trong thư mục 'public'

let sensorData = []; // Mảng lưu trữ dữ liệu tạm thời

// API nhận dữ liệu từ ESP8266
app.post('/api/data', (req, res) => {
    const nhietDo = req.body.nhietDo;
    const doAm = req.body.doAm;

    const newData = {
        nhietDo: nhietDo,
        doAm: doAm,
        thoiGian: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
    };

    sensorData.push(newData);
    console.log("Đã nhận dữ liệu mới:", newData);
    res.status(200).send("Server đã nhận thành công!");
});

// API gửi dữ liệu cho Trang web
app.get('/api/data', (req, res) => {
    res.json(sensorData);
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});