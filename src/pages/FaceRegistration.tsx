import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, CheckCircle2, AlertCircle, RotateCcw, User,
  ChevronRight, ChevronLeft, Scan, Sparkles, Loader2
} from 'lucide-react';

type Step = 'select' | 'capture' | 'processing' | 'complete';

interface CaptureState {
  samples: number;
  targetSamples: number;
  quality: number;
  faceDetected: boolean;
}

export default function FaceRegistration() {
  const [step, setStep] = useState<Step>('select');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [capture, setCapture] = useState<CaptureState>({
    samples: 0,
    targetSamples: 5,
    quality: 0,
    faceDetected: false,
  });
  const [processing, setProcessing] = useState(0);
  const videoRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);

  const employees = [
    'James Smith', 'Sarah Johnson', 'Michael Williams', 'Emily Brown',
    'David Jones', 'Jessica Garcia', 'Robert Miller', 'Ashley Davis'
  ];

  const startCapture = useCallback(() => {
    setStep('capture');
    setCapture({ samples: 0, targetSamples: 5, quality: 0, faceDetected: false });

    // Simulate face detection
    intervalRef.current = window.setInterval(() => {
      setCapture(prev => {
        const faceDetected = Math.random() > 0.2;
        const quality = faceDetected ? Math.floor(Math.random() * 15) + 85 : 0;
        const newSamples = faceDetected && prev.quality > 80 ? Math.min(prev.samples + 1, prev.targetSamples) : prev.samples;
        
        if (newSamples >= prev.targetSamples) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setTimeout(() => setStep('processing'), 500);
        }
        
        return { ...prev, faceDetected, quality, samples: newSamples };
      });
    }, 1500);
  }, []);

  useEffect(() => {
    if (step === 'processing') {
      const interval = setInterval(() => {
        setProcessing(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep('complete'), 500);
            return 100;
          }
          return prev + Math.floor(Math.random() * 8) + 3;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [step]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const resetWizard = () => {
    setStep('select');
    setSelectedEmployee('');
    setProcessing(0);
    setCapture({ samples: 0, targetSamples: 5, quality: 0, faceDetected: false });
  };

  const steps = [
    { key: 'select', label: 'Select Employee' },
    { key: 'capture', label: 'Capture Face' },
    { key: 'processing', label: 'Processing' },
    { key: 'complete', label: 'Complete' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Steps */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-surface-100">
        <div className="flex items-center justify-between">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  step === s.key ? 'bg-primary-600 text-white scale-110' :
                  steps.findIndex(x => x.key === step) > i ? 'bg-accent-500 text-white' :
                  'bg-surface-200 text-surface-500'
                }`}>
                  {steps.findIndex(x => x.key === step) > i ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${
                  step === s.key ? 'text-primary-700' : 'text-surface-500'
                }`}>{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <ChevronRight className="w-4 h-4 text-surface-300 mx-2 hidden sm:block" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {/* Step 1: Select Employee */}
        {step === 'select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-surface-100"
          >
            <h3 className="text-xl font-semibold text-surface-900 mb-2">Select Employee</h3>
            <p className="text-surface-500 mb-6">Choose the employee to register their face for attendance tracking.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {employees.map((emp) => (
                <button
                  key={emp}
                  onClick={() => setSelectedEmployee(emp)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    selectedEmployee === emp
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-surface-200 hover:border-surface-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium text-surface-900">{emp}</span>
                </button>
              ))}
            </div>

            <button
              onClick={startCapture}
              disabled={!selectedEmployee}
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              Continue to Capture
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {/* Step 2: Capture Face */}
        {step === 'capture' && (
          <motion.div
            key="capture"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-surface-100"
          >
            <h3 className="text-xl font-semibold text-surface-900 mb-2">Capture Face Samples</h3>
            <p className="text-surface-500 mb-6">Position your face in the frame. We need {capture.targetSamples} clear samples.</p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Camera View */}
              <div className="relative aspect-square bg-surface-900 rounded-2xl overflow-hidden">
                <div ref={videoRef} className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-surface-600 mx-auto mb-3" />
                    <p className="text-surface-400 text-sm">Camera Feed</p>
                  </div>
                </div>

                {/* Face outline */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-48 h-48 rounded-full border-4 transition-colors duration-300 ${
                    capture.faceDetected ? 'border-accent-400' : 'border-white/30'
                  }`}>
                    {capture.faceDetected && (
                      <div className="absolute inset-0 rounded-full border-4 border-accent-400 animate-pulse-ring" />
                    )}
                  </div>
                </div>

                {/* Scan line */}
                {capture.faceDetected && (
                  <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent-400 to-transparent animate-scan-line" />
                )}

                {/* Status overlay */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                    capture.faceDetected ? 'bg-accent-500/20 text-accent-300' : 'bg-red-500/20 text-red-300'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${capture.faceDetected ? 'bg-accent-400' : 'bg-red-400'} animate-pulse`} />
                    {capture.faceDetected ? 'Face Detected' : 'No Face'}
                  </div>
                  <div className="px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-medium">
                    {capture.samples}/{capture.targetSamples}
                  </div>
                </div>
              </div>

              {/* Info Panel */}
              <div className="space-y-4">
                <div className="bg-surface-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-surface-700">Quality Score</span>
                    <span className={`text-sm font-bold ${capture.quality > 80 ? 'text-accent-600' : 'text-amber-600'}`}>
                      {capture.quality}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-surface-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        capture.quality > 80 ? 'bg-accent-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${capture.quality}%` }}
                    />
                  </div>
                </div>

                <div className="bg-surface-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-surface-700">Samples Captured</span>
                    <span className="text-sm font-bold text-primary-600">{capture.samples}/{capture.targetSamples}</span>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: capture.targetSamples }).map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                          i < capture.samples ? 'bg-primary-500' : 'bg-surface-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">Tips for best results:</h4>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Ensure good lighting on your face</li>
                    <li>• Look directly at the camera</li>
                    <li>• Keep a neutral expression</li>
                    <li>• Remove glasses if possible</li>
                  </ul>
                </div>

                <button
                  onClick={() => {
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    setStep('select');
                  }}
                  className="w-full py-3 border-2 border-surface-200 hover:border-surface-300 text-surface-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Go Back
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Processing */}
        {step === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-surface-100 text-center"
          >
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
              </div>
              <h3 className="text-xl font-semibold text-surface-900 mb-2">Processing Face Data</h3>
              <p className="text-surface-500 mb-6">Generating 128-dimensional face embeddings using ResNet-34...</p>
              
              <div className="w-full h-3 bg-surface-200 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(processing, 100)}%` }}
                />
              </div>
              <p className="text-sm text-surface-500">{Math.min(processing, 100)}% Complete</p>

              <div className="mt-6 space-y-2 text-left">
                {processing > 20 && (
                  <div className="flex items-center gap-2 text-sm text-accent-600">
                    <CheckCircle2 className="w-4 h-4" /> Face detection validated
                  </div>
                )}
                {processing > 50 && (
                  <div className="flex items-center gap-2 text-sm text-accent-600">
                    <CheckCircle2 className="w-4 h-4" /> Embeddings extracted (128-d vectors)
                  </div>
                )}
                {processing > 80 && (
                  <div className="flex items-center gap-2 text-sm text-accent-600">
                    <CheckCircle2 className="w-4 h-4" /> Storing in pgvector database
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 4: Complete */}
        {step === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-surface-100 text-center"
          >
            <div className="max-w-md mx-auto">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-accent-100 flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="w-10 h-10 text-accent-600" />
              </motion.div>
              <h3 className="text-2xl font-semibold text-surface-900 mb-2">Registration Complete!</h3>
              <p className="text-surface-500 mb-6">
                {selectedEmployee}'s face has been successfully registered with {capture.targetSamples} samples.
              </p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-surface-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-primary-600">{capture.targetSamples}</div>
                  <div className="text-xs text-surface-500">Samples</div>
                </div>
                <div className="bg-surface-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-accent-600">128</div>
                  <div className="text-xs text-surface-500">Dimensions</div>
                </div>
                <div className="bg-surface-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-purple-600">97.2%</div>
                  <div className="text-xs text-surface-500">Avg Quality</div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={resetWizard}
                  className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Register Another
                </button>
                <button
                  onClick={resetWizard}
                  className="flex-1 py-3 border-2 border-surface-200 hover:border-surface-300 text-surface-700 rounded-xl font-medium transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
