import React, { useState } from "react";
import "./Header.css";
import logo from "../../images/logotipo.png";
import exit from "../../images/exit.png";
import menu from "../../images/menu.png";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Eliminando el token del localStorage
    localStorage.removeItem("token");
    // Redirige al usuario a la página de inicio de sesión
    navigate("/");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleConfirmLogout = () => {
    setConfirmLogout(true);
  };

  const handleCancelLogout = () => {
    setConfirmLogout(false);
  };

  const handleLogoutConfirmed = () => {
    handleLogout();
    setConfirmLogout(false);
  };

  return (
    <div className="contentHeader">
      <div className={`boxHeader ${menuOpen ? "menuOpen" : ""}`}>
        <Link to="/jokes" onClick={closeMenu} className="imgLogo contenedor-rotacion">
          <img className="imgLogo rotacion" src={logo} title="Inicio" alt="" />
        </Link>
        <div className="menuButton" onClick={toggleMenu}>
          <img className="iconMenuHeader" src={menu} title="Menu" alt="menu" />
        </div>
        <ul className="navBar">
          <Link onClick={closeMenu} className={`linkLi ${isActive("/jokes") ? "active" : ""}`} to="/jokes">
            Inicio
          </Link>
          <hr className="line" />
          <Link
            onClick={closeMenu}
            className={`linkLi ${isActive("/jokes/create") ? "active" : ""}`}
            to="/jokes/create"
          >
            Añadir
          </Link>
          <hr className="line" />
          <Link onClick={closeMenu} className={`linkLi ${isActive("/user") ? "active" : ""}`} to="/user">
            Perfil
          </Link>
          <hr className="line" />
          <Link onClick={closeMenu} className={`linkLi ${isActive("/top") ? "active" : ""}`} to="/top">
            Top
          </Link>
        </ul>
        <div className="socialNetworkIcons">
          <div className="boxBtnExit" onClick={handleConfirmLogout}>
            <img className="btnExit" src={exit} alt="" />
          </div>
        </div>
      </div>
      <div className="empyHeader"> </div>
      <div className="spaceHeader"> </div>

      {confirmLogout && (
        <ConfirmationModal
          message="¿Estás seguro de que quieres cerrar sesión?"
          onConfirm={handleLogoutConfirmed}
          onCancel={handleCancelLogout}
        />
      )}
    </div>
  );
}
