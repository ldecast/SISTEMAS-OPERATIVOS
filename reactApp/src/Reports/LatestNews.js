import React, { Component } from 'react';
import "./LatestNews.css";

class LatestNews extends Component {

    render() {
        return (
            <div className="row__news">
                <h3 id="username">{this.props.username}</h3>
                <p id="date">{this.props.date}</p>
                <p id="text">{this.props.text}</p>
                <div className="column__hashtags">
                    {
                        this.props.hashtags.map((tag) => {
                            let _t = (tag.tag || tag);
                            return (<p key={this.props.db + _t + this.props.id}>#{_t}</p>);
                        })
                    }
                </div>
            </div>
        );
    }
}



export default LatestNews;
