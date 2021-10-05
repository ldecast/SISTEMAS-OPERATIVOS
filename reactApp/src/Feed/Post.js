import { Avatar } from "@material-ui/core";
import {
    ChatBubbleOutline,
    Repeat,
    VerifiedUser,
    ThumbDown,
    ThumbDownOutlined,
    ThumbUp,
    ThumbUpOutlined
} from "@material-ui/icons";
import React, { Component } from "react";
import "./Post.css";

class Post extends Component {

    async vote(_field, _val, _id, _field_count, _new_count) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                field: _field,
                val: _val,
                id: _id,
                fieldcount: _field_count,
                newcount: _new_count,
                db: this.props.db
            })
        };
        fetch(process.env.REACT_APP_API_URL_VOTE, requestOptions);
    };

    reTweet() {
        if (window.confirm("¿Deseas compartir el post?"))
            console.log("Repostear...");
        else
            console.log("Nada...");
    }

    render() {
        return (
            <div className="post" >
                <div className="post__avatar">
                    <Avatar src={this.props.avatar} />
                </div>
                <div className="post__body">
                    <div className="post__header">
                        <div className="post__headerText">
                            <h3>
                                {this.props.username}{" "}
                                <span>{this.props.verified && <VerifiedUser className="post__badge" />}</span>
                                <span className="post__headerSpecial">
                                    &nbsp;·&nbsp;
                                </span>
                                <span className="post__headerSpecial">
                                    {this.props.date}
                                </span>
                            </h3>
                        </div>
                        <div className="post__headerDescription">
                            <p>{this.props.text}</p>
                        </div>
                        <div className="post__Hashtags">
                            {
                                this.props.hashtags.map((hash) => {
                                    let _t = hash.tag || hash;
                                    return <a key={this.props.db + _t + this.props.id} className="twitter-hashtag"
                                        href={`https://twitter.com/search?q=${_t}`}
                                        target="_blank"
                                        rel="noreferrer">
                                        #{_t}<br /></a>
                                })
                            }
                        </div>
                    </div>
                    <br />
                    <div className="post__footer">
                        <div className="post__icon">
                            <div className="icon__vote">
                                {
                                    this.props.upvoted

                                        ? <ThumbUp
                                            onClick={
                                                () => { this.vote("upvoted", 0, this.props.id, "upvotes_count", parseInt(this.props.upvotes_count) - 1); }
                                            }
                                            fontSize="small" />
                                        : <ThumbUpOutlined
                                            onClick={
                                                () => { this.vote("upvoted", 1, this.props.id, "upvotes_count", parseInt(this.props.upvotes_count) + 1); }
                                            }
                                            fontSize="small" />
                                }
                            </div>
                            <p className="post__count">{this.props.upvotes_count}</p>
                        </div>
                        <div className="post__icon">
                            <div className="icon__vote">
                                {this.props.downvoted
                                    ? <ThumbDown
                                        onClick={
                                            () => { this.vote("downvoted", 0, this.props.id, "downvotes_count", parseInt(this.props.downvotes_count) - 1); }
                                        }
                                        fontSize="small" />
                                    : <ThumbDownOutlined
                                        onClick={
                                            () => { this.vote("downvoted", 1, this.props.id, "downvotes_count", parseInt(this.props.downvotes_count) + 1); }
                                        }
                                        fontSize="small" />
                                }
                            </div>
                            <p className="post__count">{this.props.downvotes_count}</p>
                        </div>
                        <ChatBubbleOutline fontSize="small" />
                        <Repeat onClick={() => this.reTweet()} fontSize="small" />
                    </div>
                </div>
            </div>
        );
    }

}

export default Post;