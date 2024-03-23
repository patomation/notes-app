// import Navbar from './navbar'
// import Footer from './footer'

import { Nav } from './Nav/Nav'

export default function Layout({
  children,
}: {
  children: any
}) {
  return (
    <>
      {/* <Navbar /> */}
      <main
        id="layout"
        style={{
          background: '#000000',
          // minHeight: '100vh',
          color: '#fff !important',
          paddingTop: '4em',

          display: 'flex',
          width: '100%',
          justifyContent: 'center',
        }}
      >
        <Nav />
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: '600px',
          }}
        >
          {children}
        </section>
      </main>
      {/* <Footer /> */}
    </>
  )
}
