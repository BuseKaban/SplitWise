import React, { FormEvent, useState } from 'react';
import { IonAlert, IonButton, IonInput, useIonAlert } from '@ionic/react';
import { setCurrentUser, users } from '../../utils/Users';
import { useHistory } from 'react-router';

const Login: React.FC = () => {

    const history = useHistory();

    function handleSubmit(event: FormEvent<HTMLFormElement>): void {
        const loggedInUser = users.find((user) => {
            return user.username == username && user.password == password
        })
        if (loggedInUser) {
            setCurrentUser(loggedInUser);
            history.push("/groups");

        }
        else {
            presentAlert({
                mode: "ios",
                header: 'Forget Password ?',
                message: 'User information is incorrect, try again or reset your password',
                buttons: ['OK', "Reset your password"],

            })
        }
        event.preventDefault();

    }

    const [username, setUsername] = useState("");
    const [password, setpassword] = useState("");

    const [presentAlert] = useIonAlert();

    let counter = 0;
    return (
        <>
            <form id='login' onSubmit={handleSubmit}>
                <p>{counter++}</p>
                <IonInput onIonChange={(e) => { setUsername(e.detail.value!) }} id='username' name='username' label="Username" labelPlacement="floating" fill="solid" placeholder="Enter text"></IonInput>
                <IonInput onIonChange={(e) => { setpassword(e.detail.value!) }} id="password" name='password' label="Password" labelPlacement="floating" fill="outline" placeholder="Enter text"></IonInput>
                <IonButton form={"login"} type='submit' />
            </form>


        </>



    );


}
export default Login;

