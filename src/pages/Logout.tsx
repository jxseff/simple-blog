import { supabaseClient } from "../services/supabase";

const Logout = async () => {
  const { data } = await supabaseClient.auth.getSession();
  console.log(data);
  return <h1>Logout Page</h1>;
};

export default Logout;