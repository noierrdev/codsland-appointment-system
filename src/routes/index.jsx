import { lazy } from "react"
import Loadable from "./Loadable"
import { useRoutes } from "react-router-dom"


const AppRoutes=props=>{
    const routes=[
        {
            path:"/",
            element:Loadable(lazy(()=>import("../layouts/Default")))(props),
            children:[
                {
                    path:"",
                    element:Loadable(lazy(()=>import("../pages/")))(props)
                }
            ]
        }
    ]
    return useRoutes(routes)
}
export default AppRoutes