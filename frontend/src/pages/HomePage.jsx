import Delivery from '@/components/Delivery'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import PopularProducts from '@/components/PopularProducts'
import ThreeDChocolateSection from '@/components/ThreeDChocolateSection'
import React from 'react'

const HomePage = () => {
  return (
    <div className='mx-5 md:mx-auto max-w-screen-xl font-poppins '>
      
      <Hero />
      <ThreeDChocolateSection />
      <PopularProducts />
      <Delivery/>
      
    </div>
  )
}

export default HomePage
