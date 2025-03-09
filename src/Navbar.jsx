import React from 'react'
import { NavLink } from 'react-router-dom';

const navData = [

]

const Navbar = () => {
  return (
    <>
        <div class="nav-div">
  <p>MENU</p>
  <ul>
    <li>
      <NavLink to="/customer">Customer's Details</NavLink>
    </li>
    <li>
      <NavLink to="/billing">Billing</NavLink>
    </li>
    <li>
      <NavLink to="/database">DataBase</NavLink>
    </li>
    <li>
      <NavLink to="/ladger">Ladger Account</NavLink>
    </li>
  </ul>
</div>
    </>
  )
}

export default Navbar;