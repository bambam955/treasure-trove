import { Header } from '../components/Header';

export function Landing() {
  return (
    <div className='vh-100 d-flex flex-column' style={{ padding: 8 }}>
      <Header />
      <div className='flex-grow-1 d-flex align-items-center justify-content-center'>
        <div>Landing page content coming soon!</div>
      </div>
    </div>
  );
}
