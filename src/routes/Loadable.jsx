import { Suspense } from "react";


const Loadable=WrappedComponent=>props=>{
    return (
        <Suspense fallback={<></>} >
            <WrappedComponent {...props} />
        </Suspense>
    )
}
export default Loadable;