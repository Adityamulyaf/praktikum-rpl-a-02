import { useState, useEffect, useRef } from 'react';
import './ValidationAI.css';

// Preset Menu Results for Simulated AI Detection
const PRESET_MENUS = [
  {
    name: 'Menu A: Nasi & Ayam Panggang',
    foodTags: ['Nasi Putih', 'Fillet Ayam Panggang', 'Cah Wortel & Buncis', 'Susu Kotak UHT', 'Potongan Melon'],
    calories: 640,
    protein: 25,
    carbs: 82,
    fat: 14,
    complianceText: 'Memenuhi 100% standar gizi program MBG.',
    summary: 'Menu memenuhi standar kecukupan nutrisi program MBG dengan gizi makro lengkap dan serat seimbang.'
  },
  {
    name: 'Menu B: Nasi Merah & Ikan Kembung',
    foodTags: ['Nasi Merah', 'Ikan Kembung Goreng', 'Sayur Sop Bening', 'Susu Kotak UHT', 'Buah Pisang'],
    calories: 590,
    protein: 22,
    carbs: 75,
    fat: 12,
    complianceText: 'Memenuhi 100% standar gizi program MBG.',
    summary: 'Menu makanan kaya akan protein hewani, omega-3, dan karbohidrat kompleks dari nasi merah.'
  },
  {
    name: 'Menu C: Nasi & Tumis Daging Sapi',
    foodTags: ['Nasi Putih', 'Tumis Daging Sapi Lada Hitam', 'Sayur Bayam', 'Susu Kotak UHT', 'Irisan Pepaya'],
    calories: 670,
    protein: 28,
    carbs: 85,
    fat: 15,
    complianceText: 'Memenuhi 100% standar gizi program MBG.',
    summary: 'Menu gizi lengkap dengan kandungan zat besi tinggi dari daging sapi segar serta zat antioksidan dari bayam.'
  }
];

export default function ValidationAI() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCameraSimulated, setIsCameraSimulated] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);

  // Initialize with some seed history records
  const [history, setHistory] = useState([
    {
      id: 1,
      time: 'Hari ini, 12:15',
      image: null,
      menuName: 'Nasi Putih, Fillet Ayam Panggang, Sayur Buncis',
      calories: 640,
      status: 'Tervalidasi'
    },
    {
      id: 2,
      time: 'Kemarin, 11:58',
      image: null,
      menuName: 'Nasi Merah, Ikan Kembung, Sop Bening, Pisang',
      calories: 590,
      status: 'Tervalidasi'
    }
  ]);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Stop camera tracks on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // Open WebRTC Camera Stream
  const handleOpenCamera = async () => {
    setCameraError(null);
    setCapturedImage(null);
    setValidationResult(null);
    setIsCameraSimulated(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
      });
      setIsCameraOpen(true);
      setCameraStream(stream);

      // Bind stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setCameraError('Gagal mengakses kamera. Pastikan izin kamera telah diberikan atau gunakan opsi unggah foto.');
    }
  };

  // Open Simulated Camera (bypass hardware and black feed issues)
  const handleOpenSimulatedCamera = () => {
    setCameraError(null);
    setCapturedImage(null);
    setValidationResult(null);
    setIsCameraOpen(true);
    setIsCameraSimulated(true);

    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  // Close Camera
  const handleCloseCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }
    setIsCameraOpen(false);
    setCameraStream(null);
  };

  // Capture current frame from Video stream
  const handleCapture = () => {
    if (isCameraSimulated) {
      // In simulation mode, we draw the mock plate to the canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext('2d');
        canvas.width = 640;
        canvas.height = 480;

        // Draw background
        context.fillStyle = '#F8F7F5';
        context.fillRect(0, 0, 640, 480);

        // Draw outer circle for plate
        context.fillStyle = '#FFFFFF';
        context.strokeStyle = '#E5E3DF';
        context.lineWidth = 10;
        context.beginPath();
        context.arc(320, 240, 200, 0, 2 * Math.PI);
        context.fill();
        context.stroke();

        // Draw food elements
        // Nasi
        context.fillStyle = '#F0EEEB';
        context.beginPath();
        context.arc(260, 200, 70, 0, 2 * Math.PI);
        context.fill();
        context.fillStyle = '#1A1A18';
        context.font = 'bold 20px sans-serif';
        context.fillText('Nasi Putih', 210, 205);

        // Ayam
        context.fillStyle = '#D1B06C';
        context.beginPath();
        context.arc(380, 200, 60, 0, 2 * Math.PI);
        context.fill();
        context.fillStyle = '#1A1A18';
        context.fillText('Ayam Panggang', 310, 205);

        // Sayur
        context.fillStyle = '#E8F5E9';
        context.beginPath();
        context.arc(320, 310, 55, 0, 2 * Math.PI);
        context.fill();
        context.fillStyle = '#2E7D32';
        context.fillText('Sayur Buncis', 260, 315);

        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        setIsCameraOpen(false);
        runValidationSimulation(dataUrl, false);
      }
      return;
    }

    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Set canvas size matching the video aspect ratio
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Analyze pixels to check if image is black/empty
      const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imgData.data;
      let isBlack = true;

      // Sample pixels
      for (let i = 0; i < pixels.length; i += 40) {
        const r = pixels[i];
        const g = pixels[i+1];
        const b = pixels[i+2];
        if (r > 35 || g > 35 || b > 35) {
          isBlack = false;
          break;
        }
      }

      // Convert canvas to Data URL
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(dataUrl);

      // Turn off camera
      handleCloseCamera();

      // Trigger AI validation simulation
      runValidationSimulation(dataUrl, isBlack);
    }
  };

  // Handle uploaded file fallback
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCameraError(null);
      setValidationResult(null);
      
      const isImage = file.type.startsWith('image/');
      if (isImage) {
        setUploadedFile(null);
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target.result;
          
          // Create an Image object to load and draw onto the canvas to check pixels
          const img = new Image();
          img.onload = () => {
            const canvas = canvasRef.current;
            if (canvas) {
              const context = canvas.getContext('2d');
              canvas.width = img.width || 640;
              canvas.height = img.height || 480;
              context.drawImage(img, 0, 0, canvas.width, canvas.height);
              
              // Check pixels
              const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
              const pixels = imgData.data;
              let isBlack = true;
              for (let i = 0; i < pixels.length; i += 40) {
                if (pixels[i] > 35 || pixels[i+1] > 35 || pixels[i+2] > 35) {
                  isBlack = false;
                  break;
                }
              }
              
              setCapturedImage(dataUrl);
              handleCloseCamera();
              runValidationSimulation(dataUrl, isBlack);
            }
          };
          img.src = dataUrl;
        };
        reader.readAsDataURL(file);
      } else {
        // Handle non-image document file
        setCapturedImage(null);
        const fileData = {
          name: file.name,
          size: (file.size / 1024).toFixed(1) + ' KB',
          type: file.type
        };
        setUploadedFile(fileData);
        handleCloseCamera();
        runValidationSimulation(null, false);
      }
    }
  };

  // Trigger file dialog
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Simulate AI nutrition scanning
  const runValidationSimulation = (imageSrc, isBlack) => {
    setIsValidating(true);
    setValidationResult(null);

    // Simulated 2.5s scanning effect
    setTimeout(() => {
      if (isBlack) {
        // Return UNIDENTIFIED empty result
        setValidationResult({
          status: 'Tidak Terdeteksi',
          foodTags: [],
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          complianceText: 'Gagal memvalidasi - Tidak ada makanan terdeteksi.',
          summary: 'AI tidak mendeteksi adanya objek makanan (tidak ada sesuatu di dalam tangkapan gambar).'
        });
      } else {
        // Pick a random preset menu result
        const randomIndex = Math.floor(Math.random() * PRESET_MENUS.length);
        const result = PRESET_MENUS[randomIndex];
        setValidationResult(result);
      }
      setIsValidating(false);
    }, 2500);
  };

  // Save validation result to active session log
  const handleSaveResult = () => {
    if (!validationResult) return;

    const newRecord = {
      id: Date.now(),
      time: 'Baru Saja',
      image: capturedImage,
      file: uploadedFile,
      menuName: validationResult.foodTags.join(', '),
      calories: validationResult.calories,
      status: 'Tervalidasi'
    };

    setHistory([newRecord, ...history]);

    // Reset workflow
    setCapturedImage(null);
    setUploadedFile(null);
    setValidationResult(null);

    alert('Hasil validasi AI berhasil disimpan ke log harian.');
  };

  // Reset/Cancel current scan
  const handleReset = () => {
    setCapturedImage(null);
    setUploadedFile(null);
    setValidationResult(null);
    setCameraError(null);
  };

  return (
    <div style={{ textAlign: 'left' }}>
      {/* Header */}
      <div className="vai-header">
        <h1 className="vai-title">Validasi AI Kelayakan Menu</h1>
        <p className="vai-subtitle">
          Pindai porsi makanan dengan kamera untuk memvalidasi pemenuhan standar nutrisi dan porsi harian MBG.
        </p>
      </div>

      <div className="vai-grid">
        {/* Left Column: Camera and Capture Workspace */}
        <div className="vai-card">
          <h3 className="vai-card-title">
            <CameraIcon />
            <span>Kamera Pemindai Makanan</span>
          </h3>

          <div className="vai-viewport-container">
            {/* 1. Live Camera Feed */}
            {isCameraOpen && !isCameraSimulated && (
              <>
                <video ref={videoRef} autoPlay playsInline className="vai-video" />
                <div className="vai-scanner-frame" />
                <div className="vai-scanner-frame-bottom" />
                <div className="vai-scan-line" />
              </>
            )}

            {/* 2. Simulated Camera Feed */}
            {isCameraOpen && isCameraSimulated && (
              <div className="vai-simulated-feed">
                <svg width="120" height="120" viewBox="0 0 100 100" fill="none" className="vai-simulated-food-svg">
                  {/* Outer Plate */}
                  <circle cx="50" cy="50" r="45" fill="#E5E3DF" stroke="#C4C2BC" strokeWidth="2" />
                  <circle cx="50" cy="50" r="35" fill="#FFFFFF" stroke="#E5E3DF" strokeWidth="1" />
                  {/* Rice */}
                  <circle cx="42" cy="42" r="14" fill="#F8F7F5" stroke="#E5E3DF" />
                  <text x="42" y="44" fontSize="6" fontWeight="bold" fill="#5C5B57" textAnchor="middle">Nasi</text>
                  {/* Chicken */}
                  <path d="M 52 35 C 60 30, 70 35, 72 45 C 74 52, 65 60, 55 58 C 50 56, 48 45, 52 35 Z" fill="#D1B06C" stroke="#B89650" />
                  <text x="60" y="48" fontSize="6" fontWeight="bold" fill="#1A1A18" textAnchor="middle">Ayam</text>
                  {/* Veggies */}
                  <circle cx="48" cy="65" r="10" fill="#E8F5E9" stroke="#92D05D" />
                  <text x="48" y="67" fontSize="5" fontWeight="bold" fill="#2E7D32" textAnchor="middle">Sayur</text>
                  {/* Fruit */}
                  <path d="M 30 52 C 26 58, 22 55, 20 62 C 22 68, 32 68, 34 60 Z" fill="#FFF8E1" stroke="#E8A817" />
                  <text x="27" y="61" fontSize="5" fontWeight="bold" fill="#E8A817" textAnchor="middle">Buah</text>
                </svg>
                <div className="vai-simulated-label">SIMULASI KAMERA AKTIF</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '6px' }}>
                  Siap mendeteksi: Nasi, Ayam, Sayuran, dll.
                </div>
                <div className="vai-scanner-frame" />
                <div className="vai-scanner-frame-bottom" />
                <div className="vai-scan-line" />
              </div>
            )}

            {/* 3. Captured/Uploaded Static Preview */}
            {!isCameraOpen && capturedImage && (
              <>
                <img src={capturedImage} alt="Captured Meal" className="vai-captured-preview" />
                {/* Active scan effect during simulation */}
                {isValidating && (
                  <>
                    <div className="vai-scanner-frame" />
                    <div className="vai-scanner-frame-bottom" />
                    <div className="vai-scan-line" />
                    <div className="vai-scanning-overlay">
                      <div className="vai-scan-spinner" />
                      <span style={{ fontWeight: 600, letterSpacing: '0.5px' }}>Menganalisis Makanan Menggunakan AI...</span>
                    </div>
                  </>
                )}
              </>
            )}

            {/* 3b. Non-image uploaded file preview */}
            {!isCameraOpen && uploadedFile && (
              <div className="vai-document-preview">
                <div className="vai-document-icon-wrapper">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="vai-document-icon">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <div className="vai-document-info">
                  <span className="vai-document-name">{uploadedFile.name}</span>
                  <span className="vai-document-size">{uploadedFile.size}</span>
                </div>
                {isValidating && (
                  <div className="vai-scanning-overlay">
                    <div className="vai-scan-spinner" />
                    <span style={{ fontWeight: 600, letterSpacing: '0.5px' }}>Menganalisis Berkas Menggunakan AI...</span>
                  </div>
                )}
              </div>
            )}

            {/* 4. Empty Camera Placeholder */}
            {!isCameraOpen && !capturedImage && !uploadedFile && (
              <div className="vai-camera-placeholder">
                <span className="vai-placeholder-icon">
                  <ScanLargeIcon />
                </span>
                <p className="vai-placeholder-text">
                  Kamera belum aktif. Klik tombol <strong>Buka Kamera</strong> atau gunakan <strong>Kamera Simulasi</strong> jika peramban memblokir izin webcam fisik Anda.
                </p>
              </div>
            )}
          </div>

          {/* Hidden Canvas for capturing screenshots */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* Hidden File Input for local file upload fallback */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx,.txt"
            className="vai-file-upload-input"
          />

          {/* Controls */}
          <div className="vai-controls">
            {!isCameraOpen && !capturedImage && !uploadedFile && (
              <>
                <button className="vai-btn vai-btn-primary" onClick={handleOpenCamera}>
                  <CameraIcon />
                  <span>Buka Kamera</span>
                </button>
                <button className="vai-btn vai-btn-secondary" onClick={handleOpenSimulatedCamera}>
                  <SimulateIcon />
                  <span>Kamera Simulasi</span>
                </button>
                <button className="vai-btn vai-btn-secondary" onClick={triggerFileInput}>
                  <UploadIcon />
                  <span>Unggah Berkas</span>
                </button>
              </>
            )}

            {isCameraOpen && (
              <>
                <button className="vai-btn vai-btn-primary" onClick={handleCapture}>
                  <CaptureIcon />
                  <span>Ambil Foto & Validasi</span>
                </button>
                <button className="vai-btn vai-btn-secondary" onClick={handleCloseCamera}>
                  <span>Batalkan</span>
                </button>
              </>
            )}

            {!isCameraOpen && (capturedImage || uploadedFile) && !isValidating && (
              <>
                <button className="vai-btn vai-btn-secondary" onClick={uploadedFile ? triggerFileInput : (isCameraSimulated ? handleOpenSimulatedCamera : handleOpenCamera)}>
                  <RefreshIcon />
                  <span>Scan Ulang ({uploadedFile ? 'Berkas' : isCameraSimulated ? 'Simulasi' : 'Kamera'})</span>
                </button>
                <button className="vai-btn vai-btn-tertiary" onClick={handleReset}>
                  <span>Reset Tampilan</span>
                </button>
              </>
            )}
          </div>

          {cameraError && (
            <p style={{ color: 'var(--status-error)', fontSize: '13px', marginTop: 'var(--space-md)' }}>
              {cameraError}
            </p>
          )}

          {/* Warning message for black screen fallback guidance */}
          {capturedImage && !isValidating && validationResult?.status === 'Tidak Terdeteksi' && (
            <div style={{ 
              marginTop: 'var(--space-md)', 
              padding: 'var(--space-md)', 
              background: '#FFEBEE', 
              color: 'var(--status-error)', 
              borderRadius: 'var(--radius-md)', 
              fontSize: '13px',
              lineHeight: '18px',
              borderLeft: '3px solid var(--status-error)'
            }}>
              <strong>Hasil Analisis Kosong:</strong> Gambar terdeteksi hitam/kosong. Jika peramban memblokir akses webcam Anda (sehingga kamera tampil hitam), silakan klik <strong>Reset Tampilan</strong> lalu pilih tombol <strong>Kamera Simulasi</strong> untuk menguji alur deteksi positif.
            </div>
          )}
        </div>

        {/* Right Column: AI Analysis Result Panel */}
        <div className="vai-card">
          <h3 className="vai-card-title">
            <SparklesIcon />
            <span>Hasil Penilaian AI</span>
          </h3>

          {!capturedImage && !isValidating && !validationResult && (
            <div className="vai-empty-results">
              <SparklesLargeIcon />
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Belum ada data pemindaian makanan. Silakan ambil foto menu di sebelah kiri untuk melihat hasil penilaian kelayakan gizi.
              </p>
            </div>
          )}

          {isValidating && (
            <div className="vai-empty-results">
              <div className="vai-scan-spinner" style={{ borderTopColor: 'var(--color-primary)' }} />
              <p style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500, marginTop: '12px' }}>
                Sedang memproses pemindaian...
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Mendeteksi komposisi bahan makanan, porsi, kandungan kalori, dan zat gizi.
              </p>
            </div>
          )}

          {!isValidating && validationResult && (
            <div>
              <div className="vai-badge-row">
                {validationResult.status === 'Tidak Terdeteksi' ? (
                  <span className="vai-badge vai-badge-error">
                    <CrossIcon />
                    <span>TIDAK TERDETEKSI</span>
                  </span>
                ) : (
                  <span className="vai-badge vai-badge-success">
                    <CheckIcon />
                    <span>TERVALIDASI</span>
                  </span>
                )}
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Akurasi AI: <strong>{validationResult.status === 'Tidak Terdeteksi' ? '0%' : '96.4%'}</strong>
                </span>
              </div>

              <p className="vai-nutrition-summary">
                {validationResult.summary}
              </p>

              {/* Nutrition macros breakdown */}
              <div className="vai-macro-grid">
                <div className="vai-macro-card">
                  <span className="vai-macro-val">{validationResult.calories}</span>
                  <span className="vai-macro-lbl">Kalori (kkal)</span>
                </div>
                <div className="vai-macro-card">
                  <span className="vai-macro-val">{validationResult.protein}g</span>
                  <span className="vai-macro-lbl">Protein</span>
                </div>
                <div className="vai-macro-card">
                  <span className="vai-macro-val">{validationResult.carbs}g</span>
                  <span className="vai-macro-lbl">Karbo</span>
                </div>
                <div className="vai-macro-card">
                  <span className="vai-macro-val">{validationResult.fat}g</span>
                  <span className="vai-macro-lbl">Lemak</span>
                </div>
              </div>

              {/* Compliance checklist */}
              <div className="vai-checklist">
                <span className="vai-checklist-title">Analisis Kelayakan Porsi</span>
                <div className="vai-checklist-item">
                  <span className={validationResult.status === 'Tidak Terdeteksi' ? 'vai-cross-icon' : 'vai-check-icon'}>
                    {validationResult.status === 'Tidak Terdeteksi' ? <CrossIcon /> : <CheckIcon />}
                  </span>
                  <span>Karbohidrat Utama: {validationResult.status === 'Tidak Terdeteksi' ? 'Tidak Terdeteksi' : 'Terdeteksi'}</span>
                </div>
                <div className="vai-checklist-item">
                  <span className={validationResult.status === 'Tidak Terdeteksi' ? 'vai-cross-icon' : 'vai-check-icon'}>
                    {validationResult.status === 'Tidak Terdeteksi' ? <CrossIcon /> : <CheckIcon />}
                  </span>
                  <span>Protein Hewani/Nabati: {validationResult.status === 'Tidak Terdeteksi' ? 'Tidak Terdeteksi' : 'Terdeteksi'}</span>
                </div>
                <div className="vai-checklist-item">
                  <span className={validationResult.status === 'Tidak Terdeteksi' ? 'vai-cross-icon' : 'vai-check-icon'}>
                    {validationResult.status === 'Tidak Terdeteksi' ? <CrossIcon /> : <CheckIcon />}
                  </span>
                  <span>Komposisi Serat & Vitamin: {validationResult.status === 'Tidak Terdeteksi' ? 'Tidak Terdeteksi' : 'Terdeteksi'}</span>
                </div>
                <div className="vai-checklist-item">
                  <span className={validationResult.status === 'Tidak Terdeteksi' ? 'vai-cross-icon' : 'vai-check-icon'}>
                    {validationResult.status === 'Tidak Terdeteksi' ? <CrossIcon /> : <CheckIcon />}
                  </span>
                  <span>Susu Pendamping: {validationResult.status === 'Tidak Terdeteksi' ? 'Tidak Terdeteksi' : 'Terdeteksi'}</span>
                </div>
              </div>

              {/* Identified Food Tags */}
              <span className="vai-checklist-title" style={{ display: 'block', marginBottom: '8px' }}>
                Bahan yang Terdeteksi
              </span>
              <div className="vai-items-list">
                {validationResult.foodTags.length > 0 ? (
                  validationResult.foodTags.map((tag) => (
                    <span key={tag} className="vai-food-tag">
                      {tag}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                    Tidak ada bahan makanan terdeteksi (tidak ada sesuatu)
                  </span>
                )}
              </div>

              {/* Save or Discard action buttons */}
              <div className="vai-action-group">
                <button 
                  className="vai-btn vai-btn-primary" 
                  onClick={handleSaveResult}
                  disabled={validationResult.status === 'Tidak Terdeteksi'}
                >
                  <span>Simpan Laporan Validasi</span>
                </button>
                <button className="vai-btn vai-btn-tertiary" onClick={handleReset}>
                  <span>Hapus Hasil</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* History Log Section */}
      <div className="vai-history-section">
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-md)' }}>
          Riwayat Validasi Terkini
        </h2>
        <div className="vai-table-container">
          <table className="vai-table">
            <thead>
              <tr>
                <th>Waktu</th>
                <th>Foto</th>
                <th>Menu Makanan Teridentifikasi</th>
                <th style={{ textAlign: 'right' }}>Energi</th>
                <th style={{ paddingLeft: '24px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id}>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                    {item.time}
                  </td>
                  <td>
                    {item.image ? (
                      <img src={item.image} alt="Log Thumb" className="vai-history-thumb" />
                    ) : item.file ? (
                      <div className="vai-history-thumb-placeholder" title={item.file.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-primary)' }}>
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                      </div>
                    ) : (
                      <div className="vai-history-thumb-placeholder">
                        <SmallCameraIcon />
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="vai-history-food-text" title={item.menuName}>
                      {item.menuName}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>
                    {item.calories} kkal
                  </td>
                  <td style={{ paddingLeft: '24px' }}>
                    <span className="vai-badge vai-badge-success" style={{ height: '20px', padding: '2px 8px', fontSize: '11px' }}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── SVG INLINE ICONS FOR VALIDATION ───────────────────────

function CameraIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function SmallCameraIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function SimulateIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function CaptureIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5z" />
      <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z" />
    </svg>
  );
}

function ScanLargeIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M5 21H3a2 2 0 0 1-2-2v-2" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 7v10" />
      <path d="M7 12h10" />
    </svg>
  );
}

function SparklesLargeIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}

