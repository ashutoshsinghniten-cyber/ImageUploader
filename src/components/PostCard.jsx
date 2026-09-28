import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import parse from 'html-react-parser'
import service from '../Appwrite/config'
function PostCard({$id, title, content, featuredImage}) {
  const [imageUrl, setImageUrl] = useState("")

  useEffect(()=>{
    let isCurrent = true
    service.getFileView(featuredImage)
      .then((url)=>{
        if(isCurrent) setImageUrl(url.toString())
      })
      .catch((error)=> console.error("Unable to load post image", error))
    return ()=>{ isCurrent = false }
  }, [featuredImage])

  return (
      <div className='w-full bg-gray-100 rounded-xl p-4'>
        <Link to={`/post/${$id}`}>
            <div className='w-full mb-4 text-center'>
                {imageUrl && <img src={imageUrl} alt={title} className='aspect-video w-full rounded-xl bg-gray-200 object-contain'/>}
            </div>
            <h2 className='font-bold text-xl'>{title}</h2>
        </Link>
        <div className='mt-2 text-sm text-gray-700'>
          {parse(content || "")}
        </div>
        </div>
  )
}

export default PostCard
