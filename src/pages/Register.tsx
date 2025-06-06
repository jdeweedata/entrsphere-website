
import React from 'react';
import RegisterForm from '@/components/auth/RegisterForm';

const Register: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img 
            src="/lovable-uploads/4824a6ff-4ee4-49c4-a5e0-681407eaf295.png" 
            alt="EntrSphere Logo" 
            className="w-12 h-12 mx-auto mb-4" 
          />
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Create your account</h2>
          <p className="text-slate-600">Join the EntrSphere team</p>
        </div>
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default Register;
