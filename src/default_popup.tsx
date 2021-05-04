import 'sanitize.css'
import 'reset-css'
import React from 'react'
import ReactDOM from 'react-dom'
import { DefaultPopup } from '~/components/DefaultPopup'

const App = () => <DefaultPopup />

const divEl = document.createElement('div')
divEl.setAttribute('id', 'imgstckr')
document.body.appendChild(divEl)
ReactDOM.render(<App />, divEl)
