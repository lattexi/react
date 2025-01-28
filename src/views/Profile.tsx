import { useState, useEffect } from "react";

type User = {
    name: string;
    bio: string;
};

const profile = {
    name: "test",
    bio: "testing bio",
};

const guest = {
    name: "Guest",
    bio: "Welcome to our site!",
};

const Profile = () => {
    const [user, setUser] = useState<User | undefined>(undefined);

    useEffect(() => {
        const fetchProfile = async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setUser(profile);
            if (!profile) {
                setUser(guest);
            }
        };

        fetchProfile();
    }, []);

    return (
        <>
            <h2>Profile</h2>
            {user ? (
                user.name === guest.name ? (
                    <>
                        <h3>Welcome, {user.name}!</h3>
                        <p>{user.bio}</p>
                        <p>Sign up or log in to access personalized features!</p>
                        <button>Sign Up</button>
                        <button>Log In</button>
                    </>
                ) : (
                    <>
                        <h3>{user.name}'s Profile</h3>
                        <p>{user.bio}</p>
                        <button>Edit Profile</button>
                    </>
                )
            ) : (
                <>
                    <h3>Loading...</h3>
                    <progress />
                </>
            )}
        </>
    );
};


export default Profile;
