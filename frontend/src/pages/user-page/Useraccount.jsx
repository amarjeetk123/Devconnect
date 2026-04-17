import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        getProfile();
    }, []);

    const getProfile = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get("http://localhost:5000/api/auth/me",
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            console.log(res, "res")
            setUser(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    if (!user) return <p>Loading...</p>;

    return (
        <div style={styles.container}>
            <h2>My Profile</h2>

            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Username:</strong> @{user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>

            <hr />

            <div style={styles.stats}>
                <div>
                    <h3>{user.postCount}</h3>
                    <p>Posts</p>
                </div>

                <div>
                    <h3>{user.followersCount}</h3>
                    <p>Followers</p>
                </div>

                <div>
                    <h3>{user.followingCount}</h3>
                    <p>Following</p>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        width: "400px",
        margin: "40px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px"
    },
    stats: {
        display: "flex",
        justifyContent: "space-around",
        marginTop: "20px"
    }
};

export default Profile;