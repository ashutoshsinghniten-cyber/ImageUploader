import { Account, ID } from "appwrite";
import { client as appwriteClient } from "./client";


export class AuthService{
 client = appwriteClient
  account;

  constructor() {
    this.account = new Account(this.client);
  }

    async createAccount({email, password, name}){
        try{
            const userAccount = await this.account.create(ID.unique(), email, password, name);

            if(userAccount){
                //use Another service to create a user profile in the database
                return this.login({email, password});
            }
            else{
                return userAccount;
            }
        }
        catch(error){
            throw error;
        }
    }
    
    async login({email, password}){
        try{
            return await this.account.createEmailPasswordSession(email, password);
        }
        catch(error){
            throw error;
        }
    }
    async getCurrentUser(){
        try{
            return await this.account.get();
        }
        catch(error){
            throw error;
        }
        return null;
    }
    async logout(){
        try{
            return await this.account.deleteSessions();
        }
        catch(error){
            throw error;
        }
    }
}
const authService = new AuthService();
export default authService;