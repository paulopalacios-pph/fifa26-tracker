import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tmlhnjhapjvazqonjgzs.supabase.co'
const supabaseKey = 'sb_publishable_iWsWxO6yItTW2C4oCMgsLg_6fiiPJk_'

export const supabase = createClient(supabaseUrl, supabaseKey)
