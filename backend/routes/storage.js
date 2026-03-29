const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { pool } = require('../server');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, PDF, DOC, and DOCX files are allowed.'));
    }
  }
});

// Upload file
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { bucket, path: filePath } = req.body;
    const fileName = req.file.filename;

    // Store file info in database (optional)
    await pool.query(
      'INSERT INTO logs (message, user_id, entity, source) VALUES ($1, $2, $3, $4)',
      [`File uploaded: ${fileName}`, req.user?.userId, 'file', 'storage']
    );

    res.json({
      message: 'File uploaded successfully',
      fileName,
      originalName: req.file.originalname,
      size: req.file.size,
      path: `${bucket}/${filePath}/${fileName}`
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Get public file URL
router.get('/public/:bucket/:path(*)', (req, res) => {
  try {
    const { bucket, path: filePath } = req.params;
    const fullPath = path.join('./uploads', filePath);

    if (fs.existsSync(fullPath)) {
      res.sendFile(path.resolve(fullPath));
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ error: 'Failed to get file' });
  }
});

// Delete file
router.delete('/remove', async (req, res) => {
  try {
    const { bucket, paths } = req.body;
    
    for (const filePath of paths) {
      const fullPath = path.join('./uploads', filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    res.json({ message: 'Files deleted successfully' });
  } catch (error) {
    console.error('Delete files error:', error);
    res.status(500).json({ error: 'Failed to delete files' });
  }
});

module.exports = router;
