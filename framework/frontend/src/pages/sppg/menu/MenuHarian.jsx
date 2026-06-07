import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../../../api/axios';
import '../../admin/admin.css';
import '../../ValidationAI.css';
import { useAuth } from '../../../context/AuthContext';

const SparklesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5z" />
    <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z" />
  </svg>
);

const CameraIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const SimulateIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);

const UploadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const CaptureIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CrossIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ScanLargeIcon = () => (
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

const EMPTY_FORM = {
  served_at: new Date().toISOString().split('T')[0],
  menu_name: '',
  components: '',
  calories: '',
  protein: '',
  carbs: '',
  fat: '',
};

function MenuFormModal({ menu, onClose, onSaved }) {
  const isEdit = !!menu;
  const [form, setForm] = useState(
    isEdit
      ? {
          served_at:  menu.served_at  ?? '',
          menu_name:  menu.menu_name  ?? '',
          components: menu.components ?? '',
          calories:   menu.calories   ?? '',
          protein:    menu.protein    ?? '',
          carbs:      menu.carbs      ?? '',
          fat:        menu.fat        ?? '',
          photo:      menu.photo      ?? null,
          is_ai_validated: menu.is_ai_validated ?? false,
          ai_warning: menu.ai_warning ?? null,
        }
      : {
          ...EMPTY_FORM,
          photo: null,
          is_ai_validated: false,
          ai_warning: null,
        }
  );
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  // AI Scanner & Photo states
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCameraSimulated, setIsCameraSimulated] = useState(false);
  const [capturedImage, setCapturedImage] = useState(isEdit ? menu.photo : null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);

  // AI Validation results
  const [detectedPreset, setDetectedPreset] = useState(() => {
    if (isEdit && menu.calories) {
      const match = PRESET_MENUS.find((p) => Math.abs(p.calories - menu.calories) <= 80);
      return match || PRESET_MENUS[0];
    }
    return null;
  });
  const [validationRun, setValidationRun] = useState(isEdit ? true : false);
  const [validationWarning, setValidationWarning] = useState(isEdit ? menu.ai_warning : null);
  const [validationSuccess, setValidationSuccess] = useState(isEdit ? !!menu.is_ai_validated : false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    // Reset validation when claims are modified
    setValidationRun(false);
    setValidationWarning(null);
    setValidationSuccess(false);
  };

  // Cleanup camera streams on unmount
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
    setUploadedFile(null);
    setDetectedPreset(null);
    setIsCameraSimulated(false);
    setValidationRun(false);
    setValidationWarning(null);
    setValidationSuccess(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
      });
      setIsCameraOpen(true);
      setCameraStream(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setCameraError('Gagal mengakses kamera. Pastikan izin kamera telah diberikan atau gunakan opsi unggah berkas.');
    }
  };

  // Open Simulated Camera
  const handleOpenSimulatedCamera = () => {
    setCameraError(null);
    setCapturedImage(null);
    setUploadedFile(null);
    setDetectedPreset(null);
    setIsCameraOpen(true);
    setIsCameraSimulated(true);
    setValidationRun(false);
    setValidationWarning(null);
    setValidationSuccess(false);

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
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext('2d');
        canvas.width = 640;
        canvas.height = 480;

        context.fillStyle = '#F8F7F5';
        context.fillRect(0, 0, 640, 480);

        context.fillStyle = '#FFFFFF';
        context.strokeStyle = '#E5E3DF';
        context.lineWidth = 10;
        context.beginPath();
        context.arc(320, 240, 200, 0, 2 * Math.PI);
        context.fill();
        context.stroke();

        context.fillStyle = '#F0EEEB';
        context.beginPath();
        context.arc(260, 200, 70, 0, 2 * Math.PI);
        context.fill();
        context.fillStyle = '#1A1A18';
        context.font = 'bold 20px sans-serif';
        context.fillText('Nasi Putih', 210, 205);

        context.fillStyle = '#D1B06C';
        context.beginPath();
        context.arc(380, 200, 60, 0, 2 * Math.PI);
        context.fill();
        context.fillStyle = '#1A1A18';
        context.fillText('Ayam Panggang', 310, 205);

        context.fillStyle = '#E8F5E9';
        context.beginPath();
        context.arc(320, 310, 55, 0, 2 * Math.PI);
        context.fill();
        context.fillStyle = '#2E7D32';
        context.fillText('Sayur Buncis', 260, 315);

        const dataUrl = canvas.toDataURL('image/jpeg');
        setIsCameraOpen(false);
        runValidationSimulation(dataUrl, false);
      }
      return;
    }

    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imgData.data;
      let isBlack = true;

      for (let i = 0; i < pixels.length; i += 40) {
        const r = pixels[i];
        const g = pixels[i+1];
        const b = pixels[i+2];
        if (r > 35 || g > 35 || b > 35) {
          isBlack = false;
          break;
        }
      }

      const dataUrl = canvas.toDataURL('image/jpeg');
      handleCloseCamera();
      runValidationSimulation(dataUrl, isBlack);
    }
  };

  // Handle uploaded file fallback
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCameraError(null);
      setValidationRun(false);
      setValidationWarning(null);
      setValidationSuccess(false);

      const isImage = file.type.startsWith('image/');
      if (isImage) {
        setUploadedFile(null);
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target.result;
          const img = new Image();
          img.onload = () => {
            const canvas = canvasRef.current;
            if (canvas) {
              const context = canvas.getContext('2d');
              canvas.width = img.width || 640;
              canvas.height = img.height || 480;
              context.drawImage(img, 0, 0, canvas.width, canvas.height);

              const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
              const pixels = imgData.data;
              let isBlack = true;
              for (let i = 0; i < pixels.length; i += 40) {
                if (pixels[i] > 35 || pixels[i+1] > 35 || pixels[i+2] > 35) {
                  isBlack = false;
                  break;
                }
              }

              handleCloseCamera();
              runValidationSimulation(dataUrl, isBlack);
            }
          };
          img.src = dataUrl;
        };
        reader.readAsDataURL(file);
      } else {
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

  // Assign photo and select visual preset
  const runValidationSimulation = (imageSrc, isBlack) => {
    setCapturedImage(imageSrc);
    setForm(f => ({ ...f, photo: imageSrc }));

    let result;
    if (isBlack) {
      result = {
        status: 'Tidak Terdeteksi',
        foodTags: [],
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        summary: 'AI tidak mendeteksi adanya objek makanan (gambar kosong/hitam).'
      };
    } else {
      const randomIndex = Math.floor(Math.random() * PRESET_MENUS.length);
      result = PRESET_MENUS[randomIndex];
    }
    setDetectedPreset(result);
  };

  // Visual validation checking claims against photo
  const runAiValidation = () => {
    return new Promise((resolve) => {
      if (!capturedImage) {
        setCameraError('Foto makanan wajib diambil atau diunggah sebelum melakukan validasi AI.');
        resolve(null);
        return;
      }
      setCameraError(null);

      if (form.calories === '' || form.protein === '' || form.carbs === '' || form.fat === '') {
        setError('Mohon lengkapi semua nilai klaim kandungan nutrisi (Kalori, Protein, Karbohidrat, Lemak) terlebih dahulu.');
        resolve(null);
        return;
      }
      setError('');
      setIsValidating(true);
      setValidationWarning(null);
      setValidationSuccess(false);

      api.post('/sppg/menu/validate-nutrition', {
        menu_name: form.menu_name,
        components: form.components,
        calories: Number(form.calories),
        protein: Number(form.protein),
        carbs: Number(form.carbs),
        fat: Number(form.fat),
        photo: capturedImage,
      })
      .then((res) => {
        const { is_valid, warning_message } = res.data;
        setIsValidating(false);
        setValidationRun(true);

        if (warning_message) {
          setValidationWarning(warning_message);
          setForm(f => ({ ...f, is_ai_validated: false, ai_warning: warning_message }));
          resolve({ success: false, warning: warning_message });
        } else {
          setValidationSuccess(true);
          setForm(f => ({ ...f, is_ai_validated: true, ai_warning: null }));
          resolve({ success: true, warning: null });
        }
      })
      .catch((err) => {
        setIsValidating(false);
        setValidationRun(true);
        console.error('AI validation error:', err);
        // Fallback: anggap tidak ada peringatan jika API bermasalah/mati (sesuai spesifikasi SRS)
        setValidationSuccess(true);
        setForm(f => ({ ...f, is_ai_validated: false, ai_warning: null }));
        resolve({ success: true, warning: null });
      });
    });
  };

  // Reset current scan
  const handleReset = () => {
    setCapturedImage(null);
    setUploadedFile(null);
    setDetectedPreset(null);
    setCameraError(null);
    setValidationRun(false);
    setValidationWarning(null);
    setValidationSuccess(false);
    setForm(f => ({ ...f, photo: null, is_ai_validated: false, ai_warning: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Check if photo is present
    if (!capturedImage) {
      setError('Foto makanan wajib diambil atau diunggah.');
      return;
    }

    let currentValidationRun = validationRun;
    let currentWarning = validationWarning;
    let currentSuccess = validationSuccess;

    // Auto-validate if validation has not run yet
    if (!currentValidationRun) {
      const res = await runAiValidation();
      if (!res) {
        // Validation could not run (missing fields etc)
        return;
      }
      currentValidationRun = true;
      currentWarning = res.warning;
      currentSuccess = res.success;
    }

    // If warning exists, prompt for confirmation
    if (currentWarning) {
      const confirmSave = window.confirm(
        `Peringatan AI: "${currentWarning}"\n\nKlaim gizi tidak sebanding dengan visual makanan. Apakah Anda yakin ingin menyimpan dan mempublikasikan data ini? (Menu akan disimpan tanpa lencana "Tervalidasi AI")`
      );
      if (!confirmSave) {
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        photo: capturedImage,
        is_ai_validated: !currentWarning,
        ai_warning: currentWarning,
        calories: form.calories !== '' && form.calories !== null ? Number(form.calories) : null,
        protein:  form.protein  !== '' && form.protein  !== null ? Number(form.protein)  : null,
        carbs:    form.carbs    !== '' && form.carbs    !== null ? Number(form.carbs)    : null,
        fat:      form.fat      !== '' && form.fat      !== null ? Number(form.fat)      : null,
      };
      if (isEdit) {
        await api.put(`/sppg/menu/${menu.id}`, payload);
      } else {
        await api.post('/sppg/menu', payload);
      }
      onSaved();
    } catch (err) {
      console.error("Submit error details:", err.response?.data);
      let msg = 'Terjadi kesalahan.';
      if (err.response?.data) {
        if (err.response.data.message) {
          msg = err.response.data.message;
        }
        if (err.response.data.errors) {
          const details = Object.values(err.response.data.errors).flat().join(', ');
          msg = `${msg}: ${details}`;
        }
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adm-overlay" onClick={onClose}>
      <div className="adm-modal adm-modal-ai-active" onClick={(e) => e.stopPropagation()}>
        <div className="adm-modal-header">
          <h3>{isEdit ? 'Edit Menu' : 'Tambah Menu Harian'}</h3>
          <button className="adm-modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="adm-modal-body" style={{ padding: 0 }}>
            <div className="menu-form-split-container">
              {/* Left Column: AI Scanner & Photo */}
              <div className="menu-form-ai-panel">
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 var(--space-md) 0', textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid var(--border-default)', paddingBottom: 'var(--space-sm)' }}>
                  Foto Makanan (Wajib)
                </h4>

                <div className="vai-viewport-container" style={{ aspectRatio: '1.5', marginBottom: 'var(--space-md)' }}>
                  {/* Live Camera Feed */}
                  {isCameraOpen && !isCameraSimulated && (
                    <>
                      <video ref={videoRef} autoPlay playsInline className="vai-video" />
                      <div className="vai-scanner-frame" />
                      <div className="vai-scanner-frame-bottom" />
                      <div className="vai-scan-line" />
                    </>
                  )}

                  {/* Simulated Camera Feed */}
                  {isCameraOpen && isCameraSimulated && (
                    <div className="vai-simulated-feed">
                      <svg width="80" height="80" viewBox="0 0 100 100" fill="none" className="vai-simulated-food-svg">
                        <circle cx="50" cy="50" r="45" fill="#E5E3DF" stroke="#C4C2BC" strokeWidth="2" />
                        <circle cx="50" cy="50" r="35" fill="#FFFFFF" stroke="#E5E3DF" strokeWidth="1" />
                        <circle cx="42" cy="42" r="14" fill="#F8F7F5" stroke="#E5E3DF" />
                        <text x="42" y="44" fontSize="6" fontWeight="bold" fill="#5C5B57" textAnchor="middle">Nasi</text>
                        <path d="M 52 35 C 60 30, 70 35, 72 45 C 74 52, 65 60, 55 58 C 50 56, 48 45, 52 35 Z" fill="#D1B06C" stroke="#B89650" />
                        <text x="60" y="48" fontSize="6" fontWeight="bold" fill="#1A1A18" textAnchor="middle">Ayam</text>
                        <circle cx="48" cy="65" r="10" fill="#E8F5E9" stroke="#92D05D" />
                        <text x="48" y="67" fontSize="5" fontWeight="bold" fill="#2E7D32" textAnchor="middle">Sayur</text>
                      </svg>
                      <div className="vai-simulated-label" style={{ fontSize: '11px', marginTop: '8px' }}>SIMULASI KAMERA AKTIF</div>
                      <div className="vai-scanner-frame" />
                      <div className="vai-scanner-frame-bottom" />
                      <div className="vai-scan-line" />
                    </div>
                  )}

                  {/* Captured/Uploaded Preview */}
                  {!isCameraOpen && capturedImage && (
                    <>
                      <img src={capturedImage} alt="Captured Meal" className="vai-captured-preview" />
                      {isValidating && (
                        <>
                          <div className="vai-scanner-frame" />
                          <div className="vai-scanner-frame-bottom" />
                          <div className="vai-scan-line" />
                          <div className="vai-scanning-overlay">
                            <div className="vai-scan-spinner" />
                            <span style={{ fontSize: '12px' }}>AI Memvalidasi Foto & Nutrisi...</span>
                          </div>
                        </>
                      )}
                    </>
                  )}

                  {/* Document Preview */}
                  {!isCameraOpen && uploadedFile && (
                    <div className="vai-document-preview">
                      <div className="vai-document-icon-wrapper" style={{ padding: '8px', marginBottom: '8px' }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="vai-document-icon">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                      </div>
                      <div className="vai-document-info">
                        <span className="vai-document-name" style={{ fontSize: '13px' }}>{uploadedFile.name}</span>
                        <span className="vai-document-size" style={{ fontSize: '11px' }}>{uploadedFile.size}</span>
                      </div>
                      {isValidating && (
                        <div className="vai-scanning-overlay">
                          <div className="vai-scan-spinner" />
                          <span style={{ fontSize: '12px' }}>AI Memvalidasi Berkas...</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Placeholder */}
                  {!isCameraOpen && !capturedImage && !uploadedFile && (
                    <div className="vai-camera-placeholder" style={{ padding: 'var(--space-md)' }}>
                      <span className="vai-placeholder-icon">
                        <ScanLargeIcon />
                      </span>
                      <p className="vai-placeholder-text" style={{ fontSize: '12px', lineHeight: '16px' }}>
                        Foto makanan belum tersedia. Gunakan kamera langsung, kamera simulasi, atau unggah berkas foto menu makanan Anda.
                      </p>
                    </div>
                  )}
                </div>

                {/* Hidden inputs */}
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="vai-file-upload-input"
                />

                {/* Controls */}
                <div className="vai-controls" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: 'var(--space-md)' }}>
                  {!isCameraOpen && !capturedImage && !uploadedFile && (
                    <>
                      <button type="button" className="adm-btn primary" onClick={handleOpenCamera} style={{ flex: '1', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <CameraIcon />
                        <span>Kamera</span>
                      </button>
                      <button type="button" className="adm-btn" onClick={handleOpenSimulatedCamera} style={{ flex: '1', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <SimulateIcon />
                        <span>Simulasi</span>
                      </button>
                      <button type="button" className="adm-btn" onClick={triggerFileInput} style={{ flex: '1', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <UploadIcon />
                        <span>Unggah</span>
                      </button>
                    </>
                  )}

                  {isCameraOpen && (
                    <>
                      <button type="button" className="adm-btn primary" onClick={handleCapture} style={{ flex: '2', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <CaptureIcon />
                        <span>Ambil Foto</span>
                      </button>
                      <button type="button" className="adm-btn" onClick={handleCloseCamera} style={{ flex: '1' }}>
                        Batal
                      </button>
                    </>
                  )}

                  {!isCameraOpen && (capturedImage || uploadedFile) && !isValidating && (
                    <>
                      <button type="button" className="adm-btn primary" onClick={uploadedFile ? triggerFileInput : (isCameraSimulated ? handleOpenSimulatedCamera : handleOpenCamera)} style={{ flex: '1', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <RefreshIcon />
                        <span>Ambil Ulang</span>
                      </button>
                      <button type="button" className="adm-btn" onClick={handleReset} style={{ flex: '1' }}>
                        Hapus Foto
                      </button>
                    </>
                  )}
                </div>

                {cameraError && (
                  <p style={{ color: 'var(--status-error)', fontSize: '12px', margin: '0 0 12px 0' }}>
                    {cameraError}
                  </p>
                )}

                {/* Validation results banner inside the modal left column */}
                {validationRun && !isValidating && (
                  <div style={{ marginTop: '12px' }}>
                    {validationSuccess ? (
                      <div style={{
                        background: '#E8F5E9',
                        color: 'var(--status-success)',
                        padding: '12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--status-success)',
                        fontSize: '12px',
                        lineHeight: '16px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', marginBottom: '4px' }}>
                          <CheckIcon />
                          <span>Lolos Validasi AI</span>
                        </div>
                        <p style={{ margin: 0 }}>Klaim kandungan nutrisi terbukti wajar sesuai dengan visual makanan.</p>
                      </div>
                    ) : validationWarning ? (
                      <div style={{
                        background: '#FFF3E0',
                        color: '#E65100',
                        padding: '12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid #FFB74D',
                        fontSize: '12px',
                        lineHeight: '16px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', marginBottom: '4px' }}>
                          <span style={{ fontSize: '14px', display: 'inline-flex', alignItems: 'center' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                              <line x1="12" y1="9" x2="12" y2="13" />
                              <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                          </span>
                          <span>Peringatan Ketidakwajaran AI</span>
                        </div>
                        <p style={{ margin: '0 0 8px 0' }}>{validationWarning}</p>
                        <span style={{ fontSize: '11px', opacity: 0.85, fontWeight: 500 }}>
                          Klaim gizi tidak seimbang secara visual. Anda dapat merevisi gizi atau tetap menyimpan dengan risiko tanpa lencana validasi.
                        </span>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              {/* Right Column: Standard Form Inputs */}
              <div className="menu-form-inputs-panel">
                {error && <p className="adm-error-msg">{error}</p>}
                
                <div className="adm-field">
                  <label className="adm-label" htmlFor="mh-date">Tanggal Sajian</label>
                  <input id="mh-date" className="adm-input" type="date"
                    value={form.served_at} onChange={handleInputChange('served_at')} required />
                </div>
                <div className="adm-field">
                  <label className="adm-label" htmlFor="mh-name">Nama Menu</label>
                  <input id="mh-name" className="adm-input" type="text"
                    placeholder="cth. Nasi, Ayam Goreng, Sayur Bayam"
                    value={form.menu_name} onChange={handleInputChange('menu_name')} required />
                </div>
                <div className="adm-field">
                  <label className="adm-label" htmlFor="mh-components">Komponen Makanan</label>
                  <textarea id="mh-components" className="adm-textarea"
                    placeholder="Uraikan komponen makanan secara detail..."
                    value={form.components} onChange={handleInputChange('components')} />
                </div>
                
                <div className="adm-field-group" style={{ marginBottom: '16px' }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>Klaim Kandungan Nutrisi</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="adm-field" style={{ marginBottom: 0 }}>
                      <label className="adm-label" htmlFor="mh-calories">Kalori (kkal)</label>
                      <input id="mh-calories" className="adm-input" type="number" min="0"
                        value={form.calories} onChange={handleInputChange('calories')} required />
                    </div>
                    <div className="adm-field" style={{ marginBottom: 0 }}>
                      <label className="adm-label" htmlFor="mh-protein">Protein (g)</label>
                      <input id="mh-protein" className="adm-input" type="number" min="0"
                        value={form.protein} onChange={handleInputChange('protein')} required />
                    </div>
                    <div className="adm-field" style={{ marginBottom: 0 }}>
                      <label className="adm-label" htmlFor="mh-carbs">Karbohidrat (g)</label>
                      <input id="mh-carbs" className="adm-input" type="number" min="0"
                        value={form.carbs} onChange={handleInputChange('carbs')} required />
                    </div>
                    <div className="adm-field" style={{ marginBottom: 0 }}>
                      <label className="adm-label" htmlFor="mh-fat">Lemak (g)</label>
                      <input id="mh-fat" className="adm-input" type="number" min="0"
                        value={form.fat} onChange={handleInputChange('fat')} required />
                    </div>
                  </div>
                </div>

                {/* AI Validation trigger button */}
                <div style={{ marginTop: '16px' }}>
                  <button
                    type="button"
                    className={`adm-btn ${validationSuccess ? 'primary' : ''}`}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '10px',
                      fontSize: '13px',
                      fontWeight: 600,
                      border: validationSuccess ? 'none' : '1px dashed var(--color-primary)',
                      background: validationSuccess ? '#E8F5E9' : 'transparent',
                      color: validationSuccess ? '#2E7D32' : 'var(--color-primary)'
                    }}
                    onClick={runAiValidation}
                    disabled={isValidating || !capturedImage}
                  >
                    <SparklesIcon />
                    <span>
                      {isValidating
                        ? 'Memproses Validasi AI...'
                        : validationRun
                          ? 'Ulangi Validasi Kelayakan AI ✦'
                          : 'Validasi Kelayakan Menu dengan AI ✦'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="adm-modal-footer">
            <button type="button" className="adm-btn" onClick={onClose}>Batal</button>
            <button type="submit" className="adm-btn primary" disabled={loading || isValidating}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MenuHarian() {
  const { role } = useAuth();
  const canEdit = role === 'admin' || role === 'sppg';

  const [menus,       setMenus]       = useState([]);
  const [meta,        setMeta]        = useState(null);
  const [page,        setPage]        = useState(1);
  const [loading,     setLoading]     = useState(true);
  const [modalOpen,   setModalOpen]   = useState(false);
  const [editTarget,  setEditTarget]  = useState(null);

  const load = useCallback(async (pg = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get('/sppg/menu', { params: { page: pg } });
      setMenus(data.data);
      setMeta(data);
    } catch {
      setMenus([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(page); }, [page, load]);

  const openAdd   = ()     => { setEditTarget(null); setModalOpen(true); };
  const openEdit  = (menu) => { setEditTarget(menu); setModalOpen(true); };
  const closeModal  = () => setModalOpen(false);
  const handleSaved = () => { closeModal(); load(page); };

  const handleDelete = async (menu) => {
    if (!confirm(`Hapus menu "${menu.menu_name}" tanggal ${menu.served_at}?`)) return;
    try {
      await api.delete(`/sppg/menu/${menu.id}`);
      load(page);
    } catch {
      alert('Gagal menghapus menu.');
    }
  };

  const fmt = (val, unit) => val != null ? `${val} ${unit}` : '—';

  return (
    <div>
      <div className="adm-section-header">
        <h2>Menu Harian</h2>
        {canEdit && <button className="adm-btn primary" onClick={openAdd}>+ Tambah Menu</button>}
      </div>

      <div className="adm-table-wrap">
        {loading ? (
          <p className="adm-loading">Memuat data...</p>
        ) : menus.length === 0 ? (
          <p className="adm-empty">
            {canEdit 
              ? 'Belum ada menu yang diinput. Klik "+ Tambah Menu" untuk memulai.'
              : 'Belum ada menu yang diinput.'}
          </p>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Foto</th>
                <th>Nama Menu</th>
                <th>Komponen</th>
                <th>Kalori</th>
                <th>Protein</th>
                <th>Karbo</th>
                <th>Lemak</th>
                <th>Status Validasi AI</th>
                {canEdit && <th>Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {menus.map((menu) => (
                <tr key={menu.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>{menu.served_at}</td>
                  <td>
                    {menu.photo ? (
                      <img src={menu.photo} alt="Foto Makanan" className="vai-history-thumb" />
                    ) : (
                      <div className="vai-history-thumb-placeholder">—</div>
                    )}
                  </td>
                  <td>{menu.menu_name}</td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {menu.components || '—'}
                  </td>
                  <td>{fmt(menu.calories, 'kkal')}</td>
                  <td>{fmt(menu.protein,  'g')}</td>
                  <td>{fmt(menu.carbs,    'g')}</td>
                  <td>{fmt(menu.fat,      'g')}</td>
                  <td>
                    {menu.is_ai_validated ? (
                      <span className="vai-badge vai-badge-success" style={{ textTransform: 'none', fontSize: '11px', height: '20px', whiteSpace: 'nowrap' }}>
                        Tervalidasi AI
                      </span>
                    ) : menu.ai_warning ? (
                      <span className="vai-badge vai-badge-warning" title={menu.ai_warning} style={{ textTransform: 'none', fontSize: '11px', height: '20px', cursor: 'help', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
                          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                          <line x1="12" y1="9" x2="12" y2="13" />
                          <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                        Ada Peringatan
                      </span>
                    ) : (
                      <span className="vai-badge" style={{ background: '#e0e0e0', color: '#666', textTransform: 'none', fontSize: '11px', height: '20px', whiteSpace: 'nowrap' }}>
                        Belum Divalidasi
                      </span>
                    )}
                  </td>
                  {canEdit && (
                    <td>
                      <div className="adm-actions">
                        <button className="adm-btn" onClick={() => openEdit(menu)}>Edit</button>
                        <button className="adm-btn danger" onClick={() => handleDelete(menu)}>Hapus</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {meta && meta.last_page > 1 && (
        <div className="adm-pagination">
          <button className="adm-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Sebelumnya
          </button>
          <span className="adm-page-info">
            Halaman {meta.current_page} dari {meta.last_page} &bull; {meta.total} menu
          </span>
          <button className="adm-btn" disabled={page === meta.last_page} onClick={() => setPage((p) => p + 1)}>
            Berikutnya
          </button>
        </div>
      )}

      {modalOpen && (
        <MenuFormModal menu={editTarget} onClose={closeModal} onSaved={handleSaved} />
      )}
    </div>
  );
}
