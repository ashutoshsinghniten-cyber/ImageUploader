import React, {useState, useEffect} from 'react'
import service from '../Appwrite/config'
import { Container, PostCard } from '../components'
import { Query } from 'appwrite'
import { useSelector } from 'react-redux'
function AllPosts() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const userData = useSelector((state)=>state.auth.userData)
  useEffect(()=>{
        if(!userData?.$id){
            setPosts([])
            setLoading(false)
            return
        }
        setLoading(true)
        service.getPosts([
            Query.equal("status", "active"),
            Query.equal("userId", userData.$id),
        ]).then((post)=>{
            if(post){
                setPosts(post.documents ?? [])
            }
        })
        .finally(()=>setLoading(false))
  },[userData?.$id])
  if(loading){
    return <div className='w-full py-8'><Container>Loading your posts...</Container></div>
  }
  return (
    <div className='w-full py-8'>
        <Container>
            <h1 className='mb-4 px-2 font-bold text-2xl'>My active posts</h1>
            <div className='flex flex-wrap'>
                {posts.map((post)=>(
                    <div key={post.$id} className='w-full p-2 sm:w-1/2 lg:w-1/4'>
                        <PostCard {...post}/>
                    </div>
                ))}
            </div>
        </Container>
    </div>
  )
}

export default AllPosts
