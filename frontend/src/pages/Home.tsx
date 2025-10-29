import { Header } from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

export function Home() {
  const [token] = useAuth();

  // Show some very basic content just to verify that the login is working.
  // This will be revised in the future.
  return (
    <div style={{ padding: 8 }}>
      <Header />
      <br />
      <hr />
      <br />
      {token ? (
        <p>Hello, authorized user!</p>
      ) : (
        <p>This content can only be accessed by authorized users!!</p>
      )}
    </div>
  );
}
