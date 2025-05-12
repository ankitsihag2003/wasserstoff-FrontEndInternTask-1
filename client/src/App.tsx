import { io, Socket } from "socket.io-client"
import Editor from "./components/Editor"
import { useState, useEffect,useRef } from "react"
import UsernamePrompt from "./components/UsernamePrompt"
import ActiveUsers from "./components/ActiveUsers"

// randomPastel function to generate a random pastel color
function randomPastel() {                     
  const h = Math.floor(Math.random() * 360);
  return `hsl(${h}, 70%, 80%)`;
}
function App() {
  const socket_ref = useRef<Socket | null>(null);           // creating a reference to the socket

  const [username, setUsername] = useState<string>("");          // state to manage the username
  const [color, setColor] = useState<string>("");                 // state to manage the color
  const [users, setUsers] = useState<{ username: string; color: string }[]>([]);         // state to manage the users
  const [socketReady, setsocketReady] = useState(false);         // state to manage the socket connection

  useEffect(() => {
    socket_ref.current = io("http://localhost:3000");          // connecting to the socket server
    //listen for all active users
    socket_ref.current.on("active-users", (list) => setUsers(list));

    setsocketReady(true); // set the socket to ready state
    return () => {
      socket_ref.current?.disconnect();
    }
  }, [])

  const handleJoin = (name: string) => {
    setUsername(name);
    const userColor = randomPastel();
    setColor(userColor);
    socket_ref.current?.emit("join", { username: name, color: userColor });
  }
  if (!socketReady || !socket_ref.current) {
    return <div>Loading...</div>; // Show a loading state while the socket is connecting
  }
  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-4 text-center">Real-Time Collaborative Editor</h1>
        {!username ?
          <UsernamePrompt onJoin={handleJoin} />
          : (
            <div className="flex flex-col lg:flex-row w-full max-w-7xl space-x-6">
              <div className="w-full lg:w-1/4 mb-4">
                <ActiveUsers users={users}/>
              </div>
              <div className="w-full lg:w-2/4 bg-white p-6 rounded shadow-md">
                <h2 className="text-lg font-semibold mb-4">Welcome, {username}!</h2>
                <Editor socket={socket_ref.current} username={username} />
              </div>

            </div>
          )}
      </div>
    </>
  )
}

export default App
