import React, { useEffect, useState } from 'react';
import { useUserContext } from '../../UserContext';
import './OwnJokes.css';
import AudioButton from '../AudioButton/AudioButton';
import { Link } from 'react-router-dom';
import atras from '../../images/atras.png';
import btDelete from '../../images/delete.png';
import btOk from "../../images/ok.png";
import editar from '../../images/editar.png';
import MediaIcon from '../MediaScore/MediaScore';
import Header from '../Header/Header';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';

export default function OwnJokes() {
  const { user } = useUserContext();
  const [yourJokes, setYourJokes] = useState([]);
  const token = localStorage.getItem('token');
  const [editing, setEditing] = useState(false);
  const [editedJoke, setEditedJoke] = useState('');
  const [editedJokeId, setEditedJokeId] = useState('');
  const [message, setMessage] = useState('');
  const [messageVisible, setMessageVisible] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [jokeToDeleteId, setJokeToDeleteId] = useState(null);

  useEffect(() => {
    console.log('Fetching your jokes...');
    fetch('/jokes/alljokes')
      .then((response) => response.json())
      .then((data) => {
        console.log('All jokes data:', data);
        const filteredJokes = data.jokes.filter(
          (chiste) => chiste.author === user.username
        );
        console.log('Tus chistes propios:', filteredJokes);

        setYourJokes(filteredJokes);
      })
      .catch((error) => {
        console.error('Error al obtener tus chistes propios:', error);
      });
  }, [user.username]);

  const handleDeleteJoke = async (chisteId) => {
    setShowConfirmDelete(true);
    setJokeToDeleteId(chisteId);
  };

  const confirmDeleteJoke = async () => {
    if (!jokeToDeleteId) return;

    try {
      console.log('Deleting joke...');

      const response = await fetch(`/jokes/${jokeToDeleteId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Respuesta del servidor:', response.status);

      if (response.ok) {
        console.log('Chiste eliminado correctamente.');
        const updatedYourJokes = yourJokes.filter(
          (chiste) => chiste._id !== jokeToDeleteId
        );
        setYourJokes(updatedYourJokes);
        setShowConfirmDelete(false);
      } else {
        const data = await response.json();
        console.error('Error al eliminar el chiste:', data.error);
        alert(data.error);
      }
    } catch (error) {
      console.error('Error al eliminar el chiste:', error);
      alert('Error al eliminar el chiste. Inténtalo de nuevo más tarde.');
    }
  };

  const cancelDeleteJoke = () => {
    setShowConfirmDelete(false);
  };

  const saveChanges = async () => {
    if (!editedJoke) {
      return;
    }

    if (editedJoke.length > 240) {
      setMessage('El chiste no puede tener más de 240 caracteres.');
      setMessageVisible(true);
      return;
    } else {
      setMessage('');
      setMessageVisible(false);
    }

    try {
      console.log('Saving changes...');

      const response = await fetch(`/jokes/${editedJokeId}/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: editedJoke, author: user.username }),
      });

      console.log('Respuesta del servidor:', response.status);

      if (response.ok) {
        console.log('Chiste editado correctamente.');
        const updatedYourJokes = yourJokes.map((chiste) => {
          if (chiste._id === editedJokeId) {
            return { ...chiste, text: editedJoke };
          }
          return chiste
        });
        setYourJokes(updatedYourJokes);
        setEditing(false);
      } else {
        const data = await response.json();
        console.error('Error al editar el chiste:', data.error);
        setMessage(data.error);
      }
    } catch (error) {
      console.error('Error al editar el chiste:', error);
      setMessage('Error al editar el chiste. Inténtalo de nuevo más tarde.');
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditedJoke('');
    setEditedJokeId('');
    setMessage('');
  };

  return (
    <>
      <Header />
      <Link className="" title='Atras' to="/user">
        <img className='bt btnAtras' src={atras} alt="Atras" />
      </Link>
      <div className="baseUser boxComponent flex">
        {yourJokes.length > 0 && (
          <ul className='gap-40 flexCenterColums'>
            {yourJokes.map((chiste) => (
              <li className='boxArea CardUsersData' key={chiste._id}>
                {editing && chiste._id === editedJokeId ? (
                  <div className=''>
                    <div className='boxComponent'>
                      <textarea
                        rows="3"
                        value={editedJoke}
                        onChange={(e) => setEditedJoke(e.target.value)}
                      />
                      <AudioButton text={editedJoke} />
                    </div>
                    <div className='ownBox2'>
                      <img src={btOk} className='btnDelete' onClick={saveChanges} title='Guardar Cambios' alt="" />
                      <img src={btDelete} className='btnDelete' onClick={cancelEdit} title='Cancelar' alt="" />
                    </div>
                    {messageVisible && <p className="message">{message}</p>}
                  </div>
                ) : (
                  <div className='ownBox'>
                    <p>{chiste.text}</p>
                    <MediaIcon averageScore={chiste.score} />
                    <div className="btnsFavorite">
                      <img 
                        className='btnDelete'
                        src={editar} 
                        title='Editar Chiste'
                        alt=""
                        onClick={() => {
                          setEditing(true);
                          setEditedJoke(chiste.text);
                          setEditedJokeId(chiste._id);
                          setMessage('');
                        }}
                      />
                      <AudioButton text={chiste.text} />
                      <img
                        className="btnDelete"
                        src={btDelete}
                        alt="Eliminar chiste"
                        title="Eliminar chiste"
                        onClick={() => handleDeleteJoke(chiste._id)}
                      />
                    </div>
                  </div>
                )}
                {message && !messageVisible && <p className="message">{message}</p>}
              </li>
            ))}
          </ul>
        )}
        {yourJokes.length === 0 && <h4>No hay chistes propios.</h4>}
      </div>

      {showConfirmDelete && (
        <ConfirmationModal
          message="¿Estás seguro de eliminar el chiste?"
          onConfirm={confirmDeleteJoke}
          onCancel={cancelDeleteJoke}
        />
      )}
    </>
  );
}
