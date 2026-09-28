import React, {useState, useEffect} from 'react'
import { Container, PostCard } from '../components'
import service from '../Appwrite/config'
import { Query } from 'appwrite'
import { Link } from 'react-router-dom'
function Home() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(()=>{
        service.getPosts([
            Query.equal("status", "active"),
            Query.orderDesc("$createdAt"),
        ]).then((result)=>{
            if(result){
                setPosts(result.documents ?? [])
            }
        })
        .finally(()=>setLoading(false))
    },[])

    if(loading){
        return <div className='w-full py-8'><Container>Loading posts...</Container></div>
    }

    if(posts.length ===0){
        return (
            <div className='w-full py-8 mt-4 text-center'>
            <Container>
                <h1 className='font-bold text-2xl'>No posts yet</h1>
            </Container>
        </div>
        )
    }

    return (
        <div className='w-full py-8'>
            <Container>
                <div className='mb-4 flex items-center justify-between px-2'>
                    <h1 className='font-bold text-2xl'>Explore posts</h1>
                    <Link to='/all-posts' className='font-medium text-blue-700 hover:underline'>View my posts</Link>
                </div>
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

export default Home
