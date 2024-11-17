const fetchSessions = async () => {
  const currentDate = formatDate()
  const username = JSON.parse(localStorage.getItem('loggedUser'))[1].toLowerCase()


  const {data, error} = await supabase
    .from('sessions')
    .select('*')
    .order('id', {ascending: false})
    .limit(1)

    if (error) {
      console.log("Error fetching", error)
    } else {
        if (data.length > 0) {
            /* Session was found */
            if (data[0].session_id == currentDate) {
                // Session was found for this day, check if user has "signed up"
                let users = data[0].connected_users.users
                if (users.includes(username)) {
                    console.log(username, "exists in array")
                } else {
                    if (confirm('Ny session startad, gå med?')) {
                        console.log("Gått med!")
                        const {data, error} = await supabase
                        .from('sessions')
                        .update({

                        })
                    }
                }

            }
        }
    }
}



fetchSessions()
