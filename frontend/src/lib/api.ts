import { useEffect, useState } from 'react';
export type Media = {url:string;type:'image'|'video'};
export type Puppy = {slug:string;name:string;breed:string;sex:string;age:string;origin:'local'|'imported';status:'available'|'adopted';media:Media[];has_video:boolean};
export type Family = {url:string;caption:string};
export type Enquiry = {name:string;phone:string;email:string|null;area:string;puppy_slug:string|null;message:string;website:string};
const base=import.meta.env.VITE_API_BASE || '/api/v1';
export async function request<T>(path:string, init?:RequestInit):Promise<T>{const res=await fetch(base+path,init);if(!res.ok)throw new Error(`Request failed (${res.status})`);return res.json() as Promise<T>}
export function useApi<T>(path:string){const [data,setData]=useState<T>();const [error,setError]=useState('');const [attempt,retry]=useState(0);useEffect(()=>{const controller=new AbortController();setData(undefined);setError('');request<T>(path,{signal:controller.signal}).then(d=>{if(!controller.signal.aborted)setData(d)}).catch(e=>{if(!controller.signal.aborted)setError(e.message)});return()=>controller.abort()},[path,attempt]);return {data,error,retry:()=>retry(n=>n+1)}}
export const wa=(message='Hello! I would like to learn about your puppies.')=>`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '971500000000'}?text=${encodeURIComponent(message)}`;
