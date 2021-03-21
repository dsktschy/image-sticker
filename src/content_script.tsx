import React from 'react'
import ReactDOM from 'react-dom'
import { StickerListContextProvider } from './contexts/StickerList'
import { ContentScript } from './components/ContentScript'

const App = () => (
  <StickerListContextProvider>
    <ContentScript />
  </StickerListContextProvider>
)

const divEl = document.createElement('div')
divEl.setAttribute('id', 'imgstckr')
document.body.appendChild(divEl)
ReactDOM.render(<App />, divEl)
