import Link from "next/link"

const thankyouPage = () => {
  return (
    <div>Thankyou for adding session, go <Link href="/profile"><u>back</u></Link> to add more sessions</div>
  )
}

export default thankyouPage