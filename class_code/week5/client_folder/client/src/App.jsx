import { useState } from 'react';

const App = () => {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginForm = async(e) =>{
    e.preventDefault();
    const submission = {email, password}
    try{
      const response = await fetch( `http://localhost:8000/data`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: submission,

      });
      const data = await response.json();
      setMessage(JSON.stringify(data));

    } catch(error) {
      console.log(error);
    }

  }

  return (
  <div>
    {message}
    <form onSubmit={loginForm}>
      <input 
      type='email'
      placeholder='email'
      value={email}
      onChange={(e)=>{setEmail(e.target.value)}}
      required
      />

<input 
      type='password'
      placeholder='password'
      value={password}
      onChange={(e)=>{setPassword(e.target.value)}}
      required
      />
      <button type='submit'>
        Login
      </button>
    </form>
    
  </div>)
}

export default App;
