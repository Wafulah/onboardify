import React from 'react';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface CompleteScreenProps {
    customerName: string;
    finalStatus: string;
}

const CompleteScreen: React.FC<CompleteScreenProps> = ({ customerName, finalStatus }) => {
    return (
        <div className="w-full max-w-lg p-8 space-y-6 text-center bg-white shadow-xl rounded-xl">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
            <h2 className="text-3xl font-extrabold text-gray-900">
                Verification Complete! 🎉
            </h2>
            <p className="text-lg text-gray-600">
                <span className="font-bold text-blue-700">{customerName}</span>&apos;s account is now officially{' '}
                <span className="font-bold text-green-600">{finalStatus}</span>.
            </p>
            <Link
                href="/onboarding"
                className="inline-block font-medium text-blue-600 hover:text-blue-500 transition duration-150"
            >
                Start New Onboarding
            </Link>
        </div>
    );
};

export default CompleteScreen;
