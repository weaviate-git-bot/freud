import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import localFont from 'next/font/local'

//Possible to import more fonts here
const myFont = localFont({
  src: [
    {
      path: './GT_Walsheim/GT-Walsheim-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './GT_Walsheim/GT-Walsheim-Bold-Oblique.woff2',
      weight: '700',
      style: 'oblique',
    },
    {
      path: './GT_Walsheim/GT-Walsheim-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
})

const MyApp: AppType = ({ Component, pageProps }) => {
  return <main className={myFont.className}>
    <Component {...pageProps} />
  </main>
};

export default api.withTRPC(MyApp);
