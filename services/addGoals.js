
export default (goal) => {
    // {"calories": "200", "duration": "40", "steps": "2000", "type": "Spin"}
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/plain");


    const body = {
        userId: "gus-id",
        userName: "gus granbery",
        resourceType: 'goal',
        ...goal
    };

    console.log('body', body)

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(body),
        redirect: 'follow'
    };

    return fetch("https://i4qd1pw4ec.execute-api.us-east-1.amazonaws.com/default/KeepUp2/workout", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}
