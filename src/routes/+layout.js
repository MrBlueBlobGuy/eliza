import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "$env/static/public"
import { createBrowserClient, isBrowser, parse } from "@supabase/ssr"


export const ssr = false;

export async function load({fetch, data, depends}){
    depends('supabase:auth')

    const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        global: {fetch},
        cookies: {
            get(key) {
                if (!isBrowser()) return JSON.stringify(data.session);
                const cookie = parse(document.cookie);
                return cookie[key];
            },
            set(key, value) {
                if (isBrowser()) {
                    document.cookie = `${key}=${value}; path=/; Secure; SameSite=Lax`;
                }
            },
            remove(key) {
                if (isBrowser()) {
                    document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
                }
            }
        }
    })

    const{
        data : {session}
    } = await supabase.auth.getSession()

    return { supabase, session }
}
