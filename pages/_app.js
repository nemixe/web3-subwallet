import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React, Web3ReactProvider } from '@web3-react/core'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import '../styles/globals.css'
import '../styles/unity.css'
import { connectorAtom } from '../utils/atoms'
import { useEagerConnect, useInactiveListener } from '../utils/hooks'

const getLibrary = (provider) => {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

const MyApp = ({ Component, pageProps }) => {
  const context = useWeb3React()
  const { connector } = context
  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = useAtom(connectorAtom)
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector)

  return <Component {...pageProps} />
}

const InitiateWeb3Provider = (props) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <MyApp {...props} />
    </Web3ReactProvider>
  )
}
export default InitiateWeb3Provider
