import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing VITE_SUPABASE_URL environment variable");
}

// For server-side operations, use service role key if available
// Otherwise fall back to anon key (with limited permissions)
const supabaseKey =
  supabaseServiceRoleKey || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  throw new Error(
    "Missing Supabase API key (SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_ANON_KEY)"
  );
}

export const supabaseServer = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

/**
 * Execute a query on the Supabase database
 */
export async function executeQuery<T>(
  table: string,
  query: (q: any) => any
): Promise<T[]> {
  const { data, error } = await query(supabaseServer.from(table));

  if (error) {
    throw new Error(`Supabase query error: ${error.message}`);
  }

  return data || [];
}

/**
 * Insert data into a Supabase table
 */
export async function insertData<T>(table: string, data: T) {
  const { data: result, error } = await supabaseServer
    .from(table)
    .insert([data])
    .select();

  if (error) {
    throw new Error(`Supabase insert error: ${error.message}`);
  }

  return result?.[0];
}

/**
 * Update data in a Supabase table
 */
export async function updateData<T>(
  table: string,
  id: string | number,
  data: Partial<T>
) {
  const { data: result, error } = await supabaseServer
    .from(table)
    .update(data)
    .eq("id", id)
    .select();

  if (error) {
    throw new Error(`Supabase update error: ${error.message}`);
  }

  return result?.[0];
}

/**
 * Delete data from a Supabase table
 */
export async function deleteData(table: string, id: string | number) {
  const { error } = await supabaseServer.from(table).delete().eq("id", id);

  if (error) {
    throw new Error(`Supabase delete error: ${error.message}`);
  }
}

/**
 * Fetch data from a Supabase table with optional filtering
 */
export async function fetchData<T>(
  table: string,
  filters?: Record<string, any>
): Promise<T[]> {
  let query = supabaseServer.from(table).select();

  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      query = query.eq(key, value);
    }
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Supabase fetch error: ${error.message}`);
  }

  return data || [];
}
