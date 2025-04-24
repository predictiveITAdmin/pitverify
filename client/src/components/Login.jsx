import React from 'react'

const Login = ({ onLogin }) => {
  return (
     <div className="flex flex-col items-center justify-center text-center mt-20">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to the Employee Verification Portal</h1>
      <p className="text-lg text-gray-600 mb-8">Please log in using your Azure account to continue.</p>
      <button
        onClick={() => window.location.href = 'http://localhost:3001/auth/openid'}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition duration-200 hover:scale-105"
      >
        <span className="inline-flex items-center space-x-2">

          <span>Login with Azure</span>
        </span>
      </button>
    </div>
  )
}

export default Login