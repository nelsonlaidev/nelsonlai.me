type LogoProps = React.SVGAttributes<SVGElement>

const Logo = (props: LogoProps) => {
  return (
    <svg version='1.0' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 715' {...props}>
      <path
        d='M0 0V625C0 652.614 22.3858 675 50 675H150C177.614 675 200 652.614 200 625V200H350C377.614 200 400 222.386 400 250V625C400 652.614 422.386 675 450 675H550C577.614 675 600 652.614 600 625V200C600 89.5431 510.457 0 400 0H0Z'
        fill='currentColor'
      />
    </svg>
  )
}

export { Logo }
