import { Header } from '../components/Header.tsx';

// This component renders a full webpage around the main content.
export function UnauthorizedPage() {
  return (
    <div className='vh-100 d-flex flex-column p-2'>
      <Header />
      <UnauthContent />
    </div>
  );
}

// Use this component if you just want the content without a full page.
export function UnauthContent() {
  return (
    <div className='flex-grow-1 d-flex align-items-center justify-content-center'>
      <div>Please log in to use the Treasure Trove platform.</div>
    </div>
  );
}
