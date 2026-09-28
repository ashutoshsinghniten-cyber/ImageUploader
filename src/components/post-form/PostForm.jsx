import React, {useCallback, useEffect, useState} from 'react'
import {Input, Select, RTE, Button} from '../index'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import service from '../../Appwrite/config'
import { useForm } from 'react-hook-form'
function PostForm({post}) {
    const {register, handleSubmit, watch, setValue, control, getValues, formState: {errors, isSubmitting}} = useForm({
        defaultValues :{
            title:post?.title || "" ,
            slug: post?.$id ||"",
            content:post?.content ||"",
            status:post?.status|| "active",

        }
    });
    const navigate= useNavigate();
    const userData = useSelector(state=> state.auth.userData)
    const [submitError, setSubmitError] = useState("")
    const [previewUrl, setPreviewUrl] = useState("")

    useEffect(()=>{
        if(!post?.featuredImage) return
        let isCurrent = true
        service.getFileView(post.featuredImage)
            .then((url)=>{
                if(isCurrent) setPreviewUrl(url.toString())
            })
            .catch((error)=> console.error("Unable to load post image", error))
        return ()=>{ isCurrent = false }
    }, [post?.featuredImage])

    const submit = async(data)=>{
        setSubmitError("")
        try {
            const selectedImage = data.image?.[0]
            const file = selectedImage ? await service.uploadFile(selectedImage) : null
            if(selectedImage && !file){
                throw new Error("Image upload failed. Check your Appwrite storage settings and permissions.")
            }
            if(post){
                if(file){
                    await service.deleteFile(post.featuredImage)
                }
                const dbPost = await service.updatePost(post.$id, {
                    ...data,
                    featuredImage: file ? file.$id : post.featuredImage
                })
                if(!dbPost){
                    throw new Error("Post update failed. Check your Appwrite collection settings and permissions.")
                }
                navigate(`/post/${dbPost.$id}`)
                return
            }

            if(!file){
                throw new Error("Choose a featured image before submitting.")
            }
            if(!userData?.$id){
                throw new Error("You must be signed in to create a post.")
            }
            const dbPost = await service.createPost({
                ...data,
                featuredImage: file.$id,
                userId: userData.$id
            })
            if(!dbPost){
                throw new Error("Post creation failed. Check your Appwrite collection settings and permissions.")
            }
            navigate(`/post/${dbPost.$id}`)
        } catch (error) {
            setSubmitError(error.message || "Unable to submit the post.")
        }
    }

    const slugTransform = useCallback((value)=>{
        if(value && typeof value === "string"){
            return value.trim()
            .toLowerCase()
            .replace(/[^a-zA-Z\d\s]+/g, "-")
            .replace(/\s/g, "-");
        }
        return ""
    }, [])
    useEffect(()=>{
        const subscription = watch((value, {name})=>{
            if(name==='title'){

                setValue("slug", slugTransform(value.title), {shouldValidate:true})
            }
        })
        return ()=> subscription.unsubscribe();
    } ,[slugTransform, setValue, watch])
  return (
    <form onSubmit={handleSubmit(submit)} className='flex flex-wrap'>
        <div className='w-2/3 px-2'>
            <Input 
                label="Title:"
                placeholder="  title"
                className='mb-4'
                {...register("title", {required:"Title is required."})}
            />
            <Input 
                label="Slug :"
                placeholder="   slug"
                className="mb-4"
                {...register("slug", {required:"Slug is required."})}
                onInput = {
                    (e)=>{
                        setValue("slug", slugTransform(e.currentTarget.value), {shouldValidate:true,})
                    }
                }
            />
            <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
        </div>
        <div className='w-1/3 px-2'>
            <Input 
                label="Featured Image :"
                type="file"
                className="mb-4"
                accept="image/png, image/jpg, image/jpeg, image/gif"
                {...register("image", {required:post ? false : "Choose a featured image."})}
            />
            {post && (
                <div className='mb-4 w-full'>
                    {previewUrl && <img
                        src={previewUrl}
                        alt={post.title}
                        className='rounded-lg'
                    />}
                </div>
            )}
            <Select
                options={["active", "inactive"]}
                label="Status:"
                className='mb-4'
                {...register("status", {required:"Choose a post status."})}
            />
            {(submitError || errors.title || errors.slug || errors.image || errors.status) && (
                <p role="alert" className="mb-4 text-red-600">
                    {submitError || errors.title?.message || errors.slug?.message || errors.image?.message || errors.status?.message}
                </p>
            )}
            <Button className='w-full' type='submit' disabled={isSubmitting} bgColor={post? "bg-green-500" : undefined}>
                {isSubmitting ? "Submitting..." : post ? "Update" : "Submit"}
            </Button>
        </div>
    </form>
  )
}

export default PostForm
