import Link from 'next/link'

export default function Home() {
  return (
    <main className='flex justify-center items-center h-screen'>
      <Link href="/sign-in " className='border  p-10 text-center bg-primary'>Sign In</Link>
    </main>
  );
}
