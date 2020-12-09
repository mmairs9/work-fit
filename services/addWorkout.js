export default () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/plain");

    const body = {
        userId: "343423123123",
        userName: "gus granbery",
        duration: 120,
        type: "run",
        calories: 300,
        stepCount: 22,
        startDate: "2020-12-07T19:20:30+01:00"
    };

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