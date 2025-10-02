import ShaderBackground from '../components/lightswind/shader-background'
import Landing from './Landing'


function Background() {
  return (
    <div >
      <ShaderBackground className='h-[60vh] w-screen' backdropBlurAmount="xl"/>
      <Landing />
    </div>
  )
}

export default Background
