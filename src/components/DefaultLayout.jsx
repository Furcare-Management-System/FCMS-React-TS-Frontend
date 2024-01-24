import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";

export default function DefaultLayout() {
    const { user, token, setUser, setToken } = useStateContext();

    // if (!token) {
    //     return <Navigate to="/login" />;
    // }

    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
      setDropdownOpen(!isDropdownOpen);
    };
    const onLogout = (ev) => {
        ev.preventDefault();

        axiosClient.post('/logout')
            .then(() => {
            setUser({});
            setToken(null);
        });
    };

    useEffect(() => {
        axiosClient.get('/user')
            .then(({ data }) => {
            setUser(data);
        });
    }, []);

    return (
        <div id="defaultLayout">
            <aside>
{/* <img  className="icon" /> */}

                <Link to="/dashboard">Dashboard</Link>
                <Link to="/main">MainLAyout</Link>
                <Link to="/roles">Roles</Link>
                <Link to="/users">Users</Link>
                <Link to="/archives">Archived Users</Link>
                {/* <Link to="/users">Archived Files</Link> */}
                <ul onClick={toggleDropdown}>
                  Profile Data
                  {isDropdownOpen ? <span>&#9650;</span> : <span>&#9660;</span>}
                </ul>
                  {isDropdownOpen && (
                    <ul>
                      <li>
                      <Link to="/petowners">Pet Owners</Link>
                      </li>
                      <li>
                      <Link to="/staffs">Staffs</Link>
                      </li>
                    </ul>
                  )}
                <Link to="/appointments">Appointments</Link>
                <Link to="/clientservice/new">Client Service Form</Link>
            </aside>

            <div className="content">
                <header>
                    <div>FurCare Clinic Management System</div>
                    <div>
                        {user.username}
                        <Link to={`/users/`+user.id} className="btn-edit">Edit Profile</Link>
                        <a href="#" onClick={onLogout} className="btn-logout">
                            Logout
                        </a>
                    </div>
                </header>
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}