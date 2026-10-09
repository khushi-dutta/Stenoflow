import type {MetadataRoute} from 'next';
export default function robots():MetadataRoute.Robots{return {rules:[{userAgent:'*',allow:['/','/about','/pricing','/guides/'],disallow:['/app/','/api/','/login','/reset-password']}],sitemap:process.env.NEXT_PUBLIC_SITE_URL?`${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`:undefined}}
