const useMedia() => {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        setLoading(true);
        fetch('https://api.example.com/media')
        .then(response => response.json())
        .then(data => {
            setMedia(data);
            setLoading(false);
        });
    }, []);
    
    return { media, loading };
    };