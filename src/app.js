import Chat from '@pages/chat';
import Login from "@pages/login";
import { chatApi } from '@api/chat';
import { getAccessToken, getUserInfo, setInfo } from '@connector/local-storage';

function App() {
  const access_token = getAccessToken()

  if (access_token) {
    chatApi.setToken(access_token)
    return <Chat user={getUserInfo()}/>
  } else {
    function onLoginSuccess(username, token) {
      setInfo(token.id, { username, id: token.userId })
      chatApi.setToken(token)
      window.location = '/'
    }

    return <Login onLoginSuccess={onLoginSuccess} />
  }
}

export default App;
