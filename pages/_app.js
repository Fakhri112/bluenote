import '../styles/globals.css'
import '../src/config/firebase.config'
import Head from 'next/head'
import Script from 'next/script'
import { StateProvider } from '../src/hook/StateContext'
import { CookiesProvider } from 'react-cookie';

function MyApp({ Component, pageProps }) {

  return (
    <>
      <Head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" referrerPolicy='no-referrer'
          crossOrigin="anonymous"></link>
      </Head>
      <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
        strategy='afterInteractive'
      />
      <Script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.5/dist/umd/popper.min.js" strategy='afterInteractive' />
      < CookiesProvider >
        <StateProvider>
          <Component {...pageProps} />
        </StateProvider>
      </CookiesProvider>
    </>
  )
}

export default MyApp
