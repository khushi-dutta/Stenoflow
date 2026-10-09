import type {Metadata} from 'next';
import './globals.css';
import './design-system.css';
import './workspace-design.css';
export const metadata:Metadata={title:{default:'StenoFlow — Find your flow. Own your exam.',template:'%s | StenoFlow'},description:'A focused workspace for stenography, typing practice, skill-test preparation, and meaningful progress.',icons:{icon:'/favicon.svg'},openGraph:{title:'StenoFlow',description:'Practice with purpose. Progress with confidence.',type:'website'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><body>{children}</body></html>;}

