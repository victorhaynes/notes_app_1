import { Link } from "react-router";

const NavBar = () => {
  return (
    <nav className="flex text-cyan-700">
      <Link to="/">Home</Link>
      <Link to="/Register">Register</Link>
      <Link to="/login">Login</Link>
      <Link to="/about">About</Link>
    </nav>
  )
}

export default NavBar