export const fetchData= async (title, methodType, body, token) => {
    const res = await fetch(`http://localhost:8080/` + title, {
        method: methodType,
        body: JSON.stringify(body),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        }
    });

    return res;
}