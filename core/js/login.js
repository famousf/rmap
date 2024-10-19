let userIds = {
  0: "Ludwig Eriksson",
  1: "Jenny Östensson",
  2: "Magnus Edvinsson",
  3: "Fredrik Östensson",
  4: "Maja Falk",
  5: "Rasmus Engqvist",
  6: "Lukas Larsson",
  7: "Kim peter",
  8: "Fredrik Hallen",
  99: "Besökare"
}
const verifyMe = (e) => {
    let string = parseInt(document.getElementById('vme-input').value)
    if (string.toString().length >= 4) {
       if (string == 1632) {
          localStorage.setItem("sign", 1632)
          document.getElementsByClassName('auth-sig')[0].classList.add('move-away')
          document.getElementsByClassName('auth-pick-user')[0].classList.add('fade-in')
       }
    } else {
      localStorage.clear("sign")
    }

}


const numpadClick = () => {
  let parent = document.getElementsByClassName('numpad')[0]
  let input = document.getElementById('vme-input')
  let children = parent.getElementsByTagName('button')
  let corrValue = 1632
  let tempValue = 0
  console.log(children)
  for (i = 0; i < children.length; i++) {
      children[i].addEventListener('click', (e) => {
          let value = e.target.value

          if (isNaN(value)) {
              if (value == "go-back") {
                  // Not done
              }
              if (value == "delete") {
                input.value = ""
                tempValue = 0
              }
          } else {
            input.value += value
            tempValue += value
          }
        if (tempValue == corrValue) {
            // Send user to index and set the cookie, then reload page if its successful
            $.ajax({
              type: "POST",
              data: {"numpadClear":true},
              success: function(d){
                  if (d === "isCleared") {
                    location.reload()
                  }
              }
            })
        }
      })
  }
  console.log(children)
}
numpadClick()
