export const fetchData= async (title, methodType, body) => {
    const res = await fetch('http://localhost:3001/' + title, {
        method: methodType,
        body: JSON.stringify(body),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmVmN2NjZjc1NTcyNjBlYjc3NjNlMDUiLCJpYXQiOjE2NTk4NjI2ODN9.HkYtNaHtrPhd6tN7kUmNQoQCGK3SIhAIWJURswUzXv4'
        }
    });

    return res;
}