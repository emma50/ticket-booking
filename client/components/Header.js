import Link from 'next/link'

export default ({ currentUser }) => {
  return (
    <nav className='navbar navbar-light bg-light'>
      <Link href={'/'}>
        <a className='navbar-brand'>smallTik</a>
      </Link>

      <div className='d-flex justify-content-end'>
        <ul className='nav d-flex align-items-center'>
          <li>{currentUser ? 'Sign out' : 'Sign in/up'}</li>
        </ul>
      </div>
    </nav>

  )
}