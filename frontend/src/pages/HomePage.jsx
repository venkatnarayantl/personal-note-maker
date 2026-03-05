import React from 'react'
import Navbar from '../components/Navbar'
import RateLimitedUI from '../components/RateLimitedUI'

function HomePage() {
  const [isRateLimited, setIsRateLimited] = React.useState(true);
  return (
    <div className='min-h-screen'>
      <Navbar />
      {isRateLimited && <RateLimitedUI/>}
    </div>
  )
}

export default HomePage