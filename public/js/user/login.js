// JavaScript Document
// create local database firestore variable
var db = firebase.apps[0].firestore();
var auth = firebase.apps[0].auth();


// create local from webpage inputs
const txtEmail = document.querySelector('#txtEmail');
const txtContra = document.querySelector('#txtContra');

// create local insert button
const btnLogin = document.querySelector('#btnLogin');


// assign button listener
btnLogin.addEventListener('click', function () {
    auth.signInWithEmailAndPassword(txtEmail.value, txtContra.value)
        .then((userCredential) => {
            const user = userCredential.user;
            const dt = new Date();
            db.collection("datosUsuarios").where('idemp', '==', user.uid).get()
                .then(function (docRef) {
                    docRef.forEach(function (doc){
                        doc.ref.update({ultAcceso:dt}).then(function (){
                            document.location.href = 'index.html';
                        });
                    });
                })
                .catch(function (FirebaseError) {
                    Swal.fire({
                        title: 'Error',
                        text: 'Error al actualizar datos del usuario: ' + FirebaseError,
                        icon: 'error'
                    });
                });
        })
        .catch((error) => {
            Swal.fire({
                title: 'Error',
                text: 'Error de acceso al usuario: ' + error.message,
                icon: 'error'
            });
        });
});


// Google Login
const googleLogin = document.querySelector('#googleLogin');
googleLogin.addEventListener('click', e => {
    e.preventDefault(); // Previene el comportamiento por defecto del botón
    const provider = new firebase.auth.GoogleAuthProvider();

    auth.signInWithPopup(provider)
        .then(result => {
            const user = result.user;
            const dt = new Date();

            // Actualizar la última fecha de acceso en Firestore
            db.collection("datosUsuarios").where('idemp', '==', user.uid).get()
                .then(function (docRef) {
                    if(docRef.empty) {
                        console.log('No user record found. Redirecting...');
                        document.location.href = 'index.html';
                        return;
                    }
                    docRef.forEach(function (doc) {
                        doc.ref.update({ ultAcceso: dt }).then(function () {
                            console.log('Last access date updated. Redirecting...');
                            document.location.href = 'index.html';
                        });
                    });
                })
                .catch(function (FirebaseError) {
                    Swal.fire({
                        title: '¡Error!',
                        text: 'Error al actualizar documento: ' + FirebaseError,
                        icon: 'error'
                    });
                });
        })
        .catch(error => {
            Swal.fire({
                title: '¡Error!',
                text: 'Error con el inicio de sesión de Google: ' + error.message,
                icon: 'error'
            });
        });
});



