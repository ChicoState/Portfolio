import React, {Component} from 'react';
import axios from 'axios';
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";

class SignUp extends Component {
    state = {
        registerUsername:"",
        registerPassword:"",
        registerEmail:"",
        firstregisterFirstNameName:"",
        registerMiddleName:"",
        registerLastName:"",
        show: true,
    }

    render(){        

        
        const handleClose = () => {this.setState({show: false});this.props.history.push('./')};

        const register = () => {
            axios.post('/user/register', {
                registerUsername: this.state.registerUsername,
                registerPassword: this.state.registerPassword,
                registerEmail: this.state.registerEmail,
                registerFirstName: this.state.registerFirstName,
                registerMiddleName: this.state.registerMiddleName,
                registerLastName: this.state.registerLastName,
                show: true,
            }).then(res => {
                console.log(`statusCode: ${res.statusCode}`)
                console.log(res)
            }).catch(error => {
                console.error(error)
            })
        };
        
        return(
            <div>
            <Modal show={this.state.show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Sign Up</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <input placeholder='username' onChange={e => this.setState({registerUsername: e.target.value})}></input>
                <input placeholder='password' onChange={e => this.setState({registerPassword: e.target.value})}></input>
                <input placeholder='email' onChange={e => this.setState({registerEmail: e.target.value})}></input>
                <input placeholder='first name' onChange={e => this.setState({registerFirstName: e.target.value})}></input>
                <input placeholder='last name' onChange={e => this.setState({registerLastName: e.target.value})}></input>
                <input placeholder='middle name' onChange={e => this.setState({registerMiddleName: e.target.value})}></input>
                <button onClick={()=>{register(); handleClose()}}>Submit</button>
              </Modal.Body>
              <Modal.Footer>
              </Modal.Footer>
            </Modal>
            </div>
        );
    }
};
export default SignUp