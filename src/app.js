import { useState, Component } from 'react';

import Chat from '@pages/chat';
import Login from "@pages/login";
import { chatApi } from '@api/chat';
import { getAccessToken, getUserInfo, resetInfo, setInfo } from '@connector/local-storage';
import Waiting from "@components/waiting";

class App extends Component {
  state = {
    isLoading: true,
    success: false,
  }
  async componentDidMount() {
    const access_token = getAccessToken()
    if (access_token) {
      chatApi.setToken(access_token)
      try {
        const info = await chatApi.getInfo(getUserInfo().id)
        this.setState({
          isLoading: false,
          success: true,
        })

        return
      } catch (error) {
        resetInfo()
      }
    }
    this.setState({
      isLoading: false,
      success: false,
    })
  }
  render() {
    if (this.state.isLoading) {
      return <div style={{
        height: '100vh',
        flexGrow: 1,
      }}>
        <Waiting/>
      </div>
    }

    if (this.state.success) {
      return <Chat user={getUserInfo()}/>
    } else {
      return <Login onLoginSuccess={this._onLoginSuccess} />
    }
  }

  _onLoginSuccess = (username, token) => {
    this.setState({
      isLoading: true,
      success: true,
    })
    setInfo(token.id, { username, id: token.userId })
    chatApi.setToken(token.id)
    this.setState({
      isLoading: false,
    })
  }
}

export default App;
