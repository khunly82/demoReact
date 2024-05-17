import {useEffect, useRef, useState} from 'react';
import './App.css'
import {io, Socket} from "socket.io-client";

function App() {
  const socket = useRef(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([])

  useEffect(() => {
    socket.current = io('http://localhost:3000', { transports: ['polling'], autoConnect: true });
    socket.current.on('onMessage', result => {
      setMessages(result);
    })
  }, []);

  const sendMessage = () => {
    socket.current.emit('sendMessage', {data: message, type: 'text'});
    setMessage('');
  }

  const uploadFile = (e) => {
    if(e.target.files.length > 0) {
      const fr = new FileReader();
      fr.readAsDataURL(e.target.files[0]);
      fr.onload = ({target}) => {
        socket.current.emit('sendMessage', {data: target.result, type: 'image'});
      }
    }
  }

  return (
    <>
      <div>
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>
      <div>
        <input type="file" onChange={e => uploadFile(e)} />
      </div>
      <button onClick={sendMessage}>Envoyer</button>
      
      <ul>
        { messages.map((m, i) => <li key={i}>{m.type === 'image'  ? <img src={m.data}/> : <span>{m.data}</span> }</li>) } 
      </ul>
    </>
  )
}

export default App
