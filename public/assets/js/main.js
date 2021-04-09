let fbObj
const generateOTP = (event) => {
  const phoneNumber = document.querySelector('#phone-number').value
  if (!!phoneNumber === false) throw Error('Phone number is either empty or not valid !')

  const appVerifier = window.recaptchaVerifier
  fbObj.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
    .then((confirmOTP) => {
      window.confirmOTP = confirmOTP
      console.log('OTP generated')
    })
    .catch(console.log)
}

const verifyOTP = (event) => {
  console.log('OTP verification called.')
  const otpInput = document.querySelector('#otp-input').value
  if (!!otpInput === false) throw Error('OTP is either empty or not valid !')

  window.confirmOTP.confirm(otpInput)
    .then(async (result) => {
      const idToken = await firebase.auth().currentUser.getIdToken(true)
      console.log('JWT Token: ', idToken)
      const { additionalUserInfo, user } = result
      const { uid, phoneNumber, email } = user
      const { providerId } = additionalUserInfo

      // Send user id to strapi server
      const dataParams = {
        input: {
          identifier: (providerId === 'phone') ? phoneNumber : email,
          uid: idToken
        }
      }
      const url = 'http://localhost:1338/auth/login-signup'
      console.log('Endpoint: ', url)
      console.log('Data payload: ', dataParams)
      return axios.post(url, dataParams).then(resp => resp.data)
    })
    .then(data => console.log('REached Data: ', data))
    .catch(console.log)
}

const init = async () => {
  const firebaseConfig = { // Fill the details for ur web app added in ur firebase project
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
  };
  // Initialize Firebase
  fbObj = await firebase.initializeApp(firebaseConfig);
  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('captcha-container');

  // Assign event to button
  document.querySelector('#generateOTP').addEventListener('click', generateOTP)
  document.querySelector('#verify-otp').addEventListener('click', verifyOTP)
}

window.onload = async function () {
  await init()
}