import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase environment variables are missing.')
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const body = await req.json()
    const { email, first_name, last_name, role, status, phone, department, extra_permissions } = body

    if (!email) {
      throw new Error('Email is required.')
    }

    // 1. Create Auth user
    const tempPassword = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2).toUpperCase() + "!1a"
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: false,
      user_metadata: { first_name, last_name }
    })

    if (authError) {
      throw authError
    }

    const user = authData.user
    if (!user) {
      throw new Error('Failed to create Auth user.')
    }

    // 2. Insert row into public.users
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('users')
      .insert({
        id: user.id,
        email,
        first_name,
        last_name,
        role,
        status,
        phone,
        department,
        extra_permissions,
        force_password_reset: true
      })
      .select()
      .single()

    if (profileError) {
      // Cleanup auth user on profile creation failure
      await supabaseAdmin.auth.admin.deleteUser(user.id)
      throw profileError
    }

    // 3. Send invitation email
    const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email)
    if (inviteError) {
      console.warn('Failed to send invitation email:', inviteError)
    }

    return new Response(JSON.stringify(profileData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    })
  }
})
