import { Component } from 'react';

import Chat from '@pages/chat';
import Login from "@pages/login";
import { chatApi } from '@api/chat';
import { getAccessToken, getUserInfo, resetInfo, setInfo } from '@connector/local-storage';
import Waiting from "@components/waiting";
import { groupController } from './hooks/chat';

class App extends Component {
  state = {
    user: null,
    isLoading: true,
    success: false,
  }
  async componentDidMount() {
    const access_token = getAccessToken()
    let user = getUserInfo();

    if (access_token) {
      chatApi.setToken(access_token)
      try {

        [user] = await chatApi.getUserInfo([user.id])

        await groupController.init(access_token, user)

        this.setState({
          user,
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
      return <Chat user={this.state.user} />
    } else {
      return <Login onLoginSuccess={this._onLoginSuccess} />
    }
  }

  _onLoginSuccess = async (username, info) => {
    setInfo(info.token, info)
    chatApi.setToken(info.token)

    await groupController.init(info.token, info)

    this.setState({
      user: info,
      isLoading: false,
      success: true,
    })
  }
}

export default App;
