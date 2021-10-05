import { useState } from 'react';
import './App.css';
import Feed from "./Feed/Feed";
import Reports from './Reports/Reports';
import Sidebar from "./SidebarOption/Sidebar";
import Widgets from "./Widgets/Widgets";

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
      <Sidebar reports={ViewReports} feed={ViewFeed} />
      {state === 'reports'
        ? <Reports />
        : <Feed />}
      {state === 'home' && <Widgets />}
    </div>
  );
}

export default App;
