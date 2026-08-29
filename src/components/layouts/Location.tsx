import React from 'react'

const Location: React.FC = () => {
  return (
      <div className='absolute w-full h-screen bg-primaryColor bg-opacity-20 top-0 left-0 z-[1000] grid place-content-center'>
          <div className='w-[400px] h-[500px] bg-mainColor custom-shadow rounded-md'>
              <h1>Input your location</h1>
              <button>Use your current Location</button>
          </div>
    </div>
  )
}

export default Location