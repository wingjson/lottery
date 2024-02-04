import backgroundImage from '../../assets/back.jpg';
export const Main: React.FC<React.PropsWithChildren> = (props) => {
  const { children } = props

  return (
    <main style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
      }} className="min-h-full flex-col items-center justify-center bg-blue-100 text-black">
        {children}
    </main>
  )
}
