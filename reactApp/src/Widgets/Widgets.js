import { Search } from "@material-ui/icons";
import React from "react";
import {
  TwitterTimelineEmbed,
  TwitterTweetEmbed
} from "react-twitter-embed";
import "./Widgets.css";

function Widgets() {
  return (
    <div className="widgets">
      <div className="widgets__input">
        <Search className="widgets__searchIcon" />
        <input placeholder="Search Post" type="text" />
      </div>

      <div className="widgets__widgetContainer">
        <h2>Tendencias para ti</h2>
        <div className="widgets__timeline">
          <TwitterTimelineEmbed
            sourceType="profile"
            screenName="cloudnativegt"
            options={{ height: 500 }}
            theme="dark"
          />
        </div>
        {/* <div className="widgets__timeline">
          <TwitterTimelineEmbed
            sourceType="profile"
            screenName="CNCFStudents"
            options={{ height: 500 }}
            theme="dark"
          />
        </div> */}
        <div className="widgets__embed">
          <TwitterTweetEmbed tweetId={"1443342195847741444"} />
        </div>
      </div>

      <div className="widgets__widgetCopyright">
        <p>Universidad de San Carlos de Guatemala</p>
        <p>Sistemas Operativos 1&nbsp; · &nbsp;Grupo 7</p>
        <p>&copy; 2021 Proyecto 1&nbsp; · &nbsp;Segundo Semestre</p>
      </div>
    </div>
  );
}

export default Widgets;