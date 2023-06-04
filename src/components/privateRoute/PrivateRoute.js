import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'

import {useAuth} from '../../contexts/AuthContext'
import 'firebase/compat/auth'
import "firebase/compat/firestore"

export default function PrivateRoute() {
    const { currentUser } = useAuth()
  
    // return (
    //   <Route
    //     {...rest}
    //     render={props => {
    //       return currentUser ? <Outlet {...props} /> : <Navigate to="/auth" />
    //     }}
    //   ></Route>
    // )

    return(
      currentUser? <Outlet/> : <Navigate to="/auth" />
    )
  }
