import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import "./User.css";
import { useUserContext } from '../../UserContext';
import Header from '../Header/Header';

export default function User() {
  const { user } = useUserContext();
  const [userJokes, setUserJokes] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  // Utiliza useEffect para cargar los chistes del usuario y calcular la puntuación media
  useEffect(() => {
    // Realiza una solicitud para obtener todos los chistes
    async function fetchAllJokes() {
      try {
        const response = await fetch(`/jokes/alljokes`);
        if (response.ok) {
          const data = await response.json();
          // Filtra los chistes del usuario por su nombre de autor
          const userJokes = data.jokes.filter(joke => joke.author === user.username);
          setUserJokes(userJokes);
          const ratingSum = userJokes.reduce((sum, joke) => sum + joke.score, 0);
          setAverageRating(userJokes.length > 0 ? (ratingSum / userJokes.length).toFixed(2) : 0);
        }
      } catch (error) {
        console.error('Error al cargar los chistes del usuario', error);
      }
    }

    fetchAllJokes();
  }, [user.username]);

  return (
    <>
      <Header />
      <div className="flex longH">
        <div className="boxComponent">
          <div className="boxComponent boxUser boxArea">
            <div className='myRed1'>
              <p>
                <strong className='greenColor'>Nombre de usuario:</strong> <span className='whiteColor'>{user.username}</span>
              </p>
              <p >
                <strong className='greenColor'>Email:</strong> <span class="whiteColor">{user.email}</span>
              </p>
              <p>
                <strong className='greenColor'>Número de chistes subidos:</strong> <span class="whiteColor">{userJokes.length}</span>
              </p>
              {userJokes.length > 0 && (
                <p>
                  <strong className='greenColor'>Media de puntuaciones de tus chistes:</strong> <span class="whiteColor">{averageRating}</span>
                </p>
              )}
            </div>
            <div className='myRed'>
              <Link className="bt" to="/user/favorites">
                <p className="">CHISTES FAVORITOS</p>
              </Link>
              <Link className="bt" to="/user/own">
                <p className="">CHISTES PROPIOS</p>
              </Link>
              <Link className="bt" to="/user/data">
                <p className=""> CAMBIAR DATOS</p>
              </Link>
              <Link className="bt" to="/user/delete">
                <p className="">ELIMINAR USUARIO</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
