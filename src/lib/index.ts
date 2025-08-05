import { createClient } from "./supabase/server";
import { supabase } from "./supabase/client";
import { updateSession } from "./supabase/middleware";

export {
    createClient,
    supabase,
    updateSession,
};
