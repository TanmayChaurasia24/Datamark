import React from 'react'

const Button = (props: any) => {
  return (
    <div>
      <button className="bg-blue-700 cursor-pointer rounded-full p-2 flex justify-center items-center">{props.content}</button>
    </div>
  )
}

export default Button
