import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { Button, Form, Container, Spinner, Alert } from 'react-bootstrap';
import { Formik, Field } from 'formik';

class Login extends Component {
  render() {
    const next = () => {this.props.history.replace(this.props.location.state ? this.props.location.state.from.pathname : '/');}

    return (
      <Container>
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={(data, { setSubmitting, setErrors }) => {
            setSubmitting(true);
            axios({
              method: 'POST',
              data: {
                email: data.email,
                password: data.password,
              },
              withCredentials: true,
              url: '/user/login',
            })
              .then((res) => {
                setSubmitting(false);
                next();
              })
              .catch((error) => {
                setErrors({login: 'Invalid username or password!'});
                setSubmitting(false);
                console.error(error);
              });
          }}
          validate={(values) => {
            const errors = {};
            if (values.password.length === 0) {
              errors.password = 'Password is required!';
            }
            const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

            if (!values.email.match(regex)) {
              errors.email = 'Please enter a valid email';
            }
            return errors;
          }}
        >
          {({
            values,
            handleChange,
            handleBlur,
            isSubmitting,
            errors,
            handleSubmit,
          }) => {
            return (
              <Form onSubmit={handleSubmit}>
                {
                  errors.login ? <Alert variant="danger">
                  <Alert.Heading>{errors.login}</Alert.Heading>
                </Alert> : null
                }
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Field
                    isInvalid={errors.email}
                    name="email"
                    placeholder="Email"
                    type="input"
                    as={Form.Control}
                  ></Field>
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                  <Form.Label>Password</Form.Label>
                  <Field
                    isInvalid={errors.password}
                    name="password"
                    placeholder="Password"
                    type="password"
                    as={Form.Control}
                  ></Field>
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>
                {isSubmitting ? (
                  <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                  </Spinner>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    Login
                  </Button>
                )}
              </Form>
            );
          }}
        </Formik>
      </Container>
    );
  }
}

export default withRouter(Login);
