import { BaseLayout } from '../layouts/BaseLayout.tsx';

export function Landing() {
  return (
    <BaseLayout checkAuth={false}>
      <div className='flex-grow-1 d-flex align-items-center justify-content-center'>
        <div>Landing page content coming soon!</div>
      </div>
    </BaseLayout>
  );
}
