import { supabaseClient } from "../services/supabase";

const Register = async () => {
  const { data } = await supabaseClient.auth.getSession();
  console.log(data);
  return <h1>Register Page</h1>;
};

export default Register;