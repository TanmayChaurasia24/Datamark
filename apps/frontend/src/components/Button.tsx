import React from 'react'
import { useRouter } from 'next/navigation'

const Button = (props: any) => {
  const router = useRouter();
  return (
    <div>
      <button onClick={() => router.push(props.routeto)} className="bg-blue-700 cursor-pointer rounded-full p-2 flex justify-center items-center">{props.content}</button>
    </div>
  )
}

export default Button
