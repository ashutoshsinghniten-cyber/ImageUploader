import React from "react"
import ReactDom from 'react-dom/client'
import App from './App.jsx'
import { client } from './Appwrite/client.js'
import './index.css'
import { Provider } from "react-redux"
import store from './store/store.js'
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Home from "./pages/Home.jsx"
import {AuthLayout, Login} from './components/index.js'
import AddPost from './pages/AddPost.jsx'
import Signup from './pages/Signup.jsx'
import EditPost from "./pages/EditPost.jsx"
import Post from "./pages/Post.jsx"
import AllPosts from "./pages/AllPosts.jsx"

client.ping()
  .then(() => console.info("Appwrite connection successful"))
  .catch((error) => console.error("Appwrite connection failed", error));

const router = createBrowserRouter([
  {
    path:"/",
    element:<App/>,
    children:[
      {
        path:"/",
        element:<Home />
      },
      {
        path:"/login",
        element:(
          <AuthLayout authentication={false} >
            <Login />
          </AuthLayout>
        ),
      },
      {
        path:"/signup",
        element:(
          <AuthLayout authentication={false} >
            <Signup />
          </AuthLayout>
        ),
      },
      {
        path:"/all-posts",
        element:(
          <AuthLayout authentication>
            {" "}
            <AllPosts />
          </AuthLayout>
        ),
      },
      {
        path:"/add-posts",
        element:(
          <AuthLayout authentication>
            {" "}
            <AddPost />
          </AuthLayout>
        )
      },
      {
        path:"/edit-post/:slug",
        element:(
          <AuthLayout authentication>
            {" "}
            <EditPost />
          </AuthLayout>
        ),
      },
      {
        path:"/post/:slug",
        element:<Post />
      },
    ]
  }
])
ReactDom.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
