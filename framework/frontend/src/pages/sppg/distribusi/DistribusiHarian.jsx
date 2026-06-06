import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../../../api/axios';
import '../../admin/admin.css';
import '../../ValidationAI.css';

const STATUS_LABELS = {
  belum_diantar: 'Belum Diantar',
  siap_diantar:  'Siap Diantar',
  sudah_diantar: 'Sudah Diantar',
  batal:         'Batal',
};

const STATUS_BADGE = {
  belum_diantar: 'inactive',
  siap_diantar:  '',        // neutral — will use a custom style inline
  sudah_diantar: 'active',
  batal:         'danger',
};

function PhotoViewerModal({ photoUrl, onClose }) {
  return (
    <div className="adm-overlay" onClick={onClose}>
      <div className="adm-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', padding: 0, overflow: 'hidden' }}>
        <div style={{ position: 'relative' }}>
          <img src={photoUrl} alt="Bukti pengiriman" style={{ width: '100%', height: 'auto', display: 'block' }} />
          <button 
            onClick={onClose} 
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(0,0,0,0.5)',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            &times;
          </button>
        </div>
      </div>
    </div>
  );
}

function PhotoProofModal({ record, onClose, onSaved }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCameraSimulated, setIsCameraSimulated] = useState(false);
  const [capturedImage, setCapturedImage] = useState(record.photo || null);
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  const handleOpenCamera = async () => {
    setCameraError(null);
    setCapturedImage(null);
    setIsCameraSimulated(false);
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
      console.error(err);
      setCameraError('Gagal mengakses kamera. Silakan gunakan opsi unggah.');
    }
  };

  const handleOpenSimulatedCamera = () => {
    setCameraError(null);
    setCapturedImage(null);
    setIsCameraOpen(true);
    setIsCameraSimulated(true);
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  const handleCloseCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }
    setIsCameraOpen(false);
    setCameraStream(null);
  };

  const handleCapture = () => {
    if (isCameraSimulated) {
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext('2d');
        canvas.width = 640;
        canvas.height = 480;
        
        context.fillStyle = '#E5E3DF';
        context.fillRect(0, 0, 640, 480);
        
        context.fillStyle = '#2563EB';
        context.fillRect(160, 160, 220, 160);
        
        context.fillStyle = '#1E3A8A';
        context.fillRect(380, 200, 80, 120);
        
        context.fillStyle = '#1A1A18';
        context.beginPath();
        context.arc(220, 320, 30, 0, 2 * Math.PI);
        context.arc(340, 320, 30, 0, 2 * Math.PI);
        context.fill();

        context.fillStyle = '#FFFFFF';
        context.font = 'bold 16px sans-serif';
        context.fillText('HaloMBG Box', 200, 240);
        
        context.fillStyle = '#FFFFFF';
        context.font = '12px sans-serif';
        context.fillText(`BUKTI DISTRIBUSI: ${new Date().toLocaleString('id-ID')}`, 20, 450);

        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        setIsCameraOpen(false);
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
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(dataUrl);
      handleCloseCamera();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!capturedImage) {
      setError('Foto bukti pengiriman wajib diambil atau diunggah.');
      return;
    }
    setLoading(true);
    try {
      await onSaved(capturedImage);
    } catch {
      setError('Gagal menyimpan bukti pengiriman.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adm-overlay" onClick={onClose}>
      <div className="adm-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="adm-modal-header">
          <h3>Bukti Foto Pengiriman</h3>
          <button className="adm-modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="adm-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>
              Unggah atau ambil foto makanan setibanya di <strong>{record.school?.name}</strong>.
            </p>

            <div className="vai-viewport-container" style={{ aspectRatio: '1.5', width: '100%' }}>
              {isCameraOpen && !isCameraSimulated && (
                <>
                  <video ref={videoRef} autoPlay playsInline className="vai-video" />
                  <div className="vai-scanner-frame" />
                </>
              )}
              {isCameraOpen && isCameraSimulated && (
                <div className="vai-simulated-feed">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#8c8a85' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="1" y="3" width="15" height="13" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                    <span style={{ fontSize: '11px', marginTop: '8px' }}>KAMERA SIMULASI AKTIF</span>
                  </div>
                </div>
              )}
              {!isCameraOpen && capturedImage && (
                <img src={capturedImage} alt="Bukti pengiriman" className="vai-captured-preview" />
              )}
              {!isCameraOpen && !capturedImage && (
                <div className="vai-camera-placeholder">
                  <span style={{ fontSize: '2.5rem', marginBottom: '8px', opacity: 0.5 }}>📷</span>
                  <span style={{ fontSize: '12px', opacity: 0.6 }}>Belum ada foto</span>
                </div>
              )}
            </div>

            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />

            {cameraError && <p className="adm-error-msg">{cameraError}</p>}
            {error && <p className="adm-error-msg">{error}</p>}

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {!isCameraOpen && (
                <>
                  <button type="button" className="adm-btn" onClick={handleOpenCamera}>Kamera</button>
                  <button type="button" className="adm-btn" onClick={handleOpenSimulatedCamera}>Simulasi</button>
                  <button type="button" className="adm-btn" onClick={() => fileInputRef.current.click()}>Unggah</button>
                </>
              )}
              {isCameraOpen && (
                <>
                  <button type="button" className="adm-btn primary" onClick={handleCapture}>Ambil Foto</button>
                  <button type="button" className="adm-btn" onClick={handleCloseCamera}>Batal</button>
                </>
              )}
            </div>
          </div>
          <div className="adm-modal-footer">
            <button type="button" className="adm-btn" onClick={onClose}>Batal</button>
            <button type="submit" className="adm-btn primary" disabled={loading || !capturedImage}>
              {loading ? 'Menyimpan...' : 'Simpan Bukti'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function DistribusiHarian() {
  const [records,  setRecords]  = useState([]);
  const [date,     setDate]     = useState(new Date().toISOString().split('T')[0]);
  const [loading,  setLoading]  = useState(true);
  const [updating, setUpdating] = useState(null);
  
  const [photoModalRecord, setPhotoModalRecord] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const load = useCallback(async (d = date) => {
    setLoading(true);
    try {
      const { data } = await api.get('/sppg/distribution', { params: { date: d } });
      setRecords(data);
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => { load(date); }, [date]);

  const performStatusUpdate = async (record, newStatus, photo = null) => {
    setUpdating(record.id);
    try {
      const payload = { status: newStatus };
      if (photo !== null) {
        payload.photo = photo;
      } else if (newStatus !== 'sudah_diantar') {
        payload.photo = null; // Reset photo if status is not "sudah_diantar"
      }
      const { data } = await api.put(`/sppg/distribution/${record.id}`, payload);
      setRecords((prev) => prev.map((r) => (r.id === record.id ? data : r)));
    } catch {
      alert('Gagal memperbarui status.');
    } finally {
      setUpdating(null);
      setPhotoModalRecord(null);
    }
  };

  const handleStatusChange = (record, newStatus) => {
    if (newStatus === 'sudah_diantar') {
      setPhotoModalRecord(record);
    } else {
      performStatusUpdate(record, newStatus, null);
    }
  };

  return (
    <div>
      <div className="adm-section-header">
        <h2>Status Distribusi</h2>
        <input
          type="date"
          className="adm-input"
          style={{ width: 'auto' }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="adm-table-wrap">
        {loading ? (
          <p className="adm-loading">Memuat data...</p>
        ) : records.length === 0 ? (
          <p className="adm-empty">Tidak ada sekolah yang terdaftar untuk dapur ini.</p>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Sekolah</th>
                <th>Kecamatan</th>
                <th>Status</th>
                <th>Foto Bukti</th>
                <th>Diperbarui</th>
                <th>Ubah Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec) => (
                <tr key={rec.id}>
                  <td>{rec.school?.name ?? '—'}</td>
                  <td>{rec.school?.district ?? '—'}</td>
                  <td>
                    <span className={`adm-badge ${STATUS_BADGE[rec.status] ?? ''}`}>
                      {STATUS_LABELS[rec.status]}
                    </span>
                  </td>
                  <td>
                    {rec.photo ? (
                      <button 
                        type="button" 
                        onClick={() => setSelectedPhoto(rec.photo)}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      >
                        <img src={rec.photo} alt="Bukti" style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #d1d5db' }} />
                      </button>
                    ) : rec.status === 'sudah_diantar' ? (
                      <button 
                        type="button"
                        className="adm-btn"
                        style={{ padding: '2px 8px', fontSize: '11px' }}
                        onClick={() => setPhotoModalRecord(rec)}
                      >
                        + Tambah Foto
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.85rem', opacity: 0.5 }}>—</span>
                    )}
                  </td>
                  <td style={{ whiteSpace: 'nowrap', fontSize: '0.8rem', opacity: 0.7 }}>
                    {rec.status_updated_at
                      ? new Date(rec.status_updated_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                      : '—'}
                  </td>
                  <td>
                    <select
                      className="adm-input"
                      style={{ width: 'auto', padding: '4px 8px' }}
                      value={rec.status}
                      disabled={updating === rec.id}
                      onChange={(e) => handleStatusChange(rec, e.target.value)}
                    >
                      {Object.entries(STATUS_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {photoModalRecord && (
        <PhotoProofModal
          record={photoModalRecord}
          onClose={() => setPhotoModalRecord(null)}
          onSaved={(photo) => performStatusUpdate(photoModalRecord, 'sudah_diantar', photo)}
        />
      )}

      {selectedPhoto && (
        <PhotoViewerModal
          photoUrl={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </div>
  );
}
