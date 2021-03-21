import React from 'react'
import ReactDOM from 'react-dom'
import { DefaultPopup } from './components/DefaultPopup'
import 'sanitize.css'
import 'reset-css'

const App = () => <DefaultPopup />

const divEl = document.createElement('div')
divEl.setAttribute('id', 'imgstckr')
document.body.appendChild(divEl)
ReactDOM.render(<App />, divEl)
