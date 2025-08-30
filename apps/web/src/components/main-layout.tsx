import Image from 'next/image'

import Footer from './layout/footer'
import Header from './layout/header'

type MainLayoutProps = {
  children: React.ReactNode
}

const MainLayout = (props: MainLayoutProps) => {
  const { children } = props

  return (
    <>
      <Header />
      <main id='skip-nav' className='mx-auto mb-16 w-full max-w-5xl flex-1 px-4 py-24 sm:px-8'>
        {children}
      </main>
      <Footer />
      <Image
        width={1512}
        height={550}
        className='absolute top-0 left-1/2 -z-10 -translate-x-1/2'
        src='/images/gradient-background-top.png'
        alt=''
        role='presentation'
        priority={true}
      />
      <Image
        width={1512}
        height={447}
        className='absolute -bottom-6 left-1/2 -z-10 -translate-x-1/2'
        src='/images/gradient-background-bottom.png'
        alt=''
        role='presentation'
        priority={true}
      />
    </>
  )
}

export default MainLayout
