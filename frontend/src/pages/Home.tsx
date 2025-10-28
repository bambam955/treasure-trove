import { Header } from '../components/Header'

// TODO: make it so only authorized users can see this page
export function Home() {
  return (
    <div style={{ padding: 8 }}>
      <Header />
      <br />
      <hr />
      <br />
      <p>This content can only be accessed by authorized users!!</p>
    </div>
  )
}
