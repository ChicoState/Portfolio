import React, { Component } from 'react';
import axios from 'axios';

class LogoutClass extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            data: ""
        }
    }


    render(){

        const logout = () => {
            axios({
              method: "GET",
              withCredentials: true,
              url: "/user/logout",
            })
            .then((res) => console.log(res))
            .catch((error) => {
              console.log(error);
            })
          };

        return(
            <div>
            <button onClick={logout}>Logout</button>
            </div>
            );
     }
    
}
export default LogoutClass;