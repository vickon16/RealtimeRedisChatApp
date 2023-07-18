import AddFriendButton from '@/components/AddFriendButton'
import React from 'react'

const AddPage = async () => {

  return (
    <section className='p-10 px-4'>
      <h1 className='font-bold text-clampBase mb-8'>Add a friend</h1>
      <AddFriendButton />
    </section>
  )
}

export default AddPage