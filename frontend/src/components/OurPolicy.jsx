import React from 'react'
import { Repeat, RotateCcw, Headphones } from 'lucide-react';

const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-16 sm:gap-8 text-center py-10 text-gray-700 dark:text-gray-300'>
      
      <div className='py-8 flex flex-col items-center'>
        <div className="p-4 bg-primary-100 dark:bg-primary-900 rounded-full mb-6">
          <Repeat className='w-16 h-16 text-primary-600 dark:text-primary-400' />
        </div>
        <p className='font-semibold text-lg'>Easy Exchange Policy</p>
        <p className='text-gray-500 dark:text-gray-400 text-base'>We offer hassle-free exchange policy</p>
      </div>

      <div className='py-8 flex flex-col items-center'>
        <div className="p-4 bg-secondary-100 dark:bg-secondary-900 rounded-full mb-6">
          <RotateCcw className='w-16 h-16 text-secondary-600 dark:text-secondary-400' />
        </div>
        <p className='font-semibold text-lg'>7 Days Return Policy</p>
        <p className='text-gray-500 dark:text-gray-400 text-base'>We provide 7 days free return policy</p>
      </div>

      <div className='py-8 flex flex-col items-center'>
        <div className="p-4 bg-emerald-100 dark:bg-emerald-900 rounded-full mb-6">
          <Headphones className='w-16 h-16 text-emerald-600 dark:text-emerald-400' />
        </div>
        <p className='font-semibold text-lg'>Best Customer Support</p>
        <p className='text-gray-500 dark:text-gray-400 text-base'>We provide 24/7 customer support</p>
      </div>
    </div>
  )
}

export default OurPolicy
