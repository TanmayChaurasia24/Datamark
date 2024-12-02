import React from 'react'
import Button from './Button'
const Appbar = () => {
  return (
    <nav className='h-[10vh] bg-slate-900'>
        <div className='flex justify-between items-center h-[100%] p-4'>
            <div className='logo font-bold text-4xl'>DataMark</div>
            <Button content="Connect Wallet"/>
        </div>
    </nav>
  )
}

export default Appbar
