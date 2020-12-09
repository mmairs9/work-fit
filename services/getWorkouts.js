export default () => {
    console.log('getting workouts')
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    return fetch("https://i4qd1pw4ec.execute-api.us-east-1.amazonaws.com/default/KeepUp2/leader", requestOptions)
        .then(response => response.json())
}