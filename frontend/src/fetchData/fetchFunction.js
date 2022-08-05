export const fetchData= async (title) => {
    const res = await fetch('http://localhost:3001/' + title);
    const data = await res.json();

    return data;
}