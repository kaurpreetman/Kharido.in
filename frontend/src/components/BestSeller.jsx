import React, { useEffect, useState, useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import { ProductCard } from './ui/ProductCard';



const BestSeller = () => {

  return (
    <div className=''>
      <div className='text-center text-3xl'>
        <Title text1={'BEST'} text2={'SELLERS'} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          Discover our top-selling products, loved by customers for their quality, value, and style. Handpicked favorites that you don't want to miss!
        </p>
      </div>

     
    </div>
  )
}

export default BestSeller
