import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';
import { AuctionInfo } from '@shared/auctions.ts';
import { useQuery } from '@tanstack/react-query';
import AuctionsApi from '../api/auctions.ts';

export function Home() {
  const [token] = useAuth();

  const auctionsQuery = useQuery<AuctionInfo[]>({
    queryKey: ['users'],
    queryFn: () => AuctionsApi.getAllAuctions(token!),
  });
  // auctionsQuery.refetch();
  console.log('auctions are:', auctionsQuery.data);

  // If the user goes to this page without being logged in then show an error message.
  if (!token) {
    return (
      <div className='vh-100 d-flex flex-column p-2'>
        <Header />
        <div className='flex-grow-1 d-flex align-items-center justify-content-center'>
          <div>Please log in to use the Treasure Trove platform.</div>
        </div>
      </div>
    );
  }

  // Show some very basic content just to verify that the login is working.
  // This will be revised in the future.
  return (
    <div className='vh-100 d-flex flex-column p-2'>
      <Header />
      <div className='flex-grow-1 d-flex align-items-center justify-content-center'>
        {/* <div>Content coming soon!</div> */}
        <table>
          <tbody>
            {auctionsQuery.data?.map((a) => (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.description}</td>
                <td>{a.buyerId}</td>
                <td>{a.sellerId}</td>
                <td>{a.minimumBid}</td>
                {/* <td>{new Date(a.endDate).toISOString()}</td> */}
                <td>{a.endDate.toISOString()}</td>
                <td>{a.expectedValue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
