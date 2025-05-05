import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react";

const PhotoCaptureModal = forwardRef(({ onCapture, onClose }, ref) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    open() {
      setIsVisible(true);
      startCamera();
    },
    close() {
      stopCamera();
      setIsVisible(false);
    },
  }));

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error al acceder a la cámara:", err);
      alert("No se pudo acceder a la cámara.");
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    stream?.getTracks().forEach((track) => track.stop());
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const context = canvasRef.current.getContext("2d");
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);

    const base64 = canvasRef.current.toDataURL("image/png");
    stopCamera();
    setIsVisible(false);
    onCapture(base64);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center relative">
        <h3 className="text-lg font-semibold mb-4">Verificación facial</h3>
        <video ref={videoRef} autoPlay playsInline className="rounded-lg border mb-4" width="300" />
        <div className="flex justify-center gap-4">
          <button
            onClick={handleCapture}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Tomar Foto
          </button>
          <button
            onClick={() => {
              stopCamera();
              setIsVisible(false);
              onClose();
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Cancelar
          </button>
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
});

export default PhotoCaptureModal;
