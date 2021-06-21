import hooks from "leemons-hooks";
import {useState, useEffect} from "react";
import Link from "next/link";

export default function Welcome({url}) {
  const [msgs, setMsgs] = useState([]);
  useEffect(() => {
    hooks.fireEvent('user-admin::welcome_visited', msgs).then(([msgs]) => {
      setMsgs(msgs);
      console.log("Welcome receives", msgs);
    });
  }, []);
  return <div>
    <p>Welcome to user-admin &lt;3</p>
    {
      msgs.map(msg => {console.log("Iteration sees", msg); return <p>{msg}</p>})
    }
    <button onClick={() => {throw new Error('Testing Errors in Front');}}>Throw</button>
    <Link href={url}>Go to page</Link>
  </div>;
}
