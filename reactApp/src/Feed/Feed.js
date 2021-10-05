import React, { Component } from "react";
import "./Feed.css";
import Post from "./Post";
import TweetBox from "./TweetBox";
import Selector from '../DBSelector/Selector';
import socket from "../socket";

class Feed extends Component {

  constructor() {
    super();
    this.state = {
      posts: [],
      db: "2",
      isLoaded: false
    }
  }

  getPosts(_db = this.state.db) {
    this.setState({
      isLoaded: false
    });
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ db: _db })
    };
    fetch(process.env.REACT_APP_API_URL_HOME, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          posts: data,
          db: _db,
          isLoaded: true
        });
      });
  }

  componentDidMount() {
    this.getPosts();

    socket.on('post-added', (result) => {
      console.log("post-added!")
      // console.log(result)
      this.getPosts();
    });

    socket.on('post-voted', (result) => {
      console.log("post-voted!")
      this.getPosts();
    });

    socket.on('db-changed', (_db) => {
      console.log("database-changed!", _db);
      this.getPosts(_db);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected because of ' + reason);
    });
  }

  render() {
    return (
      <div className="feed" >
        <div className="feed__header">
          <h2>Feed</h2>
          <Selector selected={this.state.db} />
        </div>
        <TweetBox _db={this.state.db} />
        {
          this.state.isLoaded
            ?
            this.state.posts.map((tw) => {
              return <Post key={this.state.db + tw.id}
                username={tw.username}
                verified={true}
                text={tw.content}
                avatar={tw.avatar || "https://www.pikpng.com/pngl/m/80-805068_my-profile-icon-blank-profile-picture-circle-clipart.png"}
                upvoted={tw.upvoted === 1}
                upvotes_count={tw.upvotes_count}
                downvoted={tw.downvoted === 1}
                downvotes_count={tw.downvotes_count}
                hashtags={tw.hashtags}
                date={tw.fecha}
                id={tw.id}
                db={this.state.db}
              />
            })
            :
            <div className="gif">
              <img src="https://quevedoes.files.wordpress.com/2019/08/img_8392.gif" id="loading" alt="loading" />
            </div>
        }
      </div >
    );
  }
}

export default Feed;