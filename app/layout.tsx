import "./globals.css";
import { Great_Vibes, Cinzel } from "next/font/google";

const greatVibes = Great_Vibes({
  subsets:["latin"],
  weight:"400",
  variable:"--great"
});

const cinzel = Cinzel({
  subsets:["latin"],
  variable:"--cinzel"
});

export default function RootLayout({
  children,
}:{
  children:React.ReactNode
}){

  return(

<html lang="en">

<body
className={`${greatVibes.variable} ${cinzel.variable}`}
>

{children}

</body>

</html>

  );

}