import { useState } from 'react';
import './App.css';
import Feed from "./Feed/Feed";
import Reports from './Reports/Reports';
import Sidebar from "./SidebarOption/Sidebar";
import Widgets from "./Widgets/Widgets";
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

function App() {
  const [state, setState] = useState({
    estado: 'home',
    count: 0
  });

  function ViewReports() {
    setState({
      estado: 'reports',
      count: state.count + 1
    });
  }

  function ViewFeed() {
    console.log(state)
    setState({
      estado: 'home',
      count: state.count + 1
    });
  }

  return (
    <div className="app">
      <div className="notifications">
        <ReactNotification />
      </div>
      <Sidebar reports={ViewReports} feed={ViewFeed} />
      {state.estado === 'reports'
        ? <Reports key={state.count} />
        : <Feed key={state.count} />}
      {state.estado === 'home' && <Widgets />}
    </div>
  );
}

export default App;
