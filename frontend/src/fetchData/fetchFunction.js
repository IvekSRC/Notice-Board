export const fetchData= async (title, methodType, body) => {
    const res = await fetch('http://localhost:3001/' + title, {
        method: methodType,
        body: JSON.stringify(body),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });

    return res;
}