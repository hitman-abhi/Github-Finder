import React,{useState, Fragment} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './App.css';
import Navbar from './components/layout/Navbar';
import Users from './components/users/Users';
import axios from 'axios';
import User from './components/users/User';
import Alert from './components/layout/Alert';
import About from './components/pages/About'
import Search from './components/users/Search';
const App = () => {
  const[users,setUsers] = useState([]);
  const[user,setUser] = useState({});
  const[repos,setRepos] = useState([]);
  const[loading,setLoading] = useState(false);
  const[alert,setAlert] = useState(null);
  
  // Search Github Users
  const searchUsers = async text => {
    setLoading(true);
    const res = await axios.get(`https://api.github.com/search/users?q=${text}&client_id=$
    {process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=$
    {process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
    //const res = await axios.get(`https://codeforces.com/api/user.info?handles=${text}`);
    
    setUsers(res.data.items);
    setLoading(false);
  };
  //Get Users repos
  const getUserRepos = async (username) =>{
    setLoading(true);

    const res = await axios.get(`https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=$
    {process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=$
    {process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
    //const res = await axios.get(`https://codeforces.com/api/user.info?handles=${text}`);
    
    setRepos(res.data);
    setLoading(false);
  };

  //clear users from state
  const clearUsers = () => {
    setLoading(false);
    setUsers([]);
  }
  
  //Get single Github user
  const getUser = async (username) =>{
    setLoading(true);

    const res = await axios.get(`https://api.github.com/users/${username}?client_id=$
    {process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=$
    {process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
    //const res = await axios.get(`https://codeforces.com/api/user.info?handles=${text}`);
    
    setLoading(false);
    setUser(res.data);
  };
  //Set Alert
  const showAlert = (msg,type) => {
    setAlert({msg,type})

    setTimeout(() => setAlert(null),5000);
  }
  return (
    <Router>
    <div className="App">
      <Navbar/>
      <div className='container'>
        <Alert alert={alert}/>
        <Switch>
          <Route
            exact
            path='/'
            render={props => (
              <Fragment>
                    <Search 
                      searchUsers={searchUsers} 
                      clearUsers={clearUsers}
                      showClear={users.length > 0 ?true:false}
                      setAlert={showAlert}
                    />
                    <Users loading={loading} users={users}/>
              </Fragment>
            )} />
            <Route exact path='/about' component={About}/>
            <Route exact path='/user/:login' render={props => (
              <User
                { ...props } 
                getUser={getUser} 
                getUserRepos={getUserRepos}
                user={user} 
                repos={repos}
                loading={loading}
              />
            )} />
        </Switch> 
      </div>
    </div>
    </Router>
  );
  
  
}

export default App;
