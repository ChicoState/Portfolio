import React, { Component } from 'react';
import axios from 'axios';
import { Button, Container, Form, Spinner } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { Formik, Field } from 'formik';

class Signup extends Component {
  render() {
    const next = () => {
      this.props.history.replace(
        this.props.location.state
          ? this.props.location.state.from.pathname
          : '/',
      );
    };

    return (
      <Container>
        <Formik
          initialValues={{
            username: '',
            email: '',
            password: '',
            passwordConfirm: '',
          }}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={(data, { setSubmitting }) => {
            setSubmitting(true);
            axios
              .post('/user/register', data)
              .then((res) => {
                console.log(`statusCode: ${res.statusCode}`);
                console.log(res);
                setSubmitting(false);
                next();
              })
              .catch((error) => {
                console.error(error);
                setSubmitting(false);
              });
          }}
          validate={(values) => {
            const errors = {};

            if (values.username.length === 0) {
              errors.username = 'Username is required!';
            }
            if (values.password.length === 0) {
              errors.password = 'Password is required!';
            }

            const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

            if (!values.email.match(regex)) {
              errors.email = 'Please enter a valid email';
            }
            if (values.password !== values.passwordConfirm) {
              errors.passwordConfirm = 'Password fields do not match!';
            }
            return errors;
          }}
        >
          {({ values, handleSubmit, isSubmitting, errors }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formSignupUsername">
                <Form.Label>Username</Form.Label>
                <Field
                  name="username"
                  isInvalid={errors.username}
                  placeholder="Username"
                  type="input"
                  as={Form.Control}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="formSignupEmail">
                <Form.Label>Email</Form.Label>
                <Field
                  isInvalid={errors.email}
                  name="email"
                  placeholder="Email"
                  type="input"
                  as={Form.Control}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="formSignupPassword">
                <Form.Label>Password</Form.Label>
                <Field
                  isInvalid={errors.password}
                  name="password"
                  placeholder="Password"
                  type="password"
                  as={Form.Control}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="formSignupPasswordConfirm">
                <Form.Label>Confirm Password</Form.Label>
                <Field
                  isInvalid={errors.passwordConfirm}
                  name="passwordConfirm"
                  placeholder="Password"
                  type="password"
                  as={Form.Control}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.passwordConfirm}
                </Form.Control.Feedback>
              </Form.Group>
              {isSubmitting ? (
                <Spinner animation="border" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              ) : (
                <Button disabled={isSubmitting} variant="primary" type="submit">
                  Sign up
                </Button>
              )}

              <pre>{JSON.stringify(values, null, 2)}</pre>
              <pre>{JSON.stringify(errors, null, 2)}</pre>
            </Form>
          )}
        </Formik>
      </Container>
    );
  }
}
export default withRouter(Signup);
