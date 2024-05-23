import App from "./App"
import TranscribeStateProvider from "./state/StateProvider"


function Index() {
  return (
    <TranscribeStateProvider>
      <App/>
    </TranscribeStateProvider>
  )
}

export default Index
