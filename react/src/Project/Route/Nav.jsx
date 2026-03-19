


import React, { useReducer } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink } from 'react-router';

import { useSelector } from 'react-redux';

import '../css/nav.css';

export const Nav = () => {
    const state = useSelector((state) => state.User); 
    // בדיקה האם המשתמש הנוכחי מנהל
    const manager=()=>{ 
        if(state.Current && (state.Current.Id === '215893132' || state.Current.Id === '325454767')){
   
         return   ( 
        <> 
             <li className="nav-item">
                        <NavLink to="AllRequest" className="nav-link" >see Request</NavLink>
              </li>
         </>  
       ) } 
       return null
    }
    return (
    
        <nav className="navbar navbar-expand navbar-dark bg-dark" >
            {console.log(state.Current)}
            
           <NavLink className="nav-link" to="home">   <img src="../logo7.png" className="navbar-brand" width={70} ></img> </NavLink>
            
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav mr-auto" style={{ width: '100%', justifyContent: 'space-evenly' }}>
                    <li className="nav-item active">
                        <NavLink className="nav-link" to="home">  Home</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="SendRequest"className="nav-link">SendRequest</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="MyStatus" className="nav-link" >See status</NavLink>
                    </li>
                     {manager()}
                     {/* יציג רק כששם שמשתמש מלא */}
                     {state.Current?.name? <li className="nav-item nav-link" style={{border:" 5px solid #59d3deff"}}> Hello {state.Current.name}</li>:null}
                    <div className="ml-auto">
                    <NavLink to="register"> <div className="btn btn-outline-light mr-2" >Sign Up</div></NavLink>
                    <NavLink to="logIn"> <div className="btn btn-light" >Login</div></NavLink>
                    </div>
                </ul>

            </div>
        </nav>
        
    );
};








