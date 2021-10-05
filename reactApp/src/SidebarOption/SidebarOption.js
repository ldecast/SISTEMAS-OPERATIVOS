import React from "react";
import "./SidebarOption.css";

const SidebarOption = (props) => {
  return (
    <a href={props.url} className={`sidebarOption`} onClick={props.click}>
      <props.Icon />
      {props.text}
    </a >
  );
}

export default SidebarOption;