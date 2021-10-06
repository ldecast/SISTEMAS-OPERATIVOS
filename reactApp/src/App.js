import { useState } from 'react';
import './App.css';
import Feed from "./Feed/Feed";
import Reports from './Reports/Reports';
import Sidebar from "./SidebarOption/Sidebar";
import Widgets from "./Widgets/Widgets";
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

function App() {
  const [state, setState] = useState('home');

  function ViewReports() {
    setState('reports')
  }

  function ViewFeed() {
    setState('home')
  }

  return (
    <div className="app">
      <div className="notifications">
        <ReactNotification />
      </div>
      <Sidebar reports={ViewReports} feed={ViewFeed} />
      {state === 'reports'
        ? <Reports />
        : <Feed />}
      {state === 'home' && <Widgets />}
    </div>
  );
}

export default App;
