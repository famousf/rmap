const handleLoginErrors = (error) => {
  console.log(error)
  let parent = document.getElementsByClassName('auth-screen')[0]
  let html = `
    <div class="_loginError">${error.login}</div>
  `
  parent.insertAdjacentHTML('beforeend', html)

  setTimeout(() => {
    parent.lastElementChild.remove()
  }, 1000)

}
const registerAuth = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password
  });

  if (error) {
    console.error('Error signing up:', error.message);
  } else {
    console.log('User signed up:', data.user);


  }
}
const verifyUser = async (userId) => {
  // Check if first time logging in, to 'confirm them'
  const {data, error} = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

    if (error) {
      console.log(error)
      return null
    } else {
      return data
    }
}
const verifyOrg = async (uid, number) => {
  const {data, error} = await supabase
    .from('users')
    .select('*')
    .eq('id', uid)
    .single()

    if (error) {
        handleLoginErrors({verifyOrg: error.message})
        return false
    } else {
        if (number != data.org_number) {
          handleLoginErrors({login: "invalid org number"})
          return false
        } else {
          return true
        }
    }
}
const confirmTos = async (data) => {
  const {error} = await supabase
    .from('users')
    .update({accepted_tos:true})
    .eq('id', data.id)

  if (!error) {
      return true
  } else {
      return false
  }
}
const syncToken = async (userData) => {
  console.log("Syncing: ", userData)
  const {data, error} = await supabase
    .from('users')
    .insert({
      id: userData.id,
      username: "",
      email: userData.email

    })

    if (error) {
      console.log(error)
      return

    } else {
      console.log("Updated user-col", userData)

    }
}
const authAccount = async (email, password, orgNumber) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    handleLoginErrors({login:error.message})
  } else {
    let isVerified = await verifyUser(data.user.id)
    if (!isVerified) {
      syncToken(data.user) // Update auth.user with user

    } else if (data.user.id == isVerified.id) {
      // Check if user is in an org.
      let inOrg = await verifyOrg(data.user.id, orgNumber)
      if (!inOrg) {

      } else {
          // Sucessful - Prompt user


          if (isVerified.accepted_tos != null || isVerified.accepted_tos) {
              localStorage.setItem('at', JSON.stringify([`${data.user.id}`,`${data.session.access_token}`]))
              localStorage.setItem('user_info', JSON.stringify(isVerified))
              window.location.href = '/map/'
          } else {
              // Request accepting ToS
              console.log("accept tos please")
              console.log(data)
              document.getElementsByClassName('tos')[0].classList.add('show')
              document.getElementById('tos_button').addEventListener('click', (e) => {
                  if (e.target.id == "tos_button") {
                      confirmTos(isVerified).then(r => {
                          if (r) {
                            localStorage.setItem('at', JSON.stringify([`${data.user.id}`,`${data.session.access_token}`]))
                            localStorage.setItem('user_info', JSON.stringify(isVerified))
                            window.location.href = '/map/'
                          }
                      })
                  }
              })
          }
      }

    }


  }
}
const initalizeAuthMain = async () => {
  let accessToken = JSON.parse(localStorage.getItem('at'))
  if (!accessToken) {
      // Prompt user to login
      if (window.location.search != "?login=false") { window.location.search = "?login=false" }
      return false

  } else { return accessToken }


}

const signInUser = async (element) => {
  let email = document.getElementById('email').value
  let password = document.getElementById('password').value
  let orgNumber = document.getElementById('orgNumber').value
  /*
  switch (0) {
    case email.length:
      console.log("No email")
      break
    case password.length:
      console.log("No password")
      break
    case orgNumber.length:
      break
  }
  */

  authAccount(email, password, orgNumber)


}
initalizeAuthMain()


//
const signOutUser = async (element) => {
  const {error} = await supabase.auth.signOut()
  if (!error) {
      localStorage.removeItem('at')
      localStorage.removeItem('affiliation')
      localStorage.removeItem('settings')
      localStorage.removeItem('user_info')
      location.reload()
  }
}
