import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Scan,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Play,
  Pause,
  Zap,
  Target,
  Activity,
  VideoOff
} from 'lucide-react';
import { employees, recentScans as initialScans } from '../data/mockData';
import { ScanResult } from '../types';
import toast from 'react-hot-toast';

export default function FaceRecognition() {
  const [scanning, setScanning] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [currentMatch, setCurrentMatch] = useState<ScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>(initialScans.slice(0, 10));
  const [stats, setStats] = useState({ total: 0, successful: 0, failed: 0 });
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const scanInterval = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera not supported');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error('Camera error:', err);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (scanning) {
      scanInterval.current = window.setInterval(() => {
        const detected = Math.random() > 0.25;
        setFaceDetected(detected);

        if (detected) {
          const registeredEmployees = employees.filter(e => e.faceRegistered);
          const matchedEmp = registeredEmployees[Math.floor(Math.random() * registeredEmployees.length)];
          const success = Math.random() > 0.1;
          
          const result: ScanResult = {
            id: Math.random().toString(36).substr(2, 9),
            employeeName: matchedEmp.name,
            employeeId: matchedEmp.id,
            timestamp: new Date().toISOString(),
            confidence: success ? Math.floor(Math.random() * 6) + 94 : 0,
            status: success ? 'success' : 'failed',
          };

          setCurrentMatch(result);
          setScanHistory(prev => [result, ...prev.slice(0, 19)]);
          setStats(prev => ({
            total: prev.total + 1,
            successful: prev.successful + (success ? 1 : 0),
            failed: prev.failed + (success ? 0 : 1),
          }));

          setTimeout(() => setCurrentMatch(null), 2000);
        }
      }, 2500);
    }

    return () => {
      if (scanInterval.current) clearInterval(scanInterval.current);
    };
  }, [scanning]);

  const toggleScanning = async () => {
    if (scanning) {
      setScanning(false);
      setFaceDetected(false);
      setCurrentMatch(null);
      stopCamera();
      setCameraReady(false);
    } else {
      try {
        await startCamera();
        setCameraReady(true);
        setScanning(true);
        toast.success('Camera activated');
      } catch (err) {
        toast.error('Failed to access camera. Using simulation mode.');
        setScanning(true);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-2">
          Face Recognition
        </h1>
        <p className="text-surface-600 dark:text-surface-400">
          Real-time face detection and attendance marking
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Scanner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 card overflow-hidden"
        >
          <div className="p-6 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${scanning ? 'bg-emerald-500 animate-pulse' : 'bg-surface-300 dark:bg-surface-600'}`} />
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Live Scanner</h3>
            </div>
            <button
              onClick={toggleScanning}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all ${
                scanning
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30'
                  : 'btn-primary'
              }`}
            >
              {scanning ? <><Pause className="w-4 h-4" /> Stop</> : <><Play className="w-4 h-4" /> Start</>}
            </button>
          </div>

          {/* Camera Feed */}
          <div className="relative aspect-video bg-surface-900 m-4 rounded-xl overflow-hidden">
            {!scanning ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <VideoOff className="w-20 h-20 text-surface-600 mx-auto mb-4" />
                  <p className="text-surface-400 text-lg">Camera Offline</p>
                  <p className="text-surface-500 text-sm mt-1">Click "Start" to begin scanning</p>
                </div>
              </div>
            ) : (
              <>
                {cameraActive && cameraReady ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-surface-800 to-surface-900">
                    <div className="absolute inset-0 opacity-20" style={{
                      backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.3) 0%, transparent 50%)'
                    }} />
                  </div>
                )}

                {/* Face detection box */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`relative transition-all duration-500 ${faceDetected ? 'scale-100 opacity-100' : 'scale-90 opacity-30'}`}>
                    <div className={`w-40 h-48 rounded-2xl border-3 ${
                      faceDetected ? 'border-emerald-400' : 'border-white/20'
                    } flex items-center justify-center`}>
                      {faceDetected ? (
                        <User className="w-16 h-16 text-emerald-400" />
                      ) : (
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/20" />
                      )}
                    </div>
                    
                    {faceDetected && (
                      <>
                        <div className="absolute -top-1 -left-1 w-6 h-6 border-t-3 border-l-3 border-emerald-400 rounded-tl-lg" />
                        <div className="absolute -top-1 -right-1 w-6 h-6 border-t-3 border-r-3 border-emerald-400 rounded-tr-lg" />
                        <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-3 border-l-3 border-emerald-400 rounded-bl-lg" />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-3 border-r-3 border-emerald-400 rounded-br-lg" />
                      </>
                    )}
                  </div>
                </div>

                {/* Scan line */}
                {scanning && (
                  <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary-400 to-transparent animate-scan-line" />
                )}

                {/* Status badges */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${
                    faceDetected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-white/50'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${faceDetected ? 'bg-emerald-400 animate-pulse' : 'bg-white/30'}`} />
                    {faceDetected ? 'Face Detected' : 'Searching...'}
                  </div>
                </div>

                {/* Match result overlay */}
                <AnimatePresence>
                  {currentMatch && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`absolute bottom-4 left-4 right-4 p-4 rounded-xl backdrop-blur-md ${
                        currentMatch.status === 'success' ? 'bg-emerald-500/20 border border-emerald-400/30' : 'bg-red-500/20 border border-red-400/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          currentMatch.status === 'success' ? 'bg-emerald-500' : 'bg-red-500'
                        }`}>
                          {currentMatch.status === 'success' ? (
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          ) : (
                            <XCircle className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">{currentMatch.employeeName}</p>
                          <p className="text-white/60 text-sm">
                            {currentMatch.status === 'success'
                              ? `Matched • ${currentMatch.confidence}% confidence • Attendance marked`
                              : 'No match found in database'}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>

          {/* Stats bar */}
          <div className="px-6 pb-6 grid grid-cols-3 gap-4">
            <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-surface-900 dark:text-white">{stats.total}</div>
              <div className="text-xs text-surface-500 dark:text-surface-400 flex items-center justify-center gap-1">
                <Target className="w-3 h-3" /> Total Scans
              </div>
            </div>
            <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{stats.successful}</div>
              <div className="text-xs text-surface-500 dark:text-surface-400 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Successful
              </div>
            </div>
            <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-red-500 dark:text-red-400">{stats.failed}</div>
              <div className="text-xs text-surface-500 dark:text-surface-400 flex items-center justify-center gap-1">
                <XCircle className="w-3 h-3" /> Failed
              </div>
            </div>
          </div>
        </motion.div>

        {/* Scan History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card overflow-hidden"
        >
          <div className="p-6 border-b border-surface-200 dark:border-surface-700">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Scan History</h3>
          </div>
          <div className="divide-y divide-surface-200 dark:divide-surface-700 max-h-[600px] overflow-y-auto">
            {scanHistory.length === 0 ? (
              <div className="p-8 text-center">
                <Scan className="w-12 h-12 text-surface-300 dark:text-surface-600 mx-auto mb-3" />
                <p className="text-surface-500 dark:text-surface-400 text-sm">No scans yet</p>
              </div>
            ) : (
              scanHistory.map((scan, i) => (
                <motion.div
                  key={scan.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="p-4 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                      scan.status === 'success' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'
                    }`}>
                      {scan.status === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500 dark:text-red-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{scan.employeeName}</p>
                      <div className="flex items-center gap-2 text-xs text-surface-500 dark:text-surface-400">
                        <Clock className="w-3 h-3" />
                        {new Date(scan.timestamp).toLocaleTimeString()}
                        {scan.confidence > 0 && (
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">{scan.confidence}%</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Info Cards */}
      <div className="grid sm:grid-cols-3 gap-6">
        {[
          { icon: Zap, title: 'Processing Speed', value: '<100ms', desc: 'Average recognition time', gradient: 'from-amber-500 to-orange-500' },
          { icon: Target, title: 'Match Accuracy', value: '96.8%', desc: 'Using 128-d embeddings', gradient: 'from-primary-500 to-indigo-500' },
          { icon: Activity, title: 'Database Size', value: `${employees.filter(e => e.faceRegistered).length} faces`, desc: 'Registered in pgvector', gradient: 'from-emerald-500 to-teal-500' },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="card p-6"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-surface-900 dark:text-white">{card.value}</div>
              <div className="text-sm font-medium text-surface-700 dark:text-surface-300">{card.title}</div>
              <div className="text-xs text-surface-500 dark:text-surface-400">{card.desc}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
