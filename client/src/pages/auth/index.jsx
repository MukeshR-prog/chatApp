import { useState } from "react";
import background from "../../assets/loginBackground.png";
import victory from "../../assets/victory.svg";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client"
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";
const Auth = () => {

  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const validateLogin=() => {
    if(!email.length) {
      toast.error("Please enter the email");
      return false;
    }
    if(!password.length) {
      toast.error("Please enter the password");
      return false;
    }
    return true;
  }
  const validateSignup = () => {
    if(!email.length) {
      toast.error("Please enter the email");
      return false;
  }
  if(!password.length) {
      toast.error("Please enter the password");
      return false;
  }
  if(password !== confirmPassword) {
    toast.error("Passwords do not match");
      return false;
    }
  return true;
}

const handleLogin = async () => {
  if (validateLogin()) {
    try {
      const res = await apiClient.post(LOGIN_ROUTE, { email, password }, { withCredentials: true });

      if (res.data.user?.id) {
        setUserInfo(res.data.user);
        if (res.data.user.profileSetup) {
          navigate("/chat");
        } else {
          navigate("/profile");
        }
      }
    } catch (error) {
      if (error.response?.status === 400 && error.response.data === "Password is incorrect") {
        toast.error("Incorrect password. Please try again.");
      } else if (error.response?.status === 404) {
        toast.error("Email not found. Please check your email.");
      } else {
        toast.error("Login failed. Please try again.");
      }
    }
  }
};

  const handleSignup = async () => {
    if(validateSignup()) {
      const res = await apiClient.post(SIGNUP_ROUTE,{email,password},{withCredentials: true})
      if(res.status === 201) {
        setUserInfo(res.data.user);
        navigate("/profile");
      }
      console.log(res, res.status)
    }
  };

  return (
    <div className="h-[100vh] w-screen flex items-center justify-center">
      <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
              <img className="h-[100px]" src={victory} alt="Victory" />
            </div>
            <p className="font-medium text-center">
              Please enter your credentials to proceed.
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]: font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                  value="login"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]: font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  SignUp
                </TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-5 mt-6" value="login">
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-md p-6"
                />
                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-md p-6"
                />
                <Button
                  className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2"
                  onClick={handleLogin}
                >
                  Login
                </Button>
              </TabsContent>
              <TabsContent className="flex flex-col gap-5 mt-4" value="signup">
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-md p-6"
                />
                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-md p-6"
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="rounded-md p-6"
                />
                <Button
                  className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2"
                  onClick={handleSignup}
                >
                  SignUp
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center">
          <img className="h-[500px]" src={background} alt="Background" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
