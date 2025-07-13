import React from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate } from 'react-router';
import Loading from '../Pages/Shared/Loading';

const PrivateRoutes = ({children}) => {
    const {user, loading} =useAuth();
    if(loading){
        return Loading
    }
    if(!user){
       return <Navigate  state={{ from: location.pathname }} to='/login'></Navigate>
    }
    return children;
};

export default PrivateRoutes;