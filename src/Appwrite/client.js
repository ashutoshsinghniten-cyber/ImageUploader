import { Client } from "appwrite";
import conf from "../Conf/conf";

export const client = new Client()
  .setEndpoint(conf.appwriteUrl)
  .setProject(conf.appwriteProjectId);