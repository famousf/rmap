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
const pickUser = (e) => {
  const selectUser = document.getElementsByClassName('pickUser')[0].value
  const user = parseInt(selectUser)
  const username = userIds[user]

  localStorage.setItem("loggedUser", JSON.stringify([user, username]))
  $.ajax({
    type: "POST",
    data: {"setUser":true, "user": username},
    success: function(d){
        if (d === "loggedUser") {
          location.reload()
        }
    }
  })

}
