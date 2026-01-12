import { supabase } from "../services/supabase";

const Login = async () => {
  const { data } = await supabase.auth.getSession();
  console.log(data);
  return <h1>Login Page</h1>;
};

export default Login;