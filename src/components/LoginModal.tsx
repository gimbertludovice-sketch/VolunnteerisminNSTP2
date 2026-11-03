import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { validateTrimexEmail, generate6DigitOTP } from '../utils/security';
import { ShieldCheck, Mail, Lock, AlertCircle, ArrowRight, CheckCircle2, User, RefreshCw, KeyRound } from 'lucide-react';

interface LoginModalProps {
  onSuccess: (student: Student) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onSuccess }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [email, setEmail] = useState('');
  const [section, setSection] = useState('WITMWD3M1');

  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [errorMsg, setErrorMsg] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [enteredOtp, setEnteredOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSimulatedInbox, setShowSimulatedInbox] = useState(false);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const handleRequestOTP = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMsg('First Name and Last Name are required.');
      return;
    }

    const emailCheck = validateTrimexEmail(email);
    if (!emailCheck.isValid) {
      setErrorMsg(emailCheck.message);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const generated = generate6DigitOTP();
      setOtpCode(generated);
      setStep('otp');
      setResendTimer(60);
      setIsSubmitting(false);
      setShowSimulatedInbox(true);
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const joined = enteredOtp.join('');
    if (joined.length !== 6) {
      setErrorMsg('Please input all 6 digits of the OTP code.');
      return;
    }

    if (joined !== otpCode) {
      setErrorMsg('Incorrect OTP code. Please check the code sent to your Trimex email.');
      return;
    }

    // Success!
    const verifiedStudent: Student = {
      id: `std_${Date.now()}`,
      studentNumber: studentNumber.trim() || `2024-${Math.floor(10000 + Math.random() * 90000)}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      section: section.trim() || 'WITMWD3M1',
      loginTime: new Date().toLocaleString(),
      isVerified: true
    };

    onSuccess(verifiedStudent);
  };

  const handleOtpDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pasted = value.slice(0, 6).split('');
      const newOtp = [...enteredOtp];
      pasted.forEach((char, i) => {
        if (i < 6) newOtp[i] = char;
      });
      setEnteredOtp(newOtp);
      return;
    }

    const newOtp = [...enteredOtp];
    newOtp[index] = value;
    setEnteredOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !enteredOtp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleQuickFillGimbert = () => {
    setFirstName('Gimbert');
    setLastName('Ludovice');
    setStudentNumber('2024-03912');
    setEmail('gimbertludovice@student.trimexcolleges.edu.ph');
    setSection('WITMWD3M1');
  };

  const handleQuickFillStudent = () => {
    setFirstName('Alexander');
    setLastName('Cruz');
    setStudentNumber('2024-08144');
    setEmail('alexandercruz@student.trimexcolleges.edu.ph');
    setSection('WITMWD3M1');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#040814]/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-xl card-3d-luxury rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-amber-500/30">
        
        {/* Subtle Decorative Golden Glow Orbs */}
        <div className="absolute -top-24 -right-24 w-52 h-52 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-52 h-52 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            Trimex Colleges Institutional Portal
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-serif">
            Volunteerism on NSTP 2
          </h2>
          
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Official Examination & Learning Module System
          </p>
          <div className="text-[11px] text-amber-300/80 mt-1 font-mono">
            Presenter: Gimbert B. Ludovice · Section WITMWD3M1
          </div>
        </div>

        {/* Error Notification Banner */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start gap-3 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMsg}</div>
          </div>
        )}

        {/* STEP 1: Student Credentials */}
        {step === 'credentials' && (
          <form onSubmit={handleRequestOTP} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  First Name <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Juan"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 focus:border-amber-400 focus:outline-none text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Last Name <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Dela Cruz"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 focus:border-amber-400 focus:outline-none text-white text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Student ID Number
                </label>
                <input
                  type="text"
                  value={studentNumber}
                  onChange={(e) => setStudentNumber(e.target.value)}
                  placeholder="e.g. 2024-01928"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 focus:border-amber-400 focus:outline-none text-white text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Section
                </label>
                <input
                  type="text"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  placeholder="WITMWD3M1"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 focus:border-amber-400 focus:outline-none text-white text-sm"
                />
              </div>
            </div>

            {/* Email Field with Strict Trimex Domain Notice */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Trimex Institutional Email <span className="text-amber-400">*</span>
                </label>
                <span className="text-[10px] text-amber-300 font-mono">
                  @student.trimexcolleges.edu.ph
                </span>
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@student.trimexcolleges.edu.ph"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 focus:border-amber-400 focus:outline-none text-white text-sm font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-amber-400" />
                Cybersecurity Policy: Personal emails (@gmail, @yahoo) are strictly rejected.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl gold-button text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating Institutional OTP...
                </>
              ) : (
                <>
                  <span>Request 6-Digit OTP Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Quick Demo Pre-fill Links for testing */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Quick Test Autofill:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleQuickFillGimbert}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-mono cursor-pointer"
                >
                  Gimbert (Author)
                </button>
                <button
                  type="button"
                  onClick={handleQuickFillStudent}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono cursor-pointer"
                >
                  Student Demo
                </button>
              </div>
            </div>

          </form>
        )}

        {/* STEP 2: OTP Verification */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            
            {/* Simulated Trimex Webmail Notification Preview */}
            {showSimulatedInbox && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/40 relative shadow-inner">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold uppercase tracking-wider font-mono">
                    <Mail className="w-3.5 h-3.5" />
                    Trimex Webmail Simulator (Incoming Inbox)
                  </div>
                  <span className="text-[10px] text-slate-400">Just Now</span>
                </div>
                <div className="text-xs text-slate-300 font-mono">
                  To: <span className="text-white font-semibold">{email}</span>
                </div>
                <div className="mt-2 p-2.5 rounded-xl bg-slate-950/80 border border-amber-500/30 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Your Single-Use OTP:</div>
                    <div className="text-xl font-black font-mono tracking-widest text-amber-300">
                      {otpCode}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEnteredOtp(otpCode.split(''));
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/50 text-amber-300 text-xs font-semibold cursor-pointer"
                  >
                    Auto-Fill Code
                  </button>
                </div>
              </div>
            )}

            <div className="text-center">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                Enter 6-Digit OTP Verification Code
              </label>

              {/* 6 Digit Input Boxes */}
              <div className="flex justify-center gap-2 sm:gap-3">
                {enteredOtp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-10 sm:w-12 h-12 sm:h-14 text-center text-xl font-black rounded-xl bg-slate-900 border-2 border-slate-700 focus:border-amber-400 focus:bg-slate-950 focus:outline-none text-amber-300 font-mono transition-all"
                  />
                ))}
              </div>
            </div>

            {/* Resend & Timer */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
              <button
                type="button"
                onClick={() => setStep('credentials')}
                className="hover:text-amber-300 underline cursor-pointer"
              >
                Change Email / Name
              </button>

              <div>
                {resendTimer > 0 ? (
                  <span className="font-mono text-slate-400">Resend in {resendTimer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleRequestOTP()}
                    className="text-amber-300 font-semibold hover:underline cursor-pointer"
                  >
                    Resend New OTP
                  </button>
                )}
              </div>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl gold-button text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/25"
            >
              <KeyRound className="w-4 h-4" />
              <span>Verify OTP & Enter Examination</span>
            </button>

          </form>
        )}

        {/* Security Disclaimers */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-300 space-y-1 text-center font-mono">
          <div className="flex items-center justify-center gap-1.5 text-amber-400/90 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            256-bit Institutional Anti-Cheat Proctoring Enabled
          </div>
          <div>Passing Score: 15 / 20 · Alt+Tab Monitoring Active</div>
        </div>

      </div>
    </div>
  );
};
