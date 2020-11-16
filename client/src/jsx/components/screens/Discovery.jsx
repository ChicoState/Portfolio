import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import Post from '../Post';
import { getUserName } from '../Authentication';
import InfiniteScroll from 'react-infinite-scroll-component';


class Discovery extends Component {
  state = {
    tags: '',
    post: null,
    next: null,
    hasNext: false,
    searching: false,
  }

  search = (next) => {
    this.setState({
      searching: true,
    });
    return axios({
      method: 'GET',
      params:
      {
        tags: this.state.tags,
        limit: 20,
        next: next,
      },
      withCredentials: true,
      url: '/post/discovery'
    })
      .then((res) => {
        this.setState(
          {
            posts: this.state.posts && next
              ? this.state.posts.concat(res.data.results)
              : res.data.results,
            next: res.data.next,
            hasNext: res.data.hasNext,
            searching: false
          }
        )
      })
      .catch((error) => {
        this.setState({
          searching: false,
        });
        console.error(error)
      })
  };

  render() {

    const deletePost = (post_id) => {
      axios({
        method: 'POST',
        data: {
          id: post_id,
        },
        withCredentials: true,
        url: '/post/delete',
      })
        .then((res) => {
          if (res.status === 200) {
            this.setState((prevState) => ({
              posts: prevState.posts.filter((post) => post._id !== post_id),
            }));
          }
        })
        .catch((error) => console.log(error));
    };


    let curUsername = getUserName(
      this.props.cookies ? this.props.cookies.get('access_token') : null
    );

    return (
      <div>
        <h1>Discovery</h1>
        <Form onSubmit={(e) => {this.search(null); e.preventDefault();}}>
          <Form.Group controlId="formPostTitle">
            <Form.Label>Search</Form.Label>
            <Form.Control
              placeholder="Ex: Art, Photography, Music, Video..."
              onChange={(e) => this.setState({ tags: e.target.value })}
            />
          </Form.Group>
          {this.state.searching ?
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner> :

            <Button
              type="submit"
              variant="primary"
            >
              Enter
                </Button>
          }
        </Form>
        <br />
        {this.state.posts ? (
          <InfiniteScroll
            dataLength={this.state.posts.length}
            hasMore={this.state.hasNext}
            next={this.search.bind(this, this.state.next)}
            className="justify-content-center align-items-center row"
            loader={
              <div className="col-sm-12">
                <Spinner animation="border" />
              </div>
            }
            scrollThreshold="80%"
          >
            {this.state.posts.map((item) => {
              return (
                <Post
                  className="col-sm"
                  key={item._id}
                  title={item.title}
                  message={item.message}
                  username={item.username}
                  attachments={item.attachments}
                  timestamp={item.timestamp}
                  id={item._id}
                  delete={item.username === curUsername}
                  deleteHandler={deletePost}
                  link={curUsername ? true : false}
                />
              );
            })}
          </InfiniteScroll>
        ) : (
            <div></div>
          )
        }
      </div>
    );
  }
}

export default Discovery;