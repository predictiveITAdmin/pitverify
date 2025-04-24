import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-center text-sm text-gray-600 py-3 mt-10">
      &copy; {new Date().getFullYear()} PredictiveIT. All rights reserved.
    </footer>
  )
}

export default Footer