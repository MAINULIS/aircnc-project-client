const Heading = ({ title, subtitle, center }) => {
    return (
      <div className={center ? 'text-center' : 'text-start'}>
        <div className='text-2xl font-bold uppercase'>{title}</div>
        <div className='font-light text-neutral-500 mt-2 uppercase'>{subtitle}</div>
      </div>
    )
  }
  
  export default Heading