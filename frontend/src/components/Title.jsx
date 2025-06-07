import React from 'react'

const Title = ({ text1, text2 }) => {
  return (
    <h2 className='font-bold text-3xl'>
      <span className='text-blue-500'>{text1}</span> {text2}
    </h2>
  );
};

export default Title;

