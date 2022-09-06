const fs = require('fs')
const file = path.join(process.cwd(), 'users.json');
let data = fs.readFileSync("users.json")
let parsedData = JSON.parse(file)

// 1. getting a random user 
const randomUser = (req, res) => {
    // fs.readFile("users.json", (err, data) => {
    //     if (err) {
    //         res.send('data was not found')
    //     } else {
    //         const users = JSON.parse(data)
    //         const randomUser = users[Math.floor(Math.random() * users.length) + 1]
    //         res.send(JSON.stringify(randomUser))
    //     }
    // })
    console.log(parsedData)
    const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

    if (data) {
        const randomNum = random(1, parsedData.length)
        const randomUsers = parsedData.find(user => user.id == Number(randomNum))
        res.status(200).json({ data: randomUsers })
    } else {
        res.status(500).json({ error: "Internal Server Error!" })

    }
}


// 2.getting all users 
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


// 3. posting users 
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

// 4. updating a random user 
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


// 5. updating multiple users 
const bulkUpdate = (req, res) => {
    const { id, gender, name, contact, address, photoUrl } = req.body;
    const updatedUser = { id, gender, name, contact, address, photoUrl };
    fs.readFile("users.json", (err, data) => {
        let parsedData = JSON.parse(data)
        if (err) {
            res.status(404).json({ error: "User was not found" })
        }
        else {
            if (!id || !gender || !name || !contact || !address || !photoUrl) {
                res.status(403).json({ message: "Please provide id, name ,gender, contact, address and photoUrl" })
            };

            id.forEach(singleId => {
                if (isNaN(singleId) || !singleId) {
                    res.status(403).json({ error: "id is not valid" })
                }
            });

            parsedData.forEach(singleUser => {
                id.filter(singleId => singleUser.id == singleId ? updateUser(singleUser) : null)

            })

            function updateUser(singleUser) {
                parsedData = parsedData.map(data => {
                    data.id == singleUser.id ? { ...updatedUser, id: singleUser.id } : data
                })
            };
            fs.writeFile("users.json", jSON.stringify(parsedData), (err) => {
                if (err) {
                    res.status(403).json({ error: "data can not be updated" })
                }
                else {
                    res.status(200).json({ message: "Data updated successfully" })
                }
            })

        };
    })
}


const deleteUser = (req, res) => {
    const { id } = req.body;
    fs.readFile("users.json", (err, data) => {
        let parsedData = JSON.parse(data);
        if (err) {
            res.status(403).json({ error: "data was not found" })
        }
        else {
            const remainingUsers = parsedData.filter(data => {
                return data.id != Number(id)
            })
            console.log(remainingUsers);
            if (isNaN(Number(id)) || !id) {
                res.status(403).json({ error: "id was not found" })
            }
            else if (parsedData.length === remainingUsers.length) {
                res.status(403).json({ error: "user not found" })
            }
            else if (remainingUsers) {
                fs.writeFile("users.json", JSON.stringify(remainingUsers), (err) => {
                    if (err) {
                        res.status(403).json({ message: "data can't delete properly" })
                    }
                    else {
                        res.status(200).json({ message: "data deleted successfully" })
                    }
                })
            }
        }
    })

}

module.exports = { randomUser, allUser, createUser, updateUser, bulkUpdate, deleteUser }