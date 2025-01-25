import React from 'react'

const Footer = () => {
  return (
    <>
    <footer className=" bg-white dark:bg-gray-900 shadow-md mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Portfolio Tracker. All Rights Reserved.
          </p>
        </div>
      </footer>
    </>
  )
}

export default Footer