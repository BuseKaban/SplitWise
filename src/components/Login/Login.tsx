import React, { FormEvent, useState } from 'react';
import { IonAlert, IonButton, IonIcon, IonInput, IonItem, IonText, useIonAlert } from '@ionic/react';
import { setCurrentUser, users } from '../../utils/Users';
import { useHistory } from 'react-router';
import "./Login.scss"
import { lockClosed, person } from 'ionicons/icons';
const Login: React.FC = () => {
    const history = useHistory();

    function handleSubmit(event: FormEvent<HTMLFormElement>): void {
        const loggedInUser = users.find((user) => {
            return user.username == username && user.password == password
        })
        if (loggedInUser) {
            setCurrentUser(loggedInUser);
            history.push("/tabs/groups");

        }
        else {
            presentAlert({
                mode: "ios",
                header: 'Şifreni mi unuttun?',
                message: 'Kullanıcı bilgilerin yanlış, lütfen tekrar dene veya şifreni sıfırla.',
                buttons: [{ text: "Tekrar Dene", role: "cancel" }, { text: "Şifreni Değiştir", role: "destructive" },],

            })
        }
        event.preventDefault();

    }

    const [username, setUsername] = useState("");
    const [password, setpassword] = useState("");

    const [presentAlert] = useIonAlert();

    return (
        <>
            <form className='login-form ion-padding mb-16' id='login' onSubmit={handleSubmit}>
                <div className='relative text-center mb-6'>
                    <IonIcon className='w-full h-64' src='assets/icon/logo.svg'></IonIcon>
                    <p className='logo absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>SplitPay</p>
                </div>
                <IonItem lines='none' className='login-input-item'>
                    <IonIcon className='mr-2' slot='start' icon={person}></IonIcon>
                    <IonInput
                        className='login-input'
                        onIonInput={(e) => { setUsername(e.detail.value!) }}
                        id='username'
                        name='username'
                        placeholder="Kullanıcı Adı"
                    ></IonInput>
                </IonItem>

                <IonItem lines='none' className='login-input-item'>
                    <IonIcon className='mr-2' slot='start' icon={lockClosed}></IonIcon>
                    <IonInput
                        className='login-input'
                        onIonInput={(e) => { setpassword(e.detail.value!) }}
                        id='password'
                        name='password'
                        placeholder="Şifre"
                        type='password'
                    ></IonInput>
                </IonItem>

                <div className='flex justify-center mt-6'>
                    <IonButton shape='round' className='h-14 w-3/4' form={"login"} type='submit'>
                        Giriş
                    </IonButton>
                </div>
            </form>


        </>



    );


}
export default Login;

