// Add another thing on the menu
let parent = document.getElementsByClassName('fms-toggle_n')[0]
let last = document.getElementsByClassName('tn_button')[1]
let elem = `<div class="tn_button" id="experimental-layer"><i class="fa-solid fa-skull-crossbones"></i></div>`
parent.classList.add('one-extra')
last.insertAdjacentHTML('afterend', elem)

// Confirm user has the right to enter
const verify = async () => {
  let hash = location.search.replace('?experimental=', '')
  let user = USER_INFO.special

  if (!hash.includes(user)) {
      location.search = ''
  }
}

verify()
