import React, { useState, useEffect, useCallback } from 'react';
import { Mail, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { OtpVerificationFormProps } from '@/lib/types'; 

const RESEND_COOLDOWN_SECONDS = 15;

const OtpVerificationForm: React.FC<OtpVerificationFormProps> = ({ 
    customerId, 
    customerName, 
    customerEmail,
    onVerificationSuccess, 
    onBack 
}) => {
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'info' | 'success' | 'error'>('info');
    const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN_SECONDS);

    // Timer effect
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setInterval(() => {
                setResendTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [resendTimer]);

    const getMessageStyle = useCallback(() => {
        switch (messageType) {
            case 'success':
                return "text-green-700 bg-green-100 border-green-300";
            case 'error':
                return "text-red-700 bg-red-100 border-red-300";
            case 'info':
            default:
                return "text-blue-700 bg-blue-100 border-blue-300";
        }
    }, [messageType]);

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setIsLoading(true);

        try {
            // Updated API endpoint
            const response = await fetch("/api/onboard/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ customerId, otp }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessageType('success');
                setMessage(data.message || "Verification successful! Account is now verified.");
                onVerificationSuccess(data.status); // data.status should be 'VERIFIED'
            } else {
                setMessageType('error');
                setMessage(data.message || "Verification failed. Please check your OTP.");
            }
        } catch (error) {
            setMessageType('error');
            setMessage("An unknown error occurred during verification.");
            console.error("Verification Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = useCallback(async () => {
        if (resendTimer > 0 || isLoading) return;

        setMessage('');
        setIsLoading(true);

        try {
            // Updated API endpoint
            const response = await fetch("/api/onboard/resend-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ customerId }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessageType('info');
                setMessage(data.message || "New verification code sent successfully!");
                setResendTimer(RESEND_COOLDOWN_SECONDS); // Start cooldown
            } else {
                setMessageType('error');
                setMessage(data.message || "Failed to resend code.");
            }
        } catch (error) {
            setMessageType('error');
            setMessage("An unknown error occurred during resend.");
            console.error("Resend Error:", error);
        } finally {
            setIsLoading(false);
        }
    }, [customerId, resendTimer, isLoading]);

    const isVerificationSuccessful = messageType === 'success';

    return (
        <div className="w-full max-w-lg p-8 space-y-8 bg-white shadow-xl rounded-xl">
            <div className="flex flex-col items-center space-y-3">
                <div className="p-3 bg-blue-100 rounded-full">
                    <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900">
                    Verify Your Email
                </h2>
                <p className="text-center text-gray-500">
                    Hello <span className="font-semibold text-blue-700">{customerName}</span>, a 6-digit code has been sent to <span className="font-mono text-blue-700">{customerEmail}</span>.
                </p>
            </div>

            {message && (
                <div className={`p-3 border rounded-lg flex items-center gap-3 ${getMessageStyle()}`} role="alert">
                    {messageType === 'success' && <CheckCircle className="w-5 h-5" />}
                    {messageType === 'error' && <XCircle className="w-5 h-5" />}
                    {messageType === 'info' && <Mail className="w-5 h-5" />}
                    <span className="text-sm font-medium">{message}</span>
                </div>
            )}

            <form className="space-y-6" onSubmit={handleOtpSubmit}>
                {/* OTP Input Field */}
                <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                        Verification Code (6 Digits)
                    </label>
                    <div className="mt-1">
                        <input
                            id="otp"
                            name="otp"
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            required
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                            className="block w-full px-4 py-3 text-lg text-center tracking-widest border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-150"
                            placeholder="______"
                            disabled={isLoading || isVerificationSuccessful}
                        />
                    </div>
                </div>

                {/* Verify Button */}
                <button
                    type="submit"
                    className="flex justify-center w-full px-4 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 disabled:opacity-50"
                    disabled={isLoading || otp.length !== 6 || isVerificationSuccessful}
                >
                    {isLoading && messageType !== 'info' ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        'Verify Account'
                    )}
                </button>
            </form>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button
                    onClick={onBack}
                    className="font-medium text-gray-500 hover:text-gray-700 transition duration-150 text-sm"
                    disabled={isLoading || isVerificationSuccessful}
                >
                    &larr; Start Over
                </button>
                
                <div className="flex items-center space-x-2">
                    {resendTimer > 0 && !isVerificationSuccessful ? (
                        <span className="text-sm text-gray-500">
                            Resend in <span className="font-mono text-blue-600">{resendTimer}s</span>
                        </span>
                    ) : (
                        <button
                            onClick={handleResendOtp}
                            className={`font-semibold text-blue-600 hover:text-blue-500 transition duration-150 text-sm ${isLoading || isVerificationSuccessful ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isLoading || isVerificationSuccessful}
                        >
                            {isLoading && messageType === 'info' ? <Loader2 className="w-4 h-4 inline mr-1 animate-spin" /> : 'Resend Code'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OtpVerificationForm;