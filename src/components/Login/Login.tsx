import React, { FormEvent, useRef, useState } from 'react';
import { IonAlert, IonButton, IonCheckbox, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonList, IonModal, IonPage, IonText, useIonAlert } from '@ionic/react';
import { currentUser, getLoginUser, registerUser, setCurrentUser, updateUsers } from '../../utils/Users';
import { useHistory } from 'react-router';
import "./Login.scss"
import { lockClosed, person } from 'ionicons/icons';
const Login: React.FC = () => {
    const history = useHistory();

    function handleSubmit(event: FormEvent<HTMLFormElement>): void {
        getLoginUser(username, password).then(
            result => {
                setCurrentUser(result);
                updateUsers().then(
                    () => history.push("/tabs/groups")
                );
            },
            reject => presentAlert({
                mode: "ios",
                header: 'Şifreni mi unuttun?',
                message: 'Kullanıcı bilgilerin yanlış, lütfen tekrar dene veya şifreni sıfırla.',
                buttons: [{ text: "Tekrar Dene", role: "cancel" }, { text: "Şifreni Değiştir", role: "destructive" },],

            }));


        event.preventDefault();

    }

    const [username, setUsername] = useState("");
    const [password, setpassword] = useState("");

    const [signusername, setSignUsername] = useState("");
    const [signpassword, setSignpassword] = useState("");

    const signModal = useRef<HTMLIonModalElement>(null);
    const [presentAlert] = useIonAlert();

    function register(): void {
        registerUser(signusername, signpassword).then(
            user => {
                setCurrentUser(user)
                updateUsers().then(
                    () => history.push("/tabs/groups")
                )
            }, rejectReason => { console.log(rejectReason) }
        )
    }

    return (
        <IonPage>
            <IonContent>
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
                    <div className='flex justify-center '> <IonButton fill='clear' id="open-sign-modal" className='sign-button h-14 w-3/4 normal-case'>Hesap oluşturun</IonButton></div>
                </form>
                <IonModal className='modal' ref={signModal} trigger='open-sign-modal' initialBreakpoint={0.80} breakpoints={[0, 0.80]}>
                    <IonList className='ion-padding'>
                        <IonItem lines='full'>
                            <IonInput
                                className='sign-input'
                                onIonInput={(e) => { setSignUsername(e.detail.value!) }}
                                id='username'
                                name='username'
                                placeholder="Kullanıcı Adı"
                                type='text'
                            ></IonInput>
                        </IonItem>

                        <IonItem lines='full'>
                            <IonInput
                                className='sign-input'
                                onIonInput={(e) => { setSignpassword(e.detail.value!) }}
                                id='password'
                                name='password'
                                placeholder="Şifre"
                                type='password'
                            ></IonInput>
                        </IonItem>

                        <IonItem lines='full'>
                            <IonInput
                                className='sign-input'
                                id='email'
                                name='email'
                                placeholder="E-mail"
                                type='email'
                            ></IonInput>
                        </IonItem>
                        <IonItem className='ion-no-padding' lines='none' >
                            <IonCheckbox className='w-full'>Kullanım koşullarını okudum,onaylıyorum.</IonCheckbox>
                        </IonItem>

                        <IonButton shape='round' className='h-14 w-3/4' onClick={register}>
                            Üye Ol

                        </IonButton>


                    </IonList>


                </IonModal>
            </IonContent>
        </IonPage>
    );


}
export default Login;

