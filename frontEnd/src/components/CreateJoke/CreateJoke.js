import React, { useState } from 'react';
import { useUserContext } from '../../UserContext';
import './CreateJoke.css';
import AudioButton from '../AudioButton/AudioButton';
 
import Headers from '../Header/Header';
import MyAlert from '../MyAlert/MyAlert';
import { useNavigate } from 'react-router-dom';

const CreateJoke = () => {
  const { user } = useUserContext();
  const [jokeText, setJokeText] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const charLimit = 240;

  const handleTextAreaChange = (e) => {
    const newText = e.target.value;
    if (newText.length <= charLimit) {
      setJokeText(newText);
    }
  };

  const getCharCountColor = () => {
    if (jokeText.length === 240 ) {
      return 'red';
    } else if (jokeText.length > 200) {
      return '#ffa600';
    }
    return '#97C257';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validación de longitud del texto del chiste
    if (jokeText.length > charLimit) {
      setMessage('El chiste es demasiado largo. Debe tener menos de 240 caracteres.');
      return; 
    }

    try {
      const response = await fetch(`/api/jokes/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: jokeText, author: user.username }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Chiste agregado correctamente:', data);

        setMessage('Chiste añadido correctamente');
        setJokeText('');
        setTimeout(() => {
          navigate('/jokes');
        }, 2000);
      } else {
        const errorData = await response.json();
        console.error('Error al agregar el chiste:', errorData.error);

        setMessage('Error al agregar el chiste: ' + errorData.error);
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      setMessage('Error al enviar el formulario. Inténtalo de nuevo más tarde.');
    }
  };

  return (
    <>  
    <Headers />                     
        <div className="boxCreateJoke">
          <form className="boxComponent boxArea" onSubmit={handleSubmit}>
            <textarea
              className="textAreaCreateJoke"
              rows="5"
              cols="40"
              id="textAreaCreate"
              placeholder="Escribe tu chiste aquí (máximo 240 caracteres)"
              value={jokeText}
              onChange={handleTextAreaChange}
              required
            />
            <div className='btnsCreate'>
              <span className='contadorCreate' style={{color: getCharCountColor()}}>
                {jokeText.length}/{charLimit}
              </span>
              <AudioButton text={jokeText} />
            </div>
            <button className="linkLi buttonSubmit" type="submit">
              Añadir Chiste
            </button>
            {message && <p className="message">{message}</p>}
            {message && <MyAlert text="¡Añadiste un nuevo chiste!" />}
          </form>
        </div>
      </>
  );
};

export default CreateJoke;
