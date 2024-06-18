const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

const pathToFfmpeg = './ffmpeg/bin/ffmpeg.exe';
const pathToFfprobe = './ffmpeg/bin/ffprobe.exe';

ffmpeg.setFfmpegPath(pathToFfmpeg);
ffmpeg.setFfprobePath(pathToFfprobe);

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.use(express.static('public'));

app.post('/upload', upload.single('video'), (req, res) => {
    const filePath = req.file.path;
    const outputFilePath = `converted/${path.basename(filePath, path.extname(filePath))}.mp4`;

    ffmpeg(filePath)
        .output(outputFilePath)
        .on('end', () => {
            // Удаление исходного файла .mod после конвертации
            fs.unlinkSync(filePath);
            res.json({ filename: path.basename(outputFilePath) });
        })
        .on('error', (err) => {
            console.error(err);
            res.status(500).send('Ошибка конвертации видео.');
        })
        .run();
});

app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'converted', filename);
    res.download(filePath, (err) => {
        if (err) {
            console.error(err);
        }
        // Удаление файла .mp4 после загрузки
        fs.unlinkSync(filePath);
    });
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
