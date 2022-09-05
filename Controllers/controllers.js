const fs = require('fs')


const randomUser = (req, res) => {
    fs.readFile("users.json", (err, data) => {
        if (err) {
            res.send('data was not found')
        } else {
            const users = JSON.parse(data)
            const randomUser = users[Math.floor(Math.random() * users.length) + 1]
            res.send(JSON.stringify(randomUser))
        }
    })
}

const allUser = (req, res) => {
    const { limit } = req.query;

    fs.readFile("users.json", (err, data) => {
        if (err) {
            res.send('data was not found')

        } else {
            const parsedData = JSON.parse(data)
            const selectedUsers = parsedData.slice(0, limit ? limit : Infinity)
            res.status(200).send(JSON.stringify(selectedUsers))
        }
    })
}

const createUser = (req, res) => {

    const { id, name, gender, contact, address, photoUrl } = req.body;
    console.log(id)

    fs.readFile("users.json", (err, data) => {

        if (err) {
            res.send('data was not found')
        }

        else {
            const allUser = JSON.parse(data);
            if (id && name && gender && contact && address && photoUrl) {
                const existedId = allUser.find(user => user.id === id)

                if (existedId) {
                    console.log("i am in third stage")
                    res.status(403).json({ message: "Try with another Id" })

                }
                else if (typeof Number(id) === "number" && Number(id) > 0) {
                    allUser.push({ id, name, gender, contact, address, photoUrl });

                    fs.writeFile("users.json", JSON.stringify(allUser), (err) => {
                        if (err) {
                            res.send('Failed to append file')
                        } else {
                            console.log("i am in last stage")
                            res.send("user has succesfully added")
                        }
                    });
                }
            }
            else {
                res.status(403).json({ error: "the id you provided isn't correct or add all the properties" })
            }
        }
    })


}


const updateUser = (req, res) => {

    let newId;
    const { id, gender, name, contact, address, photoUrl } = req.body

    fs.readFile("users.json", (err, data) => {
        if (err) {
            res.status(403).json({ message: "data was not found" })
        }
        else {
            let parsedData = JSON.parse(data);
            if (!gender || !name || !contact || !address || !photoUrl) {
                return res.status(403).json({ error: "Please provide gender, name, contact, address, photoUrl property." })
            }
            if (id) {
                newId = id
            } else {
                newId = Math.floor(Math.random() * (parsedData.length - 1)) + 1;
            }
            const updatedUser = { id: newId, gender, name, contact, address, photoUrl }
            const userExist = parsedData.find(user => user.id == Number(newId))
            if (!userExist) {
                res.status(403).json({ error: "User data not found" })
            } else if (updatedUser) {
                parsedData = parsedData.map(user => user.id != Number(newId) ? user : updatedUser)
                fs.writeFile("users.json", JSON.stringify(parsedData), (err) => {
                    if (err) {
                        res.status(500).json({ error: "Internal Server Error" })

                    }
                    else {
                        res.status(201).json({ message: "User data updated successfully" })
                    }
                })

            }

        }
    })
}

module.exports = { randomUser, allUser, createUser, updateUser }