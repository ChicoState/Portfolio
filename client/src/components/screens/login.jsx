import React, {Component } from 'react';
import axios from 'axios';
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";



class Login extends Component {
  state = {
    email: "",
    password: "",
    show: true,
  }
  
  render(){
    //const [show, setShow] = useState(false);

    const handleClose = () => {this.setState({show: false}); this.props.history.push('./')};


    const loginUser = () => {
      axios({
        method: "POST",
        data: {
          email: this.state.email,
          password: this.state.password
        },
        withCredentials: true,
        url: "/user/login",
      }).then((res) => console.log(res)).catch(error => {
        console.error(error)
      });
    };
    return(
          <div>
              <Modal show={this.state.show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Login</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <input placeholder='email' onChange={e => this.setState({email: e.target.value})}></input>
                <input placeholder='password' onChange={e => this.setState({password: e.target.value})}></input>
                <button onClick= {()=>{loginUser(); handleClose()}}>Submit</button>
              </Modal.Body>
              <Modal.Footer>
              </Modal.Footer>
            </Modal>
          </div>
    );
  }
};

export default Login;