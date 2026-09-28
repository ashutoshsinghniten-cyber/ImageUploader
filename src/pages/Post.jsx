import React, {useState, useEffect} from 'react'
import {Container, Button } from "../components"
import service from '../Appwrite/config'
import { useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import parse from 'html-react-parser'
function Post() {
    const [post, setPost]= useState()
    const [imageUrl, setImageUrl] = useState("")
    const [imageSize, setImageSize] = useState(100)
    const {slug} = useParams()
    const navigate= useNavigate()
    const userData = useSelector(state => state.auth.userData)
    const isAuthor = post && userData ? post.userId ===userData.$id:false
    useEffect(()=>{
        if(slug){
            service.getPost(slug).then((post)=>{
                if(post){
                    setPost(post)
                }
                else{
                    navigate('/')
                }
            })
        }else{
            navigate('/')
        }
    },[slug, navigate])

    useEffect(()=>{
        if(!post?.featuredImage) return
        let isCurrent = true
        service.getFileView(post.featuredImage)
            .then((url)=>{
                if(isCurrent) setImageUrl(url.toString())
            })
            .catch((error)=> console.error("Unable to load post image", error))
        return ()=>{ isCurrent = false }
    }, [post?.featuredImage])

    const deletePost=()=>{
        service.deletePost(post.$id).then((status)=>{
            if(status){
                service.deleteFile(post.featuredImage)
                navigate("/")
            }
        })
    }
  return post?(
    <div className='py-8'>
        <Container>
            <div className='w-full border rounded-lg mb-2 flex justify-center relative p-2'>
                {imageUrl && <img 
                    src={imageUrl}
                    alt={post.title}
                    className='max-h-[70vh] max-w-full rounded-lg object-contain'
                    style={{width: `${imageSize}%`}}
                />}
                {isAuthor && (
                    <div className='absolute right-6 top-6 '>
                        <Link to={`/edit-post/${post.$id}`}>
                            <Button bgColor='bg-green-500' className='mr-3'>Edit</Button>
                        </Link>
                        <Button bgColor='bg-red-500' onClick={deletePost} >Delete</Button>
                    </div>
                )}
            </div>
            <div className='w-full mb-4'>
                <h1 className='font-bold text-2xl'>{post.title}</h1>
            </div>
            <div className='browser-css mb-6'>
                {parse(post.content)}
            </div>
            {imageUrl && (
                <div className='mb-6 flex max-w-sm items-center gap-3'>
                    <label htmlFor='post-image-size' className='shrink-0'>Image size</label>
                    <input
                        id='post-image-size'
                        type='range'
                        min='25'
                        max='100'
                        step='5'
                        value={imageSize}
                        onChange={(event)=>setImageSize(Number(event.target.value))}
                        className='w-full'
                    />
                    <output htmlFor='post-image-size' className='w-12 text-right'>{imageSize}%</output>
                </div>
            )}
        </Container>
    </div>
  ):null
}

export default Post
