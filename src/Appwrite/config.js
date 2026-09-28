import conf from "../Conf/conf";
import {ID, Databases, Storage, Query, Permission, Role} from 'appwrite'
import { client as appwriteClient } from "./client";

class Service{
    client = appwriteClient;
    databases;
    bucket;

    constructor(){
        this.databases = new Databases(this.client)
        this.bucket = new Storage(this.client)
    }

    async createPost({title, status, featuredImage, userId, content, slug}){
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    status,
                    featuredImage,
                    userId,
                    content,
                    
                }
            ) 
        } catch (error) {
            console.log("App Service :: createPost :: error", error);
            return null;
        }
    }

    async updatePost(slug, {title, featuredImage, content, status}){
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    featuredImage,
                    content,
                    status
                }
            )
        } catch (error) {
            console.log("App Service :: updatePost :: error", error);

        }
    }

    async deletePost(slug){
        try {
            return await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                

            )
            return true;
        } catch (error) {
            console.log("App Service :: deletePost :: error", error);
            return false;
        }

    }

    async getPost(slug){
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
            )
        } catch (error) {
            console.log("App Service :: getPost :: error", error);
            return null;
        }
    }

    async getPosts(query=[Query.equal("status", "active")]){
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                query,
            )
        } catch (error) {
            console.log("App Service :: getPosts :: error", error);
            return false;
        }
    }

    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file,
                [Permission.read(Role.any())],
            )
        } catch (error) {
            console.log("App Service :: uploadFile :: error", error);
            return false;
        }
    }

    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId,
            )
            return true;
        } catch (error) {
            console.log("App Service :: deleteFile :: error", error);
            return false;
        }
    }

    async getFileView(fileId){
        return await this.bucket.getFileView(
            conf.appwriteBucketId,
            fileId,
        )
    }
}
const service = new Service()
export default service