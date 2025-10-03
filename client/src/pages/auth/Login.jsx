import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { login } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";
import axios from "axios";


const Login = () => {
    const [role, setRole] = useState("admin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            return toast.error("All fields are required");
        }

        try {
            const res = await axios.post("http://localhost:3000/api/auth/login", {
                email,
                password
            })

            dispatch(login(res.data));
            localStorage.setItem("token", res.data.token);
            toast.success("Login successful");

            navigate(`/${res.data.role}`);

        } catch (error) {
            toast.error(error.response.data.message);
            return;
        }

    };


    return (
        <div className="flex h-screen items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg p-8 rounded-lg w-96">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

                <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-4 px-3 py-2 border rounded"
                />

                <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-4 px-3 py-2 border rounded"
                />



                {/* <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full mb-6 px-3 py-2 border rounded"
                >
                    <option value="admin">Admin</option>
                    <option value="teacher">Teacher</option>
                    <option value="student">Student</option>
                </select> */}

                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Login
                </button>
            </div>
        </div>
    );
};

export default Login;
