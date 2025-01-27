type user = {
    name: string;
    bio: string;
};

const Profile = (props: user) => {
    return (
        <>
            <h1>Profile</h1>
            <h2>{props.name}</h2>
            <p>{props.bio}</p>
        </>
    );
};

export default Profile;